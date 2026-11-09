"use client";

import { useRef } from "react";
import type { MouseEvent } from "react";
import { copy, CV_VIEW_URLS } from "../data";
import type { Language } from "../types";
import Icon from "./Icon";
import { Badge, PhotoPlaceholder } from "./ui";

export default function Hero({ lang }: { lang: Language }) {
  const t = copy[lang];
  const cvViewUrl = CV_VIEW_URLS[lang];
  const visual = useRef<HTMLDivElement>(null);
  const tilt = (event: MouseEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    if (visual.current) visual.current.style.transform = `perspective(1000px) rotateX(${y * -5}deg) rotateY(${x * 7}deg)`;
  };
  const resetTilt = () => { if (visual.current) visual.current.style.transform = "perspective(1000px) rotateX(0) rotateY(0)"; };
  return <section className="hero section-wrap" id="inicio" data-reveal>
    <div className="hero-copy"><Badge tone="blue">✧ {t.hello}</Badge><h1>Karol Isabella<br/><em>Cabrera Pantoja</em></h1><p className="hero-role">{t.role}</p><p className="hero-intro">{t.intro}</p><div className="button-row"><a className="button primary" href="#proyectos">{t.projectsButton} <Icon name="arrow-right"/></a>{cvViewUrl ? <a className="button secondary" href={cvViewUrl} target="_blank" rel="noreferrer"><Icon name="eye"/> {t.view}</a> : <button className="button secondary cv-view-pending" type="button" disabled title={t.cvPending}><Icon name="eye"/> {t.view}</button>}</div></div>
    <div className="hero-visual" ref={visual} onMouseMove={tilt} onMouseLeave={resetTilt}><span className="sparkle-sticker">✣</span><div className="hero-frame"><PhotoPlaceholder lang={lang}/><div className="photo-caption"><strong>Karol Isabella</strong><span>{t.location.toUpperCase()}</span></div></div><div className="status-strip"><i/> {t.dev}</div></div>
  </section>;
}
