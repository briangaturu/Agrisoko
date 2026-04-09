const MissionVision = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-green-600 via-white to-green-50 relative overflow-hidden">
      
      {/* subtle background glow */}
      <div className="absolute inset-0 animate-soft-glow bg-[radial-gradient(circle_at_bottom_left,_#22c55e,_transparent)] opacity-10"></div>

      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 relative z-10">
        
        {/* Mission */}
        <div className="p-8 rounded-2xl bg-white/80 backdrop-blur-md shadow-lg border border-green-100 hover-lift animate-fade-in-up">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Our{" "}
            <span className="text-gradient">
              Mission
            </span>
          </h2>
          <p className="mt-4 text-gray-600 leading-relaxed">
            To empower farmers by providing a digital marketplace that enables
            fair pricing, direct communication, and access to reliable market
            information.
          </p>
        </div>

        {/* Vision */}
        <div className="p-8 rounded-2xl bg-white/80 backdrop-blur-md shadow-lg border border-green-100 hover-lift animate-fade-in-up delay-150">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Our{" "}
            <span className="text-gradient">
              Vision
            </span>
          </h2>
          <p className="mt-4 text-gray-600 leading-relaxed">
            To become the leading digital agriculture platform that transforms
            how agricultural products are traded across regions.
          </p>
        </div>

      </div>
    </section>
  );
};

export default MissionVision;