"use client";

import Image from "next/image";
import { GripVertical } from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";

type BeforeAfterSliderProps = {
  beforeImage: string;
  afterImage: string;
  beforeAlt: string;
  afterAlt: string;
};

export default function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeAlt,
  afterAlt,
}: BeforeAfterSliderProps) {
  const [position, setPosition] = useState(50);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isAutoAnimating, setIsAutoAnimating] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const autoAnimationFrameRef = useRef<number | null>(null);

  const isDraggingRef = useRef(false);
  const hasAnimatedRef = useRef(false);
  const hasInteractedRef = useRef(false);

  const cancelAutoAnimation = () => {
    if (autoAnimationFrameRef.current !== null) {
      cancelAnimationFrame(autoAnimationFrameRef.current);
      autoAnimationFrameRef.current = null;
    }

    setIsAutoAnimating(false);
  };

  const registerInteraction = () => {
    hasInteractedRef.current = true;
    setHasInteracted(true);
    cancelAutoAnimation();
  };

  const updatePosition = (clientX: number) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();

    const percentage = Math.max(
      0,
      Math.min(100, ((clientX - rect.left) / rect.width) * 100),
    );

    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    animationFrameRef.current = requestAnimationFrame(() => {
      setPosition(percentage);
    });
  };

  const handlePointerDown = (
    event: ReactPointerEvent<HTMLDivElement>,
  ) => {
    registerInteraction();
    isDraggingRef.current = true;

    event.currentTarget.setPointerCapture(event.pointerId);
    updatePosition(event.clientX);
  };

  const handlePointerMove = (
    event: ReactPointerEvent<HTMLDivElement>,
  ) => {
    if (!isDraggingRef.current) return;

    updatePosition(event.clientX);
  };

  const handlePointerEnd = (
    event: ReactPointerEvent<HTMLDivElement>,
  ) => {
    isDraggingRef.current = false;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  useEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (
          !entry.isIntersecting ||
          hasAnimatedRef.current ||
          hasInteractedRef.current
        ) {
          return;
        }

        hasAnimatedRef.current = true;
        setIsAutoAnimating(true);

        const duration = 2600;
        const startTime = performance.now();

        const easeInOutCubic = (value: number) => {
          return value < 0.5
            ? 4 * value * value * value
            : 1 - Math.pow(-2 * value + 2, 3) / 2;
        };

        const animate = (currentTime: number) => {
          if (hasInteractedRef.current) {
            cancelAutoAnimation();
            return;
          }

          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);

          let nextPosition = 50;

          if (progress < 0.3) {
            const localProgress = easeInOutCubic(progress / 0.3);
            nextPosition = 50 + (72 - 50) * localProgress;
          } else if (progress < 0.7) {
            const localProgress = easeInOutCubic(
              (progress - 0.3) / 0.4,
            );

            nextPosition = 72 + (28 - 72) * localProgress;
          } else {
            const localProgress = easeInOutCubic(
              (progress - 0.7) / 0.3,
            );

            nextPosition = 28 + (50 - 28) * localProgress;
          }

          setPosition(nextPosition);

          if (progress < 1) {
            autoAnimationFrameRef.current =
              requestAnimationFrame(animate);
          } else {
            autoAnimationFrameRef.current = null;
            setPosition(50);
            setIsAutoAnimating(false);
          }
        };

        const startDelay = window.setTimeout(() => {
          autoAnimationFrameRef.current =
            requestAnimationFrame(animate);
        }, 350);

        observer.disconnect();

        return () => {
          window.clearTimeout(startDelay);
        };
      },
      {
        threshold: 0.45,
      },
    );

    observer.observe(container);

    return () => {
      observer.disconnect();

      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      cancelAutoAnimation();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      role="slider"
      tabIndex={0}
      aria-label="Comparer les images avant et après"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(position)}
      className="relative h-full min-h-[440px] w-full cursor-ew-resize touch-none select-none overflow-hidden rounded-2xl bg-[#080808] outline-none ring-[#d4af37]/60 transition focus-visible:ring-2 sm:min-h-[506px]"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
      onLostPointerCapture={() => {
        isDraggingRef.current = false;
      }}
      onKeyDown={(event) => {
        if (
          event.key !== "ArrowLeft" &&
          event.key !== "ArrowRight" &&
          event.key !== "Home" &&
          event.key !== "End"
        ) {
          return;
        }

        event.preventDefault();
        registerInteraction();

        if (event.key === "ArrowLeft") {
          setPosition((current) => Math.max(0, current - 2));
        }

        if (event.key === "ArrowRight") {
          setPosition((current) => Math.min(100, current + 2));
        }

        if (event.key === "Home") {
          setPosition(0);
        }

        if (event.key === "End") {
          setPosition(100);
        }
      }}
    >
      {/* Imagem depois */}
      <Image
        src={afterImage}
        alt={afterAlt}
        fill
        sizes="(max-width: 1024px) 100vw, 50vw"
        className="pointer-events-none select-none object-cover"
        draggable={false}
      />

      {/* Imagem antes */}
      <div
        className="pointer-events-none absolute inset-0 will-change-[clip-path]"
        style={{
          clipPath: `inset(0 ${100 - position}% 0 0)`,
        }}
      >
        <Image
          src={beforeImage}
          alt={beforeAlt}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="select-none object-cover grayscale-[35%]"
          draggable={false}
        />
      </div>

      {/* Sombras */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/15" />

      {/* Label antes */}
      <div className="pointer-events-none absolute left-4 top-4 z-20 rounded-full border border-white/15 bg-black/70 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-white backdrop-blur-md">
        Avant
      </div>

      {/* Label depois */}
      <div className="pointer-events-none absolute right-4 top-4 z-20 rounded-full border border-[#d4af37]/30 bg-[#d4af37] px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-black">
        Après
      </div>

      {/* Linha */}
      <div
        className="pointer-events-none absolute bottom-0 top-0 z-20 w-[2px] bg-[#d4af37] shadow-[0_0_18px_rgba(212,175,55,0.8)] will-change-transform"
        style={{
          left: `${position}%`,
          transform: "translateX(-50%)",
        }}
      />

      {/* Pega */}
      <div
        className={`pointer-events-none absolute top-1/2 z-30 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#d4af37]/60 bg-[#0b0b0b] shadow-[0_8px_30px_rgba(0,0,0,0.55)] will-change-transform ${
          isAutoAnimating ? "animate-pulse" : ""
        }`}
        style={{
          left: `${position}%`,
        }}
      >
        <GripVertical className="h-5 w-5 text-[#d4af37]" />
      </div>

      {/* Instrução */}
      <div
        className={`pointer-events-none absolute bottom-5 left-1/2 z-30 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/10 bg-black/70 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/80 backdrop-blur-md transition-opacity duration-500 sm:text-[11px] ${
          hasInteracted ? "opacity-0" : "opacity-100"
        }`}
      >
        Faites glisser pour comparer
      </div>
    </div>
  );
}