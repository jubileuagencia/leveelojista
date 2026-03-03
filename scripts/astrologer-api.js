#!/usr/bin/env node

/**
 * Astrologer API Integration Script
 *
 * Integra com a Astrologer API (RapidAPI) para obter posicoes planetarias
 * e aspectos de transito para um periodo especifico.
 *
 * Endpoints:
 *   POST /api/v5/subject — posicoes planetarias numa data
 *   POST /api/v5/chart-data/transit — aspectos entre transito e referencia
 *
 * Uso:
 *   node scripts/astrologer-api.js --start 2026-03-03 --end 2026-03-09
 *   node scripts/astrologer-api.js --start 2026-03-03 --end 2026-03-09 --output output.json
 *   node scripts/astrologer-api.js --date 2026-03-03  (dia unico)
 *
 * @module scripts/astrologer-api
 * @version 1.0.0
 */

'use strict';

const https = require('https');
const path = require('path');
const fs = require('fs');

// ─── Config ─────────────────────────────────────────────────

const API_HOST = 'astrologer.p.rapidapi.com';
const API_KEY = 'bb23daaf63mshfa1ba9934a75298p195af4jsneafff3c8f1f4';

const DEFAULT_LOCATION = {
  city: 'Sao Paulo',
  nation: 'BR',
  longitude: -46.6333,
  latitude: -23.5505,
  timezone: 'America/Sao_Paulo',
};

// Referencia para transitos: Equinocio Vernal (Sol a 0° Aries)
// Usado como "mapa generico" para calcular aspectos entre transito e posicao fixa
const REFERENCE_SUBJECT = {
  name: 'Equinocio Vernal Reference',
  year: 2000,
  month: 3,
  day: 20,
  hour: 7,
  minute: 35,
  ...DEFAULT_LOCATION,
};

// Planetas que rastreamos
const TRACKED_PLANETS = [
  'sun', 'moon', 'mercury', 'venus', 'mars',
  'jupiter', 'saturn', 'uranus', 'neptune', 'pluto',
  'chiron', 'mean_lilith',
  'true_north_lunar_node', 'true_south_lunar_node',
];

// Hierarquia de planetas por peso de impacto
const PLANET_WEIGHT = {
  pluto: 10,    // geracional — transformacao profunda
  neptune: 9,   // geracional — dissolucao/transcendencia
  uranus: 9,    // geracional — ruptura/inovacao
  saturn: 8,    // social — estrutura/responsabilidade
  jupiter: 7,   // social — expansao/abundancia
  chiron: 6,    // ponte — cura/ferida
  mars: 5,      // pessoal — acao/energia
  venus: 4,     // pessoal — valores/amor
  mercury: 4,   // pessoal — comunicacao/mente
  sun: 6,       // luminar — identidade/vitalidade
  moon: 5,      // luminar — emocoes/instinto
  mean_lilith: 3,
  true_north_lunar_node: 5,
  true_south_lunar_node: 4,
};

// Peso dos aspectos
const ASPECT_WEIGHT = {
  conjunction: 10,
  opposition: 8,
  square: 7,
  trine: 5,
  sextile: 3,
  quintile: 2,
};

// Nomes dos signos em portugues
const SIGN_NAMES = {
  Ari: 'Aries', Tau: 'Touro', Gem: 'Gemeos', Can: 'Cancer',
  Leo: 'Leao', Vir: 'Virgem', Lib: 'Libra', Sco: 'Escorpiao',
  Sag: 'Sagitario', Cap: 'Capricornio', Aqu: 'Aquario', Pis: 'Peixes',
};

const SIGN_EMOJIS = {
  Ari: '♈', Tau: '♉', Gem: '♊', Can: '♋',
  Leo: '♌', Vir: '♍', Lib: '♎', Sco: '♏',
  Sag: '♐', Cap: '♑', Aqu: '♒', Pis: '♓',
};

const PLANET_NAMES = {
  sun: 'Sol', moon: 'Lua', mercury: 'Mercurio', venus: 'Venus',
  mars: 'Marte', jupiter: 'Jupiter', saturn: 'Saturno',
  uranus: 'Urano', neptune: 'Netuno', pluto: 'Plutao',
  chiron: 'Quiron', mean_lilith: 'Lilith',
  true_north_lunar_node: 'Nodo Norte', true_south_lunar_node: 'Nodo Sul',
};

