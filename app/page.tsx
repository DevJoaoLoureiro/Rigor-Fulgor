import Contact from "../app/components/Contact";
import Footer from "../app/components/Footer";
import FranceMap from "../app/components/FranceMap";
import Gallery from "../app/components/Gallery";
import Hero from "../app/components/Hero";
import Navbar from "../app/components/Navbar";
import Services from "../app/components/Services";
import About from "../app/components/About";
import WheelVisualizer from "../app/components/WheelVisualizer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Réparation de jantes, chromage et sellerie automobile | Rigor & Fulgor",
  description:
    "Spécialiste de la réparation de jantes, du chromage et de la sellerie automobile. Demandez votre devis en ligne.",
  keywords: [
    "réparation jantes",
    "chromage automobile",
    "sellerie automobile",
    "rénovation jantes",
    "réparation jantes aluminium",
  ],
};

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Services />
        <About />
        <Gallery />
        <FranceMap />
        <WheelVisualizer />
        <Contact />
      </main>
      <Footer />
    </>
  );
}