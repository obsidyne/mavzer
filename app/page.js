import Navbar         from './components/Navbar';
import HeroSection    from './components/HeroSection';
import AboutSection   from './components/AboutSection';
import ContactSection from './components/ContactSection';
import Products from './components/Products';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <Products/>
        <ContactSection />
      </main>
    </>
  );
}