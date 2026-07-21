"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Award, Check } from "lucide-react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { GiCarWheel } from "react-icons/gi";
import { MdVerified } from "react-icons/md";

const highlights = [
  {
    icon: <Award className="h-6 w-6" />,
    title: "Depuis 2009",
    description: "Plus de 15 ans d’expérience",
  },
  {
    icon: <MdVerified className="h-6 w-6" />,
    title: "Qualité garantie",
    description: "Des finitions professionnelles et durables",
  },
  {
    icon: <GiCarWheel className="h-6 w-6" />,
    title: "Tous types de jantes",
    description: "Aluminium, sportives, classiques et spéciales",
  },
  {
    icon: <FaMapMarkerAlt className="h-6 w-6" />,
    title: "Intervention en France",
    description: "Service disponible dans plusieurs régions",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.14,
      delayChildren: 0.2,
    },
  },
};

const fadeUpVariants = {
  hidden: {
    opacity: 0,
    y: 28,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.75,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

export default function Hero() {
  return (
    <section id="accueil" className="bg-black pt-20">
      <div className="relative min-h-[680px] overflow-hidden lg:min-h-[78vh]">
        {/* Imagem com zoom cinematográfico */}
        <motion.div
          initial={{ scale: 1.08 }}
          animate={{ scale: 1.02 }}
          transition={{
            duration: 8,
            ease: "easeOut",
          }}
          className="absolute inset-0"
        >
          <Image
            src="/images/hero-jantes.png"
            alt="Jante automobile restaurée par Rigor & Fulgor"
            fill
            priority
            quality={88}
            sizes="100vw"
            className="object-cover object-[62%_center] sm:object-center"
          />
        </motion.div>

        {/* Overlay lateral */}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.98)_0%,rgba(0,0,0,0.90)_38%,rgba(0,0,0,0.42)_72%,rgba(0,0,0,0.18)_100%)]" />

        {/* Overlay vertical */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/25" />

        {/* Brilho dourado animado */}
        <motion.div
          aria-hidden="true"
          initial={{ opacity: 0, x: -80 }}
          animate={{
            opacity: [0.1, 0.22, 0.1],
            x: [-80, 30, -80],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="pointer-events-none absolute left-[-160px] top-1/2 h-[480px] w-[480px] -translate-y-1/2 rounded-full bg-[#d4af37]/10 blur-[140px]"
        />

        {/* Reflexo subtil na imagem */}
        <motion.div
          aria-hidden="true"
          initial={{ x: "-140%", opacity: 0 }}
          animate={{
            x: ["-140%", "140%"],
            opacity: [0, 0.12, 0],
          }}
          transition={{
            duration: 4.5,
            delay: 1.5,
            repeat: Infinity,
            repeatDelay: 5,
            ease: "easeInOut",
          }}
          className="pointer-events-none absolute inset-y-0 w-[35%] skew-x-[-18deg] bg-gradient-to-r from-transparent via-white/10 to-transparent blur-xl"
        />

        <div className="relative mx-auto flex min-h-[680px] max-w-7xl items-center px-6 py-20 lg:min-h-[78vh] lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-3xl"
          >
            {/* Eyebrow */}
            <motion.div
              variants={fadeUpVariants}
              className="mb-5 flex items-center gap-3"
            >
              <motion.span
                initial={{ width: 0 }}
                animate={{ width: 32 }}
                transition={{
                  duration: 0.8,
                  delay: 0.3,
                  ease: "easeOut",
                }}
                className="h-px bg-[#d4af37]"
              />

              <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#d4af37] sm:text-sm sm:tracking-[0.32em]">
                Spécialiste de la rénovation automobile
              </p>
            </motion.div>

            {/* Título */}
            <motion.h1
              variants={fadeUpVariants}
              className="text-[3.1rem] font-black uppercase leading-[0.9] tracking-[-0.035em] text-white sm:text-6xl lg:text-[5.4rem]"
            >
              Réparation
              <br />
              de jantes
              <br />

              <motion.span
                initial={{ opacity: 0, backgroundPosition: "200% center" }}
                animate={{ opacity: 1, backgroundPosition: "0% center" }}
                transition={{
                  opacity: {
                    duration: 0.7,
                    delay: 0.65,
                  },
                  backgroundPosition: {
                    duration: 1.8,
                    delay: 0.7,
                  },
                }}
                className="bg-gradient-to-r from-[#b88a16] via-[#f2d56f] to-[#d4af37] bg-[length:200%_100%] bg-clip-text text-transparent"
              >
                depuis 2009
              </motion.span>
            </motion.h1>

            {/* Descrição */}
            <motion.p
              variants={fadeUpVariants}
              className="mt-7 max-w-2xl text-base leading-7 text-white/70 sm:text-lg sm:leading-8"
            >
              Réparation, rénovation et personnalisation de jantes, chromage de
              pièces et restauration de sellerie automobile.
            </motion.p>

            {/* Botões */}
            <motion.div
              variants={fadeUpVariants}
              className="mt-8 flex flex-col gap-4 sm:flex-row"
            >
              <motion.a
                href="#contact"
                whileHover={{
                  y: -3,
                  scale: 1.015,
                }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="relative overflow-hidden rounded-md bg-[#d4af37] px-8 py-4 text-center text-sm font-black uppercase tracking-wide text-black shadow-[0_10px_35px_rgba(212,175,55,0.15)]"
              >
                <motion.span
                  aria-hidden="true"
                  initial={{ x: "-130%" }}
                  whileHover={{ x: "130%" }}
                  transition={{ duration: 0.7 }}
                  className="absolute inset-y-0 w-1/3 skew-x-[-20deg] bg-white/30 blur-md"
                />

                <span className="relative z-10">Demander un devis</span>
              </motion.a>

              <motion.a
                href="#services"
                whileHover={{
                  y: -3,
                  scale: 1.015,
                  backgroundColor: "#d4af37",
                  color: "#000000",
                }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="rounded-md border border-[#d4af37]/70 bg-black/20 px-8 py-4 text-center text-sm font-black uppercase tracking-wide text-white backdrop-blur-sm"
              >
                Découvrir nos services
              </motion.a>
            </motion.div>

            {/* Confiança */}
            <motion.div
              variants={fadeUpVariants}
              className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-xs font-semibold text-white/65 sm:text-sm"
            >
              {[
                "Devis personnalisé",
                "Photos acceptées",
                "Intervention en France",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[#d4af37]" />
                  {item}
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Destaques */}
      <div className="border-y border-white/10 bg-[#0b0b0b]">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.25,
          }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.12,
              },
            },
          }}
          className="mx-auto grid max-w-7xl grid-cols-1 divide-y divide-white/10 px-6 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4 lg:px-8"
        >
          {highlights.map((item) => (
            <motion.div
              key={item.title}
              variants={{
                hidden: {
                  opacity: 0,
                  y: 25,
                },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.6,
                    ease: [0.22, 1, 0.36, 1],
                  },
                },
              }}
              whileHover={{
                y: -4,
                backgroundColor: "rgba(255,255,255,0.025)",
              }}
              className="group px-6 py-8 text-center"
            >
              <motion.div
                whileHover={{
                  scale: 1.08,
                  rotate: 3,
                }}
                className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-[#d4af37]/40 bg-[#d4af37]/5 text-[#d4af37] transition duration-300 group-hover:border-[#d4af37] group-hover:bg-[#d4af37]/10 group-hover:shadow-[0_0_25px_rgba(212,175,55,0.15)]"
              >
                {item.icon}
              </motion.div>

              <h2 className="text-sm font-black uppercase tracking-wide text-white">
                {item.title}
              </h2>

              <p className="mt-2 text-sm leading-6 text-white/50">
                {item.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}