"use client";

import { useEffect, useRef } from "react";

type Spark = {
  x: number;
  y: number;
  speed: number;
  size: number;
  alpha: number;
  phase: number;
  frequency: number;
  drift: number;
  tint: "white" | "pink" | "blue";
};

const randomBetween = (min: number, max: number) => Math.random() * (max - min) + min;

export default function AnimatedBackground() {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d", { alpha: true });
    if (!root || !canvas || !context) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const particles: Spark[] = [];
    let width = 0;
    let height = 0;
    let maxParticles = 42;
    let spawnInterval = 0.55;
    let spawnElapsed = 0;
    let previousTime = 0;
    let animationFrame = 0;
    let pointerFrame = 0;
    let targetX = 0;
    let targetY = 0;

    const resize = () => {
      const bounds = root.getBoundingClientRect();
      width = bounds.width;
      height = bounds.height;
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.35);
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      maxParticles = window.innerWidth <= 700 ? 36 : 42;
      spawnInterval = window.innerWidth <= 700 ? 0.62 : 0.48;
      while (particles.length > maxParticles) particles.pop();
    };

    const createSpark = (initial = false): Spark => ({
      x: randomBetween(0, width),
      y: initial ? randomBetween(0, height) : randomBetween(-24, -4),
      speed: randomBetween(20, 38),
      size: randomBetween(0.8, 1.8),
      alpha: randomBetween(0.42, 0.9),
      phase: randomBetween(0, Math.PI * 2),
      frequency: randomBetween(0.7, 1.9),
      drift: randomBetween(2, 12),
      tint: Math.random() < 0.36 ? "pink" : Math.random() < 0.56 ? "blue" : "white",
    });

    const drawSpark = (spark: Spark, time: number) => {
      const twinkle = 0.58 + Math.sin(time * spark.frequency + spark.phase) * 0.3;
      const opacity = Math.max(0, Math.min(1, spark.alpha * twinkle));
      const x = spark.x + Math.sin(time * 0.28 + spark.phase) * spark.drift;
      const colors = document.documentElement.dataset.theme === "dark"
        ? { white: "248,238,244", pink: "254,198,211", blue: "145,178,209" }
        : { white: "255,255,255", pink: "190,57,94", blue: "61,125,169" };

      context.beginPath();
      context.fillStyle = `rgba(${colors[spark.tint]},${opacity})`;
      context.shadowColor = `rgba(${colors[spark.tint]},${opacity * 0.8})`;
      context.shadowBlur = spark.size > 1.25 ? 7 : 4;
      context.arc(x, spark.y, spark.size, 0, Math.PI * 2);
      context.fill();

      if (spark.size > 1.35 && twinkle > 0.72) {
        context.globalAlpha = opacity * 0.45;
        context.fillRect(x - 0.35, spark.y - 2.1, 0.7, 4.2);
        context.fillRect(x - 2.1, spark.y - 0.35, 4.2, 0.7);
        context.globalAlpha = 1;
      }
    };

    const hero = document.getElementById("inicio");
    const heroObserver = hero ? new IntersectionObserver(([entry]) => {
      root.classList.toggle("is-hero", entry.isIntersecting);
    }, { threshold: 0.14 }) : null;
    if (hero) heroObserver?.observe(hero);

    const movePointer = (event: PointerEvent) => {
      if (!finePointer.matches || reduceMotion.matches) return;
      targetX = (event.clientX / window.innerWidth - 0.5) * -10;
      targetY = (event.clientY / window.innerHeight - 0.5) * -8;
      if (pointerFrame) return;
      pointerFrame = requestAnimationFrame(() => {
        root.style.setProperty("--light-parallax-x", `${targetX}px`);
        root.style.setProperty("--light-parallax-y", `${targetY}px`);
        pointerFrame = 0;
      });
    };

    const render = (now: number) => {
      if (document.hidden) return;
      const delta = previousTime ? Math.min((now - previousTime) / 1000, 0.05) : 0;
      previousTime = now;
      const time = now / 1000;
      context.clearRect(0, 0, width, height);
      spawnElapsed += delta;
      if (spawnElapsed >= spawnInterval && particles.length < maxParticles) {
        particles.push(createSpark());
        spawnElapsed = 0;
      }

      for (let index = particles.length - 1; index >= 0; index -= 1) {
        const spark = particles[index];
        spark.y += spark.speed * delta;
        drawSpark(spark, time);
        if (spark.y > height + 12) particles.splice(index, 1);
      }
      context.shadowBlur = 0;
      animationFrame = requestAnimationFrame(render);
    };

    const start = () => {
      if (reduceMotion.matches || document.hidden || animationFrame) return;
      resize();
      if (!particles.length) {
        const seedCount = maxParticles;
        for (let index = 0; index < seedCount; index += 1) particles.push(createSpark(true));
      }
      previousTime = 0;
      animationFrame = requestAnimationFrame(render);
    };
    const stop = () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
      animationFrame = 0;
      previousTime = 0;
    };
    const onMotionPreference = () => reduceMotion.matches ? stop() : start();
    const onVisibilityChange = () => document.hidden ? stop() : start();

    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("pointermove", movePointer, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);
    reduceMotion.addEventListener("change", onMotionPreference);
    start();

    return () => {
      stop();
      heroObserver?.disconnect();
      if (pointerFrame) cancelAnimationFrame(pointerFrame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", movePointer);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      reduceMotion.removeEventListener("change", onMotionPreference);
    };
  }, []);

  return <div ref={rootRef} className="animated-background" aria-hidden="true">
    <div className="ambient-clouds">
      <span className="ambient-cloud cloud-pink" />
      <span className="ambient-cloud cloud-blue" />
      <span className="ambient-cloud cloud-wine" />
    </div>
    <canvas ref={canvasRef} className="ambient-sparkles" />
  </div>;
}
