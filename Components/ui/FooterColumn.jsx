'use client';
import React from 'react';

export default function FooterColumn({ theme, title, links }) {
  return (
    <div>
      <h4 className={`font-bold mb-6 text-lg ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{title}</h4>
      <ul className={`space-y-4 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
        {links.map((link, index) => {
          // Support both simple string arrays and object arrays with { name, href }
          const label = typeof link === 'string' ? link : link.name;
          const href = typeof link === 'string' ? '#' : link.href;

          return (
            <li key={index}>
              <a href={href} className="hover:text-teal-500 transition-colors">{label}</a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}