import { Search, CalendarCheck, Smile } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: <Search className="h-10 w-10 text-blue-600" />,
      title: "1. Discover & Filter",
      description: "Browse home businesses by category, price, or location to find the product or service you need."
    },
    {
      icon: <CalendarCheck className="h-10 w-10 text-blue-600" />,
      title: "2. Book Your Service",
      description: "Pick a convenient date and time and send your booking. You pay the entrepreneur directly, with no hidden fees."
    },
    {
      icon: <Smile className="h-10 w-10 text-blue-600" />,
      title: "3. Enjoy & Review",
      description: "Receive your order or service, then leave a review to help other women grow their business."
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900">How Aatmanirbhar Nari Works</h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Get started in three simple steps. We make discovering and supporting women-led businesses easy.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow duration-300 text-center group"
            >
              <div className="w-20 h-20 mx-auto bg-blue-50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                {step.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
              <p className="text-gray-600 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;