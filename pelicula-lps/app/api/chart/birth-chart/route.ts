import { NextResponse } from "next/server";
import { findCityById } from "@/lib/cities-server";
import {
  SIGN_NAMES,
  SIGN_EMOJIS,
  PLANET_NAMES,
  PLANET_SYMBOLS,
  HOUSE_NAMES,
  DISPLAY_PLANETS,
  type SignKey,
} from "@/lib/astro-constants";
import { getEventoParaAscendente, type Evento } from "@/lib/evento";
import { createServiceClient } from "@/lib/supabase";

const API_HOST = "astrologer.p.rapidapi.com";
const API_KEY = process.env.ASTROLOGER_API_KEY ?? "";
const MANYCHAT_API_TOKEN = process.env.MANYCHAT_API_TOKEN ?? "";
const MANYCHAT_TAG_ID = 82561115;

interface ChartRequest {
  name: string;
  email: string;
  day: number;
  month: number;
  year: number;
  hour: number;
  minute: number;
  citySlug: string;
  instagram: string;
  manychatId: string;
  eventoSlug: string;
}

interface PlanetPosition {
  key: string;
  name: string;
  symbol: string;
  sign: string;
  signEmoji: string;
  signKey: string;
  degree: number;
  absDegree: number;
  house: string;
  retrograde: boolean;
}

const HOUSE_KEYS = [
  "first_house", "second_house", "third_house", "fourth_house",
  "fifth_house", "sixth_house", "seventh_house", "eighth_house",
  "ninth_house", "tenth_house", "eleventh_house", "twelfth_house",
] as const;

function validate(body: unknown): { data: ChartRequest; error?: string } {
  const b = body as Record<string, unknown>;

  const name = String(b.name ?? "").trim();
  if (name.length < 2 || name.length > 100) return { data: {} as ChartRequest, error: "Informe seu nome" };

  const email = String(b.email ?? "").trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { data: {} as ChartRequest, error: "Email inválido" };

  const day = Number(b.day);
  const month = Number(b.month);
  const year = Number(b.year);
  const hour = Number(b.hour);
  const minute = Number(b.minute);

  if (!Number.isInteger(month) || month < 1 || month > 12) return { data: {} as ChartRequest, error: "Mês inválido" };
  if (!Number.isInteger(year) || year < 1900 || year > 2026) return { data: {} as ChartRequest, error: "Ano inválido" };
  if (!Number.isInteger(day) || day < 1 || day > 31) return { data: {} as ChartRequest, error: "Dia inválido" };

  const testDate = new Date(year, month - 1, day);
  if (testDate.getDate() !== day) return { data: {} as ChartRequest, error: "Data inválida" };

  if (!Number.isInteger(hour) || hour < 0 || hour > 23) return { data: {} as ChartRequest, error: "Hora inválida" };
  if (!Number.isInteger(minute) || minute < 0 || minute > 59) return { data: {} as ChartRequest, error: "Minuto inválido" };

  const citySlug = String(b.citySlug ?? "").trim();
  if (!findCityById(Number(citySlug))) return { data: {} as ChartRequest, error: "Selecione uma cidade" };

  const instagram = String(b.instagram ?? "").trim().replace(/^@/, "");
  const manychatId = String(b.manychatId ?? "").trim();
  const eventoSlug = String(b.eventoSlug ?? "").trim();

  return { data: { name, email, day, month, year, hour, minute, citySlug, instagram, manychatId, eventoSlug } };
}

async function fetchEvento(slug: string): Promise<Evento | null> {
  try {
    const supabase = createServiceClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sb = supabase as any;

    let query;
    if (slug) {
      query = sb.from("eventos").select("*").eq("slug", slug).maybeSingle();
    } else {
      query = sb.from("eventos").select("*").eq("is_active", true).order("data_evento", { ascending: false }).limit(1).maybeSingle();
    }

    const { data } = await query;
    return data as Evento | null;
  } catch (err) {
    console.error("fetchEvento error:", err);
    return null;
  }
}

function buildEclipseResponse(evento: Evento | null, ascSignKey: SignKey) {
  if (!evento) {
    // Fallback — sem evento no banco
    return {
      house: 1,
      theme: { title: "Evento da semana", keywords: "", description: "Nenhum evento configurado." },
      meta: { substackUrl: "", ctaTexto: "", ctaPergunta: "", headerLabel: "" },
    };
  }
  return getEventoParaAscendente(evento, ascSignKey);
}

