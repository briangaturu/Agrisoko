const steps = [
  {
    step: "1",
    title: "Create an Account",
    description: "Sign up as a farmer or buyer in minutes.",
  },
  {
    step: "2",
    title: "Post or Browse Produce",
    description: "Farmers list crops, buyers explore available produce.",
  },
  {
    step: "3",
    title: "Chat & Trade",
    description: "Communicate directly and agree on price and delivery.",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-green-50 via-white to-green-50">
      <div className="max-w-7xl mx-auto px-6 text-center">

        {/* Section Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
          How It Works
        </h2>

        <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
          Start trading farm produce in three simple steps — fast, secure,
          and transparent.
        </p>

        {/* Steps */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((item) => (
            <div
              key={item.step}
              className="group p-8 bg-white rounded-2xl border border-green-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
            >
              {/* Step Number */}
              <div className="mx-auto w-14 h-14 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold text-xl group-hover:bg-green-600 group-hover:text-white transition">
                {item.step}
              </div>

              {/* Title */}
              <h3 className="mt-5 font-semibold text-lg text-gray-900 group-hover:text-green-700 transition">
                {item.title}
              </h3>

              {/* Description */}
              <p className="mt-3 text-gray-600 text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default HowItWorks;