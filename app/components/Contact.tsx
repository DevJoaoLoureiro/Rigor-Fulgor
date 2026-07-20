"use client";

import { useState } from "react";

const MAX_FILES = 5;
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export default function Contact() {
  const [loading, setLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFilesChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(event.target.files ?? []);

    if (files.length > MAX_FILES) {
      alert("Vous pouvez envoyer un maximum de 5 photos.");
      event.target.value = "";
      setSelectedFiles([]);
      return;
    }

    const invalidType = files.find(
      (file) => !file.type.startsWith("image/")
    );

    if (invalidType) {
      alert("Seules les images sont autorisées.");
      event.target.value = "";
      setSelectedFiles([]);
      return;
    }

    const oversizedFile = files.find(
      (file) => file.size > MAX_FILE_SIZE
    );

    if (oversizedFile) {
      alert(
        `La photo "${oversizedFile.name}" dépasse la limite de 5 Mo.`
      );
      event.target.value = "";
      setSelectedFiles([]);
      return;
    }

    setSelectedFiles(files);
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setLoading(true);

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Erreur lors de l’envoi."
        );
      }

      alert("Votre demande a été envoyée avec succès !");
      form.reset();
      setSelectedFiles([]);
    } catch (error) {
      console.error(error);

      const message =
        error instanceof Error
          ? error.message
          : "Une erreur est survenue.";

      alert(message);
    } finally {
      setLoading(false);
    }
  };

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
            Envoyez-nous les informations nécessaires ainsi que des
            photos. Nous vous répondrons avec une estimation adaptée à
            votre demande.
          </p>

          <div className="mt-10 space-y-5 text-white/80">
            <p>
              <strong className="text-[#d4af37]">
                Téléphone :
              </strong>{" "}
              À ajouter
            </p>

            <p>
              <strong className="text-[#d4af37]">
                E-mail :
              </strong>{" "}
              À ajouter
            </p>

            <p>
              <strong className="text-[#d4af37]">
                Instagram :
              </strong>{" "}
              À ajouter
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          className="rounded-xl border border-white/10 bg-[#101010] p-7 sm:p-9"
        >
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
                disabled={loading}
                className="w-full rounded-md border border-white/15 bg-black px-4 py-3 text-white outline-none transition focus:border-[#d4af37] disabled:cursor-not-allowed disabled:opacity-60"
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
                disabled={loading}
                className="w-full rounded-md border border-white/15 bg-black px-4 py-3 text-white outline-none transition focus:border-[#d4af37] disabled:cursor-not-allowed disabled:opacity-60"
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
              disabled={loading}
              className="w-full rounded-md border border-white/15 bg-black px-4 py-3 text-white outline-none transition focus:border-[#d4af37] disabled:cursor-not-allowed disabled:opacity-60"
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
              disabled={loading}
              className="w-full rounded-md border border-white/15 bg-black px-4 py-3 text-white outline-none transition focus:border-[#d4af37] disabled:cursor-not-allowed disabled:opacity-60"
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
              disabled={loading}
              className="w-full rounded-md border border-white/15 bg-black px-4 py-3 text-white outline-none transition focus:border-[#d4af37] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <option value="">
                Sélectionnez un service
              </option>
              <option value="Jantes">Jantes</option>
              <option value="Chromage">Chromage</option>
              <option value="Sellerie">Sellerie</option>
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
              accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
              multiple
              disabled={loading}
              onChange={handleFilesChange}
              className="w-full rounded-md border border-dashed border-white/20 bg-black px-4 py-5 text-sm text-white/60 file:mr-4 file:rounded-md file:border-0 file:bg-[#d4af37] file:px-4 file:py-2 file:font-bold file:text-black disabled:cursor-not-allowed disabled:opacity-60"
            />

            <p className="mt-2 text-xs text-white/40">
              Maximum 5 photos, 5 Mo par photo.
            </p>

            {selectedFiles.length > 0 && (
              <div className="mt-4 rounded-md border border-white/10 bg-black/50 p-4">
                <p className="text-sm font-semibold text-white">
                  Photos sélectionnées :
                </p>

                <ul className="mt-2 space-y-1 text-sm text-white/60">
                  {selectedFiles.map((file) => (
                    <li key={`${file.name}-${file.size}`}>
                      {file.name} —{" "}
                      {(file.size / 1024 / 1024).toFixed(2)} Mo
                    </li>
                  ))}
                </ul>
              </div>
            )}
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
              disabled={loading}
              className="w-full resize-none rounded-md border border-white/15 bg-black px-4 py-3 text-white outline-none transition focus:border-[#d4af37] disabled:cursor-not-allowed disabled:opacity-60"
              placeholder="Décrivez le travail souhaité..."
            />
          </div>

          <label className="mt-6 flex items-start gap-3 text-sm text-white/60">
            <input
              name="consent"
              type="checkbox"
              required
              disabled={loading}
              className="mt-1 accent-[#d4af37]"
            />

            <span>
              J’accepte que mes informations soient utilisées pour
              répondre à ma demande.
            </span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="mt-7 w-full rounded-md bg-[#d4af37] px-6 py-4 font-black text-black transition hover:bg-[#e8c75a] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? "Envoi en cours..."
              : "Envoyer ma demande"}
          </button>
        </form>
      </div>
    </section>
  );
}