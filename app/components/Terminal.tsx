"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import type { Language } from "../types";
import Icon from "./Icon";

type Line = { text: string; kind?: "command" | "muted" | "future" };
const getStartup = (lang: Language): Line[] => [
  { text: "$ whoami", kind: "command" },
  { text: "Karol Isabella Cabrera Pantoja" },
  { text: lang === "es" ? "Desarrolladora de software en formación · Mente creativa" : "Software Developer in Progress · Creative Mind", kind: "muted" },
  { text: "$ cat skills.json", kind: "command" },
  { text: `${lang === "es" ? "✓ Lenguajes" : "✓ Languages"}: Java, Python, JavaScript, TypeScript` },
  { text: "✓ Frontend: React, Next.js, Tailwind CSS" },
  { text: "✓ Backend: NestJS, Spring Boot" },
  { text: `${lang === "es" ? "✓ Bases de datos" : "✓ Database"}: PostgreSQL, MySQL, Supabase` },
  { text: "$ echo $FUTURE", kind: "command" },
  { text: lang === "es" ? "Aprender. Crear. Crecer." : "Building. Creating. Growing.", kind: "future" },
];

export default function Terminal({ lang }: { lang: Language }) {
  const [lines, setLines] = useState<Line[]>([]);
  const [input, setInput] = useState("");
  const [started, setStarted] = useState(false);
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    const terminal = document.querySelector(".terminal");
    if (!terminal) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setStarted(true); observer.disconnect(); }
    }, { threshold: 0.35 });
    observer.observe(terminal);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    let row = 0;
    let character = 0;
    let timer = 0;
    const startup = getStartup(lang);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || document.visibilityState === "hidden") {
      const frame = window.requestAnimationFrame(() => setLines(startup));
      return () => window.cancelAnimationFrame(frame);
    }
    const finishWhenHidden = () => {
      if (document.visibilityState !== "hidden") return;
      window.clearTimeout(timer);
      setLines(startup);
    };
    document.addEventListener("visibilitychange", finishWhenHidden);
    const typeNext = () => {
      if (row >= startup.length) {
        setLines(startup);
        return;
      }
      const source = startup[row];
      character += 1;
      const typedText = source.text.slice(0, character);
      setLines((current) => {
        const next = [...current];
        const typedLine = { ...source, text: typedText };
        if (next.length <= row) next.push(typedLine);
        else next[row] = typedLine;
        return next;
      });
      if (character >= source.text.length) {
        row += 1;
        character = 0;
        timer = window.setTimeout(typeNext, 190);
      } else timer = window.setTimeout(typeNext, source.kind === "command" ? 42 : 15);
    };
    typeNext();
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("visibilitychange", finishWhenHidden);
    };
  }, [started, lang]);

  const runCommand = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const command = input.trim().toLowerCase();
    if (!command) return;
    const output: Record<string, string> = {
      help: lang === "es" ? "Comandos: help · proyectos · contacto · clear" : "Commands: help · projects · contact · clear",
      proyectos: lang === "es" ? "Proyectos: SENAS · Arq-3 · PillSense · VerbPulse · NetAgro" : "Projects: SENAS · Arq-3 · PillSense · VerbPulse · NetAgro",
      projects: lang === "es" ? "Proyectos: SENAS · Arq-3 · PillSense · VerbPulse · NetAgro" : "Projects: SENAS · Arq-3 · PillSense · VerbPulse · NetAgro",
      contacto: lang === "es" ? "cabreraisabella1105@gmail.com · Pasto, Colombia" : "Email: cabreraisabella1105@gmail.com · Pasto, Colombia",
      contact: lang === "es" ? "Correo: cabreraisabella1105@gmail.com · Pasto, Colombia" : "Email: cabreraisabella1105@gmail.com · Pasto, Colombia",
    };
    if (command === "clear") setLines([]);
    else setLines((current) => [...current, { text: `$ ${command}`, kind: "command" }, ...(output[command] ? [{ text: output[command], kind: "muted" as const }] : [])]);
    setInput("");
  };
  const copyCommand = async (command: string) => {
    await navigator.clipboard.writeText(command.replace(/^\$\s*/, ""));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  };

  return <div className="terminal" aria-label={lang === "es" ? "Terminal interactiva de habilidades" : "Interactive skills terminal"}>
    <div className="terminal-top"><span className="terminal-lights"><i/><i/><i/></span><span>karol-isabella</span><span>▣ bash</span></div>
    <div className="terminal-body" aria-live="polite">{lines.map((line, index) => line.kind === "command" ? <p key={`${index}-${line.text}`} className="command terminal-command"><span className="terminal-command-text">{line.text}</span><button onClick={() => copyCommand(line.text)} type="button" aria-label={copied ? (lang === "es" ? "Comando copiado" : "Command copied") : (lang === "es" ? "Copiar comando" : "Copy command")}><Icon name={copied ? "check" : "copy"} size={13}/><span>{copied ? (lang === "es" ? "Copiado" : "Copied") : (lang === "es" ? "Copiar" : "Copy")}</span></button></p> : <p key={`${index}-${line.text}`} className={line.kind}>{line.text}</p>)}<form className="terminal-input" onSubmit={runCommand}><label htmlFor="terminal-command">$</label><input id="terminal-command" value={input} onChange={(event) => setInput(event.target.value)} style={{ width: input.length ? `${input.length}ch` : "0ch" }} aria-label={lang === "es" ? "Escribe un comando" : "Enter a command"} autoComplete="off" spellCheck="false"/><span className="cursor" aria-hidden="true">█</span></form></div>
  </div>;
}
