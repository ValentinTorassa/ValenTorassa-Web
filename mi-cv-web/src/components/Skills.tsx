import { Shield, Cloud, Network, Code } from 'lucide-react';

const Skills = () => {
  const skillCategories = [
    {
      id: 1,
      title: 'Ciberseguridad',
      icon: Shield,
      color: 'from-red-500 to-red-600',
      description: 'Hardening, SIEM, alertas, cumplimiento',
      skills: ['Hardening', 'SIEM', 'Alertas', 'Compliance', 'ISO 27001', 'SOC 2']
    },
    {
      id: 2,
      title: 'Cloud',
      icon: Cloud,
      color: 'from-cyber-500 to-cyber-600',
      description: 'AWS: IAM, VPC, EC2, Config',
      skills: ['AWS IAM', 'VPC', 'EC2', 'Config', 'Cloud Security', 'Infrastructure']
    },
    {
      id: 3,
      title: 'Redes & Linux',
      icon: Network,
      color: 'from-green-500 to-green-600',
      description: 'Huawei, MikroTik, WireGuard, Bash',
      skills: ['Huawei', 'MikroTik', 'WireGuard', 'Bash', 'Linux Admin', 'Networking']
    },
    {
      id: 4,
      title: 'Desarrollo',
      icon: Code,
      color: 'from-primary-500 to-primary-600',
      description: 'C#, ASP.NET Core, PostgreSQL, React, Docker',
      skills: ['C#', 'ASP.NET Core', 'PostgreSQL', 'React', 'Docker', 'TypeScript']
    }
  ];

  return (
    <section id="skills" className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="section-title text-center">
          Habilidades Técnicas
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {skillCategories.map((category) => (
            <div
              key={category.id}
              className="card card-hover text-center"
            >
              <div
                className={`w-16 h-16 bg-gradient-to-br ${category.color} mx-auto mb-4 rounded-xl flex items-center justify-center shadow-lg`}
              >
                <category.icon className="w-8 h-8 text-white" />
              </div>

              <h3 className="text-xl font-bold text-white mb-2">{category.title}</h3>
              <p className="text-gray-400 text-sm mb-4">{category.description}</p>

              <div className="flex flex-wrap gap-2 justify-center">
                {category.skills.map((skill, skillIndex) => (
                  <span 
                    key={skillIndex}
                    className="badge text-xs"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
