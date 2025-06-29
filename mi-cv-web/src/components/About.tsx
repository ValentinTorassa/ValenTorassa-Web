import { motion } from 'framer-motion';
import { Shield, Target, Zap } from 'lucide-react';

const About = () => {
  const highlights = [
    {
      icon: Shield,
      title: 'Protección',
      description: 'Entornos críticos seguros'
    },
    {
      icon: Target,
      title: 'Cumplimiento',
      description: 'ISO/IEC 27001, SOC 2'
    },
    {
      icon: Zap,
      title: 'Innovación',
      description: 'Automatización de defensas'
    }
  ];

  return (
    <motion.section 
      id="about"
      className="py-20 relative overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-dark-900/50 via-dark-800/30 to-dark-900/50"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Main content */}
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="section-title text-4xl md:text-5xl mb-8">
              Construyendo el futuro digital de forma segura
            </h2>
            
            <div className="max-w-4xl mx-auto">
              <p className="text-xl md:text-2xl text-gray-300 leading-relaxed mb-8">
                Profesional en ciberseguridad y sistemas con experiencia en la protección de entornos críticos, 
                tanto locales como en la nube. Especializado en Linux, AWS, cumplimiento normativo 
                y automatización de defensas.
              </p>
              
              <p className="text-lg text-gray-400 leading-relaxed">
                Con formación técnica sólida y orientación a la mejora continua, 
                mi objetivo es crear soluciones que protejan no solo sistemas, sino personas y sus datos 
                en un mundo cada vez más conectado.
              </p>
            </div>
          </motion.div>

          {/* Highlights grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {highlights.map((item, index) => (
              <motion.div
                key={item.title}
                className="card card-hover text-center"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                whileHover={{ y: -10, scale: 1.02 }}
              >
                <motion.div 
                  className="w-16 h-16 bg-gradient-to-br from-primary-500 to-cyber-500 mx-auto mb-6 rounded-xl flex items-center justify-center shadow-lg"
                  whileHover={{ rotate: 5, scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                >
                  <item.icon className="w-8 h-8 text-white" />
                </motion.div>

                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-gray-400">{item.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Skills badges */}
          <motion.div 
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <h3 className="text-2xl font-bold text-white mb-8">Especialidades</h3>
            <div className="flex flex-wrap justify-center gap-3">
              <span className="badge badge-primary">Ciberseguridad</span>
              <span className="badge badge-cyber">AWS</span>
              <span className="badge badge-primary">Linux</span>
              <span className="badge badge-cyber">Compliance</span>
              <span className="badge badge-primary">Networking</span>
              <span className="badge badge-cyber">Automation</span>
              <span className="badge badge-primary">.NET</span>
              <span className="badge badge-cyber">React</span>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default About; 