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
    <section id="zones" className="bg-[#080808] py-24">
      <div className="mx-auto grid max-w-7xl gap-14 px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#d4af37]">
            Zones d’intervention
          </p>

          <h2 className="mt-4 text-4xl font-black text-white sm:text-5xl">
            Nous intervenons dans plusieurs régions de France
          </h2>

          <p className="mt-6 max-w-xl text-lg leading-8 text-white/60">
            Contactez-nous afin de confirmer les disponibilités et les
            conditions de collecte ou de livraison dans votre région.
          </p>

          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {cities.map((city) => (
              <div
                key={city}
                className="rounded-md border border-white/10 bg-white/[0.03] px-4 py-4 text-center font-semibold text-white/80"
              >
                {city}
              </div>
            ))}
          </div>
        </div>
            

            <div className="relative h-[550px] w-full overflow-hidden rounded-2xl border border-white/10 bg-black">
  <Image
    src="/images/france-map.png"
    alt="Carte des zones d’intervention en France"
    fill
    className="object-cover object-center scale-100"
  />
</div>
        
      </div>
    </section>
  );
}