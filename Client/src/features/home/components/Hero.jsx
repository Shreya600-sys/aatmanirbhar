import { Search, Shield, Clock, Award } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/services?keyword=${encodeURIComponent(keyword.trim())}`);
    }
  };

  return (
    <div className="relative bg-gray-900 min-h-[600px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
          alt="Women entrepreneurs at work"
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/60 to-gray-900/90" />
      </div>
 
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
         
        <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-6">
          Support <span className="text-blue-500">Women Entrepreneurs</span> Right in Your Neighbourhood
        </h1>
        <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
          From homemade tiffin and tailoring to beauty services and handicrafts, connect with talented women running businesses from home.
        </p>
 
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-12">
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Search tiffin, tailoring, beauty, handicrafts..."
              className="w-full h-14 pl-6 pr-36 rounded-full bg-transparent border border-white/30 text-white placeholder:text-gray-400 text-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <button
              type="submit"
              className="absolute right-2 h-10 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium transition-colors flex items-center gap-2"
            >
              <Search className="h-4 w-4" />
              Search
            </button>
          </div>
        </form>
 
        <div className="flex flex-wrap justify-center gap-8 text-gray-400 text-sm font-medium">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-400" />
            <span>Verified Accounts</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-400" />
            <span>No Hidden Fees</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-purple-400" />
            <span>Book in Minutes</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;