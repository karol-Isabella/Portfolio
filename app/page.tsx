"use client";

import { useEffect, useState } from "react";
import About from "./components/About";
import Contact from "./components/Contact";
import Experience from "./components/Experience";
import Footer from "./components/Footer";
import GlobalEffects from "./components/GlobalEffects";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import Projects from "./components/Projects";
import Skills from "./components/Skills";
import Testimonials from "./components/Testimonials";
import { socialLinks } from "./data";
import type { Language } from "./types";

const sectionIds = ["inicio", "sobre-mi", "proyectos", "experiencia", "herramientas", "testimonios", "contacto"];

export default function Home() {
  const [lang, setLang] = useState<Language>("es");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [preferencesLoaded, setPreferencesLoaded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("inicio");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const savedLang = localStorage.getItem("portfolio-language");
    const savedTheme = localStorage.getItem("portfolio-theme");
    const frame = window.requestAnimationFrame(() => {
      if (savedLang === "es" || savedLang === "en") setLang(savedLang);
      if (savedTheme === "dark" || savedTheme === "light") setTheme(savedTheme);
      setPreferencesLoaded(true);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.lang = lang;
    if (preferencesLoaded) {
      localStorage.setItem("portfolio-theme", theme);
      localStorage.setItem("portfolio-language", lang);
    }
  }, [theme, lang, preferencesLoaded]);

  useEffect(() => {
    document.querySelectorAll<HTMLElement>("[data-reveal-stagger]").forEach((group) => {
      Array.from(group.children).forEach((child, index) => (child as HTMLElement).style.setProperty("--reveal-delay", `${index * 130}ms`));
    });
    const revealTargets = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    const revealTarget = (target: HTMLElement) => {
      target.classList.add("is-visible");
      const timeline = target.closest<HTMLElement>(".timeline");
      if (!timeline || !target.matches(".education-item")) return;
      const items = Array.from(timeline.querySelectorAll(".education-item"));
      const index = items.indexOf(target);
      const currentProgress = Number(timeline.style.getPropertyValue("--timeline-progress")) || 0;
      timeline.style.setProperty("--timeline-progress", `${Math.max(currentProgress, (index + 1) / items.length)}`);
    };
    const revealObserver = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) { revealTarget(entry.target as HTMLElement); revealObserver.unobserve(entry.target); }
    }), { threshold: 0.01, rootMargin: "0px 0px 4% 0px" });
    revealTargets.forEach((section) => revealObserver.observe(section));
    document.documentElement.classList.add("motion-ready");
    let revealFrame = 0;
    const revealVisibleTargets = () => {
      revealFrame = 0;
      document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-visible)").forEach((target) => {
        const bounds = target.getBoundingClientRect();
        if (bounds.top < window.innerHeight * 0.96 && bounds.bottom > 0) revealTarget(target);
      });
    };
    const scheduleVisibleReveal = () => {
      if (!revealFrame) revealFrame = window.requestAnimationFrame(revealVisibleTargets);
    };
    window.addEventListener("scroll", scheduleVisibleReveal, { passive: true });
    window.addEventListener("resize", scheduleVisibleReveal);
    scheduleVisibleReveal();
    const sectionObserver = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) setActive(entry.target.id);
    }), { rootMargin: "-25% 0px -65% 0px" });
    sectionIds.forEach((id) => {
      const section = document.getElementById(id);
      if (section) sectionObserver.observe(section);
    });
    return () => {
      revealObserver.disconnect();
      sectionObserver.disconnect();
      window.removeEventListener("scroll", scheduleVisibleReveal);
      window.removeEventListener("resize", scheduleVisibleReveal);
      if (revealFrame) window.cancelAnimationFrame(revealFrame);
      document.documentElement.classList.remove("motion-ready");
    };
  }, []);

  const changeLanguage = () => setLang((current) => current === "es" ? "en" : "es");
  const copyEmail = async () => {
    await navigator.clipboard.writeText(socialLinks.email);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2200);
  };

  return <>
    <Navbar lang={lang} theme={theme} active={active} menuOpen={menuOpen} onLanguage={changeLanguage} onTheme={() => setTheme((current) => current === "light" ? "dark" : "light")} onMenu={() => setMenuOpen((current) => !current)} />
    <main>
      <Hero lang={lang} />
      <About lang={lang} />
      <Projects lang={lang} />
      <Experience lang={lang} />
      <Skills lang={lang} />
      <Testimonials lang={lang} />
      <Contact lang={lang} />
    </main>
    <Footer lang={lang} copied={copied} onCopy={copyEmail} />
    <GlobalEffects />
  </>;
}