const PLANET_SYMBOLS = {
  sun: '☉', moon: '☽', mercury: '☿', venus: '♀',
  mars: '♂', jupiter: '♃', saturn: '♄',
  uranus: '♅', neptune: '♆', pluto: '♇',
  chiron: '⚷', mean_lilith: '⚸',
  true_north_lunar_node: '☊', true_south_lunar_node: '☋',
};

const HOUSE_NAMES = {
  First_House: 'Casa 1', Second_House: 'Casa 2', Third_House: 'Casa 3',
  Fourth_House: 'Casa 4', Fifth_House: 'Casa 5', Sixth_House: 'Casa 6',
  Seventh_House: 'Casa 7', Eighth_House: 'Casa 8', Ninth_House: 'Casa 9',
  Tenth_House: 'Casa 10', Eleventh_House: 'Casa 11', Twelfth_House: 'Casa 12',
};

// ─── HTTP Client ────────────────────────────────────────────

function apiRequest(endpoint, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const options = {
      hostname: API_HOST,
      port: 443,
      path: endpoint,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-RapidAPI-Key': API_KEY,
        'X-RapidAPI-Host': API_HOST,
        'Content-Length': Buffer.byteLength(data),
      },
    };

    const req = https.request(options, (res) => {
      let chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => {
        const body = Buffer.concat(chunks).toString();
        if (res.statusCode !== 200) {
          reject(new Error(`API ${res.statusCode}: ${body.substring(0, 200)}`));
          return;
        }
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          reject(new Error(`JSON parse error: ${e.message}`));
        }
      });
    });

    req.on('error', reject);
    req.setTimeout(30000, () => {
      req.destroy(new Error('Request timeout (30s)'));
    });
    req.write(data);
    req.end();
  });
}

// ─── API Functions ──────────────────────────────────────────

/**
 * Obtem posicoes planetarias para uma data especifica.
 * @param {Date} date - Data alvo
 * @param {Object} location - Coordenadas e timezone
 * @returns {Promise<Object>} Dados do subject com planetas
 */
async function getSubject(date, location = DEFAULT_LOCATION) {
  const body = {
    subject: {
      name: `Transit ${date.toISOString().split('T')[0]}`,
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
      hour: 12,
      minute: 0,
      longitude: location.longitude,
      latitude: location.latitude,
      city: location.city,
      nation: location.nation,
      timezone: location.timezone,
      zodiac_type: 'Tropical',
      houses_system_identifier: 'P',
    },
  };

  const response = await apiRequest('/api/v5/subject', body);
  if (response.status !== 'OK') {
    throw new Error(`API subject error: ${JSON.stringify(response)}`);
  }
  return response.subject;
}

/**
 * Obtem dados de transito (aspectos entre transito e mapa de referencia).
 * @param {Date} date - Data do transito
 * @param {Object} location - Coordenadas
 * @returns {Promise<Object>} Dados do chart com aspectos
 */
async function getTransitData(date, location = DEFAULT_LOCATION) {
  const body = {
    first_subject: REFERENCE_SUBJECT,
    transit_subject: {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
      hour: 12,
      minute: 0,
      longitude: location.longitude,
      latitude: location.latitude,
      city: location.city,
      nation: location.nation,
      timezone: location.timezone,
    },
    active_points: [
      'Sun', 'Moon', 'Mercury', 'Venus', 'Mars',
      'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto',
      'Chiron', 'True_North_Lunar_Node',
    ],
    active_aspects: [
      { name: 'conjunction', orb: 8 },
      { name: 'opposition', orb: 8 },
      { name: 'square', orb: 6 },
      { name: 'trine', orb: 6 },
      { name: 'sextile', orb: 4 },
    ],
  };

  const response = await apiRequest('/api/v5/chart-data/transit', body);
  if (response.status !== 'OK') {
    throw new Error(`API transit error: ${JSON.stringify(response)}`);
  }
  return response.chart_data;
}

// ─── Processing Functions ───────────────────────────────────

