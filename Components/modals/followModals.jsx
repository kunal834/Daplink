import React, { useState, useEffect, useMemo } from "react";
import { X, Search, User, LoaderIcon } from "lucide-react";
import Link from "next/link";

const UserItem = React.memo(({ user,theme }) => (
  <div className={`flex items-center justify-between rounded-xl px-3 py-3 transition `}>
    <div className="flex items-center gap-4">
      {/* {console.log("user", user)} */}
      <img
        src={user.daplinkID.profile}
        alt={user.username}
        className={`h-11 w-11 rounded-full object-cover ring-2 ring-zinc-200 ${theme === 'dark' ? 'ring-zinc-200' : 'ring-zinc-700'}`}
        onError={e => (e.currentTarget.src = "https://via.placeholder.com/150")}
      />
      <div>
        <p className={`text-sm font-semibold  ${theme === 'dark' ? 'text-white' : 'text-zinc-800'}`}>
          {user.daplinkID.handle}
        </p>
        <p className={`text-xs  uppercase tracking-wide ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}`}>
          {user.name}
        </p>
      </div>
    </div>

    <Link className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${theme === 'dark' ? 'bg-zinc-200 text-zinc-900 hover:bg-zinc-50' : 'bg-zinc-800 text-zinc-100 hover:bg-black hover:text-white'} hover:scale-105`}
      href={`/u/${user.daplinkID.handle}`}
    >
      View profile
    </Link>
  </div>
));

export default function FollowModal({
  isOpen,
  onClose,
  initialTab = "followers",
  theme,
  data
}) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      setSearch("");
    }
  }, [isOpen, initialTab]);

  const users = useMemo(() => {
    const list = data?.[activeTab] || [];
    if (!search) return list;
    return list.filter(
      u =>
        u.username.toLowerCase().includes(search.toLowerCase()) ||
        u.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [data, activeTab, search]);

  if(!users) return LoaderIcon;

  if (!isOpen) return null;

  

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
      />

      {/* Modal Container */}
      <div
        onClick={e => e.stopPropagation()}
        className={`relative flex h-[500px] w-full max-w-[400px] flex-col rounded-[32px] border shadow-2xl transition-all duration-300 animate-in zoom-in-95 ${theme === 'dark'
            ? "border-white/10 bg-[#0a0a0a]/90 backdrop-blur-xl text-white"
            : "border-zinc-200 bg-white/90 backdrop-blur-xl text-zinc-900"
          }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5">
          <h2 className={`text-[10px] font-black uppercase tracking-[0.3em] ${theme === 'dark' ? "text-zinc-300" : "text-zinc-700"}`}>
            {activeTab}
          </h2>
          <button
            onClick={onClose}
            className={`rounded-full p-2 transition-all active:scale-90 ${theme === 'dark' ? "bg-white/5 text-zinc-500 hover:text-white" : "bg-zinc-100 text-zinc-500 hover:text-zinc-900"
              }`}
          >
            <X size={16} />
          </button>
        </div>

        {/* Tab Switcher - Refined */}
        <div className="mt-4 flex gap-1 px-6">
          {["followers", "following"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 rounded-full py-2.5 text-[9px] font-black uppercase tracking-widest transition-all
                ${activeTab === tab
                  ? (theme === 'dark' ? "bg-white text-black" : "bg-zinc-900 text-white")
                  : (theme === 'dark' ? "bg-white/5 text-zinc-400 hover:text-zinc-200" : "bg-zinc-50 text-zinc-600 hover:text-zinc-800")
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* List Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar">
          {users.length ? (
            <div className={`divide-y ${theme === 'dark' ? "divide-white/5" : "divide-zinc-100"}`}>
              {users.map((u, i) => <UserItem key={i} user={u} theme={theme} />)}
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center opacity-40">
              <div className={`mb-3 rounded-2xl p-4 ${theme === 'dark' ? "bg-white/5" : "bg-zinc-50"}`}>
                <Search size={20} />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em]">
                No users found
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
