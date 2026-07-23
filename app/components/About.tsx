import Image from "next/image";

const stats = [
  { value: "15+", label: "Années d’expérience" },
  { value: "1000+", label: "Jantes rénovées" },
  { value: "100%", label: "Clients satisfaits" },
  { value: "Qualité", label: "Notre priorité" },
];

export default function About() {
  return (
    <section id="about" className="bg-[#080808] py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid overflow-hidden rounded-2xl border border-white/10 bg-[#0f0f0f] lg:grid-cols-[0.85fr_1.5fr]">
          <div className="flex flex-col justify-center p-8 sm:p-10 lg:p-12">
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#d4af37]">
              À propos de nous
            </p>

            <h2 className="mt-4 text-4xl font-black leading-tight text-white">
              Passion, précision et exigence depuis 2009
            </h2>

            <p className="mt-6 leading-7 text-white/60">
              Chez Rigor Fulgor, chaque projet est réalisé avec rigueur,
              attention et précision. Nous utilisons des équipements adaptés et
              des matériaux de qualité afin d’obtenir des résultats durables et
              professionnels.
            </p>

            <ul className="mt-8 space-y-4 text-sm text-white/80">
              <li className="flex gap-3">
                <span className="text-[#d4af37]">✓</span>
                Plus de 15 ans d’expérience
              </li>

              <li className="flex gap-3">
                <span className="text-[#d4af37]">✓</span>
                Équipements et matériaux professionnels
              </li>

              <li className="flex gap-3">
                <span className="text-[#d4af37]">✓</span>
                Finitions soignées et durables
              </li>

              <li className="flex gap-3">
                <span className="text-[#d4af37]">✓</span>
                Satisfaction client au centre de notre travail
              </li>
            </ul>

            <a
              href="#contact"
              className="mt-9 inline-flex w-fit rounded-md border border-[#d4af37]/70 px-6 py-3 text-sm font-bold uppercase tracking-wide text-[#d4af37] transition hover:bg-[#d4af37] hover:text-black"
            >
              En savoir plus
            </a>
          </div>

          <div className="relative min-h-[420px]">
            <Image
              src="/images/foto-equipa.jpg"
              alt="Atelier Rigor Fulgor"
              fill
              className="object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-r from-[#0f0f0f] via-transparent to-transparent lg:block" />
          </div>
        </div>

        <div className="grid border-x border-b border-white/10 bg-[#0b0b0b] sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="border-t border-white/10 px-6 py-7 text-center sm:border-r"
            >
              <p className="text-3xl font-black text-white">{stat.value}</p>
              <p className="mt-2 text-sm text-white/50">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}