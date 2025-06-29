const Certifications = () => {
  const certifications = [
    {
      id: 1,
      name: 'HCIA Datacom',
      issuer: 'Huawei Talents',
      year: '2024',
      status: 'Completado',
      logo: 'https://www.centex-sarawak.my/wp-content/uploads/2023/02/logo-hcia.png',
      description: 'Certificación en redes de datos Huawei'
    },
    {
      id: 2,
      name: 'Formación avanzada en AWS',
      issuer: 'AWS',
      year: '2024',
      status: 'En curso',
      logo: 'https://miro.medium.com/v2/resize:fit:512/0*P7dmdm5OCZaMEPOG',
      description: 'Especialización en servicios cloud de Amazon Web Services'
    },
    {
      id: 3,
      name: 'CISSP',
      issuer: 'ISC²',
      year: '2024',
      status: 'En preparación',
      logo: 'https://images.squarespace-cdn.com/content/v1/511d6cd9e4b04b471a7bdd63/1548690014962-U1OBGUPJTPBHPBTA33EF/certified-information-systems-security-professional-cissp.png',
      description: 'Certified Information Systems Security Professional'
    },
    {
      id: 4,
      name: 'FCE – Cambridge English',
      issuer: 'Cambridge',
      year: '2024',
      status: 'En preparación',
      logo: 'https://theenglishexamcentre.com/wp-content/uploads/2024/12/preparacion-first-FCE-madrid.png',
      description: 'First Certificate in English'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completado':
        return '✔';
      case 'En curso':
        return '📘';
      case 'En preparación':
        return '⏳';
      default:
        return '⏳';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completado':
        return 'badge-cyber';
      case 'En curso':
        return 'badge-primary';
      case 'En preparación':
        return 'badge';
      default:
        return 'badge';
    }
  };

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="section-title text-center">Certificaciones y Cursos</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {certifications.map((cert) => (
            <div key={cert.id} className="card card-hover">
              <div className="flex items-start gap-4">
                {/* Logo sin marco ni fondo */}
                <div className="flex-shrink-0">
                  <img
                    src={cert.logo}
                    alt={`${cert.issuer} logo`}
                    className="w-14 h-14 object-contain"
                  />
                </div>

                {/* Contenido */}
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-white">{cert.name}</h3>
                      <p className="text-cyber-400 text-sm">{cert.issuer}</p>
                    </div>
                    <span className="text-gray-400 text-sm">{cert.year}</span>
                  </div>

                  <p className="text-gray-300 text-sm mb-3 leading-relaxed">
                    {cert.description}
                  </p>

                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 text-base">{getStatusIcon(cert.status)}</span>
                    <span className={`badge ${getStatusColor(cert.status)}`}>
                      {cert.status}
                    </span>
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

export default Certifications;
