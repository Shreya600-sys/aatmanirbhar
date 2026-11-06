import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import BrandLogo from "../../../components/BrandLogo";
import { SITE } from "../../../config/site";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-16 border-t border-gray-800 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
        
        {/* col1: Brand & Mission */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <BrandLogo nameClassName="text-xl font-bold text-white tracking-tight" />
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">
            A home business enablement portal that helps women entrepreneurs reach local customers.
            {" "}{SITE.tagline}
          </p>
          <div className="flex gap-5 pt-2">
            <a href="#" aria-label="Facebook" className="text-gray-400 hover:text-blue-500 transition-colors"><Facebook size={20} /></a>
            <a href="#" aria-label="Twitter" className="text-gray-400 hover:text-blue-400 transition-colors"><Twitter size={20} /></a>
            <a href="#" aria-label="Instagram" className="text-gray-400 hover:text-pink-500 transition-colors"><Instagram size={20} /></a>
            <a href="#" aria-label="LinkedIn" className="text-gray-400 hover:text-blue-600 transition-colors"><Linkedin size={20} /></a>
          </div>
        </div>

        {/* Col 2: Quick Links */}
        <div>
          <h3 className="text-white font-semibold text-lg mb-6">Platform</h3>
          <ul className="space-y-3 text-sm">
            <li><Link to="/" className="hover:text-blue-400 transition-colors">Home</Link></li>
            <li><Link to="/services" className="hover:text-blue-400 transition-colors">Find Services</Link></li>
            <li><Link to="/auth/register" className="hover:text-blue-400 transition-colors">Start Your Business</Link></li>
            <li><Link to="/auth/login" className="hover:text-blue-400 transition-colors">Entrepreneur Login</Link></li>
          </ul>
        </div>

        {/* Col 3: Support */}
        <div>
          <h3 className="text-white font-semibold text-lg mb-6">Support</h3>
          <ul className="space-y-3 text-sm">
            <li><a href="#" className="hover:text-blue-400 transition-colors">Help Center</a></li>
            <li><a href="#" className="hover:text-blue-400 transition-colors">Trust & Safety</a></li>
            <li><a href="#" className="hover:text-blue-400 transition-colors">Terms of Service</a></li>
            <li><a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a></li>
          </ul>
        </div>

        {/* Col 4: Contact Info (email/phone appear when set in Client/.env) */}
        <div>
          <h3 className="text-white font-semibold text-lg mb-6">Contact Us</h3>
          <ul className="space-y-4 text-sm">
            <li className="flex items-start gap-3">
              <MapPin size={18} className="text-blue-500 mt-0.5" />
              <span>{SITE.location}</span>
            </li>
            {SITE.phone && (
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-blue-500" />
                <span>{SITE.phone}</span>
              </li>
            )}
            {SITE.email && (
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-blue-500" />
                <a href={`mailto:${SITE.email}`} className="hover:text-blue-400 transition-colors">{SITE.email}</a>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} {SITE.name}. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
