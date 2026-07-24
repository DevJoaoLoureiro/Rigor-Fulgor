"use client";

import Image from "next/image";
import {
  ChangeEvent,
  DragEvent,
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";

const MAX_FILES = 5;
const MAX_FILE_SIZE = 5 * 1024 * 1024;

type Status = {
  type: "success" | "error";
  message: string;
} | null;

type SelectedImage = {
  id: string;
  file: File;
  preview: string;
};

const services = [
  { value: "Jantes", label: "Rénovation de jantes" },
  { value: "Chromage", label: "Chromage de pièces" },
  { value: "Sellerie", label: "Sellerie automobile" },
];

function formatFileSize(bytes: number) {
  return `${(bytes / 1024 / 1024).toFixed(2)} Mo`;
}

function createImageId(file: File) {
  return `${file.name}-${file.size}-${file.lastModified}`;
}

export default function Contact() {
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedImages, setSelectedImages] = useState<SelectedImage[]>([]);
  const [status, setStatus] = useState<Status>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      selectedImages.forEach((image) => {
        URL.revokeObjectURL(image.preview);
      });
    };
  }, [selectedImages]);

  const validateAndAddFiles = (incomingFiles: File[]) => {
    setStatus(null);

    const imageFiles = incomingFiles.filter((file) =>
      file.type.startsWith("image/")
    );

    if (imageFiles.length !== incomingFiles.length) {
      setStatus({
        type: "error",
        message: "Seules les images sont autorisées.",
      });
      return;
    }

    const oversizedFile = imageFiles.find(
      (file) => file.size > MAX_FILE_SIZE
    );

    if (oversizedFile) {
      setStatus({
        type: "error",
        message: `La photo « ${oversizedFile.name} » dépasse la limite de 5 Mo.`,
      });
      return;
    }

    const currentIds = new Set(selectedImages.map((image) => image.id));

    const uniqueFiles = imageFiles.filter(
      (file) => !currentIds.has(createImageId(file))
    );

    if (selectedImages.length + uniqueFiles.length > MAX_FILES) {
      setStatus({
        type: "error",
        message: `Vous pouvez envoyer un maximum de ${MAX_FILES} photos.`,
      });
      return;
    }

    const newImages = uniqueFiles.map((file) => ({
      id: createImageId(file),
      file,
      preview: URL.createObjectURL(file),
    }));

    setSelectedImages((current) => [...current, ...newImages]);
  };

  const handleFilesChange = (event: ChangeEvent<HTMLInputElement>) => {
    validateAndAddFiles(Array.from(event.target.files ?? []));
    event.target.value = "";
  };

  const handleDragEnter = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (event.currentTarget.contains(event.relatedTarget as Node)) {
      return;
    }

    setIsDragging(false);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);

    validateAndAddFiles(Array.from(event.dataTransfer.files));
  };

  const removeImage = (id: string) => {
    setSelectedImages((current) => {
      const imageToRemove = current.find((image) => image.id === id);

      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.preview);
      }

      return current.filter((image) => image.id !== id);
    });
  };

  const clearImages = () => {
    selectedImages.forEach((image) => {
      URL.revokeObjectURL(image.preview);
    });

    setSelectedImages([]);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setStatus(null);

    const form = event.currentTarget;
    const formData = new FormData(form);

    // Remove possíveis ficheiros do input e adiciona os ficheiros controlados.
    formData.delete("photos");

    selectedImages.forEach(({ file }) => {
      formData.append("photos", file);
    });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Une erreur est survenue lors de l’envoi."
        );
      }

      setStatus({
        type: "success",
        message:
          "Votre demande a bien été envoyée. Nous vous répondrons rapidement.",
      });

      form.reset();
      clearImages();
    } catch (error) {
      console.error(error);

      setStatus({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Une erreur est survenue. Veuillez réessayer.",
      });
    } finally {
      setLoading(false);
    }
  };

  const inputClassName = `
    w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3.5
    text-white placeholder:text-white/30 outline-none transition-all
    hover:border-white/20
    focus:border-[#d4af37] focus:ring-4 focus:ring-[#d4af37]/10
    disabled:cursor-not-allowed disabled:opacity-50
  `;

  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-black py-16 sm:py-20 lg:py-28"
    >
      {/* Efeito de fundo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-20 h-[500px] w-[500px] rounded-full bg-[#d4af37]/[0.06] blur-[140px]"
      />

      <div className="relative mx-auto grid max-w-7xl items-start gap-14 px-5 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 lg:px-8">
        {/* Coluna de informações */}
        <div className="lg:sticky lg:top-28">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-[#d4af37]" />

            <p className="text-xs font-bold uppercase tracking-[0.32em] text-[#d4af37] sm:text-sm">
              Demande de devis
            </p>
          </div>

          <h2 className="mt-5 max-w-lg text-4xl font-black leading-[1.05] text-white sm:text-5xl lg:text-6xl">
            Parlez-nous de votre projet
          </h2>

          <p className="mt-6 max-w-xl text-base leading-7 text-white/55 sm:text-lg sm:leading-8">
            Envoyez-nous les informations nécessaires ainsi que quelques
            photos. Nous vous répondrons avec une estimation adaptée à votre
            demande.
          </p>

          <div className="mt-10 divide-y divide-white/10 border-y border-white/10">
            <ContactItem
              icon={<PhoneIcon />}
              label="Téléphone"
              value="+33 629521327"
              href="tel:629521327"
            />

            <ContactItem
              icon={<MailIcon />}
              label="E-mail"
              value="contact@rigorfulgor.fr"
              href="mailto:contact@rigorfulgor.fr"
            />

            <ContactItem
              icon={<InstagramIcon />}
              label="Instagram"
              value="@rigorfulgor"
              href="https://www.instagram.com/rigorfulgor/"
            />

            <ContactItem
              icon={<ClockIcon />}
              label="Délai de réponse"
              value="Sous 24 à 48 heures"
            />
          </div>

          <div className="mt-8 rounded-2xl border border-[#d4af37]/20 bg-[#d4af37]/[0.05] p-5">
            <div className="flex gap-4">
              <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#d4af37] text-black">
                <CameraIcon />
              </div>

              <div>
                <p className="font-bold text-white">
                  Ajoutez des photos détaillées
                </p>

                <p className="mt-1 text-sm leading-6 text-white/50">
                  Photographiez les dommages sous plusieurs angles afin de
                  recevoir une estimation plus précise.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Formulário */}
        <form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          className="relative rounded-3xl border border-white/10 bg-gradient-to-b from-[#141414] to-[#0b0b0b] p-5 shadow-[0_30px_100px_rgba(0,0,0,0.55)] sm:p-8 lg:p-10"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-[#d4af37]/60 to-transparent"
          />

          <FormSectionHeader
            number="01"
            title="Vos coordonnées"
            description="Les informations nécessaires pour vous contacter."
          />

          <div className="mt-7 grid gap-5 sm:grid-cols-2">
            <FormField label="Nom complet" htmlFor="name" required>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-white/30">
                  <UserIcon />
                </div>

                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  disabled={loading}
                  className={`${inputClassName} pl-11`}
                  placeholder="Votre nom"
                />
              </div>
            </FormField>

            <FormField label="Téléphone" htmlFor="phone" required>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-white/30">
                  <PhoneIcon />
                </div>

                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  required
                  disabled={loading}
                  className={`${inputClassName} pl-11`}
                  placeholder="+33 6 00 00 00 00"
                />
              </div>
            </FormField>
          </div>

          <div className="mt-5">
            <FormField label="E-mail" htmlFor="email" required>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-white/30">
                  <MailIcon />
                </div>

                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  disabled={loading}
                  className={`${inputClassName} pl-11`}
                  placeholder="votre@email.fr"
                />
              </div>
            </FormField>
          </div>

          <div className="my-9 h-px bg-white/10" />

          <FormSectionHeader
            number="02"
            title="Votre projet"
            description="Indiquez le service souhaité et votre localisation."
          />

          <div className="mt-7 grid gap-5 sm:grid-cols-2">
            <FormField
              label="Ville ou localisation"
              htmlFor="city"
              required
            >
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-white/30">
                  <LocationIcon />
                </div>

                <input
                  id="city"
                  name="city"
                  type="text"
                  autoComplete="address-level2"
                  required
                  disabled={loading}
                  className={`${inputClassName} pl-11`}
                  placeholder="Paris, Bordeaux..."
                />
              </div>
            </FormField>

            <FormField label="Service souhaité" htmlFor="service" required>
              <div className="relative">
                <select
                  id="service"
                  name="service"
                  required
                  disabled={loading}
                  defaultValue=""
                  className={`${inputClassName} appearance-none pr-12`}
                >
                  <option value="" disabled>
                    Sélectionnez un service
                  </option>

                  {services.map((service) => (
                    <option key={service.value} value={service.value}>
                      {service.label}
                    </option>
                  ))}
                </select>

                <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-white/40">
                  <ChevronDownIcon />
                </div>
              </div>
            </FormField>
          </div>

          <div className="mt-5">
            <FormField label="Votre demande" htmlFor="message" required>
              <textarea
                id="message"
                name="message"
                rows={5}
                required
                disabled={loading}
                className={`${inputClassName} min-h-36 resize-y`}
                placeholder="Décrivez le travail souhaité, les dommages observés, le modèle du véhicule..."
              />
            </FormField>
          </div>

          <div className="my-9 h-px bg-white/10" />

          <FormSectionHeader
            number="03"
            title="Photos"
            description={`Ajoutez jusqu’à ${MAX_FILES} photos pour une estimation plus précise.`}
          />

          <div className="mt-7">
            <input
              ref={inputRef}
              id="photos"
              name="photos"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
              multiple
              disabled={loading || selectedImages.length >= MAX_FILES}
              onChange={handleFilesChange}
              className="sr-only"
            />

            <div
              role="button"
              tabIndex={0}
              onClick={() => inputRef.current?.click()}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  inputRef.current?.click();
                }
              }}
              onDragEnter={handleDragEnter}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`
                group relative flex min-h-52 cursor-pointer flex-col items-center
                justify-center overflow-hidden rounded-2xl border-2 border-dashed
                px-6 py-10 text-center outline-none transition-all
                ${
                  isDragging
                    ? "border-[#d4af37] bg-[#d4af37]/10"
                    : "border-white/15 bg-black/25 hover:border-[#d4af37]/70 hover:bg-[#d4af37]/[0.04]"
                }
                focus-visible:border-[#d4af37]
                focus-visible:ring-4 focus-visible:ring-[#d4af37]/10
              `}
            >
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.08),transparent_65%)] opacity-0 transition-opacity group-hover:opacity-100"
              />

              <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-[#d4af37]/30 bg-[#d4af37]/10 text-[#d4af37] transition-transform group-hover:-translate-y-1">
                <UploadIcon />
              </div>

              <p className="relative mt-5 font-bold text-white">
                {isDragging
                  ? "Déposez vos photos ici"
                  : "Glissez-déposez vos photos"}
              </p>

              <p className="relative mt-1 text-sm text-white/45">
                ou cliquez pour sélectionner des fichiers
              </p>

              <div className="relative mt-5 flex flex-wrap justify-center gap-2 text-xs text-white/35">
                <span className="rounded-full border border-white/10 px-3 py-1">
                  JPG
                </span>

                <span className="rounded-full border border-white/10 px-3 py-1">
                  PNG
                </span>

                <span className="rounded-full border border-white/10 px-3 py-1">
                  WEBP
                </span>

                <span className="rounded-full border border-white/10 px-3 py-1">
                  5 Mo maximum
                </span>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between gap-4 text-xs">
              <p className="text-white/35">
                {selectedImages.length}/{MAX_FILES} photos sélectionnées
              </p>

              {selectedImages.length > 0 && (
                <button
                  type="button"
                  onClick={clearImages}
                  disabled={loading}
                  className="font-semibold text-white/45 transition hover:text-[#d4af37]"
                >
                  Tout supprimer
                </button>
              )}
            </div>

            {selectedImages.length > 0 && (
              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {selectedImages.map((image) => (
                  <div
                    key={image.id}
                    className="group relative aspect-square overflow-hidden rounded-xl border border-white/10 bg-black"
                  >
                    <Image
                      src={image.preview}
                      alt={image.file.name}
                      fill
                      unoptimized
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />

                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/70 to-transparent px-3 pb-3 pt-10">
                      <p className="truncate text-xs font-semibold text-white">
                        {image.file.name}
                      </p>

                      <p className="mt-0.5 text-[11px] text-white/50">
                        {formatFileSize(image.file.size)}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeImage(image.id)}
                      disabled={loading}
                      aria-label={`Supprimer ${image.file.name}`}
                      className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-black/80 text-white/70 backdrop-blur transition hover:border-red-400/50 hover:bg-red-500 hover:text-white"
                    >
                      <CloseIcon />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <label className="mt-8 flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 bg-black/25 p-4 text-sm text-white/50 transition hover:border-white/20">
            <input
              name="consent"
              type="checkbox"
              required
              disabled={loading}
              className="peer sr-only"
            />

            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border border-white/20 bg-black text-transparent transition peer-checked:border-[#d4af37] peer-checked:bg-[#d4af37] peer-checked:text-black peer-focus-visible:ring-4 peer-focus-visible:ring-[#d4af37]/20">
              <CheckIcon />
            </span>

            <span>
              J’accepte que mes informations soient utilisées pour répondre à
              ma demande. <span className="text-[#d4af37]">*</span>
            </span>
          </label>

          {status && (
            <div
              role="alert"
              className={`
                mt-6 flex items-start gap-3 rounded-xl border p-4 text-sm
                ${
                  status.type === "success"
                    ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-200"
                    : "border-red-500/25 bg-red-500/10 text-red-200"
                }
              `}
            >
              <div className="mt-0.5 shrink-0">
                {status.type === "success" ? (
                  <SuccessIcon />
                ) : (
                  <WarningIcon />
                )}
              </div>

              <p>{status.message}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="
              group relative mt-7 flex w-full items-center justify-center
              overflow-hidden rounded-xl bg-[#d4af37] px-6 py-4
              font-black uppercase tracking-wide text-black
              shadow-[0_12px_35px_rgba(212,175,55,0.18)]
              transition-all duration-300
              hover:-translate-y-0.5 hover:bg-[#e5c657]
              hover:shadow-[0_18px_45px_rgba(212,175,55,0.28)]
              active:translate-y-0
              disabled:cursor-not-allowed disabled:opacity-60
            "
          >
            <span className="relative flex items-center gap-3">
              {loading ? (
                <>
                  <LoadingIcon />
                  Envoi en cours...
                </>
              ) : (
                <>
                  Envoyer ma demande
                  <ArrowIcon />
                </>
              )}
            </span>
          </button>

          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-white/30">
            <LockIcon />
            <span>Vos informations restent confidentielles.</span>
          </div>
        </form>
      </div>
    </section>
  );
}

type FormFieldProps = {
  label: string;
  htmlFor: string;
  required?: boolean;
  children: React.ReactNode;
};

function FormField({
  label,
  htmlFor,
  required = false,
  children,
}: FormFieldProps) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-2.5 block text-sm font-semibold text-white/80"
      >
        {label}

        {required && <span className="ml-1 text-[#d4af37]">*</span>}
      </label>

      {children}
    </div>
  );
}

type FormSectionHeaderProps = {
  number: string;
  title: string;
  description: string;
};

function FormSectionHeader({
  number,
  title,
  description,
}: FormSectionHeaderProps) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#d4af37]/30 bg-[#d4af37]/10 text-xs font-black text-[#d4af37]">
        {number}
      </div>

      <div>
        <h3 className="text-xl font-black text-white">{title}</h3>

        <p className="mt-1 text-sm leading-6 text-white/40">{description}</p>
      </div>
    </div>
  );
}

type ContactItemProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
};

function ContactItem({ icon, label, value, href }: ContactItemProps) {
  const content = (
    <div className="group flex items-center gap-4 py-5">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-[#d4af37] transition group-hover:border-[#d4af37]/30 group-hover:bg-[#d4af37]/10">
        {icon}
      </div>

      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/35">
          {label}
        </p>

        <p className="mt-1 font-semibold text-white/80 transition group-hover:text-white">
          {value}
        </p>
      </div>
    </div>
  );

  if (!href) {
    return content;
  }

  return (
    <a href={href} className="block">
      {content}
    </a>
  );
}

/* Ícones SVG — não requer nenhuma biblioteca externa */

function UserIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4.5 21a7.5 7.5 0 0 1 15 0" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.69 2.8a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.28-1.28a2 2 0 0 1 2.11-.45c.9.33 1.84.56 2.8.69A2 2 0 0 1 22 16.92Z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function CameraIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path d="M14.5 5 13 3h-2L9.5 5H5a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-4.5Z" />
      <circle cx="12" cy="12.5" r="4" />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg
      width="25"
      height="25"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path d="M12 16V4" />
      <path d="m7 9 5-5 5 5" />
      <path d="M20 15v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-4" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      aria-hidden="true"
    >
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
      className="transition-transform group-hover:translate-x-1"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <rect x="5" y="10" width="14" height="11" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

function SuccessIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12 2.5 2.5L16 9" />
    </svg>
  );
}

function WarningIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M10.3 3.7 2.6 17a2 2 0 0 0 1.7 3h15.4a2 2 0 0 0 1.7-3L13.7 3.7a2 2 0 0 0-3.4 0Z" />
      <path d="M12 9v4M12 17h.01" />
    </svg>
  );
}

function LoadingIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="animate-spin"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="3"
        opacity="0.25"
      />

      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}