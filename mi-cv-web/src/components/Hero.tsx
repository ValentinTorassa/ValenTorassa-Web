import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, MapPin, ArrowDown } from 'lucide-react';

const Hero = () => {
  const socialLinks = [
    {
      name: 'GitHub',
      url: 'https://github.com/valentin-torassa',
      icon: Github,
      color: 'hover:text-gray-300'
    },
    {
      name: 'LinkedIn',
      url: 'https://linkedin.com/in/valentin-torassa',
      icon: Linkedin,
      color: 'hover:text-cyber-400'
    },
    {
      name: 'Email',
      url: 'mailto:valentin.torassa@example.com',
      icon: Mail,
      color: 'hover:text-primary-400'
    }
  ];

  return (
    <section className="min-h-[88vh] md:min-h-screen relative flex items-center justify-center overflow-hidden pt-12 md:pt-20">

      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-dark-950 via-dark-900 to-dark-800"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 via-cyber-500/10 to-purple-500/10"></div>

      {/* Gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-primary-500/20 to-cyber-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-cyber-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }}></div>

      {/* 🐧 Pingüino decorativo */}
      <motion.div
        className="absolute top-6 left-6 text-3xl"
        initial={{ opacity: 0, rotate: -15 }}
        animate={{ opacity: 1, rotate: 0 }}
        transition={{ delay: 1.2, duration: 0.8 }}
      >
        🐧
      </motion.div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Name */}
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
            <span className="bg-gradient-to-r from-primary-400 via-cyber-400 to-purple-400 bg-clip-text text-transparent">
              Valentín
            </span>
            <br />
            <span className="bg-gradient-to-r from-cyber-400 via-primary-400 to-cyber-400 bg-clip-text text-transparent">
              Torassa
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-cyber-400 to-primary-400 bg-clip-text text-transparent">
              Colombero
            </span>
          </h1>

          {/* Subtitle */}
          <motion.p 
            className="text-lg md:text-xl lg:text-2xl text-gray-300 mb-2 font-mono"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Cybersecurity & Compliance Analyst
          </motion.p>
          
          <motion.p 
            className="text-base md:text-lg text-gray-400 mb-4 font-mono"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <span className="text-primary-400">Linux</span>,{' '}
            <span className="text-cyber-400">Networks</span> &{' '}
            <span className="text-purple-400">Cloud</span> Security Engineer
          </motion.p>


          {/* Location */}
          <motion.div 
            className="flex items-center justify-center gap-2 text-gray-500 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            <MapPin className="w-5 h-5" />
            <span className="text-lg">Rosario, Argentina</span>
          </motion.div>

          {/* Social Links */}
          <motion.div 
            className="flex items-center justify-center gap-4 mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
          >
            {socialLinks.map((link, index) => (
              <motion.a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-4 rounded-xl bg-dark-800/50 border border-dark-700 backdrop-blur-sm transition-all duration-300 ${link.color} hover:bg-dark-800 hover:border-cyber-500/30 hover:scale-110 hover:shadow-2xl hover:shadow-cyber-500/20`}
                whileHover={{ scale: 1.1, y: -5 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 + index * 0.1, duration: 0.5 }}
              >
                <link.icon className="w-6 h-6" />
              </motion.a>
            ))}
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            className="mt-4 flex flex-col items-center justify-center text-gray-500"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.8 }}
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex flex-col items-center gap-2"
            >
              <span className="text-sm">Scroll para explorar</span>
              <ArrowDown className="w-5 h-5" />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