async function callBirthChartAPI(data: ChartRequest) {
  const city = findCityById(Number(data.citySlug))!;

  const body = {
    subject: {
      name: data.name,
      year: data.year,
      month: data.month,
      day: data.day,
      hour: data.hour,
      minute: data.minute,
      longitude: city.longitude,
      latitude: city.latitude,
      city: city.name,
      nation: "BR",
      timezone: city.timezone,
      zodiac_type: "Tropical",
      houses_system_identifier: "P",
    },
    theme: "dark",
    language: "PT",
    split_chart: true,
    transparent_background: true,
  };

  const res = await fetch(`https://${API_HOST}/api/v5/chart/birth-chart`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-RapidAPI-Key": API_KEY,
      "X-RapidAPI-Host": API_HOST,
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(45000),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Astrologer API ${res.status}: ${text.substring(0, 200)}`);
  }

  const json = await res.json();
  if (json.status !== "OK") {
    throw new Error(`Astrologer API error: ${JSON.stringify(json).substring(0, 200)}`);
  }

  return json;
}

function extractPlanets(subject: Record<string, unknown>): PlanetPosition[] {
  const planets: PlanetPosition[] = [];

  for (const key of DISPLAY_PLANETS) {
    const planet = subject[key] as Record<string, unknown> | undefined;
    if (!planet) continue;

    const signKey = String(planet.sign ?? "") as SignKey;
    const houseName = String(planet.house ?? "");

    planets.push({
      key,
      name: PLANET_NAMES[key] ?? key,
      symbol: PLANET_SYMBOLS[key] ?? "",
      sign: SIGN_NAMES[signKey] ?? signKey,
      signEmoji: SIGN_EMOJIS[signKey] ?? "",
      signKey,
      degree: Math.round(Number(planet.position ?? 0) * 100) / 100,
      absDegree: Math.round(Number(planet.abs_pos ?? 0) * 100) / 100,
      house: HOUSE_NAMES[houseName] ?? houseName,
      retrograde: Boolean(planet.retrograde),
    });
  }

  return planets;
}

function extractHouseCusps(subject: Record<string, unknown>): number[] {
  return HOUSE_KEYS.map((key) => {
    const house = subject[key] as Record<string, unknown> | undefined;
    return Math.round(Number(house?.abs_pos ?? 0) * 100) / 100;
  });
}

function getAscendant(subject: Record<string, unknown>): { sign: string; signKey: SignKey; emoji: string; degree: number } {
  const firstHouse = subject.first_house as Record<string, unknown> | undefined;
  if (firstHouse) {
    const signKey = String(firstHouse.sign ?? "") as SignKey;
    return {
      sign: SIGN_NAMES[signKey] ?? signKey,
      signKey,
      emoji: SIGN_EMOJIS[signKey] ?? "",
      degree: Math.round(Number(firstHouse.abs_pos ?? 0) * 100) / 100,
    };
  }
  const sun = subject.sun as Record<string, unknown> | undefined;
  const signKey = String(sun?.sign ?? "Ari") as SignKey;
  return {
    sign: SIGN_NAMES[signKey] ?? signKey,
    signKey,
    emoji: SIGN_EMOJIS[signKey] ?? "",
    degree: 0,
  };
}

async function tagManychatSubscriber(subscriberId: string) {
  try {
    await fetch("https://api.manychat.com/fb/subscriber/addTag", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${MANYCHAT_API_TOKEN}`,
      },
      body: JSON.stringify({
        subscriber_id: subscriberId,
        tag_id: MANYCHAT_TAG_ID,
      }),
      signal: AbortSignal.timeout(10000),
    });
  } catch (err) {
    console.error("ManyChat tag error:", err);
  }
}

async function findExistingChart(data: ChartRequest, evento: Evento | null) {
  try {
    const supabase = createServiceClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sb = supabase as any;

    let lead: { id: string } | null = null;

    if (data.manychatId) {
      const { data: mcLead } = await sb
        .from("leads").select("id").eq("manychat_id", data.manychatId).maybeSingle();
      if (mcLead) lead = mcLead;
    }
    if (!lead) {
      const { data: emailLead } = await sb
        .from("leads").select("id").eq("email", data.email).maybeSingle();
      if (emailLead) lead = emailLead;
    }
    if (!lead && data.instagram) {
      const { data: igLead } = await sb
        .from("leads").select("id").eq("ig_username", data.instagram).maybeSingle();
      if (igLead) lead = igLead;
    }

    if (!lead) return null;

    const { data: chart } = await sb
      .from("charts")
      .select("chart_data, ascendant_sign")
      .eq("lead_id", lead.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!chart?.chart_data) return null;

    const stored = chart.chart_data as {
      ascendant: { sign: string; signKey: string; emoji: string; degree?: number };
      planets: PlanetPosition[];
      houseCusps?: number[];
      svg?: string;
    };
    const ascSignKey = (stored.ascendant?.signKey ?? chart.ascendant_sign ?? "Ari") as SignKey;

    const updates: Record<string, string> = {};
    if (data.manychatId) updates.manychat_id = data.manychatId;
    if (data.instagram) updates.ig_username = data.instagram;
    if (data.name) updates.name = data.name;
    if (data.email) updates.email = data.email;
    if (Object.keys(updates).length > 0) {
      await sb.from("leads").update(updates).eq("id", lead.id);
    }

    return {
      ascendant: stored.ascendant ?? {
        sign: SIGN_NAMES[ascSignKey] ?? ascSignKey,
        signKey: ascSignKey,
        emoji: SIGN_EMOJIS[ascSignKey] ?? "",
        degree: 0,
      },
      planets: stored.planets ?? [],
      houseCusps: stored.houseCusps ?? [],
      svg: stored.svg ?? null,
      eclipse: buildEclipseResponse(evento, ascSignKey),
      cached: true,
    };
  } catch (err) {
    console.error("findExistingChart error:", err);
    return null;
  }
}

