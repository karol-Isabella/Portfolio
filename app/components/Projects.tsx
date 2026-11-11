"use client";

import { useEffect, useRef, useState } from "react";
import { copy, projects } from "../data";
import type { Language } from "../types";
import Icon from "./Icon";
import { Badge, SectionHeading } from "./ui";
import { PhotoPlaceholder } from "./PhotoPlaceholder";

const localized = (value: string | { es: string; en: string }, lang: Language) => typeof value === "string" ? value : value[lang];
const categories: Record<string, string[]> = { SENAS: ["design", "build", "create"], "Arq-3❀": ["design", "create"], PillSense: ["build"], VerbPulse: ["design", "build"], NetAgro: ["build", "create"], KashiApp: ["build"] };
const filters = ["all", "design", "build", "create"] as const;

export default function Projects({ lang }: { lang: Language }) {
  const [filter, setFilter] = useState<(typeof filters)[number]>("all");
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const settleTimer = useRef<number | null>(null);
  const t = copy[lang];
  const labels: Record<(typeof filters)[number], string> = lang === "es" ? { all: "Soñar", design: "Diseñar", build: "Programar", create: "Crear" } : { all: "All", design: "Design", build: "Build", create: "Create" };
  const visibleProjects = projects.filter((project) => filter === "all" || categories[project.name]?.includes(filter));

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.2 });
    observer.observe(carousel);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    trackRef.current?.querySelectorAll<HTMLElement>(".project-card").forEach((card, index) => {
      card.style.setProperty("--reveal-delay", `${index * 85}ms`);
      card.classList.add("is-visible");
    });
  }, [inView, filter]);

  useEffect(() => {
    const track = trackRef.current;
    const card = track?.children[activeIndex] as HTMLElement | undefined;
    if (!track || !card) return;
    const left = card.offsetLeft - (track.clientWidth - card.clientWidth) / 2;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    track.scrollTo({ left, behavior: reducedMotion ? "instant" : "smooth" });
  }, [activeIndex, filter]);

  useEffect(() => {
    if (!inView || paused || visibleProjects.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const interval = window.setInterval(() => setActiveIndex((current) => (current + 1) % visibleProjects.length), 4200);
    return () => window.clearInterval(interval);
  }, [inView, paused, visibleProjects.length]);

  const selectFilter = (nextFilter: (typeof filters)[number]) => {
    setFilter(nextFilter);
    setActiveIndex(0);
  };

  const selectProject = (index: number) => {
    setActiveIndex((index + visibleProjects.length) % visibleProjects.length);
  };

  const updateIndexAfterSwipe = () => {
    if (settleTimer.current) window.clearTimeout(settleTimer.current);
    settleTimer.current = window.setTimeout(() => {
      const track = trackRef.current;
      if (!track) return;
      const center = track.scrollLeft + track.clientWidth / 2;
      let nearestIndex = 0;
      let nearestDistance = Infinity;
      Array.from(track.children).forEach((child, index) => {
        const item = child as HTMLElement;
        const distance = Math.abs(item.offsetLeft + item.clientWidth / 2 - center);
        if (distance < nearestDistance) { nearestDistance = distance; nearestIndex = index; }
      });
      setActiveIndex(nearestIndex);
    }, 160);
  };

  return <section className="projects-section section-wrap" id="proyectos">
    <SectionHeading title={t.projects} description={t.projectsIntro}/>
    <div className="project-filters" role="group" aria-label={lang === "es" ? "Filtrar proyectos" : "Filter projects"}>
      {filters.map((item) => <button className={`filter-chip filter-${item} ${filter === item ? "selected" : ""}`} key={item} onClick={() => selectFilter(item)} aria-pressed={filter === item}>{labels[item]}</button>)}
    </div>
    <div className="project-carousel" ref={carouselRef} role="region" aria-label={lang === "es" ? "Carrusel de proyectos" : "Project carousel"} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocusCapture={() => setPaused(true)} onBlurCapture={() => setPaused(false)}>
      <div className="project-list" ref={trackRef} onScroll={updateIndexAfterSwipe}>
        {visibleProjects.map((project, i) => <article className={`project-card ${i === activeIndex ? "is-active" : ""}`} key={project.name} data-project-reveal aria-hidden={i !== activeIndex} inert={i !== activeIndex} aria-label={`${project.name}, ${i + 1} ${lang === "es" ? "de" : "of"} ${visibleProjects.length}`}>
          <div className={`project-media${project.portraitImage ? " is-portrait" : ""}`}><PhotoPlaceholder lang={lang} src={project.image} alt={`${project.name} preview`}/></div>
          <div className="project-copy">
            {project.featured && <Badge>✦ {lang === "es" ? "DESTACADO" : "FEATURED"}</Badge>}
            <h3>{project.name}</h3><h4>{localized(project.subtitle, lang)}</h4>
            <div className="project-detail"><b>{t.description}</b><p>{localized(project.description, lang)}</p></div>
            <div className="project-detail tech"><b>{t.technologies}</b><p>{localized(project.tech, lang)}</p></div>
            <div className="project-actions"><a className="button primary" href={project.link} target="_blank" rel="noreferrer"><Icon name="github"/>{t.github}<Icon name="arrow-right"/></a>{project.demoLink && <a className="text-link" href={project.demoLink} target="_blank" rel="noreferrer">{t.viewDemo}<Icon name="arrow-right"/></a>}</div>
          </div>
        </article>)}
      </div>
      <div className="carousel-controls">
        <button className="carousel-arrow" type="button" onClick={() => selectProject(activeIndex - 1)} aria-label={lang === "es" ? "Proyecto anterior" : "Previous project"}><Icon name="arrow-right"/></button>
        <div className="carousel-pagination" aria-label={lang === "es" ? "Seleccionar proyecto" : "Choose a project"}>
          {visibleProjects.map((project, index) => <button key={project.name} className={`carousel-dot ${index === activeIndex ? "active" : ""}`} type="button" onClick={() => selectProject(index)} aria-label={`${lang === "es" ? "Ver" : "View"} ${project.name}`} aria-current={index === activeIndex ? "true" : undefined}/>) }
        </div>
        <span className="carousel-count" aria-live="polite">{String(activeIndex + 1).padStart(2, "0")} <i>/</i> {String(visibleProjects.length).padStart(2, "0")}</span>
        <button className="carousel-arrow" type="button" onClick={() => selectProject(activeIndex + 1)} aria-label={lang === "es" ? "Proyecto siguiente" : "Next project"}><Icon name="arrow-right"/></button>
      </div>
    </div>
  </section>;
}
