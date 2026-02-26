import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-white to-green-50 border-t border-green-100">
      <div className="max-w-7xl mx-auto px-6 py-16">

        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand */}
          <div>
            <h2 className="text-2xl font-bold text-green-700 flex items-center gap-2">
              🌱 AgriSoko
            </h2>
            <p className="mt-4 text-gray-600 text-sm leading-relaxed">
              Connecting farmers and buyers directly through a secure,
              transparent, and modern digital marketplace.
            </p>

            {/* Social Icons */}
            <div className="flex gap-4 mt-6">
              <a href="#" className="w-9 h-9 flex items-center justify-center rounded-full bg-green-100 text-green-700 hover:bg-green-600 hover:text-white transition">
                <FaFacebookF />
              </a>
              <a href="#" className="w-9 h-9 flex items-center justify-center rounded-full bg-green-100 text-green-700 hover:bg-green-600 hover:text-white transition">
                <FaTwitter />
              </a>
              <a href="#" className="w-9 h-9 flex items-center justify-center rounded-full bg-green-100 text-green-700 hover:bg-green-600 hover:text-white transition">
                <FaInstagram />
              </a>
              <a href="#" className="w-9 h-9 flex items-center justify-center rounded-full bg-green-100 text-green-700 hover:bg-green-600 hover:text-white transition">
                <FaLinkedinIn />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li><Link to="/" className="hover:text-green-600 transition">Home</Link></li>
              <li><Link to="/marketplace" className="hover:text-green-600 transition">Marketplace</Link></li>
              <li><Link to="/insights" className="hover:text-green-600 transition">Crop Insights</Link></li>
              <li><Link to="/about" className="hover:text-green-600 transition">About Us</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Support</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li><Link to="/contact" className="hover:text-green-600 transition">Contact</Link></li>
              <li><Link to="/faq" className="hover:text-green-600 transition">FAQs</Link></li>
              <li><Link to="/privacy" className="hover:text-green-600 transition">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-green-600 transition">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Stay Updated</h3>
            <p className="text-sm text-gray-600 mb-4">
              Subscribe to receive market updates and crop insights.
            </p>

            <div className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 rounded-l-md border border-green-200 focus:outline-none focus:ring-2 focus:ring-green-400 text-sm"
              />
              <button className="px-4 py-2 bg-green-600 text-white rounded-r-md hover:bg-green-700 transition text-sm font-semibold">
                Subscribe
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-6 border-t border-green-100 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} AgriSoko. All rights reserved.
        </div>

      </div>
    </footer>
  );
};

export default Footer;