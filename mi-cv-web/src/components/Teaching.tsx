import { GraduationCap } from 'lucide-react';

const Teaching = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="section-title text-center">
          Docencia
        </h2>

        <div className="max-w-4xl mx-auto">
          <div className="card card-hover">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                  <GraduationCap className="w-8 h-8 text-white" />
                </div>
              </div>

              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-2">Ayudante de Cátedra</h3>
                <p className="text-cyber-400 font-medium mb-3">Sistemas Operativos – UAI</p>

                <p className="text-gray-300 leading-relaxed mb-4">
                  Acompaño a estudiantes en la comprensión práctica de los sistemas operativos, 
                  explorando desde conceptos básicos hasta planificación de procesos y manejo de recursos. 
                  También colaboré anteriormente en Arquitectura de Computadoras II.
                </p>

                <div className="flex flex-wrap gap-3">
                  <span className="badge badge-primary">Docencia</span>
                  <span className="badge badge-cyber">Sistemas Operativos</span>
                  <span className="badge badge-primary">Arquitectura de Computadoras</span>
                  <span className="badge badge-cyber">UAI</span>
                  <span className="badge badge-primary">Enseñanza</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Teaching;
