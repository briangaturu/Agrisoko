import { Link } from "react-router-dom";

const CallToAction = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-green-600 via-white to-green-100 relative overflow-hidden text-center">
      <h2 className="text-3xl md:text-4xl font-bold text-green-700">
        Ready to Trade Smarter?
      </h2>
      <p className="mt-4 text-green-800 max-w-xl mx-auto">
        Join thousands of farmers and buyers transforming agriculture.
      </p>

      <div className="mt-8 flex justify-center gap-4 flex-wrap">
        <Link
          to="/register"
          className="px-8 py-3 bg-green-700 text-white font-semibold rounded-md hover:bg-green-800 transition"
        >
          Get Started
        </Link>
        <Link
          to="/marketplace"
          className="px-8 py-3 border border-green-700 text-green-700 rounded-md hover:bg-green-700 hover:text-white transition"
        >
          Browse Produce
        </Link>
      </div>
    </section>
  );
};

export default CallToAction;