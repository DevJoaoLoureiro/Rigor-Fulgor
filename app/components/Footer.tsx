export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#050505]">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-12 md:flex-row md:items-center md:justify-between lg:px-8">
        <div>
          <p className="text-xl font-black uppercase tracking-wider text-[#d4af37]">
            Rigor Fulgor
          </p>

          <p className="mt-2 text-sm text-white/50">
            Jantes · Chromage · Sellerie automobile
          </p>
        </div>

        <nav className="flex flex-wrap gap-6 text-sm text-white/60">
          <a href="#accueil" className="hover:text-[#d4af37]">
            Accueil
          </a>

          <a href="#services" className="hover:text-[#d4af37]">
            Services
          </a>

          <a href="#realisations" className="hover:text-[#d4af37]">
            Réalisations
          </a>

          <a href="#contact" className="hover:text-[#d4af37]">
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