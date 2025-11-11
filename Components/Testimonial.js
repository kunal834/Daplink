// TestimonialsSection.jsx
import React from 'react';
import Image from 'next/image'; // Assuming Next.js for Image component

const testimonials = [
  {
    id: 1,
    rating: 5,
    quote: "DapLink completely transformed how I share my portfolio. I landed 3 freelance gigs in the first month!",
    author: "Sarah Chen",
    title: "UX Designer",
    avatar: "/innovate.png", // Replace with actual paths to images
  },
  {
    id: 2,
    rating: 5,
    quote: "The skill exchange feature helped me find a mentor and learn React. Best decision ever.",
    author: "Marcus Johnson",
    title: "Software Developer",
    avatar: "/innovate.png", // Replace with actual paths
  },
  {
    id: 3,
    rating: 5,
    quote: "My audience engagement doubled after switching to DapLink. The analytics are incredibly detailed.",
    author: "Priya Sharma",
    title: "Content Creator",
    avatar: "/innovate.png", // Replace with actual paths
  },
  // Add more testimonials as needed
];

const StarRating = ({ rating }) => {
  return (
    <div className="flex items-center mb-3">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`h-5 w-5 ${
            i < rating ? 'text-yellow-400' : 'text-gray-300'
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
};

const Testimonials = () => {
  return (
    // Background: You can apply the subtle grid background here or a gradient as seen in the image
    // For the image's gradient, you'd use something like: bg-gradient-to-r from-purple-100 via-pink-100 to-indigo-100
    // I'll use a light gradient to match the image's overall feel.
    <section className="bg-gradient-to-r from-purple-50 via-pink-50 to-indigo-50 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
            Loved by creators worldwide
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            See what our community has to say
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white p-8 rounded-lg shadow-lg flex flex-col justify-between" // Added flex-col justify-between for consistent height
            >
              <StarRating rating={testimonial.rating} />
              
              <p className="text-lg text-gray-700 leading-relaxed mb-6 flex-grow"> {/* flex-grow to push author to bottom */}
                "{testimonial.quote}"
              </p>

              <div className="flex items-center mt-4">
                <div className="flex-shrink-0">
                  <Image
                    className="h-12 w-12 rounded-full object-cover"
                    src={testimonial.avatar}
                    alt={testimonial.author}
                    width={48} // Define width and height for Next.js Image component
                    height={48}
                  />
                </div>
                <div className="ml-4">
                  <div className="text-base font-semibold text-gray-900">
                    {testimonial.author}
                  </div>
                  <div className="text-sm text-indigo-600">
                    {testimonial.title}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;