import { copy, testimonials } from "../data";
import type { Language } from "../types";
import { SectionHeading } from "./ui";

const localized = (value: string | { es: string; en: string }, lang: Language) => typeof value === "string" ? value : value[lang];

export default function Testimonials({ lang }: { lang: Language }) {
  const t = copy[lang];
  return <section className="testimonials-section section-wrap" id="testimonios" data-reveal><SectionHeading eyebrow={lang === "es" ? "VALIDACIÓN & TRABAJO EN EQUIPO" : "TRUST & TEAMWORK"} title={t.testimonials} description={t.testimonialIntro} centered/><div className="testimonial-grid" data-reveal-stagger>{testimonials.map((item, i) => <article className="testimonial-card" key={item.name} data-reveal><p className="quote">«{localized(item.quote, lang)}»</p><div className="person"><span className={`avatar avatar-${i}`}>{item.initials}</span><div><strong>{item.name}</strong><small>{localized(item.role, lang)}</small></div></div></article>)}</div></section>;
}
