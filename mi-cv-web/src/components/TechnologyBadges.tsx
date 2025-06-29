const TechnologyBadges = () => {
  const technologies = [
    { name: 'Linux', color: 'FCC624', logo: 'linux' },
    { name: 'AWS', color: 'FF9900', logo: 'amazonaws' },
    { name: 'Python', color: '3776AB', logo: 'python' },
    { name: 'C sharp', color: '239120', logo: 'csharp' },
    { name: '.NET', color: '512BD4', logo: 'dotnet' },
    { name: 'PostgreSQL', color: '316192', logo: 'postgresql' },
    { name: 'SQL Server', color: 'CC2927', logo: 'microsoftsqlserver' },
    { name: 'React', color: '61DAFB', logo: 'react' },
    { name: 'TypeScript', color: '3178C6', logo: 'typescript' },
    { name: 'Docker', color: '2496ED', logo: 'docker' },
    { name: 'WireGuard', color: '88171A', logo: 'wireguard' },
    { name: 'MikroTik', color: '000000', logo: 'mikrotik' },
    { name: 'Bash', color: '4EAA25', logo: 'gnubash' }
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="section-title text-center">
          Tecnologías
        </h2>

        <div className="max-w-6xl mx-auto">
          <div className="card">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {technologies.map((tech) => (
                <div
                  key={tech.name}
                  className="flex flex-col items-center gap-2 p-4 rounded-lg bg-dark-800/30 border border-dark-700 hover:border-cyber-500/30 transition-all duration-300"
                >
                  <img
                    src={`https://img.shields.io/badge/${tech.name}-${tech.color}?style=for-the-badge&logo=${tech.logo}&logoColor=white`}
                    alt={`${tech.name} badge`}
                    className="h-8 w-auto"
                    loading="lazy"
                  />
                  <span className="text-xs text-gray-400 font-medium text-center">
                    {tech.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechnologyBadges;
