import { Calendar, MapPin } from 'lucide-react';

const Education = () => {
  const education = [
    {
      id: 1,
      degree: 'Ingeniería en Sistemas',
      institution: 'UAI',
      period: '2022 – 2026',
      location: 'Rosario, Argentina',
      status: 'En curso',
      logo: 'https://automovileshibridosyelectricos.com.ar/wp-content/uploads/2020/01/LOGO-UAI-SIN-SLOGAN-en-GREY_-dark.png',
    },
    {
      id: 2,
      degree: 'Analista en Sistemas',
      institution: 'UAI',
      period: '2022 - dic 2024',
      location: 'Rosario, Argentina',
      status: 'Completado',
      logo: 'https://automovileshibridosyelectricos.com.ar/wp-content/uploads/2020/01/LOGO-UAI-SIN-SLOGAN-en-GREY_-dark.png',
    },
    {
      id: 3,
      degree: 'Técnico Electromecánico',
      institution: 'EETP Nº 292',
      period: '2018 – 2022',
      location: 'Rosario, Argentina',
      status: 'Completado',
      logo: 'https://i.imgur.com/9OEK3o5.png',
    }
  ];

  return (
    <section id="education" className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="section-title text-center">Formación Académica</h2>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Línea del timeline */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-500 to-cyber-500"></div>

            <div className="space-y-8">
              {education.map((item) => (
                <div key={item.id} className="relative flex items-start gap-6">
                  {/* Logo con fondo gris oscuro para mejor contraste */}
                  <div className="flex-shrink-0 relative z-10">
                    <div className="w-20 h-20 bg-dark-300 border border-gray-600 rounded-full flex items-center justify-center shadow-lg overflow-hidden">
                      <img
                        src={item.logo}
                        alt={`${item.institution} logo`}
                        className="w-16 h-16 object-contain"
                      />
                    </div>
                  </div>

                  {/* Contenido */}
                  <div className="flex-1 card card-hover">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1">{item.degree}</h3>
                        <p className="text-cyber-400 font-medium">{item.institution}</p>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{item.period}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{item.location}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`badge ${item.status === 'Completado' ? 'badge-cyber' : 'badge-primary'}`}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default Education;
