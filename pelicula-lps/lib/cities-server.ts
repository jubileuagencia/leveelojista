import citiesData from "@/data/cities.json";

interface CityRaw {
  i: number;   // geoname_id
  n: string;   // name
  a: string;   // ascii_name
  la: number;  // latitude
  lo: number;  // longitude
  t: string;   // timezone
  p: number;   // population
  cc: string;  // country_code (2-letter ISO)
  s: string;   // state/admin1 name
}

export interface City {
  id: number;
  name: string;
  asciiName: string;
  latitude: number;
  longitude: number;
  timezone: string;
  population: number;
  countryCode: string;
  state: string;
}

const cities = citiesData as CityRaw[];

// Index by id for O(1) lookup
const cityById = new Map<number, CityRaw>();
for (const c of cities) {
  cityById.set(c.i, c);
}

function toCityPublic(c: CityRaw): City {
  return {
    id: c.i,
    name: c.n,
    asciiName: c.a,
    latitude: c.la,
    longitude: c.lo,
    timezone: c.t,
    population: c.p,
    countryCode: c.cc,
    state: c.s,
  };
}

export function searchCities(query: string, limit = 12): City[] {
  if (query.length < 2) return [];
  const q = query.toLowerCase();

  const results: CityRaw[] = [];
  for (const c of cities) {
    if (
      c.n.toLowerCase().includes(q) ||
      c.a.toLowerCase().includes(q)
    ) {
      results.push(c);
      if (results.length >= limit) break;
    }
  }

  return results.map(toCityPublic);
}

export function findCityById(id: number): City | undefined {
  const c = cityById.get(id);
  return c ? toCityPublic(c) : undefined;
}
