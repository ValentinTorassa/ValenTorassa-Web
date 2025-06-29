import { motion } from 'framer-motion';
import Header from './components/Header';
import Hero from './components/Hero';
import Experience from './components/Experience';
import Education from './components/Education';
import Certifications from './components/Certifications';
import Skills from './components/Skills';
import Teaching from './components/Teaching';
import Research from './components/Research';
import TechnologyBadges from './components/TechnologyBadges';
import PersonalSkills from './components/PersonalSkills';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-dark-950">
      {/* Background pattern */}
      <div className="fixed inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-cyber-500/10 to-primary-500/10"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <Header />
        <Hero />
        
        <main>
          <Experience />
          <Education />
          <Certifications />
          <Skills />
          <Teaching />
          <Research />
          <TechnologyBadges />
          <PersonalSkills />
        </main>

        <Footer />
      </div>

      {/* Scroll to top button */}
      <motion.button
        className="fixed bottom-8 right-8 z-50 w-12 h-12 bg-gradient-to-r from-primary-500 to-cyber-500 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 3, duration: 0.5 }}
        whileHover={{ scale: 1.1, y: -2 }}
        whileTap={{ scale: 0.9 }}
      >
        <svg className="w-6 h-6 text-white mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </motion.button>
    </div>
  );
}

export default App;
