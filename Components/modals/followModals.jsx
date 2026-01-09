import React, { useState, useEffect, useMemo } from "react";
import { X, Search } from "lucide-react";
import Link from "next/link";

const UserItem = React.memo(({ user }) => (
  <div className="flex items-center justify-between rounded-xl px-3 py-3 transition hover:bg-zinc-100 dark:hover:bg-zinc-800">
    <div className="flex items-center gap-4">
      {console.log("user",user)}
      <img
        src={user.daplinkID.profile}
        alt={user.username}
        className="h-11 w-11 rounded-full object-cover ring-2 ring-zinc-200 dark:ring-zinc-700"
        onError={e => (e.currentTarget.src = "https://via.placeholder.com/150")}
      />
      <div>
        <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          {user.daplinkID.handle}
        </p>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
          {user.name}
        </p>
      </div>
    </div>

    <Link className="rounded-full bg-zinc-900 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-zinc-700 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />

      {/* Modal */}
      <div
        onClick={e => e.stopPropagation()}
        className="relative flex h-[600px] w-full max-w-[420px] flex-col rounded-3xl border border-zinc-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-950"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6">
          <h2 className="text-lg font-bold uppercase tracking-tight text-zinc-900 dark:text-white">
            {activeTab}
          </h2>
          <button
            onClick={onClose}
            className="rounded-full bg-zinc-100 p-2 text-zinc-500 transition hover:text-zinc-900 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div className="mt-4 flex gap-2 px-6">
          {["followers", "following"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 rounded-full py-2 text-xs font-bold uppercase tracking-wider transition
                ${
                  activeTab === tab
                    ? "bg-zinc-900 text-white dark:bg-white dark:text-black"
                    : "bg-zinc-100 text-zinc-500 hover:text-zinc-800 dark:bg-zinc-900 dark:text-zinc-400"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search  to be implemented later*/}
        {/* <div className="px-6 py-4">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
            />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search profiles"
              className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 py-3 pl-11 pr-4 text-sm font-medium text-zinc-900 outline-none focus:ring-2 focus:ring-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:focus:ring-white"
            />
          </div>
        </div> */}

        {/* List */}
        <div className="flex-1 space-y-1 overflow-y-auto px-4 py-6">
          {users.length ? (
            users.map(u => <UserItem key={u.id} user={u} />)
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-zinc-400">
              <Search size={28} />
              <p className="mt-2 text-xs font-semibold uppercase tracking-widest">
                No users found
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
