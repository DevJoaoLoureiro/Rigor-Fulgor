import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#050505]">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-12 md:flex-row md:items-center md:justify-between lg:px-8">
        <div>
          <a
            href="#accueil"
            aria-label="Rigor Fulgor — Accueil"
            className="relative block h-12 w-[200px]"
          >
            <Image
              src="/images/logo.jpg"
              alt="Rigor Fulgor"
              fill
              sizes="200px"
              className="object-contain object-left"
            />
          </a>

          <p className="mt-3 text-sm text-white/50">
            Jantes · Chromage · Sellerie automobile
          </p>
        </div>

        <nav className="flex flex-wrap gap-6 text-sm text-white/60">
          <a
            href="#accueil"
            className="transition hover:text-[#d4af37]"
          >
            Accueil
          </a>

          <a
            href="#services"
            className="transition hover:text-[#d4af37]"
          >
            Services
          </a>

          <a
            href="#realisations"
            className="transition hover:text-[#d4af37]"
          >
            Réalisations
          </a>

          <a
            href="#contact"
            className="transition hover:text-[#d4af37]"
          >
            Contact
          </a>
        </nav>

        <p className="text-sm text-white/40">
          © {new Date().getFullYear()} Rigor Fulgor
        </p>
      </div>
    </footer>
  );
}