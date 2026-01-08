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
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            How It Works
          </h2>
  
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((item) => (
              <div key={item.step} className="p-6 bg-white rounded-xl shadow-sm">
                <div className="w-12 h-12 mx-auto rounded-full bg-green-600 text-white flex items-center justify-center font-bold">
                  {item.step}
                </div>
                <h3 className="mt-4 font-semibold text-lg">{item.title}</h3>
                <p className="mt-2 text-gray-600 text-sm">
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
  