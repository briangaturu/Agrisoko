const CropInsightsPreview = () => {
    return (
      <section className="py-20 bg-green-50">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              Seasonal Crop Insights
            </h2>
            <p className="mt-4 text-gray-600">
              Understand when crops are in season, where they grow best,
              and plan your purchases or harvests better.
            </p>
            <button className="mt-6 px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700">
              View Insights
            </button>
          </div>
  
          <div className="bg-white p-6 rounded-xl shadow">
            📈 Interactive charts coming soon
          </div>
        </div>
      </section>
    );
  };
  
  export default CropInsightsPreview;
  