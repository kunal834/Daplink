"use client";

import React, { useMemo, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/Authenticate";
import { useQuery } from "@tanstack/react-query";
import {
  Link as LinkIcon,
  ExternalLink,
  Loader2,
  Globe2,
  Activity,
  TrendingUp,
  TrendingDown,
  ChevronDown,
  Flame,
  HelpCircle,
} from "lucide-react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";

export default function AnalyticsTab() {
  const { theme } = useTheme();
  const { user, loading: authLoading } = useAuth();
  const isDarkMode = theme === "dark";
  const searchParams = useSearchParams();
  const sections = [
    { key: "profile", label: "My Profile" },
    { key: "linkinbio", label: "Link in Bio" },
    { key: "urlshortener", label: "URL Shortener" },
  ];
  const activeSection = useMemo(() => {
    const candidate = (searchParams.get("section") || "profile").toLowerCase();
    return sections.some((section) => section.key === candidate)
      ? candidate
      : "profile";
  }, [searchParams]);
  const needsBioAnalytics = activeSection !== "urlshortener";

  const [range, setRange] = useState(30);
  const [mapMode, setMapMode] = useState("countries");
  const [activeHoursTab, setActiveHoursTab] = useState("Weekdays");
  const [activeHoursMode, setActiveHoursMode] = useState("pageviews");
  const [stats, setStats] = useState({
    totals: { views: 0, clicks: 0 },
    rangeTotals: { views: 0, clicks: 0 },
    uniqueVisitors: 0,
    series: [],
    visitorsSeries: [],
    topLinks: [],
    referrers: [],
    devices: [],
    osBreakdown: [],
    browserBreakdown: [],
    locations: [],
    locationPoints: [],
    countries: [],
    hourly: [],
    dayHour: [],
    dayHourUnique: [],
    avgTimeSeconds: 0,
    rangeDays: 30,
  });
  const [error, setError] = useState("");

  const profileId = useMemo(() => {
    if (!user?.daplinkID) return "";
    if (typeof user.daplinkID === "string") return user.daplinkID;
    return user.daplinkID?._id || "";
  }, [user?.daplinkID]);

  const analyticsQuery = useQuery({
    queryKey: ["posthog-analytics", profileId, range],
    enabled: !!profileId && needsBioAnalytics,
    staleTime: 60_000,
    gcTime: 10 * 60_000,
    keepPreviousData: true,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    onError: (err) => {
      setError(err?.message || "Failed to load analytics.");
    },
    queryFn: async () => {
      setError("");
      const res = await fetch(
        `/api/posthog/analytics?profileId=${profileId}&range=${range}`
      );
      const data = await res.json();
      // console.log("posthog analytics data", data);
      if (!res.ok) throw new Error(data?.error || "Failed to load analytics.");
      return data;
    },
  });

  React.useEffect(() => {
    if (!analyticsQuery.data) return;
    setStats(analyticsQuery.data);
  }, [analyticsQuery.data]);

  const shortLinksQuery = useQuery({
    queryKey: ["short-links"],
    enabled: activeSection === "urlshortener" && !!user && !authLoading,
    staleTime: 60_000,
    gcTime: 10 * 60_000,
    keepPreviousData: true,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    queryFn: async () => {
      const res = await fetch("/api/getLinks");
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to load short links.");
      return data;
    },
  });

  const rangeTotals = stats.rangeTotals || { views: 0, clicks: 0 };
  const ctr = rangeTotals.views
    ? Math.round((rangeTotals.clicks / rangeTotals.views) * 100)
    : 0;

  const topLink = stats.topLinks?.[0];
  const topCountries = stats.countries.slice(0, 5);
  const avgTimeSeconds = Number(stats.avgTimeSeconds || 0);
  const avgTimeLabel = avgTimeSeconds
    ? `${Math.floor(avgTimeSeconds / 60)}m ${String(Math.round(avgTimeSeconds % 60)).padStart(2, "0")}s`
    : "--";

  const highlightCountries = useMemo(() => {
    return new Set(
      (stats.countries || [])
        .map((country) => String(country.label || "").toLowerCase().trim())
        .filter(Boolean)
    );
  }, [stats.countries]);

  const formatHourTick = (hour) => {
    const h = hour % 12 || 12;
    const period = hour >= 12 ? "PM" : "AM";
    return `${h}${period}`;
  };


  const cityMarkers = useMemo(() => {
    return (stats.locationPoints || []).filter(
      (point) =>
        Number.isFinite(point.lat) &&
        Number.isFinite(point.lon) &&
        point.label
    );
  }, [stats.locationPoints]);

  const shortLinks = Array.isArray(shortLinksQuery.data)
    ? shortLinksQuery.data
    : [];
  const totalShortLinks = shortLinks.length;
  const activeShortLinks = shortLinks.filter((link) => link.isActive).length;
  const totalShortClicks = shortLinks.reduce(
    (sum, link) => sum + Number(link.clicks || 0),
    0
  );
  const avgShortClicks = totalShortLinks
    ? Number((totalShortClicks / totalShortLinks).toFixed(1))
    : 0;
  const topShortLinks = [...shortLinks]
    .sort((a, b) => Number(b.clicks || 0) - Number(a.clicks || 0))
    .slice(0, 5);

  const dayHourMatrix = useMemo(() => {
    const matrix = Array.from({ length: 7 }, () =>
      Array.from({ length: 24 }, () => 0)
    );
    stats?.dayHour?.forEach((entry) => {
      const dayIdx = Math.min(Math.max(entry.day - 1, 0), 6);
      const hourIdx = Math.min(Math.max(entry.hour, 0), 23);
      matrix[dayIdx][hourIdx] = Number(entry.count || 0);
    });
    return matrix;
  }, [stats.dayHour]);

  const dayHourUniqueMatrix = useMemo(() => {
    const matrix = Array.from({ length: 7 }, () =>
      Array.from({ length: 24 }, () => 0)
    );
    stats?.dayHourUnique?.forEach((entry) => {
      const dayIdx = Math.min(Math.max(entry.day - 1, 0), 6);
      const hourIdx = Math.min(Math.max(entry.hour, 0), 23);
      matrix[dayIdx][hourIdx] = Number(entry.count || 0);
    });
    return matrix;
  }, [stats.dayHourUnique]);

  const orderedDayHourMatrix = useMemo(() => {
    const order = [6, 0, 1, 2, 3, 4, 5];
    return order.map((idx) => dayHourMatrix[idx] || Array.from({ length: 24 }, () => 0));
  }, [dayHourMatrix]);

  const orderedDayHourUniqueMatrix = useMemo(() => {
    const order = [6, 0, 1, 2, 3, 4, 5];
    return order.map((idx) => dayHourUniqueMatrix[idx] || Array.from({ length: 24 }, () => 0));
  }, [dayHourUniqueMatrix]);

  const activeHourMatrix =
    activeHoursMode === "unique"
      ? orderedDayHourUniqueMatrix
      : orderedDayHourMatrix;

  const heatmapMax = useMemo(() => {
    const flat = activeHourMatrix.flat();
    return Math.max(1, ...flat);
  }, [activeHourMatrix]);

  const hasHeatmapData = useMemo(() => {
    if (activeHoursMode === "unique") {
      return stats.dayHourUnique?.some((entry) => Number(entry.count || 0) > 0);
    }
    return stats.dayHour?.some((entry) => Number(entry.count || 0) > 0);
  }, [stats.dayHour, stats.dayHourUnique, activeHoursMode]);


  const activeHoursDataSets = useMemo(() => {
    const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dayLong = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const byDay = activeHourMatrix.map((row, idx) => ({
      name: dayLabels[idx],
      clicks: row.reduce((sum, v) => sum + Number(v || 0), 0),
    }));
    const byDayLong = activeHourMatrix.map((row, idx) => ({
      name: dayLong[idx],
      clicks: row.reduce((sum, v) => sum + Number(v || 0), 0),
    }));
    const byHour = Array.from({ length: 24 }).map((_, hourIdx) => {
      const total = activeHourMatrix.reduce((sum, row) => sum + Number(row[hourIdx] || 0), 0);
      return { name: `${hourIdx}`, clicks: total };
    });
    return {
      "Weekdays": byDay,
      "Days of week": byDayLong,
      "Hours": byHour,
    };
  }, [activeHourMatrix]);

  const activeHoursChartData = useMemo(
    () => activeHoursDataSets[activeHoursTab] || [],
    [activeHoursDataSets, activeHoursTab]
  );

  const activeHoursPeak = useMemo(() => {
    if (!activeHoursChartData.length) return null;
    return activeHoursChartData.reduce((prev, cur) => (prev.clicks > cur.clicks ? prev : cur));
  }, [activeHoursChartData]);

  const ActiveHoursTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload.length) return null;

    return (
      <div className="relative pointer-events-none">
        <div className="bg-[#1e293b] text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 min-w-fit">
          <p className="text-lg font-bold leading-tight">
            {payload[0].value}{" "}
            {activeHoursMode === "unique" ? "users" : "pageviews"}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            on {activeHoursTab=== "Hours"
              ? `${((payload[0].payload.name % 12))} ${payload[0].payload.name >= 12 ? "PM" : "AM"}`
              : payload[0].payload.name}
          </p>

        </div>

        {/* Arrow */}
        <div className="absolute left-1/4 -bottom-2 -translate-x-1/2 w-4 h-4 bg-[#1e293b] rotate-45 rounded-sm" />
      </div>
    );
  };



  const buildSlices = (rows, limit = 4) => {
    const total = rows.reduce((sum, row) => sum + Number(row.count || 0), 0);
    if (!total) return { total: 0, slices: [] };
    const slices = rows
      .slice(0, limit)
      .map((row) => ({
        label: row.label || "Unknown",
        pct: Math.round((Number(row.count || 0) / total) * 100),
      }))
      .filter((slice) => slice.pct > 0);
    return { total, slices };
  };

  const buildDonutGradient = (slices, colors) => {
    if (!slices.length) return "conic-gradient(#e2e8f0 0 100%)";
    let current = 0;
    const parts = slices.map((slice, idx) => {
      const start = current;
      const end = current + slice.pct;
      current = end;
      return `${colors[idx % colors.length]} ${start}% ${end}%`;
    });
    return `conic-gradient(${parts.join(", ")})`;
  };

  const referrerTotal = stats.referrers.reduce(
    (sum, row) => sum + Number(row.count || 0),
    0
  );
  const referrerSlices = stats.referrers.slice(0, 4).map((row) => {
    const pct = referrerTotal ? Math.round((row.count / referrerTotal) * 100) : 0;
    return { label: row.label, pct };
  });

  const referrerGradient = referrerSlices.length
    ? `conic-gradient(#60a5fa 0 ${referrerSlices[0].pct}%, #34d399 ${referrerSlices[0].pct}% ${referrerSlices[0].pct + (referrerSlices[1]?.pct || 0)}%, #fbbf24 ${referrerSlices[0].pct + (referrerSlices[1]?.pct || 0)}% ${referrerSlices[0].pct + (referrerSlices[1]?.pct || 0) + (referrerSlices[2]?.pct || 0)}%, #f472b6 ${referrerSlices[0].pct + (referrerSlices[1]?.pct || 0) + (referrerSlices[2]?.pct || 0)}% 100%)`
    : "conic-gradient(#1f2937 0 100%)";

  const browserSlices = buildSlices(stats.browserBreakdown);
  const osSlices = buildSlices(stats.osBreakdown);
  const deviceSlices = buildSlices(stats.devices);
  const donutColors = ["#60a5fa", "#34d399", "#fbbf24", "#f472b6"];

  const shortLinksError = shortLinksQuery.error?.message || "";
  const showBioLoading = needsBioAnalytics && analyticsQuery.isLoading;
  const showShortLoading =
    activeSection === "urlshortener" && shortLinksQuery.isLoading;
  const showLoading = authLoading || showBioLoading || showShortLoading;
  const cardClass = isDarkMode
    ? "bg-gradient-to-b from-slate-900/80 to-slate-950/90 border-slate-800/80 shadow-[0_12px_30px_rgba(0,0,0,0.45)] ring-1 ring-white/5 backdrop-blur-sm"
    : "bg-gradient-to-b from-white to-slate-50 border-slate-200 shadow-[0_10px_24px_rgba(15,23,42,0.12)]";
  const geographyUrl =
    "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div
        className={`relative overflow-hidden rounded-[2.5rem] border p-6 md:p-8 ${isDarkMode
          ? "bg-gradient-to-br from-slate-950 via-slate-900 to-black border-slate-800"
          : "bg-gradient-to-br from-white via-slate-50 to-slate-100 border-slate-200"
          }`}
      >
        <div className="relative z-10">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight">
                Analytics
              </h2>
              <p
                className={`text-sm mt-1 ${isDarkMode ? "text-slate-400" : "text-slate-600"
                  }`}
              >
                Know who is visiting, clicking, and converting.
              </p>
            </div>
            <div
              className={`hidden md:flex items-center gap-2 text-xs font-bold px-3 py-2 rounded-full ${isDarkMode
                ? "bg-white/5 text-slate-300 border border-white/10"
                : "bg-black/5 text-slate-700 border border-black/5"
                }`}
            >
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Tracking
            </div>
          </div>
        </div>
        <div
          className={`absolute -top-16 -right-12 w-52 h-52 rounded-full blur-3xl opacity-40 ${isDarkMode ? "bg-indigo-500" : "bg-indigo-300"
            }`}
        ></div>
        <div
          className={`absolute -bottom-20 -left-10 w-56 h-56 rounded-full blur-3xl opacity-40 ${isDarkMode ? "bg-emerald-500" : "bg-emerald-300"
            }`}
        ></div>
      </div>

      <div className="flex flex-wrap gap-2">
        {sections.map((section) => {
          const isActive = section.key === activeSection;
          return (
            <Link
              key={section.key}
              href={`/Dashboard/analytics?section=${section.key}`}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${isActive
                ? isDarkMode
                  ? "bg-white text-black shadow-lg shadow-white/20"
                  : "bg-slate-900 text-white shadow-lg shadow-slate-900/20"
                : isDarkMode
                  ? "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
                  : "bg-white text-slate-500 hover:text-slate-900 border border-slate-200"
                }`}
            >
              {section.label}
            </Link>
          );
        })}
      </div>

      {showLoading && (
        <div
          className={`rounded-[2rem] border p-6 flex items-center gap-3 text-sm font-semibold ${isDarkMode
            ? "bg-slate-900 border-slate-800 text-slate-300"
            : "bg-white border-slate-200 text-slate-700"
            }`}
        >
          <Loader2 className="w-4 h-4 animate-spin" />
          Loading analytics...
        </div>
      )}

      {!authLoading && !profileId && needsBioAnalytics && (
        <div
          className={`rounded-[2rem] border p-6 text-sm font-semibold ${isDarkMode
            ? "bg-slate-900 border-slate-800 text-slate-300"
            : "bg-white border-slate-200 text-slate-700"
            }`}
        >
          Connect a bio profile to start tracking analytics.
        </div>
      )}

      {(error || shortLinksError) && (
        <div
          className={`rounded-[2rem] border p-6 text-sm font-semibold ${isDarkMode
            ? "bg-slate-900 border-slate-800 text-rose-300"
            : "bg-white border-slate-200 text-rose-600"
            }`}
        >
          {activeSection === "urlshortener" ? shortLinksError : error}
        </div>
      )}
      {needsBioAnalytics && !analyticsQuery.isLoading && profileId && !error && (
        <>
          {(activeSection === "profile" || activeSection === "linkinbio") && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
                <div className={`p-5 rounded-2xl border ${cardClass}`}>
                  <p className={isDarkMode ? "text-xs font-bold text-slate-400" : "text-xs font-bold text-slate-500"}>Total Views</p>
                  <div className="mt-2 text-3xl font-black">{rangeTotals.views.toLocaleString()}</div>
                  <div className="mt-2 text-xs font-semibold text-emerald-400 flex items-center gap-1">
                    {/* <TrendingUp className="w-3 h-3" /> +12% this week */}
                  </div>
                  <div className="mt-4 h-2 rounded-full bg-emerald-500/10 overflow-hidden">
                    <div className="h-full bg-emerald-400" style={{ width: "60%" }}></div>
                  </div>
                </div>

                <div className={`p-5 rounded-2xl border ${cardClass}`}>
                  <p className={isDarkMode ? "text-xs font-bold text-slate-400" : "text-xs font-bold text-slate-500"}>Unique Visitors</p>
                  <div className="mt-2 text-3xl font-black">{stats.uniqueVisitors.toLocaleString()}</div>
                  <div className="mt-2 text-xs font-semibold text-emerald-400 flex items-center gap-1">
                    {/* <TrendingUp className="w-3 h-3" /> +9% this week */}
                  </div>
                  <div className="mt-4 h-2 rounded-full bg-sky-500/10 overflow-hidden">
                    <div className="h-full bg-sky-400" style={{ width: "52%" }}></div>
                  </div>
                </div>

                <div className={`p-5 rounded-2xl border ${cardClass}`}>
                  <p className={isDarkMode ? "text-xs font-bold text-slate-400" : "text-xs font-bold text-slate-500"}>CTR</p>
                  <div className="mt-2 text-3xl font-black">{ctr}%</div>
                  <div className="mt-2 text-xs font-semibold text-rose-400 flex items-center gap-1">
                    {/* <TrendingDown className="w-3 h-3" /> -3.2% this week */}
                  </div>
                  <div className="mt-4 h-2 rounded-full bg-rose-500/10 overflow-hidden">
                    <div className="h-full bg-rose-400" style={{ width: `${Math.min(100, ctr)}%` }}></div>
                  </div>
                </div>

                <div className={`p-5 rounded-2xl border ${cardClass}`}>
                  <p className={isDarkMode ? "text-xs font-bold text-slate-400" : "text-xs font-bold text-slate-500"}>Avg. Time on Page</p>
                  <div className="mt-2 text-3xl font-black">{avgTimeLabel}</div>
                  <div className={isDarkMode ? "mt-2 text-xs text-slate-500" : "mt-2 text-xs text-slate-400"}>
                    {avgTimeSeconds ? `Avg in last ${stats.rangeDays} days` : "Not tracked yet"}
                  </div>
                </div>

                <div className={`p-5 rounded-2xl border flex flex-col justify-between ${cardClass}`}>
                  <p className={isDarkMode ? "text-xs font-bold text-slate-400" : "text-xs font-bold text-slate-500"}>Top Link</p>
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-sm font-semibold truncate">
                        {topLink ? topLink.linkText || topLink.linkUrl : "No data"}
                      </div>
                      <div className={isDarkMode ? "text-xs text-slate-500 truncate" : "text-xs text-slate-400 truncate"}>
                        {topLink ? topLink.linkUrl : ""}
                      </div>
                    </div>
                    <ExternalLink className={isDarkMode ? "w-4 h-4 text-slate-400" : "w-4 h-4 text-slate-500"} />
                  </div>
                  <div className="mt-4 text-xs font-bold text-indigo-400">
                    {topLink ? `${topLink.count} clicks` : ""}
                  </div>
                </div>
              </div>

              <div className={`rounded-3xl border p-6 ${cardClass}`}>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-6">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold">Active Hours</h3>
                      <HelpCircle size={14} className="text-slate-400" />
                    </div>
                    <p className="text-slate-500 mt-1 text-sm">
                      {activeHoursMode === "unique" ? "Unique users" : "Total pageviews"} in the last {range} days
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <div className={`inline-flex rounded-full border overflow-hidden text-xs font-semibold ${isDarkMode ? "border-white/10" : "border-slate-200"}`}>
                      <button
                        type="button"
                        onClick={() => setActiveHoursMode("unique")}
                        className={`px-4 py-1.5 ${activeHoursMode === "unique" ? "bg-slate-900 text-white" : isDarkMode ? "bg-slate-800 text-slate-300" : "bg-white text-slate-600"}`}
                      >
                        Unique users
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveHoursMode("pageviews")}
                        className={`px-4 py-1.5 ${activeHoursMode === "pageviews" ? "bg-slate-900 text-white" : isDarkMode ? "bg-slate-800 text-slate-300" : "bg-white text-slate-600"}`}
                      >
                        Total pageviews
                      </button>
                    </div>
                    <div className="relative">
                      <button className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold ${isDarkMode ? "bg-slate-800 text-slate-200 border border-slate-700" : "bg-white text-slate-700 border border-slate-200"}`}>
                        Last {range} Days <ChevronDown size={14} className="text-slate-400" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <div className="bg-orange-50 p-1.5 rounded-full">
                    <Flame size={16} className="text-orange-500 fill-orange-500" />
                  </div>
                  <span className="text-slate-500 text-sm">
                    Most active {activeHoursTab === "Hours" ? "time" : "day"}:{' '}
                    <strong className="text-slate-800">
                      {activeHoursPeak
                        ? activeHoursTab === "Hours"
                          ? `${activeHoursPeak.name % 12 || 12} ${activeHoursPeak.name >= 12 ? "PM" : "AM"}`
                          : activeHoursPeak.name
                        : "--"}
                    </strong>
                  </span>

                </div>

                <div className={`rounded-[2rem] border p-6 ${isDarkMode ? "border-white/10 bg-slate-950/40" : "border-slate-200 bg-white"}`}>
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                    <div className={`inline-flex rounded-xl border ${isDarkMode ? "border-white/10 bg-slate-900/60" : "border-slate-100 bg-slate-50"}`}>
                      {["Weekdays", "Days of week", "Hours"].map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setActiveHoursTab(tab)}
                          className={`px-5 py-2 text-sm font-bold rounded-lg transition-all ${activeHoursTab === tab
                            ? "bg-[#3b82f6] text-white shadow-md shadow-blue-200"
                            : "text-slate-400 hover:text-slate-500"
                            }`}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2.5 bg-gradient-to-r from-blue-100 to-blue-500 rounded-full"></div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">High</span>
                      <HelpCircle size={14} className="text-slate-300" />
                    </div>
                  </div>

                  <div className="h-[320px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={activeHoursChartData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }} barGap={8}>
                        <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }} dy={12} tickFormatter={activeHoursTab === "Hours" ? formatHourTick : undefined} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                        <Tooltip content={<ActiveHoursTooltip />} cursor={{ fill: 'transparent' }} position={{ y: -20 }} />
                        <Bar dataKey="clicks" radius={[8, 8, 4, 4]} barSize={activeHoursTab === "Days of week" ? 60 : 40}>
                          {activeHoursChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={activeHoursPeak && entry.clicks == activeHoursPeak.clicks ? '#3b82f6' : '#bfdbfe'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="flex justify-end mt-8">
                    <div className="inline-flex items-center gap-3 bg-slate-50/80 backdrop-blur-sm px-5 py-2.5 rounded-full border border-slate-100">
                      <span className="text-xs font-bold text-slate-400 uppercase">Low</span>
                      <div className="relative w-40 h-2.5 bg-gradient-to-r from-blue-100 via-blue-400 to-blue-600 rounded-full"></div>
                      <span className="text-sm font-bold text-slate-800">High</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-[1fr_1.3fr_0.7fr] gap-4">
                <div className="space-y-4">
                  <div className={`rounded-3xl border p-6 ${cardClass}`}>
                    <h3 className="text-sm font-bold mb-4">Top Links</h3>
                    <div className="space-y-3">
                      {stats.topLinks.slice(0, 3).map((link, idx) => (
                        <div key={link.linkUrl} className="flex items-center justify-between text-sm">
                          <span className="truncate">{idx + 1}. {link.linkText || link.linkUrl}</span>
                          <span className="text-emerald-400 font-semibold">{link.count}</span>
                        </div>
                      ))}
                      {stats.topLinks.length === 0 && (
                        <p className={isDarkMode ? "text-xs text-slate-500" : "text-xs text-slate-400"}>No data yet.</p>
                      )}
                    </div>
                  </div>

                  <div className={`rounded-3xl border p-6 ${cardClass}`}>
                    <h3 className="text-sm font-bold mb-4">Tech Breakdown</h3>
                    <div className="space-y-4">
                      {[
                        { title: "Browsers", data: browserSlices },
                        { title: "Operating Systems", data: osSlices },
                        { title: "Devices", data: deviceSlices },
                      ].map((item) => (
                        <div key={item.title} className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-14 h-14 rounded-full relative"
                              style={{
                                background: buildDonutGradient(
                                  item.data.slices,
                                  donutColors
                                ),
                              }}
                            >
                              <div
                                className={`absolute inset-2 rounded-full ${isDarkMode ? "bg-slate-950" : "bg-white"
                                  }`}
                              ></div>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-slate-400">
                                {item.title}
                              </p>
                              <div className="mt-1 text-[11px] space-y-1">
                                {item.data.slices.slice(0, 2).map((slice) => (
                                  <div key={slice.label} className="flex items-center gap-2">
                                    <span className="truncate max-w-[110px]">
                                      {slice.label}
                                    </span>
                                    <span className="font-semibold">
                                      {slice.pct}%
                                    </span>
                                  </div>
                                ))}
                                {item.data.slices.length === 0 && (
                                  <span
                                    className={
                                      isDarkMode
                                        ? "text-slate-500"
                                        : "text-slate-400"
                                    }
                                  >
                                    No data
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="text-xs text-slate-500">
                            {item.data.total ? `${item.data.total} views` : ""}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className={`rounded-3xl border p-6 ${cardClass}`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold">Top Countries</h3>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setMapMode("countries")}
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${mapMode === "countries"
                          ? "bg-slate-900 text-white"
                          : "bg-slate-200 text-slate-600"
                          }`}
                      >
                        Countries
                      </button>
                      <button
                        type="button"
                        onClick={() => setMapMode("cities")}
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${mapMode === "cities"
                          ? "bg-slate-900 text-white"
                          : "bg-slate-200 text-slate-600"
                          }`}
                      >
                        Cities
                      </button>
                      <Globe2 className="w-4 h-4 text-slate-400" />
                    </div>
                  </div>
                  <div
                    className={`relative h-64 rounded-2xl border overflow-hidden mb-4 ${isDarkMode ? "bg-slate-50 border-slate-200" : "bg-slate-50 border-slate-200"
                      }`}
                  >
                    <div
                      className="absolute inset-0"
                      style={{
                        backgroundImage:
                          "radial-gradient(circle at 20% 30%, rgba(59,130,246,0.08), transparent 55%), radial-gradient(circle at 80% 70%, rgba(16,185,129,0.06), transparent 55%)",
                      }}
                    />
                    <ComposableMap
                      projectionConfig={{ scale: 225 }}
                      className="absolute inset-0 w-full h-full"
                    >
                      <Geographies geography={geographyUrl}>
                        {({ geographies }) =>
                          geographies.map((geo) => (
                            <Geography
                              key={geo.rsmKey}
                              geography={geo}
                              fill={
                                mapMode === "countries" &&
                                  highlightCountries.has(
                                    String(geo.properties?.name || "")
                                      .toLowerCase()
                                      .trim()
                                  )
                                  ? "#1d4ed8"
                                  : "#d1d5db"
                              }
                              stroke="#ffffff"
                              strokeWidth={0.6}
                            />
                          ))
                        }
                      </Geographies>
                      {mapMode === "cities" &&
                        cityMarkers.map((point) => (
                          <Marker
                            key={`${point.label}-${point.lat}-${point.lon}`}
                            coordinates={[point.lon, point.lat]}
                          >
                            <circle r={3.5} fill="#1d4ed8" />
                            <circle r={7} fill="rgba(29,78,216,0.25)" />
                          </Marker>
                        ))}
                    </ComposableMap>
                  </div>
                  <div className="space-y-2 text-xs">
                    {(mapMode === "cities" ? stats.locations : topCountries).map((item, idx) => (
                      <div key={item.label} className="flex items-center justify-between">
                        <span>
                          {idx + 1}. {item.label}
                        </span>
                        <span className="font-semibold text-sky-400">
                          {item.count}
                        </span>
                      </div>
                    ))}

                    {(mapMode === "cities" ? stats.locations : topCountries).length === 0 && (
                      <span className={isDarkMode ? "text-slate-500" : "text-slate-400"}>
                        No data yet.
                      </span>
                    )}
                  </div>
                </div>

                <div className={`rounded-3xl border p-6 ${cardClass}`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold">Live Activity</h3>
                    <Activity className="w-4 h-4 text-slate-400" />
                  </div>
                  <div className="space-y-4 text-sm">
                    {stats.referrers.slice(0, 4).map((row, idx) => (
                      <div key={`${row.label}-${idx}`} className="flex items-center justify-between gap-3">
                        <span className={isDarkMode ? "text-slate-400" : "text-slate-500"}>Now</span>
                        <span className="font-semibold truncate">{row.label}</span>
                        <span className="text-emerald-400 text-xs">{row.count}</span>
                      </div>
                    ))}
                    {stats.referrers.length === 0 && (
                      <span className={isDarkMode ? "text-slate-500" : "text-slate-400"}>No live activity yet.</span>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      )}
      {activeSection === "urlshortener" && !shortLinksQuery.isLoading && !shortLinksError && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <div
              className={`p-6 rounded-[2rem] border shadow-sm ${isDarkMode ? "bg-slate-900/80 border-slate-800" : "bg-white border-slate-200"
                }`}
            >
              <p className={isDarkMode ? "text-xs font-bold uppercase tracking-wider mb-2 text-slate-400" : "text-xs font-bold uppercase tracking-wider mb-2 text-slate-500"}>
                Total Links
              </p>
              <h3 className="text-5xl font-black tracking-tighter">{totalShortLinks}</h3>
              <div className="text-xs font-bold mt-4 text-emerald-600">
                Active: {activeShortLinks}
              </div>
            </div>
            <div
              className={`p-6 rounded-[2rem] border shadow-sm ${isDarkMode ? "bg-slate-900/80 border-slate-800" : "bg-white border-slate-200"
                }`}
            >
              <p className={isDarkMode ? "text-xs font-bold uppercase tracking-wider mb-2 text-slate-400" : "text-xs font-bold uppercase tracking-wider mb-2 text-slate-500"}>
                Total Clicks
              </p>
              <h3 className="text-5xl font-black tracking-tighter">{totalShortClicks}</h3>
              <div className="text-xs font-bold mt-4 text-emerald-600">
                Avg per link: {avgShortClicks}
              </div>
            </div>
            <div
              className={`p-6 rounded-[2rem] border shadow-sm ${isDarkMode ? "bg-slate-900/80 border-slate-800" : "bg-white border-slate-200"
                }`}
            >
              <p className={isDarkMode ? "text-xs font-bold uppercase tracking-wider mb-2 text-slate-400" : "text-xs font-bold uppercase tracking-wider mb-2 text-slate-500"}>
                Active Links
              </p>
              <h3 className="text-5xl font-black tracking-tighter">{activeShortLinks}</h3>
              <div className="text-xs font-bold mt-4 text-emerald-600">
                {totalShortLinks ? Math.round((activeShortLinks / totalShortLinks) * 100) : 0}% active
              </div>
            </div>
            <div
              className={`p-6 rounded-[2rem] border shadow-sm ${isDarkMode ? "bg-slate-900/80 border-slate-800" : "bg-white border-slate-200"
                }`}
            >
              <p className={isDarkMode ? "text-xs font-bold uppercase tracking-wider mb-2 text-slate-400" : "text-xs font-bold uppercase tracking-wider mb-2 text-slate-500"}>
                Avg Clicks
              </p>
              <h3 className="text-5xl font-black tracking-tighter">{avgShortClicks}</h3>
              <div className="text-xs font-bold mt-4 text-emerald-600">Per link</div>
            </div>
          </div>

          {totalShortLinks === 0 ? (
            <div
              className={`p-10 rounded-[2rem] border shadow-sm text-center ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
                }`}
            >
              <h3 className="text-xl font-bold mb-2">No short links yet</h3>
              <p className={isDarkMode ? "text-slate-500 text-sm mb-6" : "text-slate-500 text-sm mb-6"}>
                Create your first short link to start tracking clicks.
              </p>
              <Link
                href="/URLshorten"
                className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold ${isDarkMode ? "bg-white text-black" : "bg-slate-900 text-white"
                  }`}
              >
                Create a short link
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div
                className={`p-8 rounded-[2rem] border shadow-sm ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
                  }`}
              >
                <h3 className="font-bold mb-6">Top Short Links</h3>
                <div className="space-y-3">
                  {topShortLinks.map((link) => (
                    <div
                      key={link._id}
                      className={`p-4 rounded-2xl border flex items-center justify-between gap-4 ${isDarkMode ? "border-slate-800 bg-slate-950/40" : "border-slate-200 bg-slate-50"
                        }`}
                    >
                      <div className="min-w-0">
                        <p className="font-semibold text-sm truncate max-w-[220px]">
                          {link.title || link.shortCode}
                        </p>
                        <p className={isDarkMode ? "text-slate-500 text-xs truncate max-w-[220px]" : "text-slate-500 text-xs truncate max-w-[220px]"}>
                          /{link.shortCode}
                        </p>
                      </div>
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-500">
                        {link.clicks} clicks
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div
                className={`p-8 rounded-[2rem] border shadow-sm ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
                  }`}
              >
                <h3 className="font-bold mb-6">Click Distribution</h3>
                <div className="space-y-4">
                  {topShortLinks.map((link) => {
                    const width = totalShortClicks
                      ? Math.max(10, Math.round((link.clicks / totalShortClicks) * 100))
                      : 10;
                    return (
                      <div key={link._id} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium truncate max-w-[220px]">
                            {link.title || link.shortCode}
                          </span>
                          <span className="text-xs font-bold text-indigo-500">{link.clicks}</span>
                        </div>
                        <div
                          className={`h-2 rounded-full overflow-hidden ${isDarkMode ? "bg-white/10" : "bg-slate-100"
                            }`}
                        >
                          <div className="h-full bg-indigo-500" style={{ width: `${width}%` }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
