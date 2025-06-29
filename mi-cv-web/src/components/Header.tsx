import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, Youtube, Link } from 'lucide-react';

const Header = () => {
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
    },
    {
      name: 'YouTube',
      url: 'https://www.youtube.com/@valentin-torassa',
      icon: Youtube,
      color: 'hover:text-red-500'
    },
    {
      name: 'Bento',
      url: 'https://bento.me/valentintorassa',
      icon: Link,
      color: 'hover:text-green-400'
    }
  ];

  return (
    <motion.header 
      className="fixed top-0 left-0 right-0 z-50 bg-dark-950/90 backdrop-blur-md border-b border-dark-800/50"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 2 }}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <motion.div 
            className="flex items-center gap-3"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <div className="w-8 h-8 bg-dark-700 rounded-full flex items-center justify-center shadow-md">
              <span className="text-white text-sm">🐧</span>
            </div>
            <div>
              <h2 className="text-lg font-bold gradient-text">Valentín Torassa Colombero</h2>
              <p className="text-xs text-gray-400">Cybersecurity Analyst</p>
            </div>
          </motion.div>

          <nav className="hidden md:flex items-center gap-6">
            <a href="#experience" className="text-gray-300 hover:text-cyber-400 transition-colors">Experiencia</a>
            <a href="#education" className="text-gray-300 hover:text-cyber-400 transition-colors">Formación</a>
            <a href="#skills" className="text-gray-300 hover:text-cyber-400 transition-colors">Habilidades</a>
            <a href="#research" className="text-gray-300 hover:text-cyber-400 transition-colors">Investigación</a>
          </nav>

          <div className="flex items-center gap-2">
            {socialLinks.map((link, index) => (
              <motion.a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-2 rounded-lg bg-dark-800/50 border border-dark-700 transition-all duration-300 ${link.color} hover:bg-dark-800 hover:border-cyber-500/30 hover:scale-110`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.2 + index * 0.1, duration: 0.5 }}
              >
                <link.icon className="w-4 h-4" />
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
