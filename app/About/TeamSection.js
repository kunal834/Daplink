import React from 'react';
import { FiLinkedin } from 'react-icons/fi';

const teamMembers = [
  { name: 'Kunal Kumar', role: 'Founder', image: 'profile.jpg' , linkedin : 'https://www.linkedin.com/in/kunal-kumar-547a48313/' },
  { name: 'Akshit Kumar', role: 'CTO & Co-founder', image: 'https://via.placeholder.com/150/10b981/ffffff?text=MO' },
  { name: 'Dewansh ', role: 'Head of Design', image: 'https://via.placeholder.com/150/f97316/ffffff?text=ED' },
  { name: 'Gaurav singh rawat', role: 'Social media manager', image: 'https://via.placeholder.com/150/ef4444/ffffff?text=AK' },
];

const TeamSection = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Meet the Team
        </h2>
        <p className="text-xl text-gray-500 mb-12">
          The people behind Daplink
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <div key={index} className="flex flex-col items-center">
              <img
                className="w-32 h-32 rounded-full object-cover mb-4 ring-4 ring-indigo-300"
                src={member.image}
                alt={`Portrait of ${member.name}`}
              />
              <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
              <p className="text-sm text-indigo-600">{member.role}</p>
              <a href={member.linkedin}> <FiLinkedin/></a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;