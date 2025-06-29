import { CheckCircle, FileText, MessageSquare, BookOpen, Search, Zap } from 'lucide-react';

const PersonalSkills = () => {
  const skills = [
    {
      id: 1,
      name: 'Proactividad',
      description: 'Iniciativa y capacidad de anticipación',
      icon: Zap,
      color: 'from-primary-500 to-primary-600'
    },
    {
      id: 2,
      name: 'Documentación técnica',
      description: 'Habilidad para crear documentación clara y detallada',
      icon: FileText,
      color: 'from-cyber-500 to-cyber-600'
    },
    {
      id: 3,
      name: 'Comunicación',
      description: 'Comunicación efectiva con equipos y stakeholders',
      icon: MessageSquare,
      color: 'from-green-500 to-green-600'
    },
    {
      id: 4,
      name: 'Aprendizaje continuo',
      description: 'Compromiso con el desarrollo profesional constante',
      icon: BookOpen,
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 5,
      name: 'Investigación',
      description: 'Capacidad de investigación y resolución de problemas',
      icon: Search,
      color: 'from-red-500 to-red-600'
    }
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="section-title text-center">
          Aptitudes Personales
        </h2>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skills.map((skill) => (
              <div key={skill.id} className="card card-hover text-center">
                <div className={`w-16 h-16 bg-gradient-to-br ${skill.color} mx-auto mb-4 rounded-full flex items-center justify-center shadow-lg`}>
                  <skill.icon className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-lg font-bold text-white mb-2">{skill.name}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {skill.description}
                </p>

                <div className="mt-4 flex justify-center">
                  <CheckCircle className="w-5 h-5 text-cyber-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PersonalSkills;
