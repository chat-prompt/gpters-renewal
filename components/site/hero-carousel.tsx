"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Slide {
  tag: string;
  title: string;
  description: string;
  href: string;
  cta: string;
  bg: string; // tailwind bg class
}

interface HeroCarouselProps {
  slides: Slide[];
  interval?: number;
}

export function HeroCarousel({ slides, interval = 5000 }: HeroCarouselProps) {
  const [current, setCurrent] = useState(0);

  const next = useCallback(
    () => setCurrent((c) => (c + 1) % slides.length),
    [slides.length]
  );
  const prev = () =>
    setCurrent((c) => (c - 1 + slides.length) % slides.length);

  useEffect(() => {
    const timer = setInterval(next, interval);
    return () => clearInterval(timer);
  }, [next, interval]);

  const slide = slides[current];

  return (
    <div className={`relative rounded-xl overflow-hidden h-52 md:h-56 ${slide.bg}`}>
      <div className="px-8 py-8 md:py-10 md:px-12">
        <span className="inline-block text-xs font-medium text-primary-foreground/80 bg-white/20 px-3 py-1 rounded-full mb-3">
          {slide.tag}
        </span>
        <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
          {slide.title}
        </h2>
        <p className="text-sm text-white/80 mb-5 max-w-lg">
          {slide.description}
        </p>
        <Link
          href={slide.href}
          className="inline-block px-5 py-2.5 text-sm font-medium bg-white text-foreground rounded-lg"
        >
          {slide.cta}
        </Link>
      </div>

      {/* Navigation arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-black/20 text-white"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-black/20 text-white"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </>
      )}

      {/* Dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2 h-2 rounded-full transition-colors ${
                i === current ? "bg-white" : "bg-white/40"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
