'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import {
  Layout, User, BarChart3, Users,
  Brain, Settings, MessagesSquare,
  IndianRupee, Sparkles, ArrowRight, ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = ({ isDarkMode }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const analyticsSection = (searchParams.get('section') || 'profile').toLowerCase();
  const isAnalyticsRoute = pathname.startsWith('/Dashboard/analytics');
  const isFeaturesChildRoute =
    pathname.startsWith('/Dashboard/features/URLshorten') ||
    pathname.startsWith('/Dashboard/features/Qrcode');
  const [isAnalyticsOpen, setIsAnalyticsOpen] = React.useState(isAnalyticsRoute);
  const [isFeaturesOpen, setIsFeaturesOpen] = React.useState(isFeaturesChildRoute);

  React.useEffect(() => {
    if (isAnalyticsRoute) {
      setIsAnalyticsOpen(true);
    }
    if (isFeaturesChildRoute) {
      setIsFeaturesOpen(true);
    }
  }, [isAnalyticsRoute, isFeaturesChildRoute]);

  const navigationSections = [
    {
      title: 'Main Menu',
      items: [
        { href: '/Dashboard/editProfile', icon: User, label: 'Edit Profile' },
        {
          href: '/Dashboard/analytics',
          icon: BarChart3,
          label: 'Analytics',
          expandable: true,
          children: [
            { href: '/Dashboard/analytics?section=profile', label: 'My Profile', section: 'profile' },
            { href: '/Dashboard/analytics?section=linkinbio', label: 'Link in Bio', section: 'linkinbio' },
            { href: '/Dashboard/analytics?section=urlshortener', label: 'URL Shortener', section: 'urlshortener' },
          ],
        },
      ],
    },
    {
      title: 'Features',
      items: [
        {
          href: '/Dashboard/features',
          icon: Layout,
          label: 'Features',
          expandable: true,
          children: [
            { href: '/Dashboard/features/URLshorten', label: 'Smart URL Shortener' },
            { href: '/Dashboard/features/Qrcode', label: 'QR Code Generator' },
          ],
        },
        { href: '/Dashboard/community', icon: Users, label: 'Community', badge: 'join' },
        { href: '/Dashboard/messages', icon: MessagesSquare, label: 'Messages' },
        { href: '/Dashboard/mindset', icon: Brain, label: 'DapPost' },
        { href: '/Dashboard/settings', icon: Settings, label: 'Settings' },
        { href: '/Dashboard/Monetize', icon: IndianRupee, label: 'Monetize' },
      ],
    },
  ];

  const isActive = (href) => pathname.startsWith(href);

  return (
    <nav
      className={`w-20 md:w-66 h-full border-r flex flex-col justify-between py-6 shrink-0 z-20 transition-all duration-500 backdrop-blur-xl ${
        isDarkMode 
          ? 'bg-zinc-950/40 border-zinc-800/60 shadow-[4px_0_24px_rgba(0,0,0,0.3)]' 
          : 'bg-white/40 border-zinc-200/60 shadow-[4px_0_24px_rgba(0,0,0,0.02)]'
      }`}
    >
      <div className="flex flex-col gap-6 px-3 md:px-5">
        {navigationSections.map((section) => (
          <div key={section.title} className="space-y-3">
            <span className={`hidden md:block text-[10px] font-bold uppercase tracking-widest px-3 opacity-60 ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>
              {section.title}
            </span>
            
            <div className="space-y-1">
              {section.items.map((item) => {
                const active = isActive(item.href);
                const isAnalyticsParent = item.expandable && item.label === 'Analytics';
                const isFeaturesParent = item.expandable && item.label === 'Features';
                const isParentActive = isFeaturesParent
                  ? isFeaturesChildRoute
                  : isAnalyticsParent
                    ? isAnalyticsRoute
                    : active;
                const shouldShowChildren =
                  (isAnalyticsParent && isAnalyticsOpen) ||
                  (isFeaturesParent && isFeaturesOpen);

                return (
                  <div key={item.href} className="space-y-1">
                    {isFeaturesParent || isAnalyticsParent ? (
                      <button
                        type="button"
                        onClick={() => {
                          if (isFeaturesParent) {
                            setIsFeaturesOpen((prev) => !prev);
                          }
                          if (isAnalyticsParent) {
                            setIsAnalyticsOpen((prev) => !prev);
                          }
                        }}
                        className={`w-full flex items-center justify-center md:justify-start gap-3 px-3 py-3 rounded-xl text-sm font-semibold transition-all duration-300 group relative overflow-hidden ${
                          isParentActive
                            ? (isDarkMode
                                ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/15'
                                : 'bg-indigo-50 text-indigo-700 border border-indigo-100')
                            : (isDarkMode
                                ? 'text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-200 border border-transparent'
                                : 'text-zinc-500 hover:bg-zinc-100/60 hover:text-zinc-900 border border-transparent')
                        }`}
                      >
                        {isParentActive && (
                          <motion.div 
                            layoutId="active-indicator"
                            className="absolute left-0 top-1/4 w-1 h-1/2 bg-indigo-500 rounded-r-full shadow-[0_0_12px_rgba(99,102,241,0.8)]"
                          />
                        )}

                        <item.icon
                          className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 ${
                            isParentActive
                              ? 'text-indigo-500'
                              : isDarkMode
                                ? 'text-zinc-500 group-hover:text-zinc-300'
                                : 'text-zinc-400 group-hover:text-zinc-700'
                          }`}
                        />

                        <span className="hidden md:block truncate">{item.label}</span>

                        <ChevronDown
                          className={`hidden md:block ml-auto h-4 w-4 transition-transform duration-300 opacity-60 group-hover:opacity-100 ${(isFeaturesParent && isFeaturesOpen) || (isAnalyticsParent && isAnalyticsOpen) ? 'rotate-180 text-indigo-500' : ''}`}
                        />
                      </button>
                    ) : (
                      <Link
                        href={item.href}
                        className={`flex items-center justify-center md:justify-start gap-3 px-3 py-3 rounded-xl text-sm font-semibold transition-all duration-300 group relative overflow-hidden ${
                          isParentActive
                            ? (isDarkMode
                                ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/15'
                                : 'bg-indigo-50 text-indigo-700 border border-indigo-100')
                            : (isDarkMode
                                ? 'text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-200 border border-transparent'
                                : 'text-zinc-500 hover:bg-zinc-100/60 hover:text-zinc-900 border border-transparent')
                        }`}
                      >
                        {isParentActive && (
                          <motion.div 
                            layoutId="active-indicator"
                            className="absolute left-0 top-1/4 w-1 h-1/2 bg-indigo-500 rounded-r-full shadow-[0_0_12px_rgba(99,102,241,0.8)]"
                          />
                        )}

                        <item.icon
                          className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 ${
                            isParentActive
                              ? 'text-indigo-500'
                              : isDarkMode
                                ? 'text-zinc-500 group-hover:text-zinc-300'
                                : 'text-zinc-400 group-hover:text-zinc-700'
                          }`}
                        />

                        <span className="hidden md:block truncate">{item.label}</span>

                        {item.badge && (
                          <span
                            className={`hidden md:flex ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full transition-all duration-300 ${
                              isParentActive
                                ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/20'
                                : isDarkMode
                                  ? 'bg-zinc-800 text-zinc-400 group-hover:bg-zinc-700 group-hover:text-zinc-200'
                                  : 'bg-zinc-100 text-zinc-600 group-hover:bg-zinc-200 group-hover:text-zinc-800'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    )}

                    <AnimatePresence>
                      {shouldShowChildren && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className={`hidden md:flex flex-col gap-1 ml-5 pl-4 border-l-2 mt-1 relative overflow-hidden ${
                            isDarkMode ? 'border-zinc-850' : 'border-zinc-100'
                          }`}
                        >
                          {item.children.map((child) => {
                            const childActive = child.section
                              ? analyticsSection === child.section
                              : pathname.startsWith(child.href);
                            return (
                              <Link
                                key={child.href}
                                href={child.href}
                                className={`text-xs font-semibold tracking-wide px-3 py-2 rounded-lg transition-all duration-300 relative group ${
                                  childActive
                                    ? (isDarkMode
                                        ? 'bg-zinc-900 text-white shadow-inner border border-zinc-850'
                                        : 'bg-white text-zinc-900 shadow-sm border border-zinc-200/50')
                                    : (isDarkMode
                                        ? 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50'
                                        : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50')
                                }`}
                              >
                                {childActive && (
                                  <motion.div 
                                    layoutId="child-dot"
                                    className="absolute -left-5.25 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-indigo-500 ring-4 ring-indigo-500/20"
                                  />
                                )}
                                {child.label}
                              </Link>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="px-4 hidden md:block mb-4">
        <div className={`relative rounded-3xl p-5 overflow-hidden group border shadow-2xl transition-all duration-500 ${
          isDarkMode 
            ? 'bg-zinc-950/80 border-white/5 shadow-indigo-950/30' 
            : 'bg-white border-zinc-200/80 shadow-indigo-100/30'
        }`}>
          {/* Animated Glow Backdrops */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-3xl pointer-events-none z-0">
            <div className="absolute -top-12 -right-8 w-36 h-36 bg-linear-to-br from-indigo-500/30 to-purple-500/30 rounded-full blur-2xl group-hover:scale-125 transition-all duration-700 ease-in-out" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-linear-to-tr from-fuchsia-500/20 to-rose-500/20 rounded-full blur-2xl group-hover:scale-125 transition-all duration-700 ease-in-out" />
          </div>
          <div className="absolute inset-0 bg-linear-to-b from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0" />
          
          <div className="relative z-10 flex flex-col">
            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl border backdrop-blur-md mb-4 shadow-sm w-fit ${
              isDarkMode 
                ? 'bg-white/5 border-white/10 text-zinc-200' 
                : 'bg-zinc-100 border-zinc-200/50 text-zinc-800'
            }`}>
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[9px] font-extrabold uppercase tracking-widest">
                Current: Free
              </span>
            </div>
            
            <h4 className={`text-[15px] font-black leading-tight mb-1 tracking-tight ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>
              Go Beyond Limits
            </h4>
            
            <p className={`text-xs font-semibold mb-6 leading-relaxed ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
              Unlock custom domains, deep analytics, and premium vibes.
            </p>
            
            <Link
              href="/Pricing"
              className={`group/btn flex items-center justify-between w-full text-xs font-extrabold py-2.5 px-4 rounded-2xl hover:scale-[1.02] transition-all duration-300 shadow-md ${
                isDarkMode 
                  ? 'bg-white text-black hover:bg-zinc-100 shadow-white/5' 
                  : 'bg-zinc-900 text-white hover:bg-black shadow-zinc-900/10'
              }`}
            >
              <span>Upgrade to Pro</span>
              <div className={`rounded-full p-1 transition-transform duration-300 shadow-sm ${
                isDarkMode ? 'bg-black text-white group-hover/btn:translate-x-1' : 'bg-white text-black group-hover/btn:translate-x-1'
              }`}>
                <ArrowRight className="w-3 h-3" strokeWidth={3} />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
