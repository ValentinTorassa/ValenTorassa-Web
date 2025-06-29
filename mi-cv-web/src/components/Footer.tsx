import { Github, Heart, Download, Youtube, Link } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="py-16 border-t border-dark-800">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <p className="text-gray-400 text-lg leading-relaxed">
            Me apasiona la tecnología y quiero dejar una pequeña contribución a este mundo digital.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-6 mb-8">
            <a
              href="https://github.com/ValentinTorassa"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-dark-800/50 border border-dark-700 rounded-lg hover:bg-dark-800 hover:border-cyber-500/30 transition-all duration-300"
            >
              <Github className="w-5 h-5" />
              <span>Ver en GitHub</span>
            </a>

            <a
              href="https://drive.google.com/file/d/1qb8bo1bCCYx-ca85gqXBeV7wN5Sn5wBI/view?usp=drive_link"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-cyber-500 rounded-lg hover:from-primary-600 hover:to-cyber-600 transition-all duration-300"
            >
              <Download className="w-5 h-5" />
              <span>Descargar CV PDF</span>
            </a>

            <a
              href="https://www.youtube.com/@vtcodingbyte"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-red-700/80 border border-red-600 rounded-lg hover:bg-red-800 hover:border-red-400 transition-all duration-300"
            >
              <Youtube className="w-5 h-5" />
              <span>Canal de YouTube</span>
            </a>

            <a
              href="https://bento.me/valentintorassa"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-green-700/80 border border-green-600 rounded-lg hover:bg-green-800 hover:border-green-400 transition-all duration-300"
            >
              <Link className="w-5 h-5" />
              <span>Mi Bento</span>
            </a>
          </div>

          <div className="flex items-center justify-center gap-2 text-gray-500">
            <span>Hecho con</span>
            <Heart className="w-4 h-4 text-red-500 animate-pulse" />
            <span>en Rosario, Argentina</span>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            © 2025 Valentín Torassa Colombero. Todos los derechos reservados.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
