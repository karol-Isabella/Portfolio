"use client";

import { useEffect, useRef, useState } from "react";

export default function AnimatedIndex({ value }: { value: number }) {
  const [count, setCount] = useState(0);
  const element = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (!element.current) return;
    const node = element.current;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      const start = performance.now();
      const animate = (now: number) => {
        const progress = Math.min((now - start) / 520, 1);
        setCount(Math.round(value * (1 - Math.pow(1 - progress, 3))));
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }, { threshold: 0.7 });
    observer.observe(node);
    return () => observer.disconnect();
  }, [value]);
  return <span ref={element} className="footer-index" aria-label={`${String(count).padStart(2, "0")}`}>{String(count).padStart(2, "0")}</span>;
}
