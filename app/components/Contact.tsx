export default function Contact() {
  return (
    <section id="contact" className="bg-black py-24">
      <div className="mx-auto grid max-w-7xl gap-14 px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#d4af37]">
            Demande de devis
          </p>

          <h2 className="mt-4 text-4xl font-black text-white sm:text-5xl">
            Parlez-nous de votre projet
          </h2>

          <p className="mt-6 max-w-xl text-lg leading-8 text-white/60">
            Envoyez-nous les informations nécessaires ainsi que des photos.
            Nous vous répondrons avec une estimation adaptée à votre demande.
          </p>

          <div className="mt-10 space-y-5 text-white/80">
            <p>
              <strong className="text-[#d4af37]">Téléphone :</strong>{" "}
              À ajouter
            </p>

            <p>
              <strong className="text-[#d4af37]">E-mail :</strong>{" "}
              À ajouter
            </p>

            <p>
              <strong className="text-[#d4af37]">Instagram :</strong>{" "}
              À ajouter
            </p>
          </div>
        </div>

        <form className="rounded-xl border border-white/10 bg-[#101010] p-7 sm:p-9">
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-semibold text-white"
              >
                Nom complet
              </label>

              <input
                id="name"
                name="name"
                type="text"
                required
                className="w-full rounded-md border border-white/15 bg-black px-4 py-3 text-white outline-none transition focus:border-[#d4af37]"
                placeholder="Votre nom"
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="mb-2 block text-sm font-semibold text-white"
              >
                Téléphone
              </label>

              <input
                id="phone"
                name="phone"
                type="tel"
                required
                className="w-full rounded-md border border-white/15 bg-black px-4 py-3 text-white outline-none transition focus:border-[#d4af37]"
                placeholder="+33..."
              />
            </div>
          </div>

          <div className="mt-6">
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-semibold text-white"
            >
              E-mail
            </label>

            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full rounded-md border border-white/15 bg-black px-4 py-3 text-white outline-none transition focus:border-[#d4af37]"
              placeholder="votre@email.fr"
            />
          </div>

          <div className="mt-6">
            <label
              htmlFor="city"
              className="mb-2 block text-sm font-semibold text-white"
            >
              Ville ou localisation
            </label>

            <input
              id="city"
              name="city"
              type="text"
              required
              className="w-full rounded-md border border-white/15 bg-black px-4 py-3 text-white outline-none transition focus:border-[#d4af37]"
              placeholder="Paris, Bordeaux..."
            />
          </div>

          <div className="mt-6">
            <label
              htmlFor="service"
              className="mb-2 block text-sm font-semibold text-white"
            >
              Service souhaité
            </label>

            <select
              id="service"
              name="service"
              required
              className="w-full rounded-md border border-white/15 bg-black px-4 py-3 text-white outline-none transition focus:border-[#d4af37]"
            >
              <option value="">Sélectionnez un service</option>
              <option value="jantes">Jantes</option>
              <option value="chromage">Chromage</option>
              <option value="sellerie">Sellerie</option>
            </select>
          </div>

          <div className="mt-6">
            <label
              htmlFor="photos"
              className="mb-2 block text-sm font-semibold text-white"
            >
              Photos
            </label>

            <input
              id="photos"
              name="photos"
              type="file"
              accept="image/*"
              multiple
              className="w-full rounded-md border border-dashed border-white/20 bg-black px-4 py-5 text-sm text-white/60 file:mr-4 file:rounded-md file:border-0 file:bg-[#d4af37] file:px-4 file:py-2 file:font-bold file:text-black"
            />
          </div>

          <div className="mt-6">
            <label
              htmlFor="message"
              className="mb-2 block text-sm font-semibold text-white"
            >
              Votre demande
            </label>

            <textarea
              id="message"
              name="message"
              rows={5}
              required
              className="w-full resize-none rounded-md border border-white/15 bg-black px-4 py-3 text-white outline-none transition focus:border-[#d4af37]"
              placeholder="Décrivez le travail souhaité..."
            />
          </div>

          <label className="mt-6 flex items-start gap-3 text-sm text-white/60">
            <input
              type="checkbox"
              required
              className="mt-1 accent-[#d4af37]"
            />
            J’accepte que mes informations soient utilisées pour répondre à ma
            demande.
          </label>

          <button
            type="submit"
            className="mt-7 w-full rounded-md bg-[#d4af37] px-6 py-4 font-black text-black transition hover:bg-[#e8c75a]"
          >
            Envoyer ma demande
          </button>
        </form>
      </div>
    </section>
  );
}