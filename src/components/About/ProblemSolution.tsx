const ProblemSolution = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-green-600 via-white to-green-50 relative overflow-hidden">
      
      {/* subtle background glow */}
      <div className="absolute inset-0 animate-soft-glow bg-[radial-gradient(circle_at_top_left,_#22c55e,_transparent)] opacity-10"></div>

      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 relative z-10">
        
        {/* Problem */}
        <div className="p-8 rounded-2xl bg-white/80 backdrop-blur-md shadow-lg border border-red-100 hover-lift animate-fade-in-up">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            The{" "}
            <span className="bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
              Problem
            </span>
          </h2>
          <p className="mt-4 text-gray-600 leading-relaxed">
            Many farmers depend on middlemen who offer low prices, while buyers
            lack access to reliable information on crop availability, pricing,
            and trusted producers.
          </p>
        </div>

        {/* Solution */}
        <div className="p-8 rounded-2xl bg-white/80 backdrop-blur-md shadow-lg border border-green-100 hover-lift animate-fade-in-up delay-150">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Our{" "}
            <span className="text-gradient">
              Solution
            </span>
          </h2>
          <p className="mt-4 text-gray-600 leading-relaxed">
            Our platform connects farmers and buyers directly through a digital
            marketplace with real-time chat and crop availability insights,
            ensuring transparency and fair trade.
          </p>
        </div>

      </div>
    </section>
  );
};

export default ProblemSolution;