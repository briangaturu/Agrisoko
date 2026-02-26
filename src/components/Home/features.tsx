const features = [
  {
    title: "Direct Farmer-to-Buyer Trade",
    description: "Eliminate middlemen and trade directly with verified farmers.",
    icon: "🌾",
  },
  {
    title: "Real-Time Chat",
    description: "Negotiate prices and availability instantly via live chat.",
    icon: "💬",
  },
  {
    title: "Seasonal Crop Insights",
    description: "Know when and where crops are available before you buy.",
    icon: "📊",
  },
  {
    title: "Trusted Listings",
    description: "Verified profiles ensure safe and transparent transactions.",
    icon: "✅",
  },
];

const Features = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-green-50 via-white to-green-50">
      <div className="max-w-7xl mx-auto px-6">

        {/* Section Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900">
          Why Choose Our Platform?
        </h2>

        <p className="mt-3 text-center text-gray-600 max-w-2xl mx-auto">
          Everything you need to trade farm produce securely, quickly, and
          directly — powered by smart technology.
        </p>

        {/* Features Grid */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group text-center p-6 rounded-2xl bg-white border border-green-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
            >
              {/* Icon */}
              <div className="mx-auto w-14 h-14 flex items-center justify-center rounded-full bg-green-100 text-3xl group-hover:bg-green-600 transition">
                <span className="group-hover:scale-110 transition">
                  {feature.icon}
                </span>
              </div>

              {/* Title */}
              <h3 className="mt-5 font-semibold text-lg text-gray-900 group-hover:text-green-700 transition">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="mt-2 text-gray-600 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Features;