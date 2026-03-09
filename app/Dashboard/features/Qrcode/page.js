'use client';

import React from 'react';
import QRGenerator from './Qrcode';
import { useTheme } from '@/context/ThemeContext';

const Page = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  return (
    <section className="mx-auto w-full max-w-7xl min-h-[calc(100vh-8rem)] lg:h-[calc(100vh-8rem)] overflow-y-auto lg:overflow-hidden scrollbar-hidden">
      <div
        className={`lg:h-full rounded-3xl border p-2 md:p-4 transition-colors ${isDarkMode ? 'border-zinc-800 bg-zinc-950/40' : 'border-zinc-200 bg-white'
          }`}
      >
        <QRGenerator isDarkMode={isDarkMode} />
      </div>
    </section>
  );
};

export default Page;
