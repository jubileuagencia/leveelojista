import { NextResponse } from "next/server";
import { findCityBySlug } from "@/lib/cities";
import {
  SIGN_NAMES,
  SIGN_EMOJIS,
  PLANET_NAMES,
  PLANET_SYMBOLS,
  HOUSE_NAMES,
  DISPLAY_PLANETS,
  type SignKey,
} from "@/lib/astro-constants";
import { ECLIPSE_HOUSE_MAP, HOUSE_THEMES, ECLIPSE_META } from "@/lib/eclipse-data";
import { createServiceClient } from "@/lib/supabase";

const API_HOST = "astrologer.p.rapidapi.com";
const API_KEY = process.env.ASTROLOGER_API_KEY ?? "";

interface ChartRequest {
  name: string;
  email: string;
  day: number;
  month: number;
  year: number;
  hour: number;
  minute: number;
  citySlug: string;
}

interface PlanetPosition {
  key: string;
  name: string;
  symbol: string;
  sign: string;
  signEmoji: string;
  signKey: string;
  degree: number;
  house: string;
}

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
  if (!Number.isInteger(year) || year < 1900 || year > 2025) return { data: {} as ChartRequest, error: "Ano inválido" };
  if (!Number.isInteger(day) || day < 1 || day > 31) return { data: {} as ChartRequest, error: "Dia inválido" };

  // Validate actual date
  const testDate = new Date(year, month - 1, day);
  if (testDate.getDate() !== day) return { data: {} as ChartRequest, error: "Data inválida" };

  if (!Number.isInteger(hour) || hour < 0 || hour > 23) return { data: {} as ChartRequest, error: "Hora inválida" };
  if (!Number.isInteger(minute) || minute < 0 || minute > 59) return { data: {} as ChartRequest, error: "Minuto inválido" };

  const citySlug = String(b.citySlug ?? "").trim();
  if (!findCityBySlug(citySlug)) return { data: {} as ChartRequest, error: "Selecione uma cidade" };

  return { data: { name, email, day, month, year, hour, minute, citySlug } };
}

async function callAstrologerAPI(data: ChartRequest) {
  const city = findCityBySlug(data.citySlug)!;

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
  };

  const res = await fetch(`https://${API_HOST}/api/v5/subject`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-RapidAPI-Key": API_KEY,
      "X-RapidAPI-Host": API_HOST,
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(30000),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Astrologer API ${res.status}: ${text.substring(0, 200)}`);
  }

  const json = await res.json();
  if (json.status !== "OK") {
    throw new Error(`Astrologer API error: ${JSON.stringify(json).substring(0, 200)}`);
  }

  return json.subject;
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
      house: HOUSE_NAMES[houseName] ?? houseName,
    });
  }

  return planets;
}

function getAscendant(subject: Record<string, unknown>): { sign: string; signKey: SignKey; emoji: string } {
  const firstHouse = subject.first_house as Record<string, unknown> | undefined;
  if (firstHouse) {
    const signKey = String(firstHouse.sign ?? "") as SignKey;
    return {
      sign: SIGN_NAMES[signKey] ?? signKey,
      signKey,
      emoji: SIGN_EMOJIS[signKey] ?? "",
    };
  }
  // Fallback: use sun sign
  const sun = subject.sun as Record<string, unknown> | undefined;
  const signKey = String(sun?.sign ?? "Ari") as SignKey;
  return {
    sign: SIGN_NAMES[signKey] ?? signKey,
    signKey,
    emoji: SIGN_EMOJIS[signKey] ?? "",
  };
}

async function saveToSupabase(data: ChartRequest, ascendantSign: string, sunSign: string, moonSign: string, chartData: unknown) {
  try {
    const supabase = createServiceClient();

    // Upsert lead (email unique)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: lead, error: leadError } = await (supabase as any)
      .from("leads")
      .upsert({ name: data.name, email: data.email }, { onConflict: "email" })
      .select("id")
      .single();

    if (leadError || !lead) {
      console.error("Lead save error:", leadError);
      return;
    }

    // Insert chart
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: chartError } = await (supabase as any).from("charts").insert({
      lead_id: (lead as { id: string }).id,
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

    if (!API_KEY) {
      return NextResponse.json({ error: "API não configurada" }, { status: 500 });
    }

    const subject = await callAstrologerAPI(data);
    const planets = extractPlanets(subject);
    const ascendant = getAscendant(subject);

    const sunSign = planets.find((p) => p.key === "sun")?.signKey ?? "Ari";
    const moonSign = planets.find((p) => p.key === "moon")?.signKey ?? "Ari";

    // Eclipse calculation
    const eclipseHouse = ECLIPSE_HOUSE_MAP[ascendant.signKey] ?? 1;
    const eclipseTheme = HOUSE_THEMES[eclipseHouse];

    // Save to Supabase (non-blocking)
    saveToSupabase(data, ascendant.signKey, sunSign, moonSign, { planets, ascendant });

    return NextResponse.json({
      ascendant,
      planets,
      eclipse: {
        house: eclipseHouse,
        theme: eclipseTheme,
        meta: ECLIPSE_META,
      },
    });
  } catch (err) {
    console.error("Chart API error:", err);
    const message = err instanceof Error ? err.message : "Erro interno";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
