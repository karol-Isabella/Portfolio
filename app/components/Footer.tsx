import { copy, socialLinks } from "../data";
import type { Language } from "../types";
import { Badge } from "./ui";
import Icon from "./Icon";
import AnimatedIndex from "./AnimatedIndex";

const sectionIds = ["inicio", "sobre-mi", "proyectos", "experiencia", "herramientas", "testimonios", "contacto"];

export default function Footer({ lang, copied, onCopy }: { lang: Language; copied: boolean; onCopy: () => void }) {
  const t = copy[lang];
  return <footer className="site-footer section-wrap" data-reveal><div className="footer-brand"><a className="brand-mark" href="#inicio">KC</a><div><strong>Karol Isabella</strong><small>CABRERA PANTOJA</small></div><Badge tone="blue"><Icon name="code"/> DEV GIRL</Badge><Badge><span className="location-dot"/> {t.location.toUpperCase()}</Badge><div className="footer-social"><a href={socialLinks.github} aria-label="GitHub"><Icon name="github" size={16}/></a><a href={socialLinks.linkedin} aria-label="LinkedIn"><Icon name="linkedin" size={16}/></a><a href={socialLinks.instagram} aria-label="Instagram"><Icon name="instagram" size={16}/></a></div></div><div className="footer-nav"><b>{lang === "es" ? "NAVEGACIÓN" : "NAVIGATION"}</b>{t.footerNav.map((label, i) => <a key={label} href={`#${sectionIds[i]}`}><AnimatedIndex value={i}/> {label}</a>)}</div><div className="footer-email"><h3>{t.startContact}</h3><div><a href={`mailto:${socialLinks.email}`}><Icon name="mail"/> {socialLinks.email}</a><button onClick={onCopy} aria-label={t.copy}>{copied ? <Icon name="check"/> : <Icon name="copy"/>}</button></div>{copied && <small role="status">{t.mailCopied}</small>}</div><div className="copyright">© 2026 Karol Isabella. {t.rights}</div></footer>;
}
