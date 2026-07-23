import Image from "next/image";

const cities = [
  "Bayonne",
  "Bordeaux",
  "Poitiers",
  "Tours",
  "Blois",
  "Orléans",
  "Paris",
  "Beauvais",
  "Compiègne",
];

export default function FranceMap() {
  return (
    <section
      id="zones"
      className="relative overflow-hidden bg-[#080808] py-16 sm:py-20 lg:py-28"
    >
      {/* Glow geral da secção */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-1/2 h-[560px] w-[560px] -translate-y-1/2 rounded-full bg-[#d4af37]/[0.06] blur-[150px]"
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20 lg:px-8">
        {/* Conteúdo */}
        <div>
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-[#d4af37]" />

            <p className="text-xs font-bold uppercase tracking-[0.32em] text-[#d4af37] sm:text-sm">
              Zones d’intervention
            </p>
          </div>

          <h2 className="mt-5 max-w-2xl text-4xl font-black leading-[1.06] text-white sm:text-5xl lg:text-6xl">
            Nous intervenons dans plusieurs régions de France
          </h2>

          <p className="mt-6 max-w-xl text-base leading-7 text-white/55 sm:text-lg sm:leading-8">
            Nous organisons une collecte hebdomadaire dans plusieurs villes
            françaises afin de prendre en charge vos jantes rapidement et en
            toute sécurité.
          </p>

          {/* Informação de serviço */}
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.025] p-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#d4af37]/10 text-[#d4af37]">
                <CalendarIcon />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/35">
                  Fréquence
                </p>

                <p className="mt-1 font-semibold text-white">
                  Collecte chaque semaine
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.025] p-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#d4af37]/10 text-[#d4af37]">
                <ClockIcon />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/35">
                  Délai moyen
                </p>

                <p className="mt-1 font-semibold text-white">
                  Environ une semaine
                </p>
              </div>
            </div>
          </div>

          {/* Cidades */}
          <div className="mt-10">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-white/35">
              Villes desservies
            </p>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {cities.map((city) => (
                <div
                  key={city}
                  className="
                    group relative overflow-hidden rounded-xl border
                    border-white/10 bg-gradient-to-b from-white/[0.045]
                    to-white/[0.015] px-4 py-4 text-center
                    transition-all duration-300
                    hover:-translate-y-0.5 hover:border-[#d4af37]/40
                    hover:bg-[#d4af37]/[0.05]
                  "
                >
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#d4af37]/0 to-transparent transition group-hover:via-[#d4af37]/60" />

                  <span className="font-semibold text-white/75 transition group-hover:text-white">
                    {city}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <p className="mt-5 text-sm leading-6 text-white/35">
            Contactez-nous pour confirmer les disponibilités et les conditions
            de collecte dans votre région.
          </p>
        </div>

        {/* Mapa */}
        <div className="relative">
          <div className="relative h-[300px] w-full sm:h-[430px] lg:h-[590px]">
            {/* Glow atrás do mapa */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-[10%] rounded-full bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.16),rgba(249,115,22,0.07)_42%,transparent_72%)] blur-3xl"
            />

            <Image
              src="/images/mapa.png"
              alt="Carte des zones d’intervention en France"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="relative z-10 object-contain drop-shadow-[0_30px_70px_rgba(0,0,0,0.55)]"
            />
          </div>

          {/* Pequeno destaque */}
          <div className="mx-auto -mt-2 flex w-fit items-center gap-3 rounded-full border border-white/10 bg-black/50 px-4 py-2 text-xs text-white/50 backdrop-blur sm:text-sm lg:-mt-5">
            <span className="h-2 w-2 rounded-full bg-[#d4af37] shadow-[0_0_14px_rgba(212,175,55,0.8)]" />
            Collecte en France · Réparation au Portugal
          </div>
        </div>
      </div>
    </section>
  );
}

function CalendarIcon() {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M8 3v4M16 3v4M3 10h18" />
      <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </svg>
  );
}