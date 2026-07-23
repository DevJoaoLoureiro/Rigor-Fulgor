import {
  ArrowRight,
  Armchair,
  Check,
  CircleDot,
  Sparkles,
} from "lucide-react";


import BeforeAfterSlider from "./BeforeAfterSlider";

const services = [
  {
    number: "01",
    title: "Jantes",
    subtitle: "Réparation & rénovation",
    icon: CircleDot,
    description:
      "Nous réparons et rénovons vos jantes avec précision afin de leur redonner leur esthétique, leur solidité et leur finition d’origine.",
    services: [
      "Réparation de jantes",
      "Dévoilage de jantes",
      "Soudure aluminium",
      "Réparation de fissures",
      "Polissage",
      "Peinture personnalisée",
      "Rénovation complète",
      "Jantes multipièces",
    ],
    beforeImage: "/images/jant-avant.jpeg",
    afterImage: "/images/jant-apres.jpeg",
    beforeAlt: "Jante endommagée avant réparation",
    afterAlt: "Jante restaurée après réparation",
  },
  {
    number: "02",
    title: "Chromage",
    subtitle: "Pièces & finitions",
    icon: Sparkles,
    description:
      "Nous restaurons et sublimons vos pièces grâce à des traitements de chromage professionnels et des finitions brillantes et durables.",
    services: [
      "Chromage de pièces isolées",
      "Bain de chrome",
      "Pièces automobiles",
      "Pièces de moto",
      "Restauration de pièces chromées",
      "Polissage miroir",
      "Éléments décoratifs",
      "Rénovation de pièces anciennes",
    ],
    beforeImage: "/images/cromagem-antes.jpeg",
    afterImage: "/images/cromagem-depois.jpeg",
    beforeAlt: "Pièce automobile avant chromage",
    afterAlt: "Pièce automobile après chromage",
  },
  {
    number: "03",
    title: "Sellerie",
    subtitle: "Intérieurs sur mesure",
    icon: Armchair,
    description:
      "Nous restaurons et personnalisons les intérieurs automobiles avec des matériaux de qualité et un travail artisanal soigné.",
    services: [
      "Rénovation de volants",
      "Remplacement du revêtement",
      "Restauration de sièges",
      "Réfection complète de l’intérieur",
      "Sellerie cuir",
      "Sellerie Alcantara",
      "Couture personnalisée",
      "Réparation des déchirures",
    ],
    beforeImage: "/images/banco-antes.png",
    afterImage: "/images/banco-depois.png",
    beforeAlt: "Intérieur automobile avant restauration",
    afterAlt: "Intérieur automobile après restauration",
  },
];

export default function Services() {
  return (
    <section
      id="services"
      className="relative overflow-hidden bg-[#070707] py-24 sm:py-28 lg:py-32"
    >
      {/* Luz decorativa esquerda */}
      <div className="pointer-events-none absolute left-0 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[#d4af37]/5 blur-[150px]" />

      {/* Luz decorativa direita */}
      <div className="pointer-events-none absolute bottom-0 right-0 h-[500px] w-[500px] translate-x-1/2 rounded-full bg-[#d4af37]/5 blur-[150px]" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Cabeçalho */}
        <div className="max-w-3xl">
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-[#d4af37]" />

            <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#d4af37]">
              Notre savoir-faire
            </p>
          </div>

          <h2 className="mt-5 text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">
            Des prestations haut de gamme
            <span className="block text-[#d4af37]">
              pour votre véhicule
            </span>
          </h2>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/60">
            Jantes, chromage et sellerie automobile : trois domaines
            spécialisés pour restaurer, transformer et valoriser votre
            véhicule.
          </p>
        </div>

        {/* Serviços */}
        <div className="mt-16 space-y-10">
          {services.map((service, index) => {
            const Icon = service.icon;
            const isReversed = index % 2 !== 0;

            return (
              <article
                key={service.title}
                className="group overflow-hidden rounded-3xl border border-white/10 bg-[#0e0e0e] transition duration-500 hover:border-[#d4af37]/40 hover:shadow-[0_30px_100px_rgba(212,175,55,0.10)]"
              >
                <div className="grid lg:grid-cols-2">
                  {/* Conteúdo */}
                  <div
                    className={`flex flex-col justify-center p-8 sm:p-10 lg:p-14 ${
                      isReversed ? "lg:order-2" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between gap-6">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#d4af37]/20 bg-[#d4af37]/10 transition duration-500 group-hover:scale-105 group-hover:border-[#d4af37]/50">
                        <Icon className="h-8 w-8 text-[#d4af37]" />
                      </div>

                      <span className="text-sm font-black tracking-[0.35em] text-[#d4af37]/70">
                        {service.number}
                      </span>
                    </div>

                    <p className="mt-8 text-xs font-bold uppercase tracking-[0.3em] text-[#d4af37]">
                      {service.subtitle}
                    </p>

                    <h3 className="mt-3 text-4xl font-black text-white">
                      {service.title}
                    </h3>

                    <div className="mt-5 h-[2px] w-16 bg-[#d4af37] transition-all duration-500 group-hover:w-28" />

                    <p className="mt-6 max-w-xl leading-7 text-white/60">
                      {service.description}
                    </p>

                    <div className="mt-8 grid gap-3 sm:grid-cols-2">
                      {service.services.map((item) => (
                        <div
                          key={item}
                          className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.025] px-4 py-3 transition hover:border-[#d4af37]/20 hover:bg-[#d4af37]/5"
                        >
                          <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#d4af37]/10">
                            <Check className="h-3 w-3 text-[#d4af37]" />
                          </div>

                          <span className="text-sm leading-5 text-white/75">
                            {item}
                          </span>
                        </div>
                      ))}
                    </div>

                    <a
                      href="#contact"
                      className="mt-10 inline-flex w-fit items-center gap-3 rounded-full bg-[#d4af37] px-6 py-3.5 text-sm font-black text-black transition duration-300 hover:scale-[1.03] hover:bg-[#e3c255]"
                    >
                      Demander un devis
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  </div>

                  {/* Slider Avant / Après */}
                  <div
                    className={`relative min-h-[480px] border-t border-white/10 bg-[#080808] p-5 sm:min-h-[560px] sm:p-7 lg:border-t-0 ${
                      isReversed
                        ? "lg:order-1 lg:border-r lg:border-white/10"
                        : "lg:border-l lg:border-white/10"
                    }`}
                  >
                    <BeforeAfterSlider
                      beforeImage={service.beforeImage}
                      afterImage={service.afterImage}
                      beforeAlt={service.beforeAlt}
                      afterAlt={service.afterAlt}
                    />
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* CTA final */}
        <div className="relative mt-14 overflow-hidden rounded-3xl border border-[#d4af37]/20 bg-[#d4af37]/[0.06] px-8 py-10 sm:px-10 lg:px-12">
          <div className="pointer-events-none absolute right-0 top-1/2 h-64 w-64 -translate-y-1/2 translate-x-1/3 rounded-full bg-[#d4af37]/10 blur-[80px]" />

          <div className="relative flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#d4af37]">
                Votre projet
              </p>

              <h3 className="mt-3 text-3xl font-black text-white sm:text-4xl">
                Vous souhaitez restaurer votre véhicule ?
              </h3>

              <p className="mt-4 max-w-2xl leading-7 text-white/60">
                Envoyez-nous des photos de votre projet et recevez une
                estimation personnalisée adaptée à vos besoins.
              </p>
            </div>

            <a
              href="#contact"
              className="inline-flex shrink-0 items-center justify-center gap-3 rounded-full bg-[#d4af37] px-7 py-4 font-black text-black transition duration-300 hover:scale-105 hover:bg-[#e4c35a]"
            >
              Obtenir une estimation
              <ArrowRight className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}