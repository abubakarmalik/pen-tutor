export default function BlogSection() {
  const services = [
    {
      id: 1,
      title: "Junior Section",
      description: "Certify your English proficiency by taking IELTS, TOEFL, O1 Aptitude, PTE, IET-TOEFL tests through Pre Tuto. You can take any of these tests and make your profile highly professional.",
      bgColor: "bg-amber-50",
      imageRight: false,
      image: "/b-3.png"
    },
    {
      id: 2,
      title: "SAT Preparation",
      description: "Certify your English proficiency by taking IELTS, TOEFL, O1 Aptitude, PTE, IET-TOEFL tests through Pre Tuto. You can take any of these tests and make your profile highly professional.",
      bgColor: "bg-white",
      imageRight: true,
      image: "/b-2.png"
    },
    {
      id: 3,
      title: "IELTS Preparation",
      description: "Certify your English proficiency by taking IELTS, TOEFL, O1 Aptitude, PTE, IET-TOEFL tests through Pre Tuto. You can take any of these tests and make your profile highly professional.",
      bgColor: "bg-blue-50",
      imageRight: false,
      image: "/b-1.png"
    }
  ];

  return (
    <section className="w-full py-8 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto space-y-0">
        {services.map((service) => (
          <div key={service.id} className="grid grid-cols-1 lg:grid-cols-2">
            {/* Content - shows first if imageRight is true */}
            <div className={`${service.bgColor} p-12 flex flex-col justify-center ${service.imageRight ? 'lg:order-1' : 'lg:order-2'}`}>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                {service.title}
              </h3>
              <p className="text-gray-700 text-lg leading-relaxed">
                {service.description}
              </p>
            </div>
            
            {/* Image - shows second if imageRight is true */}
            <div className={`bg-gray-200 h-80 flex items-center justify-center overflow-hidden ${service.imageRight ? 'lg:order-2' : 'lg:order-1'}`}>
              <img 
                src={service.image} 
                alt={service.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}