/**
 * Extrai dados de um planeta do subject da API.
 */
function extractPlanetData(subject, planetKey) {
  const planet = subject[planetKey];
  if (!planet) return null;
  return {
    key: planetKey,
    name: PLANET_NAMES[planetKey] || planet.name,
    symbol: PLANET_SYMBOLS[planetKey] || '',
    sign: planet.sign,
    signName: SIGN_NAMES[planet.sign] || planet.sign,
    signEmoji: SIGN_EMOJIS[planet.sign] || '',
    position: Math.round(planet.position * 100) / 100,
    absPos: Math.round(planet.abs_pos * 100) / 100,
    house: HOUSE_NAMES[planet.house] || planet.house,
    retrograde: planet.retrograde || false,
    speed: planet.speed ? Math.round(planet.speed * 1000) / 1000 : null,
    declination: planet.declination ? Math.round(planet.declination * 100) / 100 : null,
    quality: planet.quality,
    element: planet.element,
    weight: PLANET_WEIGHT[planetKey] || 1,
  };
}

/**
 * Processa aspectos entre planetas do transito.
 * Filtra apenas aspectos entre planetas de transito (nao com o mapa de referencia).
 */
function extractTransitAspects(transitData) {
  if (!transitData || !transitData.aspects) return [];

  return transitData.aspects
    .map(a => ({
      planet1: a.p1_name.toLowerCase().replace(/ /g, '_'),
      planet1Name: PLANET_NAMES[a.p1_name.toLowerCase().replace(/ /g, '_')] || a.p1_name,
      planet1Owner: a.p1_owner,
      planet2: a.p2_name.toLowerCase().replace(/ /g, '_'),
      planet2Name: PLANET_NAMES[a.p2_name.toLowerCase().replace(/ /g, '_')] || a.p2_name,
      planet2Owner: a.p2_owner,
      aspect: a.aspect,
      orb: Math.round(a.orbit * 100) / 100,
      aspectDegrees: a.aspect_degrees,
      weight: (ASPECT_WEIGHT[a.aspect] || 1),
    }))
    .sort((a, b) => b.weight - a.weight);
}

/**
 * Detecta ingressos (planetas que mudam de signo entre duas datas).
 */
function detectIngresses(dayDataStart, dayDataEnd) {
  const ingresses = [];
  for (const key of TRACKED_PLANETS) {
    const start = dayDataStart.planets.find(p => p.key === key);
    const end = dayDataEnd.planets.find(p => p.key === key);
    if (start && end && start.sign !== end.sign) {
      ingresses.push({
        planet: key,
        planetName: PLANET_NAMES[key],
        symbol: PLANET_SYMBOLS[key],
        fromSign: start.sign,
        fromSignName: SIGN_NAMES[start.sign],
        toSign: end.sign,
        toSignName: SIGN_NAMES[end.sign],
        weight: (PLANET_WEIGHT[key] || 1) * 8, // Ingressos sao eventos importantes
      });
    }
  }
  return ingresses;
}

/**
 * Detecta mudancas de retrogradacao entre duas datas.
 */
function detectRetrogrades(dayDataStart, dayDataEnd) {
  const changes = [];
  for (const key of TRACKED_PLANETS) {
    const start = dayDataStart.planets.find(p => p.key === key);
    const end = dayDataEnd.planets.find(p => p.key === key);
    if (start && end && start.retrograde !== end.retrograde) {
      changes.push({
        planet: key,
        planetName: PLANET_NAMES[key],
        symbol: PLANET_SYMBOLS[key],
        type: end.retrograde ? 'station_retrograde' : 'station_direct',
        label: end.retrograde ? 'Estacao Retrograda' : 'Estacao Direta',
        sign: end.sign,
        signName: SIGN_NAMES[end.sign],
        position: end.position,
        weight: (PLANET_WEIGHT[key] || 1) * 9, // Estacoes sao muito importantes
      });
    }
  }
  return changes;
}

/**
 * Identifica aspectos exatos (orbe < 1°) entre planetas do transito.
 */
function findExactAspects(planets) {
  const exact = [];
  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      const p1 = planets[i];
      const p2 = planets[j];
      if (!p1 || !p2) continue;

      const diff = Math.abs(p1.absPos - p2.absPos);
      const normalizedDiff = diff > 180 ? 360 - diff : diff;

      const aspects = [
        { name: 'conjunction', degrees: 0, maxOrb: 8 },
        { name: 'opposition', degrees: 180, maxOrb: 8 },
        { name: 'trine', degrees: 120, maxOrb: 6 },
        { name: 'square', degrees: 90, maxOrb: 6 },
        { name: 'sextile', degrees: 60, maxOrb: 4 },
      ];

      for (const asp of aspects) {
        const orb = Math.abs(normalizedDiff - asp.degrees);
        if (orb <= asp.maxOrb) {
          const combinedWeight = (p1.weight + p2.weight) * (ASPECT_WEIGHT[asp.name] || 1);
          const isExact = orb < 1;
          exact.push({
            planet1: p1.key,
            planet1Name: p1.name,
            planet1Symbol: p1.symbol,
            planet1Sign: p1.signName,
            planet1Pos: p1.position,
            planet2: p2.key,
            planet2Name: p2.name,
            planet2Symbol: p2.symbol,
            planet2Sign: p2.signName,
            planet2Pos: p2.position,
            aspect: asp.name,
            aspectDegrees: asp.degrees,
            orb: Math.round(orb * 100) / 100,
            isExact,
            isApplying: null, // seria necessario comparar velocidades
            combinedWeight,
            classification: classifyAspect(combinedWeight),
          });
        }
      }
    }
  }
  return exact.sort((a, b) => b.combinedWeight - a.combinedWeight);
}

/**
 * Classifica um evento por peso combinado.
 */
function classifyAspect(weight) {
  if (weight >= 100) return { level: 'critico', emoji: '🔴', label: 'Critico/Geracional' };
  if (weight >= 60) return { level: 'estrutural', emoji: '🟠', label: 'Estrutural' };
  if (weight >= 30) return { level: 'gatilho', emoji: '🔵', label: 'Gatilho' };
  return { level: 'ambiente', emoji: '⚪', label: 'Ambiente/Contexto' };
}

/**
 * Detecta fase lunar.
 */
function detectLunarPhase(subject) {
  if (!subject.lunar_phase) return null;
  const lp = subject.lunar_phase;

  const phases = {
    0: 'Lua Nova', 1: 'Lua Crescente', 2: 'Quarto Crescente',
    3: 'Gibosa Crescente', 4: 'Gibosa Crescente',
    7: 'Lua Cheia', 8: 'Lua Cheia',
    11: 'Gibosa Minguante', 12: 'Gibosa Minguante',
    14: 'Quarto Minguante', 15: 'Lua Minguante',
  };

  // Detectar eclipses: Lua Nova ou Cheia com nodos proximos
  // BUG FIX: Checar proximidade com AMBOS os nodos (Norte E Sul).
  // Eclipse solar: Sol+Lua perto de qualquer nodo (Lua Nova).
  // Eclipse lunar: Lua perto de um nodo, Sol perto do outro (Lua Cheia).
  // Como os nodos sao sempre opostos (180°), basta checar se a Lua
  // esta dentro de 18° de QUALQUER um dos dois nodos.
  const moonDeg = subject.moon?.abs_pos || 0;
  const northNodeDeg = subject.true_north_lunar_node?.abs_pos || 0;
  const southNodeDeg = subject.true_south_lunar_node?.abs_pos || (northNodeDeg + 180) % 360;

  const northNodeProximity = Math.abs(moonDeg - northNodeDeg);
  const normalizedNorthProx = northNodeProximity > 180 ? 360 - northNodeProximity : northNodeProximity;

  const southNodeProximity = Math.abs(moonDeg - southNodeDeg);
  const normalizedSouthProx = southNodeProximity > 180 ? 360 - southNodeProximity : southNodeProximity;

  const isEclipseWindow = normalizedNorthProx < 18 || normalizedSouthProx < 18;

  let phaseName = phases[lp.moon_phase] || lp.moon_phase_name || 'Desconhecida';
  let isEclipse = false;

  if (isEclipseWindow) {
    if (lp.degrees_between_s_m < 15) {
      phaseName = 'Eclipse Solar (Lua Nova)';
      isEclipse = true;
    } else if (Math.abs(lp.degrees_between_s_m - 180) < 15) {
      phaseName = 'Eclipse Lunar (Lua Cheia)';
      isEclipse = true;
    }
  }

  return {
    phase: lp.moon_phase,
    phaseName,
    degreesBetween: Math.round(lp.degrees_between_s_m * 100) / 100,
    moonSign: subject.moon?.sign,
    moonSignName: SIGN_NAMES[subject.moon?.sign] || '',
    moonPosition: subject.moon?.position ? Math.round(subject.moon.position * 100) / 100 : null,
    isEclipse,
    isEclipseWindow,
  };
}

