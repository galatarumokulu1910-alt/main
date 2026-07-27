import { useEffect, useRef, useState, useCallback } from 'react';

interface ScrollRevealOptions {
  threshold?: number;
  rootMargin?: string;
  /** Once revealed, stay visible (default: true) */
  once?: boolean;
}

/**
 * Custom hook: observes an element and returns `isVisible` when it enters
 * the viewport. Designed for scroll-triggered reveal animations.
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  options: ScrollRevealOptions = {}
) {
  const { threshold = 0.15, rootMargin = '0px 0px -60px 0px', once = true } = options;
  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.unobserve(el);
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return { ref, isVisible };
}

/**
 * Batch version: observes multiple child elements with a stagger effect.
 * Returns a ref for the container and an array of visible indices.
 */
export function useStaggerReveal<T extends HTMLElement = HTMLDivElement>(
  itemCount: number,
  options: ScrollRevealOptions & { staggerDelay?: number } = {}
) {
  const { threshold = 0.1, rootMargin = '0px 0px -40px 0px', once = true, staggerDelay = 120 } = options;
  const containerRef = useRef<T>(null);
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());

  const markVisible = useCallback((index: number) => {
    setVisibleItems(prev => {
      const next = new Set(prev);
      next.add(index);
      return next;
    });
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Stagger-reveal each item
          for (let i = 0; i < itemCount; i++) {
            setTimeout(() => markVisible(i), i * staggerDelay);
          }
          if (once) observer.unobserve(container);
        } else if (!once) {
          setVisibleItems(new Set());
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [itemCount, threshold, rootMargin, once, staggerDelay, markVisible]);

  return { containerRef, visibleItems };
}
