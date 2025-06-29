import { Shield, Building2, Calendar, MapPin, Code } from 'lucide-react';

const Experience = () => {
  const experiences = [
    {
      id: 1,
      company: 'Teramot',
      position: 'Cybersecurity & Compliance Analyst',
      period: 'jun. 2025 – Actualidad',
      location: 'Rosario, Argentina',
      icon: Shield,
      color: 'from-primary-500 to-primary-600',
      description: 'Startup argentina de inteligencia artificial. Responsable de estructurar el área de ciberseguridad, proteger datos sensibles corporativos, garantizar el cumplimiento de normativas ISO/SOC y fortalecer la seguridad en entornos AWS.',
      technologies: ['ISO/IEC 27001', 'SOC 2', 'AWS Security', 'Data Protection', 'Compliance'],
      logo: 'https://i.imgur.com/zwCL4Rl.png'
    },
    {
      id: 2,
      company: 'Consulting IT',
      position: 'Analista de Ciberseguridad',
      period: 'sept. 2024 – jul. 2025',
      location: 'Rosario, Argentina',
      icon: Building2,
      color: 'from-cyber-500 to-cyber-600',
      description: 'Diseño de entornos seguros, hardening, SOC (Sophos), y redes híbridas.',
      technologies: ['Sophos', 'Hardening', 'SOC', 'Hybrid Networks', 'Security Design'],
      logo: 'https://i.imgur.com/NxNRmzV.jpeg'
    },
    {
      id: 3,
      company: 'FVM Systems',
      position: 'Cofundador y Developer .NET',
      period: 'jul. 2024 – Actualidad',
      location: 'Rosario, Argentina',
      icon: Code,
      color: 'from-purple-500 to-purple-600',
      description: 'Desarrollo de soluciones empresariales en .NET, aplicando conocimientos en programación y arquitectura de software. Creando una solución de trazabilidad para empresas, enfocada en mejorar la eficiencia de sus sistemas de producción.',
      technologies: ['.NET', 'C#', 'Architecture', 'Trazabilidad', 'Software Factory'],
      logo: 'https://i.imgur.com/asp8i1F.png'
    }
  ];

  return (
    <section id="experience" className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="section-title text-center">
          Experiencia Profesional
        </h2>

        <div className="max-w-6xl mx-auto space-y-8">
          {experiences.map((exp) => (
            <div key={exp.id} className="card card-hover">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Logo y empresa */}
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 bg-gradient-to-br from-dark-800 to-dark-700 rounded-xl flex items-center justify-center shadow-lg border border-dark-600">
                    <img 
                      src={exp.logo} 
                      alt={`${exp.company} logo`}
                      className="w-16 h-16 object-contain"
                      loading="lazy"
                    />
                  </div>
                </div>

                {/* Contenido */}
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">{exp.company}</h3>
                      <p className="text-cyber-400 font-medium">{exp.position}</p>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{exp.period}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{exp.location}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-300 mb-4 leading-relaxed">
                    {exp.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {exp.technologies.map((tech, techIndex) => (
                      <span 
                        key={techIndex}
                        className="badge badge-cyber"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
