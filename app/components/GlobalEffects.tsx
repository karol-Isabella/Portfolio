"use client";

import { useEffect, useRef, useState } from "react";
import Icon from "./Icon";

export default function GlobalEffects() {
  const progress = useRef<HTMLDivElement>(null);
  const cursor = useRef<HTMLDivElement>(null);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const updateScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (progress.current) progress.current.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
      setShowTop(window.scrollY > 420);
    };
    const moveCursor = (event: PointerEvent) => {
      if (!cursor.current || event.pointerType !== "mouse") return;
      cursor.current.style.setProperty("--cursor-x", `${event.clientX}px`);
      cursor.current.style.setProperty("--cursor-y", `${event.clientY}px`);
    };
    window.addEventListener("scroll", updateScroll, { passive: true });
    window.addEventListener("resize", updateScroll);
    window.addEventListener("pointermove", moveCursor, { passive: true });
    updateScroll();
    return () => {
      window.removeEventListener("scroll", updateScroll);
      window.removeEventListener("resize", updateScroll);
      window.removeEventListener("pointermove", moveCursor);
    };
  }, []);

  return <><div ref={progress} className="reading-progress" aria-hidden="true"/><div ref={cursor} className="editorial-cursor" aria-hidden="true"/><button className={`back-to-top ${showTop ? "visible" : ""}`} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="Volver arriba"><Icon name="arrow-up"/></button></>;
}
