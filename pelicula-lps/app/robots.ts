import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/decifrando", "/decifrando-costar", "/camarim", "/mapa-astral"],
        disallow: [
          "/catalogo",
          "/curso",
          "/checkout",
          "/minha-conta",
          "/login",
          "/signup",
          "/forgot-password",
          "/reset-password",
          "/api/",
          "/auth/",
        ],
      },
    ],
    sitemap: "https://lp.peliculasideral.com.br/sitemap.xml",
  };
}
