'use client';

import React, { useEffect, useRef, useState } from 'react';

export type ScrollRevealVariant =
  | 'fade-up'
  | 'fade-down'
  | 'fade-left'
  | 'fade-right'
  | 'fade-in'
  | 'zoom-in'
  | 'scale-up';

interface ScrollRevealProps {
  children: React.ReactNode;
  variant?: ScrollRevealVariant;
  delay?: number; // ms
  duration?: number; // ms
  threshold?: number; // 0..1
  once?: boolean;
  className?: string;
  as?: React.ElementType;
  onClick?: React.MouseEventHandler;
}

export default function ScrollReveal({
  children,
  variant = 'fade-up',
  delay = 0,
  duration = 600,
  threshold = 0.12,
  once = true,
  className = '',
  as: Component = 'div',
  onClick,
}: ScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // Fallback if IntersectionObserver is not supported
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once && element) {
            observer.unobserve(element);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, [threshold, once]);

  const variantClass = {
    'fade-up': 'sr-fade-up',
    'fade-down': 'sr-fade-down',
    'fade-left': 'sr-fade-left',
    'fade-right': 'sr-fade-right',
    'fade-in': 'sr-fade-in',
    'zoom-in': 'sr-zoom-in',
    'scale-up': 'sr-scale-up',
  }[variant];

  const inlineStyles: React.CSSProperties = {
    transitionDuration: `${duration}ms`,
    transitionDelay: `${delay}ms`,
  };

  return (
    <Component
      ref={ref}
      style={inlineStyles}
      onClick={onClick}
      className={`sr-hidden ${variantClass} ${isVisible ? 'sr-show' : ''} ${className}`}
    >
      {children}
    </Component>
  );
}
