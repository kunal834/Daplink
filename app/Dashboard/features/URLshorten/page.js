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
        const [meResponse, linksResponse] = await Promise.all([
          axios.get('/api/auth/me'),
          axios.get('/api/getLinks'),
        ]);

        if (!isMounted) return;

        const id = meResponse?.data?.user?._id || '';
        const fetchedLinks = Array.isArray(linksResponse?.data) ? linksResponse.data : [];

        setUserID(id);
        setLinks(fetchedLinks);
      } catch (error) {
        if (!isMounted) return;
        toast.error('Unable to load URL shortener data.');
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
