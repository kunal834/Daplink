'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import {
  Layout, User, BarChart3, Users,
  Brain, Settings, MessagesSquare,
  IndianRupee, Sparkles, ArrowRight, ChevronDown
} from 'lucide-react';

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
      className={`w-20 md:w-64 h-full border-r flex flex-col justify-between py-6 shrink-0 z-20 transition-colors duration-300 backdrop-blur-xl ${
        isDarkMode ? 'bg-zinc-950/80 border-zinc-800/50' : 'bg-white/80 border-zinc-200/60'
      }`}
    >
      <div className="flex flex-col gap-4 px-3 md:px-5">
        {navigationSections.map((section) => (
          <div key={section.title} className="space-y-2">
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
                      className={`w-full flex items-center justify-center md:justify-start gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 group relative ${
                        isParentActive
                          ? (isDarkMode
                              ? 'bg-indigo-500/10 text-indigo-400'
                              : 'bg-indigo-50 text-indigo-600')
                          : (isDarkMode
                              ? 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'
                              : 'text-zinc-500 hover:bg-zinc-100/80 hover:text-zinc-900')
                      }`}
                    >
                      {isParentActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-indigo-500 rounded-r-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
                      )}

                      <item.icon
                        className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${
                          isParentActive
                            ? 'text-indigo-500'
                            : isDarkMode
                              ? 'text-zinc-500 group-hover:text-zinc-300'
                              : 'text-zinc-400 group-hover:text-zinc-700'
                        }`}
                      />

                      <span className="hidden md:block truncate">{item.label}</span>

                      <ChevronDown
                        className={`hidden md:block ml-auto h-4 w-4 transition-transform duration-300 ${(isFeaturesParent && isFeaturesOpen) || (isAnalyticsParent && isAnalyticsOpen) ? 'rotate-180' : ''}`}
                      />
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      className={`flex items-center justify-center md:justify-start gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 group relative ${
                        isParentActive
                          ? (isDarkMode
                              ? 'bg-indigo-500/10 text-indigo-400'
                              : 'bg-indigo-50 text-indigo-600')
                          : (isDarkMode
                              ? 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'
                              : 'text-zinc-500 hover:bg-zinc-100/80 hover:text-zinc-900')
                      }`}
                    >
                      {isParentActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-indigo-500 rounded-r-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
                      )}

                      <item.icon
                        className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${
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
                          className={`hidden md:flex ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full transition-colors ${
                            isParentActive
                              ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/20'
                              : isDarkMode
                                ? 'bg-zinc-800 text-zinc-400 group-hover:bg-zinc-700'
                                : 'bg-zinc-100 text-zinc-600 group-hover:bg-zinc-200'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  )}

                  {shouldShowChildren && (
                    <div className={`hidden md:flex flex-col gap-1 ml-5 pl-4 border-l-2 mt-1 relative transition-colors ${
                      isDarkMode ? 'border-zinc-800' : 'border-zinc-100'
                    }`}>
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
                                    ? 'bg-zinc-900 text-white shadow-sm'
                                    : 'bg-white text-zinc-900 shadow-sm border border-zinc-200/50')
                                : (isDarkMode
                                    ? 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50'
                                    : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50')
                            }`}
                          >
                            {childActive && (
                              <div className="absolute -left-5.25 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-indigo-500 ring-4 ring-indigo-500/20"></div>
                            )}
                            {child.label}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div className="px-4 hidden md:block mb-4">
        <div className="relative rounded-2xl p-5 overflow-hidden group bg-[#0A0A0B] border border-white/10 shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-2xl pointer-events-none">
            <div className="absolute -top-12 -right-8 w-32 h-32 bg-indigo-500/40 rounded-full blur-3xl group-hover:bg-indigo-500/60 group-hover:scale-110 transition-all duration-700 ease-in-out" />
            <div className="absolute -bottom-10 -left-10 w-28 h-28 bg-fuchsia-500/30 rounded-full blur-3xl group-hover:bg-fuchsia-500/50 group-hover:scale-110 transition-all duration-700 ease-in-out" />
          </div>
          <div className="absolute inset-0 bg-linear-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 border border-white/10 backdrop-blur-md mb-4 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-200">
                Current: Free
              </span>
            </div>
            <h4 className="text-base font-extrabold text-white leading-tight mb-1 drop-shadow-sm">
              Go Beyond Limits
            </h4>
            <p className="text-xs font-medium text-zinc-400 mb-6 leading-relaxed">
              Unlock custom domains, deep analytics, and premium themes.
            </p>
            <Link
              href="/Pricing"
              className="group/btn flex items-center justify-between w-full bg-white text-black text-xs font-extrabold py-2.5 px-4 rounded-xl hover:bg-zinc-100 transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:scale-[1.02]"
            >
              <span>Upgrade to Pro</span>
              <div className="bg-black text-white rounded-full p-1 group-hover/btn:translate-x-1 transition-transform duration-300 shadow-sm">
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
