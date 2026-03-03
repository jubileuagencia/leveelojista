"use client";

import { useState, useRef, useEffect } from "react";
import { CITIES, type City } from "@/lib/cities";

interface CitySelectProps {
  value: string;
  onChange: (slug: string) => void;
  error?: string;
}

export default function CitySelect({ value, onChange, error }: CitySelectProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedCity = CITIES.find((c) => c.slug === value);

  const filtered = query.length >= 2
    ? CITIES.filter((c) => {
        const q = query.toLowerCase();
        return (
          c.name.toLowerCase().includes(q) ||
          c.state.toLowerCase().includes(q) ||
          `${c.name} ${c.state}`.toLowerCase().includes(q)
        );
      }).slice(0, 12)
    : [];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelect(city: City) {
    onChange(city.slug);
    setQuery("");
    setOpen(false);
  }

  function handleInputChange(val: string) {
    setQuery(val);
    setOpen(val.length >= 2);
    if (value) onChange("");
  }

  return (
    <div ref={containerRef} className="relative">
      <label className="block font-mono text-[0.6rem] tracking-[4px] uppercase text-white/30 mb-2">
        Cidade de nascimento
      </label>

      {selectedCity ? (
        <button
          type="button"
          onClick={() => {
            onChange("");
            setQuery("");
            setOpen(false);
          }}
          className="w-full text-left bg-transparent border border-white/20 px-4 py-3 text-white/90 font-body text-sm focus:outline-none focus:border-white/60 transition-colors"
        >
          {selectedCity.name}, {selectedCity.state}
        </button>
      ) : (
        <input
          type="text"
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => query.length >= 2 && setOpen(true)}
          placeholder="Digite sua cidade..."
          autoComplete="off"
          className="w-full bg-transparent border border-white/20 px-4 py-3 text-white/90 font-body text-sm placeholder:text-white/20 focus:outline-none focus:border-white/60 transition-colors"
        />
      )}

      {error && <p className="text-red-400/80 text-xs mt-1 font-body">{error}</p>}

      {open && filtered.length > 0 && (
        <ul className="absolute z-50 w-full mt-1 bg-[#0a0a0a] border border-white/20 max-h-48 overflow-y-auto">
          {filtered.map((city) => (
            <li key={city.slug}>
              <button
                type="button"
                onClick={() => handleSelect(city)}
                className="w-full text-left px-4 py-2.5 text-sm text-white/80 hover:bg-white/5 hover:text-white transition-colors font-body"
              >
                {city.name}, {city.state}
              </button>
            </li>
          ))}
        </ul>
      )}

      {open && query.length >= 2 && filtered.length === 0 && (
        <div className="absolute z-50 w-full mt-1 bg-[#0a0a0a] border border-white/20 px-4 py-3 text-white/30 text-sm font-body">
          Nenhuma cidade encontrada
        </div>
      )}
    </div>
  );
}
