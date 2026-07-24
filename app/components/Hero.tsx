"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Award, Check } from "lucide-react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { GiCarWheel } from "react-icons/gi";
import { MdVerified } from "react-icons/md";

const highlights = [
  {
    icon: <Award className="h-5 w-5" />,
    title: "Depuis 2009",
    description: "Plus de 15 ans d’expérience",
  },
  {
    icon: <MdVerified className="h-5 w-5" />,
    title: "Qualité garantie",
    description: "Des finitions professionnelles et durables",
  },
  {
    icon: <GiCarWheel className="h-5 w-5" />,
    title: "Tous types de jantes",
    description: "Aluminium, sportives, classiques et spéciales",
  },
  {
    icon: <FaMapMarkerAlt className="h-5 w-5" />,
    title: "Intervention en France",
    description: "Service disponible dans plusieurs régions",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.13,
      delayChildren: 0.15,
    },
  },
};

const fadeUpVariants = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

export default function Hero() {
  return (
    <section id="accueil" className="overflow-hidden bg-black pt-20">
      {/* HERO */}
      <div className="relative min-h-[680px] overflow-hidden lg:min-h-[760px]">
        {/* Imagem */}
        <motion.div
          initial={{ scale: 1.06 }}
          animate={{ scale: 1.01 }}
          transition={{
            duration: 9,
            ease: "easeOut",
          }}
          className="absolute inset-0"
        >
          <Image
            src="/images/bannernew.png"
            alt="Jantes automobiles restaurées par Rigor Fulgor"
            fill
            priority
            quality={92}
            sizes="100vw"
            className="
              object-cover
              object-[68%_center]
              sm:object-[65%_center]
              lg:object-[62%_center]
            "
          />
        </motion.div>

        {/* Overlay lateral mais progressivo */}
        <div
          aria-hidden="true"
          className="
            absolute inset-0
            bg-[linear-gradient(90deg,rgba(0,0,0,0.98)_0%,rgba(0,0,0,0.92)_24%,rgba(0,0,0,0.78)_43%,rgba(0,0,0,0.42)_67%,rgba(0,0,0,0.10)_100%)]
          "
        />

        {/* Overlay vertical */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/20"
        />

        {/* Sombra extra no mobile para garantir legibilidade */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-black/20 sm:bg-transparent"
        />

        {/* Glow dourado subtil */}
        <motion.div
          aria-hidden="true"
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0.08, 0.16, 0.08],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="
            pointer-events-none absolute
            -left-40 top-1/2
            h-[500px] w-[500px]
            -translate-y-1/2 rounded-full
            bg-[#d4af37]/10 blur-[150px]
          "
        />

        {/* Conteúdo */}
        <div
          className="
            relative mx-auto flex min-h-[680px] max-w-7xl items-center
            px-5 py-20
            sm:px-6
            lg:min-h-[760px] lg:px-10 lg:py-24
          "
        >
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-[760px]"
          >
            {/* Eyebrow */}
            <motion.div
              variants={fadeUpVariants}
              className="mb-6 flex items-center gap-4"
            >
              <motion.span
                initial={{ width: 0 }}
                animate={{ width: 36 }}
                transition={{
                  duration: 0.8,
                  delay: 0.25,
                  ease: "easeOut",
                }}
                className="h-px shrink-0 bg-[#d4af37]"
              />

              <p
                className="
                  text-[10px] font-bold uppercase
                  tracking-[0.24em] text-[#d4af37]
                  sm:text-xs sm:tracking-[0.32em]
                  lg:text-sm
                "
              >
                Spécialiste de la rénovation automobile
              </p>
            </motion.div>

           {/* Título */}
            <motion.h1
              variants={fadeUpVariants}
              className="
                max-w-[760px]
                text-[2.8rem] font-black uppercase
                leading-[0.92] tracking-[-0.04em] text-white
                sm:text-[4rem]
                lg:text-[4.8rem]
                xl:text-[5.3rem]
              "
            >
              Réparation
              <br />
              de jantes
              <br />

              <motion.span
                initial={{
                  opacity: 0,
                  backgroundPosition: "200% center",
                }}
                animate={{
                  opacity: 1,
                  backgroundPosition: "0% center",
                }}
                transition={{
                  opacity: {
                    duration: 0.7,
                    delay: 0.6,
                  },
                  backgroundPosition: {
                    duration: 1.7,
                    delay: 0.65,
                  },
                }}
                className="
                  bg-gradient-to-r
                  from-[#b98b17] via-[#f1d469] to-[#d4af37]
                  bg-[length:200%_100%]
                  bg-clip-text
                  text-transparent
                "
              >
                Chromage & Sellerie
              </motion.span>
            </motion.h1>

            {/* Depuis 2009 */}
            <motion.p
              variants={fadeUpVariants}
              className="
                mt-5
                text-xs
                font-bold
                uppercase
                tracking-[0.28em]
                text-[#d4af37]
                sm:text-sm
              "
            >
              Depuis 2009
            </motion.p>

            {/* Descrição */}
            <motion.p
              variants={fadeUpVariants}
              className="
                mt-7
                max-w-2xl
                text-base
                leading-7
                text-white/60
                sm:text-lg
                sm:leading-8
              "
            >
              Réparation, rénovation et personnalisation de jantes en aluminium,
              chromage de pièces automobiles et restauration de sellerie.
            </motion.p>

            {/* Botões */}
            <motion.div
              variants={fadeUpVariants}
              className="mt-9 flex flex-col gap-4 sm:flex-row"
            >
              <motion.a
                href="#contact"
                whileHover={{
                  y: -3,
                  scale: 1.012,
                }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="
                  group relative flex min-h-14 items-center justify-center
                  overflow-hidden rounded-lg
                  bg-[#d4af37] px-8 py-4
                  text-center text-sm font-black uppercase
                  tracking-[0.04em] text-black
                  shadow-[0_14px_40px_rgba(212,175,55,0.20)]
                  transition-shadow duration-300
                  hover:bg-[#e4c454]
                  hover:shadow-[0_18px_50px_rgba(212,175,55,0.30)]
                "
              >
                <span
                  aria-hidden="true"
                  className="
                    absolute inset-y-0 -left-1/2 w-1/3
                    skew-x-[-20deg] bg-white/30 blur-md
                    transition-transform duration-700
                    group-hover:translate-x-[500%]
                  "
                />

                <span className="relative z-10">Demander un devis</span>
              </motion.a>

              <motion.a
                href="#services"
                whileHover={{
                  y: -3,
                  scale: 1.012,
                }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="
                  flex min-h-14 items-center justify-center
                  rounded-lg border border-[#d4af37]/65
                  bg-black/25 px-8 py-4
                  text-center text-sm font-black uppercase
                  tracking-[0.04em] text-white
                  backdrop-blur-sm
                  transition-colors duration-300
                  hover:border-[#d4af37]
                  hover:bg-[#d4af37]/10
                "
              >
                Découvrir nos services
              </motion.a>
            </motion.div>

            {/* Confiança */}
            <motion.div
              variants={fadeUpVariants}
              className="
                mt-7 flex flex-wrap
                gap-x-7 gap-y-3
                text-xs font-semibold text-white/55
                sm:text-sm
              "
            >
              {[
                "Devis personnalisé",
                "Photos acceptées",
                "Intervention en France",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <Check
                    aria-hidden="true"
                    className="h-4 w-4 shrink-0 text-[#d4af37]"
                  />

                  <span>{item}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* DESTAQUES */}
      <div className="border-y border-white/10 bg-[#0a0a0a]">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.2,
          }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
          className="
            mx-auto grid max-w-7xl
            grid-cols-1 divide-y divide-white/10
            px-5
            sm:grid-cols-2 sm:divide-x sm:divide-y-0 sm:px-6
            lg:grid-cols-4 lg:px-8
          "
        >
          {highlights.map((item) => (
            <motion.div
              key={item.title}
              variants={{
                hidden: {
                  opacity: 0,
                  y: 22,
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
              className="
                group flex min-h-[170px]
                flex-col items-center justify-center
                px-6 py-8 text-center
                transition-colors duration-300
              "
            >
              <motion.div
                whileHover={{
                  scale: 1.08,
                  rotate: 3,
                }}
                transition={{
                  duration: 0.25,
                }}
                className="
                  flex h-12 w-12 items-center justify-center
                  rounded-full
                  border border-[#d4af37]/35
                  bg-[#d4af37]/[0.07]
                  text-[#d4af37]
                  transition-all duration-300
                  group-hover:-translate-y-1
                  group-hover:border-[#d4af37]
                  group-hover:bg-[#d4af37]/15
                  group-hover:shadow-[0_0_30px_rgba(212,175,55,0.16)]
                "
              >
                {item.icon}
              </motion.div>

              <h2
                className="
                  mt-4 text-sm font-black uppercase
                  tracking-[0.05em] text-white
                "
              >
                {item.title}
              </h2>

              <p className="mt-2 max-w-[230px] text-sm leading-6 text-white/45">
                {item.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}