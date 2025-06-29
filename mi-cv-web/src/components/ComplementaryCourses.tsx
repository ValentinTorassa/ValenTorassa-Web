const courses = [
    {
      title: "Sophos Firewall Certified Engineer",
      institution: "Sophos",
      date: "dic. 2024",
      emoji: "🛡️"
    },
    {
      title: "HUAWEI HCIA Datacom – Preparación",
      institution: "Udemy",
      date: "mar. 2025",
      emoji: "🌐"
    },
    {
      title: "Cyber Security 101",
      institution: "TryHackMe",
      date: "sept. 2024",
      emoji: "🧪"
    },
    {
      title: "Introducción a la Ciberseguridad",
      institution: "EducaciónIT",
      date: "jul. 2024",
      emoji: "🔐"
    },
    {
      title: "Introducción a Redes",
      institution: "EducaciónIT",
      date: "ene. 2025",
      emoji: "🛰️"
    },
    {
      title: "Introducción a Linux",
      institution: "EducaciónIT",
      date: "jul. 2024",
      emoji: "🐧"
    },
    {
      title: "Full Stack Python",
      institution: "Codo a Codo",
      date: "dic. 2023",
      emoji: "🐍"
    },
    {
      title: "Desarrollo Web con Node.js",
      institution: "Codo a Codo",
      date: "may. 2024",
      emoji: "⚙️"
    },
    {
      title: "Data Communication and Network Tech",
      institution: "Huawei",
      date: "sept. 2024",
      emoji: "📡"
    }
  ];
  
  const ComplementaryCourses = () => {
    return (
      <section className="py-16 border-t border-dark-800 bg-dark-950" id="complementary">
        <div className="container mx-auto px-4">
          <h2 className="section-title text-center">Cursos y Formaciones</h2>
  
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
            {courses.map((course, index) => (
              <div
                key={index}
                className="bg-dark-900 border border-dark-700 rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{course.emoji}</span>
                  <h3 className="text-white text-lg font-semibold leading-snug">{course.title}</h3>
                </div>
                <p className="text-cyber-400 text-sm">{course.institution}</p>
                <p className="text-gray-500 text-xs mt-1">{course.date}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };
  
  export default ComplementaryCourses;
  