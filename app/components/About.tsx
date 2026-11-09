import { copy } from "../data";
import type { Language } from "../types";
import { Badge, PhotoPlaceholder, SectionHeading } from "./ui";
import Icon from "./Icon";

export default function About({ lang }: { lang: Language }) {
  const t = copy[lang];
  const tagTones = ["dark", "pink", "white", "dark", "pink", "blue"];
  return <section className="about-section" id="sobre-mi" data-reveal><div className="section-wrap about-grid"><div className="about-photo"><PhotoPlaceholder lang={lang}/><Badge tone="white"><Icon name="sparkle" size={13}/> {lang === "es" ? "RETRATO" : "PORTRAIT"}</Badge><span className="dots">••</span></div><div className="about-content"><SectionHeading eyebrow="<3 DEV & ART" title={t.about}/><div className="essence-card"><Badge tone="blue"><Icon name="sparkle" size={13}/> {lang === "es" ? "MI ESENCIA" : "MY ESSENCE"}</Badge><p>«{t.essence}»</p></div><div className="about-cards" data-reveal-stagger><article className="info-card" data-reveal><Badge><Icon name="palette" size={13}/> {t.facet}</Badge><p>{t.facetText}</p></article><article className="info-card" data-reveal><Badge tone="blue"><Icon name="target" size={13}/> {t.focus}</Badge><p>{t.focusText}</p></article><article className="info-card wide" data-reveal><Badge><Icon name="heart" size={13}/> {t.outside}</Badge><p>{t.outsideText}</p></article></div><div className="trait-tags" data-reveal-stagger>{t.tags.map((tag, i) => <span data-reveal key={tag}><Badge tone={tagTones[i] ?? "pink"}><Icon name="verified" size={14}/> {tag}</Badge></span>)}</div></div></div></section>;
}
