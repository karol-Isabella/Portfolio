import { copy, socialLinks } from "../data";
import type { Language } from "../types";
import Icon from "./Icon";
import { Badge } from "./ui";

export default function Contact({ lang }: { lang: Language }) {
  const t = copy[lang];
  return <section className="contact-section section-wrap" id="contacto" data-reveal><Badge tone="dark"><Icon name="mail"/> {t.contactBadge}</Badge><h2>{t.contactTitle.split("\n").map((line) => <span key={line}>{line}</span>)}</h2><p>{t.contactText}</p><a className="button contact-button" href={`mailto:${socialLinks.email}`}><Icon name="mail"/> {t.email} <Icon name="arrow-right"/></a><div className="contact-socials" data-reveal-stagger><a data-reveal href={`tel:${socialLinks.phone.replaceAll(" ", "")}`}><Icon name="phone"/><small>{t.phone}</small><b>{socialLinks.phone}</b></a><a data-reveal href={socialLinks.linkedin} target="_blank" rel="noreferrer"><Icon name="linkedin"/><small>LINKEDIN</small><b>Isabella Cabrera</b></a><a data-reveal href={socialLinks.github} target="_blank" rel="noreferrer"><Icon name="code"/><small>GITHUB</small><b>karol-isabella</b></a></div></section>;
}
