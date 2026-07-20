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
  return (
    <section id="realisations" className="bg-black py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#d4af37]">
              Nos réalisations
            </p>

            <h2 className="mt-4 text-4xl font-black text-white sm:text-5xl">
              Un résultat qui parle de lui-même
            </h2>
          </div>

          <p className="max-w-xl leading-7 text-white/60">
            Découvrez une sélection de nos travaux de réparation, de chromage
            et de restauration automobile.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {galleryItems.map((item) => (
            <article
              key={item.title}
              className="group relative min-h-[430px] overflow-hidden rounded-xl bg-[#141414] bg-cover bg-center"
              style={{
                backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.95), rgba(0,0,0,0.1)), url('${item.image}')`,
              }}
            >
              <div className="absolute inset-0 transition duration-500 group-hover:scale-105" />

              <div className="absolute bottom-0 left-0 w-full p-7">
                <p className="text-sm font-bold uppercase tracking-wider text-[#d4af37]">
                  {item.category}
                </p>

                <h3 className="mt-2 text-2xl font-black text-white">
                  {item.title}
                </h3>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}