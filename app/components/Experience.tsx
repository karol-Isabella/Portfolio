import { certifications, copy, education } from "../data";
import type { Language } from "../types";
import { SectionHeading } from "./ui";

const localized = (value: string | { es: string; en: string }, lang: Language) => typeof value === "string" ? value : value[lang];

export default function Experience({ lang }: { lang: Language }) {
  const t = copy[lang];
  return <section className="experience-section section-wrap" id="experiencia" data-reveal><div className="education-column"><SectionHeading eyebrow={`✿ ${t.educationBadge}`} title={t.experience} description={t.experienceIntro}/><div className="timeline" data-reveal-stagger>{education.map((item) => <article className="education-item" key={item.year + localized(item.school, lang)} data-reveal><span className="year-chip">{item.year}</span><h3>{localized(item.title, lang)}</h3><strong>{localized(item.school, lang)}</strong><p>{localized(item.description, lang)}</p></article>)}</div></div><div className="cert-column"><SectionHeading eyebrow={lang === "es" ? "◎ CERTIFICACIONES & LOGROS" : "◎ CERTIFICATIONS & ACHIEVEMENTS"} title={t.certifications} description={t.certIntro}/><div className="cert-list" data-reveal-stagger>{certifications.map((item) => <article className={`cert-card ${item.tone}`} key={localized(item.title, lang)} data-reveal><span className="cert-icon">{item.icon}</span><div><h3>{localized(item.title, lang)}</h3><p>{localized(item.description, lang)}</p></div></article>)}</div></div></section>;
}
