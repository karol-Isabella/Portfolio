import { copy, skills } from "../data";
import type { Language } from "../types";
import Terminal from "./Terminal";
import { SectionHeading } from "./ui";

const localized = (value: string | { es: string; en: string }, lang: Language) => typeof value === "string" ? value : value[lang];

export default function Skills({ lang }: { lang: Language }) {
  const t = copy[lang];
  return <section className="tools-section section-wrap" id="herramientas" data-reveal><div className="tools-copy"><SectionHeading eyebrow={lang === "es" ? "TECNOLOGÍAS & HERRAMIENTAS" : "TECHNOLOGIES & TOOLS"} title={t.toolbox} description={t.toolboxIntro}/><div className="skills-grid" data-reveal-stagger>{skills.map((skill, i) => <article className="skill-card" key={skill.title.es} data-reveal><span className={`skill-icon tone-${i}`}>{skill.icon}</span><h3>{localized(skill.title, lang)}</h3><strong>{skill.tags}</strong><p>{localized(skill.description, lang)}</p></article>)}</div></div><Terminal lang={lang}/></section>;
}
