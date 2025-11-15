import React from 'react';
// Using simple icons for visual appeal
import { Users, Zap, Heart, Lightbulb } from 'lucide-react';

const values = [
  {
    icon: Users,
    title: 'Community First',
    description: 'We believe in building a platform that serves our users\' evolving professional and personal needs.',
  },
  {
    icon: Zap,
    title: 'Simplicity',
    description: 'Complex becomes made simple. We create powerful tools with minimal effort.',
  },
  {
    icon: Heart,
    title: 'Authenticity',
    description: 'Be yourself. We celebrate individuality and encourage genuine connection.',
  },
  {
    icon: Lightbulb,
    title: 'Innovation',
    description: 'Always evolving. We continuously improve and push the boundaries of the platform.',
  },
];

const ValuesSection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
          Our Values
        </h2>
        <p className="text-xl text-gray-500 mb-12 text-center">
          The principles that guide everything we do.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {values.map((value, index) => (
            <div key={index} className="p-6 text-center border-t-4 border-indigo-500 rounded-lg shadow-lg hover:shadow-xl transition duration-300">
              <value.icon className="w-10 h-10 text-indigo-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
              <p className="text-gray-500 text-sm">{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValuesSection;