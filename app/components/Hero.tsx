export default function Hero() {
  const highlights = [
    {
      title: "Depuis 2009",
      description: "Plus de 15 ans d’expérience",
    },
    {
      title: "Qualité garantie",
      description: "Des finitions professionnelles et durables",
    },
    {
      title: "Tous types de jantes",
      description: "Aluminium, sportives, classiques et spéciales",
    },
    {
      title: "Intervention en France",
      description: "Service rapide dans plusieurs régions",
    },
  ];

  return (
    <section id="accueil" className="bg-black pt-20">
      <div
        className="relative min-h-[78vh] overflow-hidden bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(0,0,0,0.96) 0%, rgba(0,0,0,0.78) 42%, rgba(0,0,0,0.18) 100%), url('/images/hero-jantes.png')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20" />

        <div className="relative mx-auto flex min-h-[78vh] max-w-7xl items-center px-6 py-20 lg:px-8">
          <div className="max-w-2xl">
            <p className="mb-5 text-sm font-bold uppercase tracking-[0.32em] text-[#d4af37]">
              Spécialiste de la rénovation automobile
            </p>

            <h1 className="text-5xl font-black uppercase leading-[0.95] text-white sm:text-6xl lg:text-7xl">
              Réparation
              <br />
              de jantes
              <br />
              <span className="text-[#d4af37]">depuis 2009</span>
            </h1>

            <p className="mt-7 max-w-xl text-base leading-7 text-white/70 sm:text-lg">
              Réparation, rénovation et personnalisation de jantes. Chromage de
              pièces et restauration de sellerie automobile.
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <a
                href="#contact"
                className="rounded-md bg-[#d4af37] px-7 py-4 text-center text-sm font-black uppercase tracking-wide text-black transition hover:bg-[#e8c75a]"
              >
                Demander un devis
              </a>

              <a
                href="#services"
                className="rounded-md border border-[#d4af37]/70 px-7 py-4 text-center text-sm font-black uppercase tracking-wide text-white transition hover:bg-[#d4af37] hover:text-black"
              >
                Nos services
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="border-y border-white/10 bg-[#0b0b0b]">
        <div className="mx-auto grid max-w-7xl grid-cols-1 divide-y divide-white/10 px-6 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4 lg:px-8">
          {highlights.map((item) => (
            <div key={item.title} className="px-6 py-7 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-[#d4af37]/50 text-xl text-[#d4af37]">
                ✓
              </div>

              <h2 className="text-sm font-black uppercase tracking-wide text-white">
                {item.title}
              </h2>

              <p className="mt-2 text-sm leading-6 text-white/50">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}