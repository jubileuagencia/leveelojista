"use client";

import { useState } from "react";
import CitySelect from "./CitySelect";

interface FormData {
  name: string;
  email: string;
  day: string;
  month: string;
  year: string;
  hour: string;
  minute: string;
  citySlug: string;
  instagram: string;
  manychatId: string;
}

interface FormStepProps {
  onSubmit: (data: FormData) => void;
  isSubmitting: boolean;
  initialData?: {
    name?: string;
    instagram?: string;
    manychatId?: string;
  };
}

export default function FormStep({ onSubmit, isSubmitting, initialData }: FormStepProps) {
  const [form, setForm] = useState<FormData>({
    name: initialData?.name ?? "",
    email: "",
    day: "",
    month: "",
    year: "",
    hour: "",
    minute: "",
    citySlug: "",
    instagram: initialData?.instagram ?? "",
    manychatId: initialData?.manychatId ?? "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  function update(key: keyof FormData, value: string) {
    // For numeric fields, filter non-digits and enforce maxLength
    const numericFields: Record<string, number> = { day: 2, month: 2, year: 4, hour: 2, minute: 2 };
    if (key in numericFields) {
      value = value.replace(/\D/g, "").slice(0, numericFields[key]);
    }
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const errs: Partial<Record<keyof FormData, string>> = {};

    if (form.name.trim().length < 2) errs.name = "Informe seu nome";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) errs.email = "Email inválido";

    const month = Number(form.month);
    const year = Number(form.year);
    const day = Number(form.day);

    if (!form.month || month < 1 || month > 12) errs.month = "Mês inválido";
    if (!form.year || year < 1900 || year > 2026) errs.year = "Ano inválido";
    if (!form.day || day < 1 || day > 31) errs.day = "Dia inválido";

    if (!errs.day && !errs.month && !errs.year) {
      const testDate = new Date(year, month - 1, day);
      if (testDate.getDate() !== day) errs.day = "Data inválida";
    }

    const hour = Number(form.hour);
    const minute = Number(form.minute);
    if (form.hour === "" || hour < 0 || hour > 23) errs.hour = "Hora inválida";
    if (form.minute === "" || minute < 0 || minute > 59) errs.minute = "Minuto inválido";

    if (!form.citySlug) errs.citySlug = "Selecione uma cidade";

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    onSubmit(form);
  }

  const inputClass =
    "w-full bg-transparent border border-white/20 px-4 py-3 text-white/90 font-body text-sm placeholder:text-white/35 focus:outline-none focus:border-white/60 transition-colors";

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
      <div className="text-center mb-10">
        <span className="font-mono text-[0.55rem] tracking-[5px] uppercase text-white/50">
          Ferramenta gratuita
        </span>
        <h1 className="font-display text-2xl md:text-3xl text-white/90 mt-3 leading-tight">
          Descubra em qual casa do seu mapa o evento vai passar
        </h1>
        <p className="text-white/60 text-sm font-body mt-3 leading-relaxed">
          Preencha seus dados de nascimento e veja onde a pérola da semana aterrissa no seu mapa.
        </p>
      </div>

      {/* Nome */}
      <div>
        <label className="block font-mono text-[0.6rem] tracking-[4px] uppercase text-white/50 mb-2">
          Nome
        </label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
          placeholder="Seu nome"
          className={inputClass}
        />
        {errors.name && <p className="text-red-400/80 text-xs mt-1 font-body">{errors.name}</p>}
      </div>

      {/* Email */}
      <div>
        <label className="block font-mono text-[0.6rem] tracking-[4px] uppercase text-white/50 mb-2">
          Email
        </label>
        <input
          type="email"
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
          placeholder="seu@email.com"
          className={inputClass}
        />
        {errors.email && <p className="text-red-400/80 text-xs mt-1 font-body">{errors.email}</p>}
      </div>

      {/* Instagram */}
      <div>
        <label className="block font-mono text-[0.6rem] tracking-[4px] uppercase text-white/50 mb-2">
          Instagram <span className="text-white/30">(opcional)</span>
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/35 font-body text-sm">@</span>
          <input
            type="text"
            value={form.instagram}
            onChange={(e) => update("instagram", e.target.value.replace(/^@/, ""))}
            placeholder="seu_usuario"
            className={`${inputClass} pl-8`}
          />
        </div>
      </div>

      {/* Data de nascimento */}
      <div>
        <label className="block font-mono text-[0.6rem] tracking-[4px] uppercase text-white/50 mb-2">
          Data de nascimento
        </label>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <input
              type="text"
              inputMode="numeric"
              value={form.day}
              onChange={(e) => update("day", e.target.value)}
              placeholder="Dia"
              maxLength={2}
              className={inputClass}
            />
            {errors.day && <p className="text-red-400/80 text-xs mt-1 font-body">{errors.day}</p>}
          </div>
          <div>
            <input
              type="text"
              inputMode="numeric"
              value={form.month}
              onChange={(e) => update("month", e.target.value)}
              placeholder="Mês"
              maxLength={2}
              className={inputClass}
            />
            {errors.month && <p className="text-red-400/80 text-xs mt-1 font-body">{errors.month}</p>}
          </div>
          <div>
            <input
              type="text"
              inputMode="numeric"
              value={form.year}
              onChange={(e) => update("year", e.target.value)}
              placeholder="Ano"
              maxLength={4}
              className={inputClass}
            />
            {errors.year && <p className="text-red-400/80 text-xs mt-1 font-body">{errors.year}</p>}
          </div>
        </div>
      </div>

      {/* Horário */}
      <div>
        <label className="block font-mono text-[0.6rem] tracking-[4px] uppercase text-white/50 mb-2">
          Horário de nascimento
        </label>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <input
              type="text"
              inputMode="numeric"
              value={form.hour}
              onChange={(e) => update("hour", e.target.value)}
              placeholder="Hora"
              maxLength={2}
              className={inputClass}
            />
            {errors.hour && <p className="text-red-400/80 text-xs mt-1 font-body">{errors.hour}</p>}
          </div>
          <div>
            <input
              type="text"
              inputMode="numeric"
              value={form.minute}
              onChange={(e) => update("minute", e.target.value)}
              placeholder="Minuto"
              maxLength={2}
              className={inputClass}
            />
            {errors.minute && <p className="text-red-400/80 text-xs mt-1 font-body">{errors.minute}</p>}
          </div>
        </div>
      </div>

      {/* Cidade */}
      <CitySelect
        value={form.citySlug}
        onChange={(slug) => update("citySlug", slug)}
        error={errors.citySlug}
      />

      {/* Submit */}
      <button
        id="zzlstteqajgfneyydwtj"
        type="submit"
        disabled={isSubmitting}
        className="w-full font-mono text-center tracking-[2px] uppercase transition-all duration-300 px-12 py-4 text-xs md:text-sm bg-white text-black hover:bg-gray-200 active:bg-gray-300 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Calculando..." : "Calcular meu mapa"}
      </button>
    </form>
  );
}
