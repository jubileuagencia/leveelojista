import { NextResponse } from "next/server";
import { searchCities, findCityById } from "@/lib/cities-server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") ?? "";
  const id = searchParams.get("id");

  // Lookup by ID (for chart API validation)
  if (id) {
    const city = findCityById(Number(id));
    if (!city) {
      return NextResponse.json({ error: "Cidade não encontrada" }, { status: 404 });
    }
    return NextResponse.json(city);
  }

  // Search by query
  const results = searchCities(query, 12);
  return NextResponse.json(results);
}
