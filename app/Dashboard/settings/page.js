"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "@/context/Authenticate";
import { useQueryClient } from "@tanstack/react-query";
import React from "react";



export default function SettingsTab({ isDarkMode }) {
    const { user, loading: authLoading } = useAuth();
    const queryClient = useQueryClient();

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

    if (authLoading || isLoading) {
        return null; 
    }


    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            <div><h2 className="text-2xl font-bold tracking-tight">Settings</h2><p className={`${isDarkMode ? 'text-zinc-500' : 'text-zinc-500'} text-sm`}>Manage your account and preferences.</p></div>
            <div className={`rounded-3xl border shadow-sm overflow-hidden ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`}>
                <div className={`p-8 border-b ${isDarkMode ? 'bg-zinc-800/30 border-zinc-800' : 'bg-zinc-50/30 border-zinc-100'}`}>
                    <div className="flex items-center gap-5">
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-xl border shadow-inner ${isDarkMode ? 'bg-zinc-800 border-zinc-700 text-zinc-500' : 'bg-gradient-to-tr from-zinc-200 to-zinc-100 border-white text-zinc-400'}`}>{daplink.handle ? daplink.handle[0].toUpperCase() : 'U'}</div>
                        <div><h3 className="font-bold text-lg">My Account</h3><p className="text-xs text-zinc-500 font-medium mt-1">Free Plan · <span className="text-indigo-500 cursor-pointer hover:underline">Upgrade</span></p></div>
                    </div>
                </div>
                <div className="p-8 space-y-8">
                    <div>
                        <label className="block text-xs font-bold text-zinc-500 mb-3 uppercase">Username</label>
                        <div className="flex group">
                            <span className={`inline-flex items-center px-4 rounded-l-xl border border-r-0 text-sm font-medium transition-colors ${isDarkMode ? 'bg-zinc-950 border-zinc-700 text-zinc-500 group-hover:bg-zinc-900' : 'bg-zinc-50 border-zinc-200 text-zinc-500 group-hover:bg-zinc-100'}`}>daplink.app/</span>
                            <input type="text" value={daplink.handle} disabled className={`flex-1 min-w-0 block w-full px-4 py-3 rounded-r-xl border font-medium sm:text-sm cursor-not-allowed ${isDarkMode ? 'bg-zinc-900 border-zinc-700 text-zinc-500' : 'bg-white border-zinc-200 text-zinc-400'}`} />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-zinc-500 mb-3 uppercase">Notifications</label>
                        <div className="space-y-3">
                            <label className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors ${isDarkMode ? 'border-zinc-700 hover:bg-zinc-800' : 'border-zinc-200 hover:bg-zinc-50'}`}><span className={`text-sm font-medium ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>Email Updates</span><div className={`w-10 h-6 rounded-full relative ${isDarkMode ? 'bg-zinc-700' : 'bg-zinc-200'}`}><div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm"></div></div></label>
                            <label className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors ${isDarkMode ? 'border-zinc-700 hover:bg-zinc-800' : 'border-zinc-200 hover:bg-zinc-50'}`}><span className={`text-sm font-medium ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>Weekly Analytics Report</span><div className="w-10 h-6 bg-black rounded-full relative"><div className="absolute top-1 right-1 w-4 h-4 bg-white rounded-full shadow-sm"></div></div></label>
                        </div>
                    </div>
                    <div className={`pt-6 border-t flex items-center justify-between ${isDarkMode ? 'border-zinc-800' : 'border-zinc-100'}`}>
                        <div><p className="font-bold text-sm">Delete Account</p><p className="text-xs text-zinc-500 mt-1">This action cannot be undone.</p></div>
                        <button className={`text-xs font-bold px-5 py-2.5 rounded-xl transition-colors border ${isDarkMode ? 'text-red-400 hover:bg-red-900/20 border-red-900/30' : 'text-red-600 hover:bg-red-50 border-red-100'}`}>Delete Account</button>
                    </div>
                </div>
            </div>
        </div>
    )
};