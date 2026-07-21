"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import { useEffect, useState } from "react";

const galleryItems = [
  {
    title: "Rénovation de jantes",
    category: "Jantes",
    image: "/images/gallery-jantes.png",
  },
  {
    title: "Pièces chromées",
    category: "Chromage",
    image: "/images/gallery-chromage.png",
  },
  {
    title: "Intérieur automobile",
    category: "Sellerie",
    image: "/images/gallery-sellerie.png",
  },
];

export default function Gallery() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const selectedItem =
    selectedIndex !== null ? galleryItems[selectedIndex] : null;

  const closeGallery = () => {
    setSelectedIndex(null);
  };

  const showPrevious = () => {
    setSelectedIndex((current) => {
      if (current === null) return null;

      return current === 0 ? galleryItems.length - 1 : current - 1;
    });
  };

  const showNext = () => {
    setSelectedIndex((current) => {
      if (current === null) return null;

      return current === galleryItems.length - 1 ? 0 : current + 1;
    });
  };

  useEffect(() => {
    if (selectedIndex === null) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeGallery();
      }

      if (event.key === "ArrowLeft") {
        showPrevious();
      }

      if (event.key === "ArrowRight") {
        showNext();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedIndex]);

  return (
    <>
      <section
        id="realisations"
        className="overflow-hidden bg-black py-24"
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{
              duration: 0.7,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="flex flex-col justify-between gap-6 md:flex-row md:items-end"
          >
            <div>
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-[#d4af37]" />

                <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#d4af37]">
                  Nos réalisations
                </p>
              </div>

              <h2 className="mt-4 max-w-3xl text-4xl font-black leading-tight text-white sm:text-5xl">
                Un résultat qui parle de lui-même
              </h2>
            </div>

            <p className="max-w-xl leading-7 text-white/60">
              Découvrez une sélection de nos travaux de réparation, de
              chromage et de restauration automobile.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.14,
                },
              },
            }}
            className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {galleryItems.map((item, index) => (
              <motion.button
                key={item.title}
                type="button"
                variants={{
                  hidden: {
                    opacity: 0,
                    y: 40,
                  },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      duration: 0.65,
                      ease: [0.22, 1, 0.36, 1],
                    },
                  },
                }}
                whileHover={{ y: -6 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => setSelectedIndex(index)}
                className="group relative min-h-[430px] overflow-hidden rounded-2xl border border-white/10 bg-[#141414] text-left shadow-[0_20px_70px_rgba(0,0,0,0.35)]"
                aria-label={`Voir ${item.title}`}
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition duration-700 ease-out group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                <div className="absolute inset-0 bg-[#d4af37]/0 transition duration-500 group-hover:bg-[#d4af37]/5" />

                <div className="absolute right-5 top-5 flex h-11 w-11 translate-y-2 items-center justify-center rounded-full border border-white/15 bg-black/55 text-white opacity-0 backdrop-blur-md transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  <ZoomIn className="h-5 w-5" />
                </div>

                <div className="absolute bottom-0 left-0 w-full p-7">
                  <p className="text-sm font-bold uppercase tracking-wider text-[#d4af37]">
                    {item.category}
                  </p>

                  <h3 className="mt-2 text-2xl font-black text-white">
                    {item.title}
                  </h3>

                  <div className="mt-5 h-px w-0 bg-[#d4af37] transition-all duration-500 group-hover:w-16" />
                </div>
              </motion.button>
            ))}
          </motion.div>
        </div>
      </section>

      <AnimatePresence>
        {selectedItem && selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeGallery}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 px-4 py-6 backdrop-blur-xl sm:px-8"
            role="dialog"
            aria-modal="true"
            aria-label={selectedItem.title}
          >
            <button
              type="button"
              onClick={closeGallery}
              className="absolute right-5 top-5 z-30 flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white backdrop-blur-md transition hover:border-[#d4af37]/60 hover:bg-[#d4af37] hover:text-black"
              aria-label="Fermer la galerie"
            >
              <X className="h-6 w-6" />
            </button>

            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                showPrevious();
              }}
              className="absolute left-4 z-30 hidden h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white backdrop-blur-md transition hover:border-[#d4af37]/60 hover:bg-[#d4af37] hover:text-black sm:flex"
              aria-label="Image précédente"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                showNext();
              }}
              className="absolute right-4 z-30 hidden h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white backdrop-blur-md transition hover:border-[#d4af37]/60 hover:bg-[#d4af37] hover:text-black sm:flex"
              aria-label="Image suivante"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            <motion.div
              key={selectedItem.image}
              initial={{ opacity: 0, scale: 0.96, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{
                duration: 0.35,
                ease: [0.22, 1, 0.36, 1],
              }}
              onClick={(event) => event.stopPropagation()}
              className="relative flex h-full max-h-[820px] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#080808] shadow-[0_30px_100px_rgba(0,0,0,0.7)]"
            >
              <div className="relative min-h-0 flex-1">
                <Image
                  src={selectedItem.image}
                  alt={selectedItem.title}
                  fill
                  priority
                  sizes="100vw"
                  className="object-contain"
                />
              </div>

              <div className="border-t border-white/10 bg-black/80 px-6 py-5 backdrop-blur-xl">
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#d4af37]">
                  {selectedItem.category}
                </p>

                <div className="mt-2 flex items-center justify-between gap-4">
                  <h3 className="text-xl font-black text-white sm:text-2xl">
                    {selectedItem.title}
                  </h3>

                  <p className="text-sm text-white/50">
                    {selectedIndex + 1} / {galleryItems.length}
                  </p>
                </div>

                <div className="mt-5 flex gap-3 sm:hidden">
                  <button
                    type="button"
                    onClick={showPrevious}
                    className="flex flex-1 items-center justify-center gap-2 rounded-md border border-white/15 px-4 py-3 text-sm font-bold text-white"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Précédente
                  </button>

                  <button
                    type="button"
                    onClick={showNext}
                    className="flex flex-1 items-center justify-center gap-2 rounded-md border border-[#d4af37]/60 px-4 py-3 text-sm font-bold text-[#d4af37]"
                  >
                    Suivante
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}