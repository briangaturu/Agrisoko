const values = [
    { title: "Transparency", icon: "🔍" },
    { title: "Fair Trade", icon: "⚖️" },
    { title: "Innovation", icon: "💡" },
    { title: "Sustainability", icon: "🌱" },
  ];
  
  const OurValues = () => {
    return (
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Our Core Values
          </h2>
  
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8">
            {values.map((value) => (
              <div
                key={value.title}
                className="p-6 bg-white rounded-xl shadow-sm"
              >
                <div className="text-4xl">{value.icon}</div>
                <p className="mt-4 font-semibold">{value.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };
  
  export default OurValues;
  