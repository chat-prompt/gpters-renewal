"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface BannerSlide {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaHref: string;
}

interface HeroBannerProps {
  slides: BannerSlide[];
}

export function HeroBanner({ slides }: HeroBannerProps) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const slide = slides[current];

  return (
    <section className="bg-primary rounded-lg p-8 md:p-12 text-primary-foreground text-center space-y-4">
      <p className="text-sm font-medium opacity-80">{slide.subtitle}</p>
      <h1 className="text-2xl font-bold">{slide.title}</h1>
      <Link
        href={slide.ctaHref}
        className="inline-block bg-background text-foreground px-6 py-2 rounded-md text-sm font-medium"
      >
        {slide.ctaText}
      </Link>
      {slides.length > 1 && (
        <div className="flex justify-center gap-2 pt-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2 h-2 rounded-full bg-primary-foreground transition-opacity ${
                i === current ? "opacity-100" : "opacity-40"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
