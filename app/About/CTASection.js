import React from 'react';

const CTASection = () => {
  return (
    <section className="py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-10 rounded-xl text-center shadow-2xl">
          <h2 className="text-3xl font-extrabold mb-3">
            Join Us on This Journey
          </h2>
          <p className="text-xl mb-8 font-light">
            Whether you're a **creator**, **professional**, or **student**, Daplink is here to help you showcase your world and connect with the right people.
          </p>
          <div className="flex justify-center space-x-4">
            <button className="px-8 py-3 text-lg font-medium text-indigo-600 bg-white rounded-full hover:bg-gray-100 transition duration-300 shadow-md">
              Get Started Now
            </button>
            <button className="px-8 py-3 text-lg font-medium text-white border-2 border-white rounded-full hover:bg-white hover:text-indigo-600 transition duration-300 shadow-md">
             Contact us 
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;