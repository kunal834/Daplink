'use client';

import React from 'react';
import Image from 'next/image';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useAuth } from '@/context/Authenticate';
import {
  User,
  Smartphone,
  Check,
  Image as ImageIcon
} from 'lucide-react';

export default function BioPage() {
  const { user, loading: authLoading } = useAuth();
  const queryClient = useQueryClient();

// Fetch daplink data
  const { data: daplink, isLoading } = useQuery({
    queryKey: ['daplink', user?.daplinkID],
    queryFn: async () => {
      const res = await axios.get(
        `/api/getDaplink?daplinkID=${user.daplinkID}`
      );  
      return res.data;
    },
    enabled: !authLoading && !!user?.daplinkID,
    staleTime: 10 * 60 * 1000,
  });

  // Mutation for updating profile
  const updateMutation = useMutation({
    mutationFn: async ({ field, value }) => {
      return axios.post('/api/updateDaplink', {
        daplinkID: user.daplinkID,
        field,
        value,
      });
    },
    onMutate: ({ field, value }) => {
      // optimistic update
      queryClient.setQueryData(
        ['daplink', user.daplinkID],
        (old) => ({ ...old, [field]: value })
      );
    },
  });

  const updateProfile = (field, value) => {
    updateMutation.mutate({ field, value });
  };

  if (authLoading || isLoading) {
    return null; // replace with skeleton if needed
  }

  const {
    script = '',
    profile: avatarUrl = '',
    theme = 'modern',
  } = daplink || {};

  const title = user?.name || 'Your Name';
  const themes = ['modern', 'ocean', 'sunset', 'light'];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Bio Page</h2>
        <p className="text-sm text-zinc-500">
          Customize your public profile and themes.
        </p>
      </div>

      {/* Profile Section */}
      <section>
        <div className="rounded-3xl p-6 shadow-sm border space-y-6 bg-white border-zinc-200/60">
          <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
            <User className="w-4 h-4" />
            Profile Details
          </h3>

          <div className="flex items-start gap-8 flex-col sm:flex-row">
            {/* Avatar */}
            <div className="relative w-28 h-28 rounded-3xl overflow-hidden border-2 border-dashed bg-zinc-50 cursor-pointer group">
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt="Avatar"
                  fill
                  sizes="112px"
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="w-10 h-10 text-zinc-300" />
                </div>
              )}

              <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white">
                <span className="text-xs font-bold mb-1">UPLOAD</span>
                <span className="text-[10px] opacity-70">Max 5MB</span>
              </div>
            </div>

            {/* Inputs */}
            <div className="flex-1 space-y-5 w-full">
              <div className="space-y-2">
                <label className="text-xs font-bold ml-1 text-zinc-500">
                  DISPLAY NAME
                </label>
                <input
                  value={title}
                  onChange={(e) =>
                    updateProfile('title', e.target.value)
                  }
                  className="w-full px-4 py-3 rounded-xl border bg-gray-400 text-sm font-bold"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold ml-1 text-zinc-500">
                  BIO
                </label>
                <textarea
                  value={script}
                  onChange={(e) =>
                    updateProfile('script', e.target.value)
                  }
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border bg-zinc-50 resize-none text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Theme Section */}
      <section>
        <h3 className="text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
          <Smartphone className="w-4 h-4" />
          Themes
        </h3>

        <div className="grid grid-cols-2 gap-5">
          {themes.map((t) => {
            const selected = theme === t;
            return (
              <button
                key={t}
                onClick={() => updateProfile('theme', t)}
                className={`relative h-44 rounded-[2rem] overflow-hidden p-6 flex flex-col justify-end text-left transition-all ${
                  selected
                    ? 'border-4 border-indigo-500 ring-4 ring-indigo-500/10'
                    : 'border hover:shadow-lg'
                }`}
              >
                <div
                  className={`absolute inset-0 ${
                    t === 'modern'
                      ? 'bg-zinc-900'
                      : t === 'ocean'
                      ? 'bg-gradient-to-br from-blue-900 to-indigo-900'
                      : t === 'sunset'
                      ? 'bg-gradient-to-br from-orange-900 via-red-800 to-rose-900'
                      : 'bg-white'
                  }`}
                />

                <div className="relative z-10">
                  <span
                    className={`font-bold capitalize text-xl block mb-1 ${
                      t === 'light' ? 'text-zinc-900' : 'text-white'
                    }`}
                  >
                    {t}
                  </span>
                </div>

                {selected && (
                  <div className="absolute top-5 right-5 bg-white text-black rounded-full p-1.5 shadow-xl">
                    <Check className="w-4 h-4" strokeWidth={4} />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
