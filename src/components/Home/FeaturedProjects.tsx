const produce = [
  { name: "Tomatoes", price: "KES 80 / kg", location: "Kirinyaga" },
  { name: "Avocados", price: "KES 150 / kg", location: "Murang’a" },
  { name: "Maize", price: "KES 3,500 / bag", location: "Uasin Gishu" },
];

const FeaturedProduce = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-green-50 via-white to-green-50">
      <div className="max-w-7xl mx-auto px-6">

        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-extrabold text-center text-gray-900">
          🌿 Featured Produce
        </h2>

        <p className="mt-3 text-center text-gray-600 max-w-xl mx-auto">
          Discover fresh farm produce directly from trusted farmers.
        </p>

        {/* Produce Grid */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8">
          {produce.map((item) => (
            <div
              key={item.name}
              className="group relative bg-white/80 backdrop-blur-md
                         border border-green-100 rounded-2xl p-6
                         shadow-sm hover:shadow-xl
                         hover:-translate-y-2 transition-all duration-300"
            >
              {/* Decorative Glow */}
              <div className="absolute inset-0 rounded-2xl bg-green-100 opacity-0 group-hover:opacity-30 blur-xl transition"></div>

              {/* Content */}
              <div className="relative z-10 text-center">

                {/* Name */}
                <h3 className="font-bold text-xl text-gray-900">
                  {item.name}
                </h3>

                {/* Location */}
                <p className="mt-2 text-sm text-gray-500">
                  📍 {item.location}
                </p>

                {/* Price */}
                <p className="mt-4 font-bold text-green-600 text-lg">
                  {item.price}
                </p>

                {/* Button */}
                <button
                  className="mt-6 w-full py-2.5 rounded-md
                             bg-green-600 text-white font-semibold
                             hover:bg-green-700
                             shadow-md hover:shadow-lg
                             transition"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default FeaturedProduce;