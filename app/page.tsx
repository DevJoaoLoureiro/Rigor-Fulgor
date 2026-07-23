import Contact from "../app/components/Contact";
import Footer from "../app/components/Footer";
import FranceMap from "../app/components/FranceMap";
import Gallery from "../app/components/Gallery";
import Hero from "../app/components/Hero";
import Navbar from "../app/components/Navbar";
import Services from "../app/components/Services";
import About from "../app/components/About";
import WheelVisualizer from "../app/components/WheelVisualizer";

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