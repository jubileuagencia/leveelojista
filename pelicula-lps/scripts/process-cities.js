#!/usr/bin/env node
/**
 * Processa o TSV do GeoNames (cities15000.txt) para JSON compacto.
 * Inclui country code e admin1 (estado/região) para labels completos.
 *
 * Fontes (baixar para /data/):
 *   - cities15000.txt (tab-separated, do cities15000.zip)
 *   - admin1CodesASCII.txt
 *   - countryInfo.txt
 *
 * Uso: node scripts/process-cities.js
 */
const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "..", "data");
const TSV_PATH = path.join(DATA_DIR, "cities15000.txt");
const ADMIN1_PATH = path.join(DATA_DIR, "admin1CodesASCII.txt");
const COUNTRY_PATH = path.join(DATA_DIR, "countryInfo.txt");
const OUT_PATH = path.join(DATA_DIR, "cities.json");

// --- Load admin1 codes → name map ---
// Format: "CC.CODE\tname\tasciiname\tgeonameid"
const admin1Map = new Map();
if (fs.existsSync(ADMIN1_PATH)) {
  const admin1Raw = fs.readFileSync(ADMIN1_PATH, "utf-8");
  for (const line of admin1Raw.split("\n")) {
    if (!line.trim()) continue;
    const parts = line.split("\t");
    if (parts.length >= 2) {
      admin1Map.set(parts[0], parts[1]); // "BR.27" → "São Paulo"
    }
  }
  console.log(`Loaded ${admin1Map.size} admin1 codes`);
}

// --- Load country code → name map ---
// countryInfo.txt: lines starting with # are comments
// Format: ISO\tISO3\tISONum\tfips\tCountry\t...
const countryMap = new Map();
if (fs.existsSync(COUNTRY_PATH)) {
  const countryRaw = fs.readFileSync(COUNTRY_PATH, "utf-8");
  for (const line of countryRaw.split("\n")) {
    if (line.startsWith("#") || !line.trim()) continue;
    const parts = line.split("\t");
    if (parts.length >= 5) {
      countryMap.set(parts[0], parts[4]); // "BR" → "Brazil"
    }
  }
  console.log(`Loaded ${countryMap.size} countries`);
}

// --- Process cities15000.txt (TSV, 19 columns) ---
// Columns: 0=geonameid, 1=name, 2=asciiname, 3=alternatenames, 4=lat, 5=lng,
//          6=feature_class, 7=feature_code, 8=country_code, 9=cc2, 10=admin1_code,
//          11-13=admin2-4, 14=population, 15=elevation, 16=dem, 17=timezone, 18=modification_date

const raw = fs.readFileSync(TSV_PATH, "utf-8");
const lines = raw.split("\n").filter((l) => l.trim());

const cities = [];
for (const line of lines) {
  const f = line.split("\t");
  if (f.length < 18) continue;

  const cc = f[8].trim();
  const admin1Code = f[10].trim();
  const admin1Key = `${cc}.${admin1Code}`;
  const admin1Name = admin1Map.get(admin1Key) || "";

  cities.push({
    i: Number(f[0]),       // geoname_id
    n: f[1].trim(),        // name
    a: f[2].trim(),        // ascii_name
    la: parseFloat(f[4]),  // latitude
    lo: parseFloat(f[5]),  // longitude
    t: f[17].trim(),       // timezone
    p: Number(f[14]) || 0, // population
    cc,                    // country_code (2-letter ISO)
    s: admin1Name,         // state/admin1 name
  });
}

// Sort by population descending (most popular first)
cities.sort((a, b) => b.p - a.p);

fs.writeFileSync(OUT_PATH, JSON.stringify(cities));

const sizeMB = (fs.statSync(OUT_PATH).size / 1024 / 1024).toFixed(2);
console.log(`Processed ${cities.length} cities → ${OUT_PATH} (${sizeMB} MB)`);
console.log(`Top 5: ${cities.slice(0, 5).map((c) => `${c.n}, ${c.s}, ${c.cc} (${c.p})`).join(", ")}`);

// Show BR examples
const brCities = cities.filter((c) => c.cc === "BR").slice(0, 5);
console.log(`BR top 5: ${brCities.map((c) => `${c.n}, ${c.s}`).join(", ")}`);
