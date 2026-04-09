const benefits = [
  {
    title: "For Farmers",
    points: [
      "Direct access to buyers",
      "Better pricing for produce",
      "Reduced post-harvest losses",
    ],
  },
  {
    title: "For Buyers",
    points: [
      "Access to verified farmers",
      "Real-time communication",
      "Seasonal crop availability insights",
    ],
  },
];

const HowPlatformHelps = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-green-600 via-white to-green-50 relative overflow-hidden">
      
      {/* subtle animated glow */}
      <div className="absolute inset-0 animate-soft-glow bg-[radial-gradient(circle_at_bottom_right,_#22c55e,_transparent)] opacity-10"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 animate-fade-in-up">
          How the Platform Helps
        </h2>

        <div className="mt-12 grid md:grid-cols-2 gap-10">
          {benefits.map((item, idx) => (
            <div
              key={item.title}
              className="p-6 rounded-2xl bg-white/80 backdrop-blur-md shadow-lg border border-green-100 hover-lift animate-fade-in-up"
              style={{ animationDelay: `${idx * 150}ms` }}
            >
              <h3 className="text-xl md:text-2xl font-semibold text-green-700 mb-3">
                {item.title}
              </h3>
              <ul className="mt-4 space-y-2 text-gray-600 list-disc list-inside">
                {item.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default HowPlatformHelps;