// ─── Main Analysis ──────────────────────────────────────────

/**
 * Processa um dia: coleta dados da API e estrutura.
 */
async function processDay(date, location = DEFAULT_LOCATION) {
  const [subject, transitData] = await Promise.all([
    getSubject(date, location),
    getTransitData(date, location),
  ]);

  const planets = TRACKED_PLANETS
    .map(key => extractPlanetData(subject, key))
    .filter(Boolean);

  const lunarPhase = detectLunarPhase(subject);
  const aspects = findExactAspects(planets);
  const transitAspects = extractTransitAspects(transitData);

  return {
    date: date.toISOString().split('T')[0],
    dateFormatted: date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    planets,
    lunarPhase,
    aspects,
    transitAspects,
    rawSubject: subject,
  };
}

/**
 * Analisa uma semana inteira e gera relatorio consolidado.
 * @param {string} startDateStr - Data inicio (YYYY-MM-DD)
 * @param {string} endDateStr - Data fim (YYYY-MM-DD)
 * @param {Object} location - Coordenadas
 * @returns {Promise<Object>} Dados consolidados da semana
 */
async function analyzeWeek(startDateStr, endDateStr, location = DEFAULT_LOCATION) {
  const startDate = new Date(startDateStr + 'T12:00:00');
  const endDate = new Date(endDateStr + 'T12:00:00');

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    throw new Error('Datas invalidas. Use formato YYYY-MM-DD.');
  }

  // Coletar dados de cada dia
  const days = [];
  const current = new Date(startDate);
  while (current <= endDate) {
    const dateStr = current.toISOString().split('T')[0];
    console.error(`  Coletando dados: ${dateStr}...`);
    try {
      const dayData = await processDay(new Date(current), location);
      days.push(dayData);
    } catch (err) {
      console.error(`  ERRO em ${dateStr}: ${err.message}`);
      days.push({ date: dateStr, error: err.message });
    }
    current.setDate(current.getDate() + 1);
    // Rate limiting: 500ms entre chamadas
    if (current <= endDate) {
      await new Promise(r => setTimeout(r, 500));
    }
  }

  const validDays = days.filter(d => !d.error);
  if (validDays.length === 0) {
    throw new Error('Nenhum dia processado com sucesso.');
  }

  // Detectar mudancas ao longo da semana
  const firstDay = validDays[0];
  const lastDay = validDays[validDays.length - 1];

  const ingresses = detectIngresses(firstDay, lastDay);
  const retrogradeChanges = detectRetrogrades(firstDay, lastDay);

  // Consolidar aspectos mais importantes da semana
  const allAspects = validDays.flatMap(d => d.aspects || []);
  const uniqueAspects = deduplicateAspects(allAspects);

  // Identificar eventos-chave rankeados
  const events = rankEvents(uniqueAspects, ingresses, retrogradeChanges, validDays);

  // Fases lunares da semana
  const lunarPhases = validDays
    .filter(d => d.lunarPhase)
    .map(d => ({ date: d.date, ...d.lunarPhase }));

  // Posicoes planetarias consolidadas (inicio e fim da semana)
  const planetPositions = {
    weekStart: firstDay.planets,
    weekEnd: lastDay.planets,
  };

  return {
    metadata: {
      startDate: startDateStr,
      endDate: endDateStr,
      location: {
        city: location.city,
        nation: location.nation,
      },
      generatedAt: new Date().toISOString(),
      daysProcessed: validDays.length,
      daysTotal: days.length,
    },
    planetPositions,
    events,
    ingresses,
    retrogradeChanges,
    lunarPhases,
    aspects: uniqueAspects.slice(0, 20), // Top 20 aspectos
    dailyData: days,
  };
}

