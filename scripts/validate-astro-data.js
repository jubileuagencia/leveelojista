#!/usr/bin/env node
'use strict';

const path = process.argv[2] || './PELICULA SIDERAL/DATA/astro-data-2026-03-03-2026-03-09.json';
const data = require(require('path').resolve(path));

console.log('=== VALIDACAO END-TO-END ===\n');
console.log('Periodo:', data.metadata.startDate, 'a', data.metadata.endDate);
console.log('Dias processados:', data.metadata.daysProcessed, '/', data.metadata.daysTotal);

console.log('\nTop 5 Eventos (' + data.events.length + ' total):');
data.events.slice(0, 5).forEach(function(e, i) {
  var orb = e.orb !== undefined ? e.orb + '°' : '-';
  var exact = e.isExact ? ' EXATO' : '';
  console.log('  ' + (i + 1) + '. [' + e.classification.level + '] ' + e.label);
  console.log('     Peso: ' + e.weight + ' | Orbe: ' + orb + exact);
});

console.log('\nIngressos: ' + data.ingresses.length);
data.ingresses.forEach(function(ing) {
  console.log('  - ' + ing.planetName + ': ' + ing.fromSignName + ' -> ' + ing.toSignName);
});

console.log('\nRetrogrados:');
data.planetPositions.weekStart.filter(function(p) { return p.retrograde; }).forEach(function(p) {
  console.log('  - ' + p.symbol + ' ' + p.name + ' em ' + p.signName);
});

var elements = {};
data.planetPositions.weekStart.forEach(function(p) {
  if (p.element) elements[p.element] = (elements[p.element] || 0) + 1;
});
console.log('\nDistribuicao elemental:');
var elNames = { Fire: 'Fogo', Earth: 'Terra', Air: 'Ar', Water: 'Agua' };
Object.entries(elements).sort(function(a, b) { return b[1] - a[1]; }).forEach(function(pair) {
  console.log('  - ' + (elNames[pair[0]] || pair[0]) + ': ' + pair[1] + ' planetas');
});

var eclipses = data.lunarPhases.filter(function(l) { return l.isEclipse; });
console.log('\nEclipses na semana: ' + eclipses.length);
eclipses.forEach(function(e) {
  console.log('  - ' + e.phaseName + ' em ' + e.moonSignName + ' (' + e.date + ')');
});

// Validacoes
var errors = [];
if (data.metadata.daysProcessed === 0) errors.push('Nenhum dia processado');
if (data.events.length < 3) errors.push('Menos de 3 eventos (encontrou ' + data.events.length + ')');
if (data.planetPositions.weekStart.length < 10) errors.push('Menos de 10 planetas no inicio');

if (errors.length > 0) {
  console.log('\n!!! ERROS DE VALIDACAO:');
  errors.forEach(function(e) { console.log('  - ' + e); });
  process.exit(1);
} else {
  console.log('\n=== TODAS AS VALIDACOES OK ===');
}
