'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UrlShortenerTab from './shorten';
import { useTheme } from '@/context/ThemeContext';
import { toast } from 'react-toastify';

const Page = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  const [userID, setUserID] = useState('');
  const [links, setLinks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const [meResult, linksResult] = await Promise.allSettled([
          axios.get('/api/auth/me'),
          axios.get('/api/getLinks'),
        ]);

        if (!isMounted) return;

        if (meResult.status === 'fulfilled') {
          const id = meResult?.value?.data?.user?._id || '';
          setUserID(id);
        } else {
          toast.error('Unable to load your account details.');
        }

        if (linksResult.status === 'fulfilled') {
          const fetchedLinks = Array.isArray(linksResult?.value?.data) ? linksResult.value.data : [];
          setLinks(fetchedLinks);
        } else {
          toast.error('Unable to load your links right now.');
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="mx-auto w-full max-w-6xl">
      <div
        className={`rounded-3xl border p-4 md:p-6 transition-colors ${
          isDarkMode ? 'border-zinc-800 bg-zinc-950/40' : 'border-zinc-200 bg-white'
        }`}
      >
        {isLoading ? (
          <div className="space-y-3 py-6">
            <div className={`h-8 w-56 rounded-lg ${isDarkMode ? 'bg-zinc-800' : 'bg-zinc-100'}`} />
            <div className={`h-4 w-80 rounded-lg ${isDarkMode ? 'bg-zinc-800' : 'bg-zinc-100'}`} />
            <div className={`h-24 w-full rounded-2xl ${isDarkMode ? 'bg-zinc-900' : 'bg-zinc-50'}`} />
          </div>
        ) : (
          <UrlShortenerTab
            isDarkMode={isDarkMode}
            userID={userID}
            links={links}
            setLinks={setLinks}
          />
        )}
      </div>
    </section>
  );
};

export default Page;
