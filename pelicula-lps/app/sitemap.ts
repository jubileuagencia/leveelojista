import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://lp.peliculasideral.com.br";

  return [
    { url: `${baseUrl}/decifrando`, lastModified: new Date(), priority: 1.0 },
    { url: `${baseUrl}/decifrando-costar`, lastModified: new Date(), priority: 0.8 },
    { url: `${baseUrl}/camarim`, lastModified: new Date(), priority: 0.9 },
    { url: `${baseUrl}/mapa-astral`, lastModified: new Date(), priority: 0.7 },
  ];
}