async function saveToSupabase(
  data: ChartRequest,
  ascendantSign: string,
  sunSign: string,
  moonSign: string,
  chartData: unknown,
) {
  try {
    const supabase = createServiceClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sb = supabase as any;

    let existingLeadId: string | null = null;

    if (data.manychatId) {
      const { data: mcLead } = await sb
        .from("leads").select("id").eq("manychat_id", data.manychatId).maybeSingle();
      if (mcLead) existingLeadId = mcLead.id;
    }
    if (!existingLeadId && data.instagram) {
      const { data: igLead } = await sb
        .from("leads").select("id").eq("ig_username", data.instagram).maybeSingle();
      if (igLead) existingLeadId = igLead.id;
    }

    let leadId: string;

    if (existingLeadId) {
      const updates: Record<string, string> = { name: data.name, email: data.email };
      if (data.instagram) updates.ig_username = data.instagram;
      if (data.manychatId) updates.manychat_id = data.manychatId;
      await sb.from("leads").update(updates).eq("id", existingLeadId);
      leadId = existingLeadId;
    } else {
      const leadPayload: Record<string, string> = { name: data.name, email: data.email };
      if (data.instagram) leadPayload.ig_username = data.instagram;
      if (data.manychatId) leadPayload.manychat_id = data.manychatId;

      const { data: lead, error: leadError } = await sb
        .from("leads")
        .upsert(leadPayload, { onConflict: "email" })
        .select("id")
        .single();

      if (leadError || !lead) {
        console.error("Lead save error:", leadError);
        return;
      }
      leadId = (lead as { id: string }).id;
    }

    const { error: chartError } = await sb.from("charts").insert({
      lead_id: leadId,
      birth_date: `${data.year}-${String(data.month).padStart(2, "0")}-${String(data.day).padStart(2, "0")}`,
      birth_time: `${String(data.hour).padStart(2, "0")}:${String(data.minute).padStart(2, "0")}:00`,
      birth_city: data.citySlug,
      ascendant_sign: ascendantSign,
      sun_sign: sunSign,
      moon_sign: moonSign,
      chart_data: chartData,
    });

    if (chartError) {
      console.error("Chart save error:", chartError);
    }
  } catch (err) {
    console.error("Supabase error:", err);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { data, error } = validate(body);
    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    // Buscar evento do banco
    const evento = await fetchEvento(data.eventoSlug);

    // Check cache
    const existing = await findExistingChart(data, evento);
    if (existing) {
      if (data.manychatId && MANYCHAT_API_TOKEN) {
        tagManychatSubscriber(data.manychatId).catch(() => {});
      }
      return NextResponse.json(existing);
    }

    if (!API_KEY) {
      return NextResponse.json({ error: "API não configurada" }, { status: 500 });
    }

    const apiResponse = await callBirthChartAPI(data);
    const subject = apiResponse.chart_data?.subject ?? apiResponse.subject ?? {};

    const planets = extractPlanets(subject);
    const ascendant = getAscendant(subject);
    const houseCusps = extractHouseCusps(subject);

    // Get SVG — split_chart returns chart_wheel, otherwise chart
    const svg = apiResponse.chart_wheel ?? apiResponse.chart ?? null;

    const sunSign = planets.find((p) => p.key === "sun")?.signKey ?? "Ari";
    const moonSign = planets.find((p) => p.key === "moon")?.signKey ?? "Ari";

    // Save with SVG and extra data
    await saveToSupabase(data, ascendant.signKey, sunSign, moonSign, {
      planets,
      ascendant,
      houseCusps,
      svg,
    });

    if (data.manychatId && MANYCHAT_API_TOKEN) {
      tagManychatSubscriber(data.manychatId).catch(() => {});
    }

    return NextResponse.json({
      ascendant,
      planets,
      houseCusps,
      svg,
      eclipse: buildEclipseResponse(evento, ascendant.signKey),
      cached: false,
    });
  } catch (err) {
    console.error("Birth Chart API error:", err);
    const message = err instanceof Error ? err.message : "Erro interno";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
