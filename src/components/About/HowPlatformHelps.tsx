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
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900">
            How the Platform Helps
          </h2>
  
          <div className="mt-12 grid md:grid-cols-2 gap-10">
            {benefits.map((item) => (
              <div
                key={item.title}
                className="border rounded-xl p-6 shadow-sm"
              >
                <h3 className="text-xl font-semibold text-green-700">
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
  