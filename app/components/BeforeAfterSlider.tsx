"use client";

import Image from "next/image";
import { GripVertical } from "lucide-react";
import { useState, useRef} from "react";

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


  const containerRef= useRef<HTMLDivElement>(null);

  
  
  const updatePosition = (clientX: number)=>{
    if(!containerRef.current) return;
  
    const rect= containerRef.current.getBoundingClientRect()
   let percent = ((clientX - rect.left) / rect.width) * 100;

    percent = Math.max(0, Math.min(100, percent));

    setPosition(percent);
  }
  return (
    <div
      ref={containerRef}
      className="relative h-full min-h-[440px] w-full overflow-hidden rounded-2xl bg-[#080808] touch-none sm:min-h-[506px]"
      onMouseDown={(e) => updatePosition(e.clientX)}
      onMouseMove={(e) => {
        if (e.buttons === 1) updatePosition(e.clientX);
      }}
      onTouchStart={(e) => updatePosition(e.touches[0].clientX)}
      onTouchMove={(e) => updatePosition(e.touches[0].clientX)}
    >
      {/* Imagem depois */}
      <Image
        src={afterImage}
        alt={afterAlt}
        fill
        priority={false}
        sizes="(max-width: 1024px) 100vw, 50vw"
        className="select-none object-cover"
        draggable={false}
      />

      {/* Imagem antes */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{
          clipPath: `inset(0 ${100 - position}% 0 0)`,
        }}
      >
        <Image
          src={beforeImage}
          alt={beforeAlt}
          fill
          priority={false}
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="select-none object-cover grayscale-[35%]"
          draggable={false}
        />
      </div>

      {/* Sombras */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/15" />

      {/* Etiqueta Avant */}
      <div className="pointer-events-none absolute left-4 top-4 z-20 rounded-full border border-white/15 bg-black/70 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-white backdrop-blur-md">
        Avant
      </div>

      {/* Etiqueta Après */}
      <div className="pointer-events-none absolute right-4 top-4 z-20 rounded-full border border-[#d4af37]/30 bg-[#d4af37] px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-black">
        Après
      </div>

      {/* Linha vertical */}
      <div
        className="pointer-events-none absolute bottom-0 top-0 z-20 w-[2px] bg-[#d4af37] shadow-[0_0_18px_rgba(212,175,55,0.8)]"
        style={{
          left: `${position}%`,
          transform: "translateX(-50%)",
        }}
      />

      {/* Botão central */}
      <div
        className="pointer-events-none absolute top-1/2 z-30 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#d4af37]/60 bg-[#0b0b0b] shadow-[0_8px_30px_rgba(0,0,0,0.55)]"
        style={{
          left: `${position}%`,
        }}
      >
        <GripVertical className="h-5 w-5 text-[#d4af37]" />
      </div>
     

      {/* Instrução */}
      <div className="pointer-events-none absolute bottom-5 left-1/2 z-30 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/10 bg-black/70 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/80 backdrop-blur-md sm:text-[11px]">
        Faites glisser pour comparer
      </div>
    </div>
  );
}