/**
 * Remove aspectos duplicados (mesmo par de planetas, mesmo aspecto).
 * Mantém o de menor orbe.
 */
function deduplicateAspects(aspects) {
  const map = new Map();
  for (const a of aspects) {
    const key = [a.planet1, a.planet2, a.aspect].sort().join('|');
    const existing = map.get(key);
    if (!existing || a.orb < existing.orb) {
      map.set(key, a);
    }
  }
  return Array.from(map.values()).sort((a, b) => b.combinedWeight - a.combinedWeight);
}

/**
 * Rankeia todos os eventos da semana por importancia.
 */
function rankEvents(aspects, ingresses, retrogradeChanges, days) {
  const events = [];

  // Aspectos como eventos
  for (const a of aspects.slice(0, 10)) {
    events.push({
      type: 'aspect',
      label: `${a.planet1Name} ${a.planet1Symbol} ${getAspectSymbol(a.aspect)} ${a.planet2Name} ${a.planet2Symbol}`,
      description: `${a.planet1Name} em ${a.aspect} com ${a.planet2Name} (orbe ${a.orb}°)`,
      planet1: a.planet1Name,
      planet1Sign: a.planet1Sign,
      planet2: a.planet2Name,
      planet2Sign: a.planet2Sign,
      aspect: a.aspect,
      orb: a.orb,
      isExact: a.isExact,
      weight: a.combinedWeight,
      classification: a.classification,
    });
  }

  // Ingressos como eventos
  for (const i of ingresses) {
    events.push({
      type: 'ingress',
      label: `${PLANET_SYMBOLS[i.planet]} ${i.planetName} entra em ${i.toSignName}`,
      description: `${i.planetName} transita de ${i.fromSignName} para ${i.toSignName}`,
      planet: i.planetName,
      fromSign: i.fromSignName,
      toSign: i.toSignName,
      weight: i.weight,
      classification: classifyAspect(i.weight),
    });
  }

  // Mudancas de retrogradacao
  for (const r of retrogradeChanges) {
    events.push({
      type: 'station',
      label: `${PLANET_SYMBOLS[r.planet]} ${r.planetName} — ${r.label}`,
      description: `${r.planetName} faz ${r.label} a ${r.position}° de ${r.signName}`,
      planet: r.planetName,
      stationType: r.type,
      sign: r.signName,
      position: r.position,
      weight: r.weight,
      classification: classifyAspect(r.weight),
    });
  }

  // Eclipses / Lua Nova / Lua Cheia
  for (const day of days) {
    if (day.lunarPhase) {
      const lp = day.lunarPhase;
      const isSignificant = lp.isEclipse ||
        lp.degreesBetween < 5 ||
        Math.abs(lp.degreesBetween - 180) < 5;

      if (isSignificant) {
        const weight = lp.isEclipse ? 100 : 40;
        events.push({
          type: lp.isEclipse ? 'eclipse' : 'lunar_phase',
          label: `☽ ${lp.phaseName} em ${lp.moonSignName}`,
          description: `${lp.phaseName} a ${lp.moonPosition}° de ${lp.moonSignName}`,
          date: day.date,
          phase: lp.phaseName,
          sign: lp.moonSignName,
          position: lp.moonPosition,
          isEclipse: lp.isEclipse,
          weight,
          classification: classifyAspect(weight),
        });
      }
    }
  }

  return events.sort((a, b) => b.weight - a.weight);
}

function getAspectSymbol(aspect) {
  const symbols = {
    conjunction: '☌', opposition: '☍', trine: '△',
    square: '□', sextile: '⚹', quintile: 'Q',
  };
  return symbols[aspect] || aspect;
}

// ─── Output Formatters ──────────────────────────────────────

/**
 * Gera relatorio em Markdown a partir dos dados consolidados.
 */
