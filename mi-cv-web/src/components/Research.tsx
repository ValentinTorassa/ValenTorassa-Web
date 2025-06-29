import { BookOpen, Award, Calendar, ExternalLink } from 'lucide-react';

const Research = () => {
  const research = [
    {
      id: 1,
      title: 'Dockerización de Servidores SCADA: Ciberseguridad Industrial',
      event: 'WICC 2024',
      date: 'abr. 2025',
      institution: 'Universidad Nacional de Cuyo',
      description: 'Investigación sobre la aplicación de contenedores Docker en entornos SCADA para mejorar la seguridad industrial.',
      highlight: 'Certificado autor WICC',
      link: '#'
    },
    {
      id: 2,
      title: 'Análisis y Desarrollo de Herramientas de Reverse Shell para Pruebas de Penetración',
      event: 'CACIC 2024',
      date: 'oct. 2024',
      institution: '30° Congreso Argentino de Ciencias de la Computación',
      description: 'Presentación sobre herramientas de reverse shell y su aplicación en pruebas de penetración.',
      highlight: 'Mejor expositor - Seguridad Informática',
      link: '#'
    },
    {
      id: 3,
      title: 'Botnets: Estado del Arte y Taxonomía de una Amenaza Sigilosa',
      event: 'JAIIO 53',
      date: 'ago. 2024',
      institution: 'Jornadas Argentinas de Informática',
      description: 'Análisis completo del estado actual de las botnets y su taxonomía en el contexto de ciberseguridad.',
      highlight: 'Expositor destacado - SACS',
      link: '#'
    },
    {
      id: 4,
      title: 'Monolitos vs Microservicios en Arquitectura de Software',
      event: 'JAIIO 53',
      date: 'jul. 2024',
      institution: 'Jornadas Argentinas de Informática',
      description: 'Comparativa y análisis de arquitecturas monolíticas vs microservicios para desarrollo eficiente.',
      highlight: 'Presentación académica',
      link: '#'
    },
    {
      id: 5,
      title: 'Seguridad en Redes WiFi: Estrategias de Detección y Expulsión de Intrusos',
      event: 'WICC 2024',
      date: 'abr. 2024',
      institution: 'Workshop de Investigadores en Ciencias de la Computación',
      description: 'Estrategias y técnicas para detectar y expulsar intrusos en redes WiFi corporativas.',
      highlight: 'Certificado de participación',
      link: '#'
    }
  ];

  return (
    <section id="research" className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="section-title text-center">
          Investigaciones
        </h2>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {research.map((item) => (
              <div
                key={item.id}
                className="card card-hover"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-cyber-500 to-primary-500 rounded-lg flex items-center justify-center shadow-lg">
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <h3 className="text-lg font-bold text-white leading-tight">{item.title}</h3>
                      {item.link && (
                        <a 
                          href={item.link}
                          className="flex-shrink-0 p-1 text-gray-400 hover:text-cyber-400 transition-colors"
                          title="Ver más"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                      <div className="flex items-center gap-1">
                        <Award className="w-4 h-4" />
                        <span>{item.event}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{item.date}</span>
                      </div>
                    </div>

                    <p className="text-gray-300 text-sm mb-3 leading-relaxed">
                      {item.description}
                    </p>

                    <div className="flex items-center gap-2">
                      <span className="badge badge-primary text-xs">{item.institution}</span>
                      <span className="badge badge-cyber text-xs">{item.highlight}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Research;
