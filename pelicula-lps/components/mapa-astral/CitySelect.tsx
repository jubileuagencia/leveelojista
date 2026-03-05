"use client";

import { useState, useRef, useEffect, useCallback } from "react";

interface CityResult {
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

function cityLabel(city: CityResult): string {
  const parts = [city.name];
  if (city.state) parts.push(city.state);
  if (city.countryCode) parts.push(city.countryCode);
  return parts.join(", ");
}

interface CitySelectProps {
  value: string;
  onChange: (id: string) => void;
  error?: string;
}

export default function CitySelect({ value, onChange, error }: CitySelectProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState<CityResult[]>([]);
  const [selectedName, setSelectedName] = useState("");
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchCities = useCallback(async (q: string) => {
    if (q.length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/cities?q=${encodeURIComponent(q)}`);
      if (res.ok) {
        const data = await res.json();
        setResults(data);
        setOpen(data.length > 0);
      }
    } catch {
      // Silently fail — user can retry
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelect(city: CityResult) {
    onChange(String(city.id));
    setSelectedName(cityLabel(city));
    setQuery("");
    setOpen(false);
    setResults([]);
  }

  function handleInputChange(val: string) {
    setQuery(val);
    if (value) {
      onChange("");
      setSelectedName("");
    }

    // Debounce API calls (300ms)
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchCities(val), 300);
  }

  function handleClear() {
    onChange("");
    setSelectedName("");
    setQuery("");
    setOpen(false);
    setResults([]);
  }

  return (
    <div ref={containerRef} className="relative">
      <label className="block font-mono text-[0.6rem] tracking-[4px] uppercase text-white/50 mb-2">
        Cidade de nascimento
      </label>

      {value && selectedName ? (
        <button
          type="button"
          onClick={handleClear}
          className="w-full text-left bg-transparent border border-white/20 px-4 py-3 text-white/90 font-body text-sm focus:outline-none focus:border-white/60 transition-colors"
        >
          {selectedName}
        </button>
      ) : (
        <input
          type="text"
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder="Digite sua cidade..."
          autoComplete="off"
          className="w-full bg-transparent border border-white/20 px-4 py-3 text-white/90 font-body text-sm placeholder:text-white/35 focus:outline-none focus:border-white/60 transition-colors"
        />
      )}

      {error && <p className="text-red-400/80 text-xs mt-1 font-body">{error}</p>}

      {open && results.length > 0 && (
        <ul className="absolute z-50 w-full mt-1 bg-[#0a0a0a] border border-white/20 max-h-48 overflow-y-auto">
          {results.map((city) => (
            <li key={city.id}>
              <button
                type="button"
                onClick={() => handleSelect(city)}
                className="w-full text-left px-4 py-2.5 text-sm text-white/80 hover:bg-white/5 hover:text-white transition-colors font-body"
              >
                {cityLabel(city)}
              </button>
            </li>
          ))}
        </ul>
      )}

      {open && query.length >= 2 && results.length === 0 && !loading && (
        <div className="absolute z-50 w-full mt-1 bg-[#0a0a0a] border border-white/20 px-4 py-3 text-white/50 text-sm font-body">
          Nenhuma cidade encontrada
        </div>
      )}

      {loading && query.length >= 2 && (
        <div className="absolute z-50 w-full mt-1 bg-[#0a0a0a] border border-white/20 px-4 py-3 text-white/40 text-sm font-body">
          Buscando...
        </div>
      )}
    </div>
  );
}
