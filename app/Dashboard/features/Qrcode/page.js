'use client';

import React from 'react';
import QRGenerator from './Qrcode';
import { useTheme } from '@/context/ThemeContext';

const Page = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  return (
    <section className="mx-auto w-full max-w-7xl h-[calc(100vh-8rem)] overflow-hidden scrollbar-hidden">
      <div
        className={`h-full overflow-hidden rounded-3xl border p-2 md:p-4 transition-colors ${
          isDarkMode ? 'border-zinc-800 bg-zinc-950/40' : 'border-zinc-200 bg-white'
        }`}
      >
        <QRGenerator isDarkMode={isDarkMode} />
      </div>
    </section>
  );
};

export default Page;
