const services = [
  {
    number: "01",
    title: "Jantes",
    description:
      "Réparation, rénovation et finition de jantes automobiles avec un travail précis et durable.",
    items: [
      "Réparation de jantes",
      "Peinture personnalisée",
      "Polissage",
      "Jantes biparties",
    ],
  },
  {
    number: "02",
    title: "Chromage",
    description:
      "Restauration et traitement chromé de pièces automobiles isolées.",
    items: [
      "Bain de chrome",
      "Pièces automobiles",
      "Rénovation de pièces",
      "Finitions brillantes",
    ],
  },
  {
    number: "03",
    title: "Sellerie",
    description:
      "Restauration soignée des intérieurs automobiles, volants et sièges.",
    items: [
      "Intérieurs automobiles",
      "Volants",
      "Sièges",
      "Restauration du cuir",
    ],
  },
];

export default function Services() {
  return (
    <section id="services" className="bg-[#080808] py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#d4af37]">
            Notre savoir-faire
          </p>

          <h2 className="mt-4 text-4xl font-black text-white sm:text-5xl">
            Nos services
          </h2>

          <p className="mt-5 text-lg leading-8 text-white/60">
            Trois domaines spécialisés pour restaurer, personnaliser et
            valoriser votre véhicule.
          </p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {services.map((service) => (
            <article
              key={service.title}
              className="group rounded-xl border border-white/10 bg-[#101010] p-8 transition duration-300 hover:-translate-y-2 hover:border-[#d4af37]/60"
            >
              <span className="text-sm font-black tracking-widest text-[#d4af37]">
                {service.number}
              </span>

              <h3 className="mt-6 text-3xl font-black text-white">
                {service.title}
              </h3>

              <p className="mt-4 leading-7 text-white/60">
                {service.description}
              </p>

              <ul className="mt-7 space-y-3">
                {service.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 text-sm text-white/80"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-[#d4af37]" />
                    {item}
                  </li>
                ))}
              </ul>

              <a
                href="#contact"
                className="mt-8 inline-block font-bold text-[#d4af37]"
              >
                Demander un devis →
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}