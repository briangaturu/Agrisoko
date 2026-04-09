// src/components/About/AboutHero.tsx
import { motion } from "framer-motion";

const AboutHero = () => {
  return (
    <section className="bg-gradient-to-r from-green-600 via-emerald-500 to-emerald-600 text-white py-5 relative overflow-hidden">

      {/* Soft animated glows */}
      <div className="absolute -top-10 -left-10 w-72 h-72 bg-white/10 rounded-full animate-pulseSlow"></div>
      <div className="absolute -bottom-16 -right-16 w-96 h-96 bg-white/5 rounded-full animate-pulseSlow"></div>

      <div className="max-w-7xl mx-auto px-6 text-center relative z-10">

        {/* Animated heading */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl font-extrabold leading-tight drop-shadow-lg"
          style={{ textShadow: "1px 1px 4px rgba(0,0,0,0.3)" }}
        >
          About Our{" "}
          <span className="text-green-200 animate-fade-in-up">
            E-Agriculture
          </span>{" "}
          Marketplace
        </motion.h1>

        {/* Animated paragraph */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mt-6 text-lg max-w-3xl mx-auto leading-relaxed text-white/90 drop-shadow-sm"
          style={{ textShadow: "0.5px 0.5px 2px rgba(0,0,0,0.25)" }}
        >
          We are building a{" "}
          <span className="font-semibold text-green-200">
            digital bridge
          </span>{" "}
          between farmers and buyers by promoting{" "}
          <span className="font-semibold text-green-200">
            direct trade
          </span>
          , transparency, and informed agricultural decision-making.
        </motion.p>

        {/* Optional call-to-action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-10 flex justify-center gap-4"
        >
          <a
            href="#values"
            className="px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition shadow-lg"
          >
            Our Values
          </a>
          <a
            href="#marketplace"
            className="px-6 py-3 border border-green-600 text-green-200 rounded-xl font-semibold hover:bg-green-50/20 transition shadow-sm"
          >
            Explore Marketplace
          </a>
        </motion.div>

      </div>
    </section>
  );
};

export default AboutHero;