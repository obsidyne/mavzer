import Navbar         from './components/Navbar';
import HeroSection    from './components/HeroSection';
import AboutSection   from './components/AboutSection';
import ContactSection from './components/ContactSection';
import Products from './components/Products';
import ClientsSection from './components/ClientsSection';
import Footer from './components/Footer';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <Products/>
        <ClientsSection/>
        <ContactSection />
        <Footer/>
      </main>
    </>
  );
}