function generateMarkdownReport(data) {
  const { metadata, planetPositions, events, ingresses, retrogradeChanges, lunarPhases, aspects } = data;

  let md = '';

  // Header
  md += `# Relatorio Astrologico Semanal\n`;
  md += `## Semana de ${formatDateBR(metadata.startDate)} a ${formatDateBR(metadata.endDate)}\n\n`;
  md += `> Gerado em ${new Date(metadata.generatedAt).toLocaleString('pt-BR')}\n`;
  md += `> Referencia: ${metadata.location.city}, ${metadata.location.nation}\n\n`;
  md += `---\n\n`;

  // 1. Panorama Celeste
  md += `## 1. Panorama Celeste\n\n`;
  if (events.length > 0) {
    const topEvent = events[0];
    md += `**Evento principal da semana:** ${topEvent.label}\n\n`;
    md += `**Classificacao:** ${topEvent.classification.emoji} ${topEvent.classification.label}\n\n`;
  }

  // Fases lunares
  if (lunarPhases.length > 0) {
    const significant = lunarPhases.find(l => l.isEclipse || l.degreesBetween < 10 || Math.abs(l.degreesBetween - 180) < 10);
    if (significant) {
      md += `**Fase lunar destaque:** ${significant.phaseName} em ${significant.moonSignName} (${significant.moonPosition}°)\n\n`;
    }
  }

  md += `---\n\n`;

  // 2. Mapa de Transitos
  md += `## 2. Mapa de Transitos\n\n`;
  md += `### Posicoes Planetarias (inicio da semana)\n\n`;
  md += `| Planeta | Simbolo | Signo | Grau | Casa | Retro | Velocidade |\n`;
  md += `|---------|---------|-------|------|------|-------|------------|\n`;

  for (const p of planetPositions.weekStart) {
    const retro = p.retrograde ? '℞' : '';
    const speed = p.speed !== null ? `${p.speed}°/dia` : '-';
    md += `| ${p.name} | ${p.symbol} | ${p.signEmoji} ${p.signName} | ${p.position}° | ${p.house || '-'} | ${retro} | ${speed} |\n`;
  }
  md += `\n`;

  // 3. Eventos Rankeados
  md += `## 3. Eventos Rankeados por Importancia\n\n`;
  for (let i = 0; i < Math.min(events.length, 8); i++) {
    const e = events[i];
    md += `### ${i + 1}. ${e.classification.emoji} ${e.label}\n`;
    md += `- **Tipo:** ${e.type}\n`;
    md += `- **Classificacao:** ${e.classification.label} (peso: ${e.weight})\n`;
    md += `- **Descricao:** ${e.description}\n`;
    if (e.orb !== undefined) md += `- **Orbe:** ${e.orb}°${e.isExact ? ' (EXATO)' : ''}\n`;
    md += `\n`;
  }

  md += `---\n\n`;

  // 4. Ingressos e Estacoes
  if (ingresses.length > 0 || retrogradeChanges.length > 0) {
    md += `## 4. Mudancas de Signo e Retrogradacao\n\n`;
    for (const i of ingresses) {
      md += `- ${i.symbol} **${i.planetName}** transita de ${i.fromSignName} para **${i.toSignName}**\n`;
    }
    for (const r of retrogradeChanges) {
      md += `- ${PLANET_SYMBOLS[r.planet]} **${r.planetName}** — ${r.label} a ${r.position}° de ${r.signName}\n`;
    }
    md += `\n---\n\n`;
  }

  // 5. Guia por Casa (placeholder - preenchido pelo agente)
  md += `## 5. Guia por Casa\n\n`;
  md += `> Esta secao sera preenchida pelo Agente Analista com interpretacoes\n`;
  md += `> personalizadas de como o evento principal afeta cada uma das 12 casas.\n\n`;

  for (let casa = 1; casa <= 12; casa++) {
    md += `### Casa ${casa}\n`;
    md += `{{INTERPRETACAO_CASA_${casa}}}\n\n`;
  }

  md += `---\n\n`;

  // 6. Materia-Prima para Conteudo
  md += `## 6. Materia-Prima para Conteudo\n\n`;
  md += `> Dados brutos para alimentar os agentes de criacao de conteudo.\n\n`;

  // Planetas retrogrados
  const retrogrades = planetPositions.weekStart.filter(p => p.retrograde);
  if (retrogrades.length > 0) {
    md += `**Planetas retrogrados:** ${retrogrades.map(p => `${p.symbol} ${p.name} em ${p.signName}`).join(', ')}\n\n`;
  }

  // Elemento dominante
  const elements = {};
  for (const p of planetPositions.weekStart) {
    if (p.element) {
      elements[p.element] = (elements[p.element] || 0) + 1;
    }
  }
  const dominantElement = Object.entries(elements).sort((a, b) => b[1] - a[1])[0];
  if (dominantElement) {
    const elementNames = { Fire: 'Fogo', Earth: 'Terra', Air: 'Ar', Water: 'Agua' };
    md += `**Elemento dominante:** ${elementNames[dominantElement[0]] || dominantElement[0]} (${dominantElement[1]} planetas)\n\n`;
  }

  // Keywords
  md += `**Keywords sugeridas:** {{KEYWORDS}}\n\n`;
  md += `**Tom emocional:** {{TOM_EMOCIONAL}}\n\n`;
  md += `**Referencias mitologicas sugeridas:** {{REFERENCIAS_MITOLOGICAS}}\n\n`;

  return md;
}

