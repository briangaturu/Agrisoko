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
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900">
            Why Choose Our Platform?
          </h2>
  
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="text-center p-6 rounded-xl border hover:shadow-lg transition"
              >
                <div className="text-4xl">{feature.icon}</div>
                <h3 className="mt-4 font-semibold text-lg text-gray-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-gray-600 text-sm">
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
  