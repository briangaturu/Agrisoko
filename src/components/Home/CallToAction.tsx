import { Link } from "react-router-dom";

const CallToAction = () => {
  return (
    <section className="py-20 bg-green-600 text-white text-center">
      <h2 className="text-3xl font-bold">
        Ready to Trade Smarter?
      </h2>
      <p className="mt-4 text-green-100">
        Join thousands of farmers and buyers transforming agriculture.
      </p>

      <div className="mt-8 flex justify-center gap-4">
        <Link
          to="/register"
          className="px-8 py-3 bg-white text-green-700 font-semibold rounded-md hover:bg-green-100"
        >
          Get Started
        </Link>
        <Link
          to="/marketplace"
          className="px-8 py-3 border border-white rounded-md hover:bg-green-700"
        >
          Browse Produce
        </Link>
      </div>
    </section>
  );
};

export default CallToAction;