function formatDateBR(dateStr) {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

// ─── CLI ────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  const flags = {};

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--start' && args[i + 1]) flags.start = args[++i];
    else if (args[i] === '--end' && args[i + 1]) flags.end = args[++i];
    else if (args[i] === '--date' && args[i + 1]) {
      flags.start = args[++i];
      flags.end = flags.start;
    }
    else if (args[i] === '--output' && args[i + 1]) flags.output = args[++i];
    else if (args[i] === '--format' && args[i + 1]) flags.format = args[++i];
    else if (args[i] === '--help' || args[i] === '-h') {
      console.log(`
Astrologer API Integration

Uso:
  node scripts/astrologer-api.js --start YYYY-MM-DD --end YYYY-MM-DD [opcoes]
  node scripts/astrologer-api.js --date YYYY-MM-DD [opcoes]

Opcoes:
  --start DATE    Data inicio (YYYY-MM-DD)
  --end DATE      Data fim (YYYY-MM-DD)
  --date DATE     Data unica (atalho para --start DATE --end DATE)
  --output FILE   Salvar JSON em arquivo
  --format FORMAT Output: json (default) ou markdown
  --help          Mostra esta ajuda
      `);
      process.exit(0);
    }
  }

  if (!flags.start) {
    console.error('Erro: --start ou --date eh obrigatorio. Use --help para ajuda.');
    process.exit(1);
  }

  if (!flags.end) flags.end = flags.start;
  if (!flags.format) flags.format = 'json';

  console.error(`\nAstrologer API — Analise: ${flags.start} a ${flags.end}\n`);

  const result = await analyzeWeek(flags.start, flags.end);

  if (flags.format === 'markdown') {
    const md = generateMarkdownReport(result);
    if (flags.output) {
      fs.writeFileSync(flags.output, md, 'utf8');
      console.error(`\nRelatorio MD salvo em: ${flags.output}`);
    } else {
      console.log(md);
    }
  } else {
    const json = JSON.stringify(result, null, 2);
    if (flags.output) {
      fs.writeFileSync(flags.output, json, 'utf8');
      console.error(`\nDados JSON salvos em: ${flags.output}`);
    } else {
      console.log(json);
    }
  }

  console.error(`\nConcluido. ${result.metadata.daysProcessed}/${result.metadata.daysTotal} dias processados.`);
  console.error(`${result.events.length} eventos identificados.`);
}

// ─── Exports ────────────────────────────────────────────────

module.exports = {
  getSubject,
  getTransitData,
  analyzeWeek,
  processDay,
  generateMarkdownReport,
  // Constantes uteis
  PLANET_NAMES,
  PLANET_SYMBOLS,
  SIGN_NAMES,
  SIGN_EMOJIS,
  HOUSE_NAMES,
  DEFAULT_LOCATION,
};

// Run if called directly
if (require.main === module) {
  main().catch(err => {
    console.error(`\nErro fatal: ${err.message}`);
    process.exit(1);
  });
}
