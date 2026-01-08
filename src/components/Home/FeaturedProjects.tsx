const produce = [
    { name: "Tomatoes", price: "KES 80 / kg", location: "Kirinyaga" },
    { name: "Avocados", price: "KES 150 / kg", location: "Murang’a" },
    { name: "Maize", price: "KES 3,500 / bag", location: "Uasin Gishu" },
  ];
  
  const FeaturedProduce = () => {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center">
            Featured Produce
          </h2>
  
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            {produce.map((item) => (
              <div
                key={item.name}
                className="border rounded-xl p-6 hover:shadow-lg transition"
              >
                <h3 className="font-semibold text-lg">{item.name}</h3>
                <p className="mt-2 text-gray-600">{item.location}</p>
                <p className="mt-4 font-bold text-green-600">{item.price}</p>
                <button className="mt-4 w-full py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };
  
  export default FeaturedProduce;
  