import React from 'react';

const metrics = [
  { value: '50K+', label: 'Users' },
  { value: '2M+', label: 'Digital Connections' },
  { value: '150+', label: 'Countries Served' },
  { value: '99.9%', label: 'Platform Uptime' },
];

const MetricsSection = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
          By the Numbers: Our Impact
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {metrics.map((metric, index) => (
            <div key={index} className="flex flex-col items-center">
              <p className="text-5xl font-extrabold text-indigo-600 mb-2">{metric.value}</p>
              <p className="text-lg font-medium text-gray-500">{metric.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MetricsSection;