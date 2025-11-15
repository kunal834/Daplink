import React, { useState } from 'react';

const NewsletterCTA = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic to handle newsletter subscription (e.g., calling an API)
    console.log("Subscribing email:", email);
    alert(`Thank you for subscribing, ${email}!`);
    setEmail('');
  };

  return (
    <div className="mt-20">
      {/* Container: Use a darker indigo for a more premium, professional feel */}
      <div className="text-center bg-indigo-700 p-8 sm:p-12 rounded-2xl shadow-2xl">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
         {`Don't Miss the Next Opportunity!`}
        </h2>
        {/* Adjusted text color for better contrast/professionalism */}
        <p className="text-indigo-300 mb-8 max-w-xl mx-auto">
          Get the latest guides, feature updates, and exclusive networking tips delivered straight to your inbox.
        </p>
        
        {/* Form and Input Container: Now handles stacking on small screens */}
        <form onSubmit={handleSubmit} className="flex flex-col items-center sm:flex-row sm:justify-center sm:max-w-md mx-auto space-y-4 sm:space-y-0">
          
          {/* Email Input */}
          <input
            type="email"
            placeholder="Enter your email address"
            aria-label="Email address for newsletter"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="
              px-5 py-3 w-full sm:flex-1 
              rounded-xl sm:rounded-r-none border-0 
              text-gray-800 placeholder-gray-500
              focus:ring-4 focus:ring-indigo-400 focus:outline-none 
              transition-shadow duration-200
            "
            required
          />
          
          {/* Subscribe Button */}
          <button
            type="submit"
            className="
              w-full sm:w-auto px-6 py-3 
              bg-gray-900 text-white font-semibold 
              rounded-xl sm:rounded-l-none 
              hover:bg-indigo-500 
              transition-colors duration-300 shadow-lg
              focus:ring-4 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-indigo-700 focus:outline-none
            "
          >
            Subscribe Now
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewsletterCTA;