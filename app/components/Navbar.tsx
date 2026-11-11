import Image from "next/image";
import { copy, CV_DOWNLOAD_PATHS, portfolioMedia } from "../data";
import type { Language } from "../types";
import Icon from "./Icon";

const navIds = ["inicio", "sobre-mi", "proyectos", "experiencia", "testimonios", "contacto"];
type Props = { lang: Language; theme: "light" | "dark"; active: string; menuOpen: boolean; onLanguage: () => void; onTheme: () => void; onMenu: () => void };

export default function Navbar({ lang, theme, active, menuOpen, onLanguage, onTheme, onMenu }: Props) {
  const t = copy[lang];
  return <header className="site-header">
    <a className="brand-mark" href="#inicio" aria-label="Karol Cabrera, inicio"><Image src={portfolioMedia.logo} alt="" width={40} height={40} unoptimized /></a>
    <nav id="primary-navigation" className={`nav-pill ${menuOpen ? "is-open" : ""}`} aria-label="Navegación principal">
      {t.nav.map((label, i) => <a key={navIds[i]} className={active === navIds[i] ? "active" : ""} href={`#${navIds[i]}`} onClick={onMenu}>{label}</a>)}
    </nav>
    <div className="header-actions flex items-center gap-[9px]"><button className="lang-toggle" onClick={onLanguage} aria-label="Change language">{lang.toUpperCase()}</button><button className="theme-toggle" onClick={onTheme} aria-label={theme === "light" ? "Activar tema oscuro" : "Activar tema claro"}><Icon name={theme === "light" ? "sun" : "moon"}/></button><a className="button primary header-cv" href={CV_DOWNLOAD_PATHS[lang]} download><Icon name="download"/>{t.download}</a><button className="menu-toggle" onClick={onMenu} aria-label={menuOpen ? t.closeMenu : t.openMenu} aria-controls="primary-navigation" aria-expanded={menuOpen}><Icon name={menuOpen ? "close" : "menu"}/></button></div>
  </header>;
}
