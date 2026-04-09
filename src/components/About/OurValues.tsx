const values = [
  { title: "Transparency", icon: "🔍" },
  { title: "Fair Trade", icon: "⚖️" },
  { title: "Innovation", icon: "💡" },
  { title: "Sustainability", icon: "🌱" },
];

const OurValues = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-green-600 via-white to-green-50 relative overflow-hidden">
      
      {/* soft background glow */}
      <div className="absolute inset-0 animate-soft-glow bg-[radial-gradient(circle_at_top_right,_#22c55e,_transparent)] opacity-10"></div>

      <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 animate-fade-in-up">
          Our Core Values
        </h2>

        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          {values.map((value, idx) => (
            <div
              key={value.title}
              className="p-6 bg-white/80 backdrop-blur-md rounded-2xl shadow-lg hover-lift animate-fade-in-up"
              style={{ animationDelay: `${idx * 150}ms` }}
            >
              <div className="text-5xl">{value.icon}</div>
              <p className="mt-4 font-semibold text-green-700">{value.title}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurValues;