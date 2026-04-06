import './index.css';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import IntroSection from './components/IntroSection';
import HowItWorksSection from './components/HowItWorksSection';
import FeaturesSection from './components/FeaturesSection';
import CtaSection from './components/CtaSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';

function App() {
  return (
    <>
      {/* Grain overlay */}
      <div className="grain-overlay" />

      <Navbar />
      <HeroSection />
      <IntroSection />
      <HowItWorksSection />
      <FeaturesSection />
      <CtaSection />
      <ContactSection />
      <Footer />
    </>
  );
}

export default App;
