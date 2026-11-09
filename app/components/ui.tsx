import type { ReactNode } from "react";
import type { Language } from "../types";

export function Badge({ children, tone = "pink" }: { children: ReactNode; tone?: string }) {
  return <span className={`badge ${tone}`}>{children}</span>;
}

export function SectionHeading({ eyebrow, title, description, centered = false }: { eyebrow?: string; title: string; description?: string; centered?: boolean }) {
  return <div className={`section-heading ${centered ? "centered" : ""}`}>{eyebrow && <Badge>{eyebrow}</Badge>}<h2>{title}</h2>{description && <p>{description}</p>}</div>;
}

export function PhotoPlaceholder({ lang = "es" }: { lang?: Language }) {
  return <div className="photo-placeholder" aria-label={lang === "es" ? "Espacio reservado para fotografía" : "Photo placeholder"}><span>KC</span><small>{lang === "es" ? "Tu fotografía aquí" : "Your photo here"}</small></div>;
}
