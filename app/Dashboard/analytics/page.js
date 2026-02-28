"use client";

import React, { Suspense, useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
} from "recharts";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/Authenticate";
import { useQuery } from "@tanstack/react-query";
import {
  ExternalLink,
  Loader2,
  Globe2,
  Activity,
  TrendingUp,
  TrendingDown,
  ChevronDown,
  ChevronRight,
  Flame,
  Filter,
  Smartphone,
  Monitor,
  Share2,
  Users,
  Eye,
  MousePointer2,
  X,
} from "lucide-react";
import WorldMap from "@/Components/DashboardComponents/WorldMap";

const DAY_CHIP_ORDER = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DAY_TO_ORDERED_INDEX = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};
const ANALYTICS_SECTIONS = [
  { key: "profile", label: "My Profile" },
  { key: "linkinbio", label: "Link in Bio" },
  { key: "urlshortener", label: "URL Shortener" },
];


function AnalyticsContent() {
  const { theme } = useTheme();
  const { user, loading: authLoading } = useAuth();
  const isDarkMode = theme === "dark";
  const searchParams = useSearchParams();

  const activeSection = useMemo(() => {
    const candidate = (searchParams.get("section") || "profile").toLowerCase();
    return ANALYTICS_SECTIONS.some((section) => section.key === candidate)
      ? candidate
      : "profile";
  }, [searchParams]);

  const needsBioAnalytics = activeSection !== "urlshortener";

  const [range, setRange] = useState(30);
  const mapMode = "countries";
  const [engagementMode, setEngagementMode] = useState("date");
  const [selectedDay, setSelectedDay] = useState("Mon");
  const [showHourlyDetails, setShowHourlyDetails] = useState(false);
  const [fullDetailsTab, setFullDetailsTab] = useState("links");
  const [showFullMap, setShowFullMap] = useState(false);
  const [fullMapView, setFullMapView] = useState("countries");
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
      console.log("posthog analytics data", data);
      if (!res.ok) throw new Error(data?.error || "Failed to load analytics.");
      return data;
    },
  });

  
  React.useEffect(() => {
    if (!analyticsQuery.data) return;
    setStats(analyticsQuery.data);
  }, [analyticsQuery.data]);

  React.useEffect(() => {
    if (!showFullMap) return undefined;

    const onKeyDown = (event) => {
      if (event.key === "Escape") setShowFullMap(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [showFullMap]);

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

  const topCountries = stats.countries.slice(0, 5);
  const avgTimeSeconds = Number(stats.avgTimeSeconds || 0);
  const avgTimeLabel = avgTimeSeconds
    ? `${Math.floor(avgTimeSeconds / 60)}m ${String(Math.round(avgTimeSeconds % 60)).padStart(2, "0")}s`
    : "--";

  // const sparklineData = useMemo(() => {
  //   return (stats.series && stats.series.length > 0)
  //     ? stats.series.slice(-7).map(d => ({ value: Number(d.count || 0) }))
  //     : [...Array(7)].map(() => ({ value: 1 }));
  // }, [stats.series]);

  // const visitorsSparklineData = useMemo(() => {
  //   return (stats.visitorsSeries && stats.visitorsSeries.length > 0)
  //     ? stats.visitorsSeries.slice(-7).map(d => ({ value: Number(d.count || 0) }))
  //     : [...Array(7)].map(() => ({ value: 1 }));
  // }, [stats.visitorsSeries]);

  const countryList = useMemo(() => {
    const total = stats.countries.reduce((sum, c) => sum + Number(c.count || 0), 0);
    return stats.countries.slice(0, 5).map(c => {
      const pct = total > 0 ? Math.round((Number(c.count) / total) * 100) : 0;
      return { code: c.label.substring(0, 2).toUpperCase(), label: c.label, pct };
    });
  }, [stats.countries]);

  const trafficSourcesList = useMemo(() => {
    const total = stats.referrers.reduce((sum, r) => sum + Number(r.count || 0), 0);
    return stats.referrers.slice(0, 4).map(source => {
      const label = source.label || "";
      const lower = label.toLowerCase();
      let icon = "REF", color = "bg-slate-500", light = "bg-slate-100", name = label;

      if (lower.includes("instagram")) { icon = "IG"; color = "bg-pink-500"; light = "bg-pink-100"; name = "Instagram"; }
      else if (lower.includes("twitter") || lower.includes("t.co") || lower.includes("x.com")) { icon = "X"; color = "bg-slate-800"; light = "bg-slate-100"; name = "X / Twitter"; }
      else if (lower === "direct" || lower === "$direct") { icon = "DIR"; color = "bg-indigo-500"; light = "bg-indigo-100"; name = "Direct"; }
      else if (lower.includes("facebook") || lower.includes("fb.com")) { icon = "FB"; color = "bg-blue-600"; light = "bg-blue-100"; name = "Facebook"; }
      else if (lower.includes("youtube") || lower.includes("youtu.be")) { icon = "YT"; color = "bg-red-500"; light = "bg-red-100"; name = "YouTube"; }
      else if (lower.includes("tiktok")) { icon = "TT"; color = "bg-black"; light = "bg-slate-200"; name = "TikTok"; }
      else { icon = "REF"; color = "bg-emerald-500"; light = "bg-emerald-100"; name = label.replace(/(^\w+:|^)\/\//, '').substring(0, 15) || "Referral"; }

      const pct = total > 0 ? Math.round((Number(source.count || 0) / total) * 100) : 0;
      return { label: name, pct, icon, color, light, count: source.count };
    });
  }, [stats.referrers]);

  const highlightCountries = useMemo(() => {
    return (stats.countries || [])
      .map((country) => ({
        label: String(country.label || "").trim(),
        count: Number(country.count || 0),
      }))
      .filter((country) => country.label);
  }, [stats.countries]);

  const formatHourTick = (hour) => `${String(hour).padStart(2, "0")}:00`;


  const cityMarkers = useMemo(() => {
    return (stats.locationPoints || [])
      .filter(
        (point) =>
          Number.isFinite(point.lat) &&
          Number.isFinite(point.lon) &&
          point.label
      )
      .map((point) => ({
        ...point,
        count: Number.isFinite(Number(point.count)) ? Number(point.count) : 0,
      }));
  }, [stats.locationPoints]);

  const fullCountryList = useMemo(() => {
    const rows = Array.isArray(stats.countries) ? stats.countries : [];
    const total = rows.reduce((sum, row) => sum + Number(row.count || 0), 0);
    return rows
      .map((row) => {
        const count = Number(row.count || 0);
        return {
          label: String(row.label || "Unknown"),
          count,
          pct: total > 0 ? Math.round((count / total) * 100) : 0,
        };
      })
      .sort((a, b) => b.count - a.count);
  }, [stats.countries]);

  const fullCityList = useMemo(() => {
    const locationRows = Array.isArray(stats.locations) ? stats.locations : [];
    const normalized = locationRows.length > 0
      ? locationRows.map((row) => ({
          label: String(row.label || row.city || "Unknown"),
          count: Number(row.count || row.visits || 0),
        }))
      : cityMarkers.map((row) => ({
          label: String(row.label || "Unknown"),
          count: Number(row.count || 0),
        }));

    const total = normalized.reduce((sum, row) => sum + Number(row.count || 0), 0);
    return normalized
      .map((row) => ({
        ...row,
        pct: total > 0 ? Math.round((Number(row.count || 0) / total) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count);
  }, [stats.locations, cityMarkers]);

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

  const selectedDayIndex = DAY_TO_ORDERED_INDEX[selectedDay] ?? 1;

  const activeHoursChartData = useMemo(() => {
    const dayViews = orderedDayHourMatrix[selectedDayIndex] || Array.from({ length: 24 }, () => 0);
    const dayUniques = orderedDayHourUniqueMatrix[selectedDayIndex] || Array.from({ length: 24 }, () => 0);

    return Array.from({ length: 24 }).map((_, hour) => {
      return {
        hour,
        hourLabel: `${String(hour).padStart(2, "0")}:00`,
        views: Number(dayViews[hour] || 0),
        uniques: Number(dayUniques[hour] || 0),
      };
    });
  }, [orderedDayHourMatrix, orderedDayHourUniqueMatrix, selectedDayIndex]);

  const hasEngagementData = useMemo(
    () => activeHoursChartData.some((entry) => Number(entry.views || 0) > 0 || Number(entry.uniques || 0) > 0),
    [activeHoursChartData]
  );

  const dayHasHourlyDataMap = useMemo(() => {
    const map = {};
    DAY_CHIP_ORDER.forEach((day) => {
      const idx = DAY_TO_ORDERED_INDEX[day];
      const dayViews = orderedDayHourMatrix[idx] || [];
      const dayUniques = orderedDayHourUniqueMatrix[idx] || [];
      map[day] = dayViews.some((v) => Number(v || 0) > 0) || dayUniques.some((v) => Number(v || 0) > 0);
    });
    return map;
  }, [orderedDayHourMatrix, orderedDayHourUniqueMatrix]);

  React.useEffect(() => {
    if (dayHasHourlyDataMap[selectedDay]) return;
    const firstDayWithData = DAY_CHIP_ORDER.find((day) => dayHasHourlyDataMap[day]);
    if (firstDayWithData && firstDayWithData !== selectedDay) {
      setSelectedDay(firstDayWithData);
    }
  }, [dayHasHourlyDataMap, selectedDay]);

  const hourlyTotals = useMemo(() => {
    return activeHoursChartData.reduce(
      (acc, row) => {
        acc.views += Number(row.views || 0);
        acc.uniques += Number(row.uniques || 0);
        return acc;
      },
      { views: 0, uniques: 0 }
    );
  }, [activeHoursChartData]);

  const hourlyPeak = useMemo(() => {
    if (!activeHoursChartData.length) return null;
    return activeHoursChartData.reduce((max, row) =>
      Number(row.views || 0) > Number(max.views || 0) ? row : max
    );
  }, [activeHoursChartData]);

  const topHourlySlots = useMemo(() => {
    return [...activeHoursChartData]
      .sort((a, b) => Number(b.views || 0) - Number(a.views || 0))
      .slice(0, 5);
  }, [activeHoursChartData]);

  const referrerTotal = stats.referrers.reduce(
    (sum, row) => sum + Number(row.count || 0),
    0
  );

  const sourceBars = useMemo(() => {
    const palette = ["#E1306C", "#582be8", "#111827", "#1D9BF0", "#16a34a", "#94a3b8"];
    return (stats.referrers || []).slice(0, 5).map((row, idx) => ({
      label: row.label || "Unknown",
      pct: referrerTotal ? Math.round((Number(row.count || 0) / referrerTotal) * 100) : 0,
      count: Number(row.count || 0),
      color: palette[idx % palette.length],
    }));
  }, [stats.referrers, referrerTotal]);

  const geoList = useMemo(() => {
    const total = stats.countries.reduce((sum, c) => sum + Number(c.count || 0), 0);
    return stats.countries.slice(0, 4).map((country) => ({
      country: country.label || "Unknown",
      visits: Number(country.count || 0),
      percentage: total ? Math.round((Number(country.count || 0) / total) * 100) : 0,
    }));
  }, [stats.countries]);

  const deviceDistribution = useMemo(() => {
    const total = stats.devices.reduce((sum, d) => sum + Number(d.count || 0), 0);
    const withPct = stats.devices.map((device) => {
      const label = String(device.label || "Unknown");
      const lower = label.toLowerCase();
      const pct = total ? Math.round((Number(device.count || 0) / total) * 100) : 0;
      let Icon = Monitor;
      if (lower.includes("mobile") || lower.includes("iphone") || lower.includes("android")) Icon = Smartphone;
      else if (lower.includes("tablet") || lower.includes("ipad")) Icon = Share2;
      return { label, pct, Icon };
    });
    return withPct.sort((a, b) => b.pct - a.pct).slice(0, 3);
  }, [stats.devices]);

  const secondaryPeak = topHourlySlots.find(
    (slot) => slot?.hour !== hourlyPeak?.hour && Number(slot.views || 0) > 0
  );

  const dateWiseEngagementData = useMemo(() => {
    const visitorsByDate = new Map(
      (stats.visitorsSeries || []).map((entry) => [
        String(entry.date || ""),
        Number(entry.visitors || 0),
      ])
    );

    return (stats.series || []).slice(-14).map((entry) => {
      const rawDate = String(entry.date || "");
      const parsedDate = new Date(`${rawDate}T00:00:00`);
      const isValidDate = !Number.isNaN(parsedDate.getTime());
      return {
        date: rawDate,
        label: isValidDate
          ? parsedDate.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })
          : rawDate,
        views: Number(entry.views || 0),
        clicks: Number(entry.clicks || 0),
        visitors: Number(visitorsByDate.get(rawDate) || 0),
      };
    });
  }, [stats.series, stats.visitorsSeries]);

  const hasDateWiseData = useMemo(
    () =>
      dateWiseEngagementData.some(
        (entry) =>
          Number(entry.views || 0) > 0 ||
          Number(entry.clicks || 0) > 0 ||
          Number(entry.visitors || 0) > 0
      ),
    [dateWiseEngagementData]
  );

  const ActiveHoursTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload.length) return null;
    const row = payload[0]?.payload || {};
    const label = formatHourTick(Number(row.hour || 0));
    const views = Number(row.views || 0);
    const uniques = Number(row.uniques || 0);

    return (
      <div className="relative pointer-events-none">
        <div className="bg-[#1e293b] text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 min-w-fit">
          <p className="text-sm font-bold leading-tight">{label}</p>
          <p className="text-xs text-slate-300 mt-1">Views: {views}</p>
          <p className="text-xs text-slate-300">Uniques: {uniques}</p>

        </div>

        {/* Arrow */}
        <div className="absolute left-1/4 -bottom-2 -translate-x-1/2 w-4 h-4 bg-[#1e293b] rotate-45 rounded-sm" />
      </div>
    );
  };

  const handleOpenHourlyDetails = () => {
    setEngagementMode("hour");
    setShowHourlyDetails(true);
    if (typeof window !== "undefined") {
      window.requestAnimationFrame(() => {
        document
          .getElementById("hourly-full-details")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  };

  const DateWiseTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload.length) return null;
    const row = payload[0]?.payload || {};
    const label = String(row.label || row.date || "");
    const views = Number(row.views || 0);
    const clicks = Number(row.clicks || 0);
    const visitors = Number(row.visitors || 0);

    return (
      <div className="relative pointer-events-none">
        <div className="bg-[#1e293b] text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 min-w-fit">
          <p className="text-sm font-bold leading-tight">{label}</p>
          <p className="text-xs text-slate-300 mt-1">Views: {views}</p>
          <p className="text-xs text-slate-300">Clicks: {clicks}</p>
          <p className="text-xs text-slate-300">Visitors: {visitors}</p>
        </div>
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

  const browserSlices = buildSlices(stats.browserBreakdown);
  const deviceSlices = buildSlices(stats.devices);

  const deviceUsageList = useMemo(() => {
    return deviceSlices.slices.map((slice) => {
      const lower = slice.label.toLowerCase();
      let icon = "📱"; let color = "bg-indigo-600"; let border = "";
      if (lower === "desktop" || lower === "mac" || lower === "windows") { icon = "💻"; color = "bg-slate-400"; }
      else if (lower === "tablet" || lower === "ipad") { icon = "🖥️"; color = "bg-slate-200"; border = isDarkMode ? "border-slate-800" : "border-slate-100"; }
      return { label: slice.label, pct: slice.pct, color, icon, border };
    });
  }, [deviceSlices.slices, isDarkMode]);

  const topBrowserList = useMemo(() => {
    return browserSlices.slices.map(slice => ({
      label: slice.label.toUpperCase(),
      pct: slice.pct
    }));
  }, [browserSlices.slices]);

  const formatCompactNumber = (value) =>
    new Intl.NumberFormat("en-US", {
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(Number(value || 0));

  const getPeriodDelta = (currentValue, previousValue) => {
    const current = Number(currentValue || 0);
    const previous = Number(previousValue || 0);

    if (previous <= 0 && current <= 0) return { change: 0, trend: "flat" };
    if (previous <= 0 && current > 0) return { change: 100, trend: "up" };

    const change = Math.round(((current - previous) / previous) * 100);
    if (change > 0) return { change, trend: "up" };
    if (change < 0) return { change, trend: "down" };
    return { change: 0, trend: "flat" };
  };

  const seriesRows = Array.isArray(stats.series) ? stats.series : [];
  const visitorsRows = Array.isArray(stats.visitorsSeries)
    ? stats.visitorsSeries
    : [];
  const periodSplit = Math.max(1, Math.floor(seriesRows.length / 2));
  const recentRows = seriesRows.slice(periodSplit);
  const previousRows = seriesRows.slice(0, periodSplit);
  const visitorsSplit = Math.max(1, Math.floor(visitorsRows.length / 2));
  const recentVisitorsRows = visitorsRows.slice(visitorsSplit);
  const previousVisitorsRows = visitorsRows.slice(0, visitorsSplit);

  const sumField = (rows, key) =>
    rows.reduce((sum, row) => sum + Number(row?.[key] || 0), 0);
  const sumVisitors = (rows) =>
    rows.reduce(
      (sum, row) => sum + Number(row?.count ?? row?.visitors ?? 0),
      0
    );

  const recentViews = sumField(recentRows, "views");
  const previousViews = sumField(previousRows, "views");
  const recentClicks = sumField(recentRows, "clicks");
  const previousClicks = sumField(previousRows, "clicks");
  const recentVisitors = sumVisitors(recentVisitorsRows);
  const previousVisitors = sumVisitors(previousVisitorsRows);
  const recentCtr = recentViews > 0 ? (recentClicks / recentViews) * 100 : 0;
  const previousCtr =
    previousViews > 0 ? (previousClicks / previousViews) * 100 : 0;

  const viewsDelta = getPeriodDelta(recentViews, previousViews);
  const visitorsDelta = getPeriodDelta(recentVisitors, previousVisitors);
  const ctrDelta = getPeriodDelta(recentCtr, previousCtr);

  const metricCards = [
    {
      label: "Total Views",
      value: rangeTotals.views.toLocaleString(),
      helper: `${formatCompactNumber(recentViews)} recent views`,
      // spark: sparklineData,
      barColor: "#6366f1",
      tone:
        viewsDelta.trend === "up"
          ? "text-emerald-500"
          : viewsDelta.trend === "down"
            ? "text-rose-500"
            : isDarkMode
              ? "text-slate-400"
              : "text-slate-500",
      deltaLabel:
        viewsDelta.trend === "flat"
          ? "Stable"
          : `${viewsDelta.change > 0 ? "+" : ""}${viewsDelta.change}%`,
      TrendIcon:
        viewsDelta.trend === "down"
          ? TrendingDown
          : viewsDelta.trend === "up"
            ? TrendingUp
            : Activity,
    },
    {
      label: "Unique Visitors",
      value: stats.uniqueVisitors.toLocaleString(),
      helper: `${formatCompactNumber(recentVisitors)} recent uniques`,
      // spark: visitorsSparklineData,
      barColor: "#0ea5e9",
      tone:
        visitorsDelta.trend === "up"
          ? "text-emerald-500"
          : visitorsDelta.trend === "down"
            ? "text-rose-500"
            : isDarkMode
              ? "text-slate-400"
              : "text-slate-500",
      deltaLabel:
        visitorsDelta.trend === "flat"
          ? "Stable"
          : `${visitorsDelta.change > 0 ? "+" : ""}${visitorsDelta.change}%`,
      TrendIcon:
        visitorsDelta.trend === "down"
          ? TrendingDown
          : visitorsDelta.trend === "up"
            ? TrendingUp
            : Activity,
    },
    {
      label: "Average CTR",
      value: `${ctr}%`,
      helper: `${rangeTotals.clicks.toLocaleString()} clicks captured`,
      // spark: sparklineData,
      barColor: "#10b981",
      tone:
        ctrDelta.trend === "up"
          ? "text-emerald-500"
          : ctrDelta.trend === "down"
            ? "text-rose-500"
            : isDarkMode
              ? "text-slate-400"
              : "text-slate-500",
      deltaLabel:
        ctrDelta.trend === "flat"
          ? "Stable"
          : `${ctrDelta.change > 0 ? "+" : ""}${ctrDelta.change}%`,
      TrendIcon:
        ctrDelta.trend === "down"
          ? TrendingDown
          : ctrDelta.trend === "up"
            ? TrendingUp
            : Activity,
    },
    {
      label: "Avg. Duration",
      value: avgTimeLabel,
      helper: "Average time spent per visitor",
      // spark: sparklineData,
      barColor: "#f59e0b",
      tone: isDarkMode ? "text-slate-400" : "text-slate-500",
      deltaLabel: "Engagement depth",
      TrendIcon: Flame,
    },
  ];

  const shortLinksError = shortLinksQuery.error?.message || "";
  const showBioLoading = needsBioAnalytics && analyticsQuery.isLoading;
  const showShortLoading =
    activeSection === "urlshortener" && shortLinksQuery.isLoading;
  const showLoading = authLoading || showBioLoading || showShortLoading;
  const cardClass = isDarkMode
    ? "bg-slate-950 border-slate-800 shadow-[0_12px_24px_rgba(2,6,23,0.38)]"
    : "bg-white border-slate-200 shadow-[0_8px_20px_rgba(15,23,42,0.08)]";

  return (
    <div className="space-y-4 md:space-y-6 animate-in fade-in duration-300 max-w-[1500px]">
      <h1 className={`text-2xl md:text-3xl font-black tracking-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}>
        Analtyics
      </h1>

      <div className={`grid grid-cols-1 sm:grid-cols-3 gap-2 p-1.5 rounded-2xl border ${isDarkMode ? "border-slate-800 bg-slate-900/70" : "border-slate-200 bg-slate-50"}`}>
        {ANALYTICS_SECTIONS.map((section) => {
          const isActive = section.key === activeSection;
          return (
            <Link
              key={section.key}
              href={`/Dashboard/analytics?section=${section.key}`}
              className={`px-4 py-3 min-h-11 text-center rounded-xl text-xs font-bold uppercase tracking-[0.12em] transition-colors duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/60 ${isActive
                ? isDarkMode
                  ? "bg-white text-slate-950 shadow-[0_8px_20px_rgba(255,255,255,0.16)]"
                  : "bg-slate-900 text-white shadow-[0_8px_18px_rgba(15,23,42,0.18)]"
                : isDarkMode
                  ? "text-slate-400 hover:bg-white/10 hover:text-white"
                  : "text-slate-500 hover:bg-white hover:text-slate-900"
                }`}
            >
              {section.label}
            </Link>
          );
        })}
      </div>

      {showLoading && (
        <div
          className={`rounded-3xl border p-5 md:p-6 flex items-center gap-3 text-sm font-semibold ${isDarkMode
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
          className={`rounded-3xl border p-5 md:p-6 text-sm font-semibold ${isDarkMode
            ? "bg-slate-900 border-slate-800 text-slate-300"
            : "bg-white border-slate-200 text-slate-700"
            }`}
        >
          Connect a bio profile to start tracking analytics.
        </div>
      )}

      {(error || shortLinksError) && (
        <div
          className={`rounded-3xl border p-5 md:p-6 text-sm font-semibold ${isDarkMode
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
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6 md:mb-8">
                {metricCards.map((card) => {
                  const TrendIcon = card.TrendIcon;
                  return (
                    <div key={card.label} className={`rounded-2xl border p-4 md:p-5 ${isDarkMode ? "border-slate-800 bg-slate-950" : "border-slate-200 bg-white shadow-[0_8px_22px_rgba(15,23,42,0.08)]"}`}>
                      <div className="flex items-center justify-between gap-2">
                        <p className={`text-[11px] font-bold uppercase tracking-[0.12em] ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                          {card.label}
                        </p>
                        <span className={`inline-flex items-center gap-1 text-xs font-bold ${card.tone}`}>
                          <TrendIcon className="w-3.5 h-3.5" />
                          {card.deltaLabel}
                        </span>
                      </div>
                      <div className="mt-3 flex items-end justify-between gap-3">
                        <div>
                          <p className="text-2xl md:text-3xl font-black leading-none">{card.value}</p>
                          <p className={`text-xs mt-2 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>{card.helper}</p>
                        </div>
                        <div className="w-20 h-12">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={card.spark}>
                              <Bar dataKey="value" fill={card.barColor} radius={[4, 4, 0, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
                {/* Engagement Peaks */}
                <div className={`xl:col-span-2 rounded-3xl border p-4 md:p-6 flex flex-col ${cardClass}`}>
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6 md:mb-8">
                    <div>
                      <h3 className="text-xl font-bold">Engagement Peaks</h3>
                      <p className={`text-sm mt-1 mb-4 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                        {engagementMode === "hour"
                          ? `When do your ${selectedDay} peaks happen?`
                          : "Date-wise engagement trend"}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-3">
                      <div className={`inline-flex rounded-2xl border p-1 ${isDarkMode ? "border-slate-800 bg-slate-900/50" : "border-slate-200 bg-slate-50"}`}>
                        <button
                          onClick={() => setEngagementMode("date")}
                          className={`px-3 py-2 min-h-11 text-xs font-bold rounded-xl transition-colors duration-200 ease-out ${
                            engagementMode === "date"
                              ? "bg-white text-indigo-600 shadow-sm"
                              : isDarkMode
                                ? "text-slate-400 hover:text-slate-300"
                                : "text-slate-500 hover:text-slate-700"
                          }`}
                        >
                          Date-wise
                        </button>
                        <button
                          onClick={() => setEngagementMode("hour")}
                          className={`px-3 py-2 min-h-11 text-xs font-bold rounded-xl transition-colors duration-200 ease-out ${
                            engagementMode === "hour"
                              ? "bg-white text-indigo-600 shadow-sm"
                              : isDarkMode
                                ? "text-slate-400 hover:text-slate-300"
                                : "text-slate-500 hover:text-slate-700"
                          }`}
                        >
                          Hour-wise
                        </button>
                      </div>
                      {engagementMode === "hour" && (
                        <div className={`inline-flex flex-wrap rounded-2xl border p-1 max-w-[360px] ${isDarkMode ? "border-slate-800 bg-slate-900/50" : "border-slate-200 bg-slate-50"}`}>
                          {DAY_CHIP_ORDER.map((day) => (
                            <button
                              key={day}
                              onClick={() => setSelectedDay(day)}
                              className={`px-3 py-2 min-h-11 text-xs font-bold rounded-xl transition-colors duration-200 ease-out ${selectedDay === day
                                ? "bg-white text-indigo-600 shadow-sm"
                                : isDarkMode ? "text-slate-400 hover:text-slate-300" : "text-slate-500 hover:text-slate-700"
                                }`}
                            >
                              {day}
                            </button>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center gap-4 text-xs font-bold">
                        {engagementMode === "hour" ? (
                          <>
                            <div className="flex items-center gap-1.5">
                              <div className="w-2 h-2 rounded-full bg-indigo-600"></div>
                              <span className={isDarkMode ? "text-slate-300" : "text-slate-600"}>Views</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                              <span className={isDarkMode ? "text-slate-300" : "text-slate-600"}>Uniques</span>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="flex items-center gap-1.5">
                              <div className="w-2 h-2 rounded-full bg-indigo-600"></div>
                              <span className={isDarkMode ? "text-slate-300" : "text-slate-600"}>Views</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                              <span className={isDarkMode ? "text-slate-300" : "text-slate-600"}>Clicks</span>
                            </div>
                          </>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={handleOpenHourlyDetails}
                        className={`text-xs font-bold underline-offset-4 hover:underline ${
                          isDarkMode ? "text-indigo-400" : "text-indigo-600"
                        }`}
                      >
                        Full details
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 min-h-[220px] md:min-h-[250px] w-full mt-auto">
                    {engagementMode === "hour" ? (
                      hasEngagementData ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <ComposedChart
                            data={activeHoursChartData}
                            margin={{ top: 8, right: 0, left: -12, bottom: 0 }}
                          >
                            <defs>
                              <linearGradient id="hourlyViewsFill" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#4f46e5" stopOpacity={0.18} />
                                <stop offset="100%" stopColor="#4f46e5" stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid
                              vertical={false}
                              strokeDasharray="3 5"
                              stroke={isDarkMode ? "#334155" : "#cbd5e1"}
                            />
                            <YAxis
                              axisLine={false}
                              tickLine={false}
                              width={34}
                              tick={{ fill: isDarkMode ? "#64748b" : "#94a3b8", fontSize: 11, fontWeight: 600 }}
                              allowDecimals={false}
                              tickCount={5}
                            />
                            <XAxis
                              dataKey="hourLabel"
                              axisLine={false}
                              tickLine={false}
                              tick={{ fill: isDarkMode ? '#64748b' : '#94a3b8', fontSize: 10, fontWeight: 600 }}
                              dy={10}
                            />
                            <Tooltip content={<ActiveHoursTooltip />} cursor={{ fill: isDarkMode ? '#1e293b' : '#f1f5f9' }} />
                            <Area
                              type="monotone"
                              dataKey="views"
                              fill="url(#hourlyViewsFill)"
                              stroke="none"
                              isAnimationActive={false}
                            />
                            <Line
                              type="monotone"
                              dataKey="views"
                              stroke="#4f46e5"
                              strokeWidth={4}
                              dot={false}
                              isAnimationActive={false}
                            />
                            <Line
                              type="monotone"
                              dataKey="uniques"
                              stroke="#10b981"
                              strokeWidth={2.5}
                              strokeDasharray="4 4"
                              dot={false}
                              isAnimationActive={false}
                            />
                          </ComposedChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className={`h-full flex items-center justify-center text-sm font-medium ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>
                          No hourly engagement data for {selectedDay}.
                        </div>
                      )
                    ) : hasDateWiseData ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={dateWiseEngagementData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }} barGap={4} barSize={14}>
                          <XAxis
                            dataKey="label"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: isDarkMode ? '#64748b' : '#94a3b8', fontSize: 10, fontWeight: 600 }}
                            dy={10}
                          />
                          <Tooltip content={<DateWiseTooltip />} cursor={{ fill: isDarkMode ? '#1e293b' : '#f1f5f9' }} />
                          <Bar dataKey="views" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="clicks" fill="#34d399" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className={`h-full flex items-center justify-center text-sm font-medium ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>
                        No date-wise engagement data yet.
                      </div>
                    )}
                  </div>
                </div>

                {/* Traffic Sources */}
                <div className={`rounded-3xl border p-4 md:p-6 flex flex-col ${cardClass}`}>
                  <div className="flex items-start justify-between mb-6 md:mb-8">
                    <div>
                      <h3 className="text-xl font-bold">Traffic Sources</h3>
                      <p className={`text-sm mt-1 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                        How users find your link
                      </p>
                    </div>
                    <button className={`p-2 rounded-xl transition-colors ${isDarkMode ? "hover:bg-white/5 text-slate-400 hover:text-white" : "hover:bg-black/5 text-slate-400 hover:text-slate-900"}`}>
                      <ExternalLink size={18} />
                    </button>
                  </div>

                  <div className="flex-1 space-y-4 md:space-y-6">
                    {trafficSourcesList.length > 0 ? trafficSourcesList.map((source, idx) => (
                      <div key={idx} className="flex items-center justify-between gap-3 group">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs ${source.light} ${isDarkMode && 'bg-opacity-10'} ${source.color.replace('bg-', 'text-')}`}>
                            {source.icon}
                          </div>
                          <span className="font-bold text-sm truncate max-w-[130px] sm:max-w-[170px]">{source.label}</span>
                        </div>
                        <div className="flex flex-col items-end gap-1.5 w-16">
                          <span className="font-black text-sm">{source.pct}%</span>
                          <div className={`h-1.5 w-full rounded-full ${isDarkMode ? "bg-slate-800" : "bg-slate-100"}`}>
                            <div className={`h-full rounded-full ${source.color}`} style={{ width: `${source.pct}%` }}></div>
                          </div>
                        </div>
                      </div>
                    )) : (
                      <span className={isDarkMode ? "text-slate-500" : "text-slate-400"}>No traffic source data yet.</span>
                    )}
                  </div>

                  <button className={`w-full py-3 min-h-11 mt-5 md:mt-6 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-colors duration-200 ease-out ${isDarkMode ? "bg-white/5 hover:bg-white/10 text-white" : "bg-slate-50 hover:bg-slate-100 text-slate-900"}`}>
                    Detailed Referral Log
                    <ChevronDown size={16} className="-rotate-90" />
                  </button>
                </div>
              </div>

              {showHourlyDetails && (
                <div id="hourly-full-details" className={`rounded-3xl border p-4 md:p-6 mb-6 md:mb-8 ${isDarkMode ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"}`}>
                  <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 className="text-xl font-black">Engagement Insights</h3>
                      <p className={`text-sm mt-1 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                        {selectedDay} deep dive with real link, source, and geography data.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowHourlyDetails(false)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-xl border ${
                        isDarkMode
                          ? "border-slate-700 text-slate-300 hover:bg-slate-900"
                          : "border-slate-200 text-slate-600 hover:bg-white"
                      }`}
                    >
                      Close
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                    <div className="lg:col-span-2 space-y-4 md:space-y-6">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className={`rounded-2xl border p-4 ${isDarkMode ? "border-slate-800 bg-slate-900" : "border-slate-200 bg-white"}`}>
                          <Eye className="w-4 h-4 text-indigo-500 mb-2" />
                          <p className={`text-[11px] font-bold uppercase ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>Views</p>
                          <p className="text-xl font-black mt-1">{rangeTotals.views.toLocaleString()}</p>
                        </div>
                        <div className={`rounded-2xl border p-4 ${isDarkMode ? "border-slate-800 bg-slate-900" : "border-slate-200 bg-white"}`}>
                          <Users className="w-4 h-4 text-emerald-500 mb-2" />
                          <p className={`text-[11px] font-bold uppercase ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>Unique</p>
                          <p className="text-xl font-black mt-1">{stats.uniqueVisitors.toLocaleString()}</p>
                        </div>
                        <div className={`rounded-2xl border p-4 ${isDarkMode ? "border-slate-800 bg-slate-900" : "border-slate-200 bg-white"}`}>
                          <MousePointer2 className="w-4 h-4 text-amber-500 mb-2" />
                          <p className={`text-[11px] font-bold uppercase ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>Clicks</p>
                          <p className="text-xl font-black mt-1">{rangeTotals.clicks.toLocaleString()}</p>
                        </div>
                        <div className={`rounded-2xl border p-4 ${isDarkMode ? "border-slate-800 bg-slate-900" : "border-slate-200 bg-white"}`}>
                          <TrendingUp className="w-4 h-4 text-violet-500 mb-2" />
                          <p className={`text-[11px] font-bold uppercase ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>CTR</p>
                          <p className="text-xl font-black mt-1">{ctr}%</p>
                        </div>
                      </div>

                      <div className={`rounded-2xl border overflow-hidden ${isDarkMode ? "border-slate-800 bg-slate-900" : "border-slate-200 bg-white"}`}>
                        <div className={`p-4 border-b flex items-center justify-between ${isDarkMode ? "border-slate-800" : "border-slate-100"}`}>
                          <h4 className="font-bold">Link Performance</h4>
                          <div className={`inline-flex rounded-lg p-1 ${isDarkMode ? "bg-slate-800" : "bg-slate-100"}`}>
                            <button
                              onClick={() => setFullDetailsTab("links")}
                              className={`px-3 py-1.5 text-xs font-bold rounded-md ${
                                fullDetailsTab === "links"
                                  ? "bg-white text-indigo-600 shadow-sm"
                                  : isDarkMode
                                    ? "text-slate-300"
                                    : "text-slate-500"
                              }`}
                            >
                              Top Links
                            </button>
                            <button
                              onClick={() => setFullDetailsTab("sources")}
                              className={`px-3 py-1.5 text-xs font-bold rounded-md ${
                                fullDetailsTab === "sources"
                                  ? "bg-white text-indigo-600 shadow-sm"
                                  : isDarkMode
                                    ? "text-slate-300"
                                    : "text-slate-500"
                              }`}
                            >
                              Top Sources
                            </button>
                          </div>
                        </div>

                        {fullDetailsTab === "links" ? (
                          <div className="overflow-x-auto">
                            <table className="w-full min-w-[520px] text-left">
                              <thead>
                                <tr className={`text-[10px] uppercase tracking-[0.12em] ${isDarkMode ? "text-slate-500 bg-slate-950" : "text-slate-400 bg-slate-50"}`}>
                                  <th className="px-4 py-3">Link</th>
                                  <th className="px-4 py-3">Clicks</th>
                                  <th className="px-4 py-3">Share</th>
                                  <th className="px-4 py-3 text-right">Action</th>
                                </tr>
                              </thead>
                              <tbody className={isDarkMode ? "divide-y divide-slate-800" : "divide-y divide-slate-100"}>
                                {stats.topLinks.slice(0, 5).map((link, idx) => {
                                  const share = rangeTotals.clicks
                                    ? Math.round((Number(link.count || 0) / Number(rangeTotals.clicks || 1)) * 100)
                                    : 0;
                                  return (
                                    <tr key={`${link.linkUrl}-${idx}`} className={isDarkMode ? "hover:bg-slate-950/70" : "hover:bg-slate-50"}>
                                      <td className="px-4 py-3 min-w-0">
                                        <p className="font-semibold text-sm truncate max-w-[180px] sm:max-w-[260px]">{link.linkText || link.linkUrl || "Untitled link"}</p>
                                        <p className={`text-xs truncate max-w-[180px] sm:max-w-[280px] ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>{link.linkUrl || "No URL"}</p>
                                      </td>
                                      <td className="px-4 py-3 text-sm font-bold">{Number(link.count || 0).toLocaleString()}</td>
                                      <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                          <div className={`h-1.5 w-16 rounded-full ${isDarkMode ? "bg-slate-800" : "bg-slate-100"}`}>
                                            <div className="h-full rounded-full bg-indigo-600" style={{ width: `${share}%` }} />
                                          </div>
                                          <span className="text-xs font-semibold">{share}%</span>
                                        </div>
                                      </td>
                                      <td className="px-4 py-3 text-right">
                                        <span className="text-xs font-bold text-indigo-500 inline-flex items-center gap-1">
                                          View <ChevronRight className="w-3 h-3" />
                                        </span>
                                      </td>
                                    </tr>
                                  );
                                })}
                                {stats.topLinks.length === 0 && (
                                  <tr>
                                    <td colSpan={4} className={`px-4 py-6 text-sm text-center ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>
                                      No link click data yet.
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <div className="p-4 space-y-3">
                            {sourceBars.map((src, idx) => (
                              <div key={`${src.label}-${idx}`}>
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-sm font-semibold truncate max-w-[70%]">{src.label}</span>
                                  <span className="text-sm font-bold">{src.pct}%</span>
                                </div>
                                <div className={`h-2 rounded-full ${isDarkMode ? "bg-slate-800" : "bg-slate-100"}`}>
                                  <div className="h-full rounded-full" style={{ width: `${src.pct}%`, backgroundColor: src.color }} />
                                </div>
                              </div>
                            ))}
                            {sourceBars.length === 0 && (
                              <p className={`text-sm ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>No source data yet.</p>
                            )}
                          </div>
                        )}
                      </div>

                      <div className={`rounded-2xl border p-5 ${isDarkMode ? "border-slate-800 bg-slate-900" : "border-slate-200 bg-white"}`}>
                        <div className="flex items-center justify-between mb-5">
                          <div>
                            <h4 className="font-bold">Hourly Peak Analysis</h4>
                            <p className={`text-xs mt-1 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>Deep dive into behavior for {selectedDay}</p>
                          </div>
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-indigo-500 bg-indigo-50 px-3 py-1.5 rounded-lg">
                            {selectedDay} peaks <Filter className="w-3 h-3" />
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-3">
                            <div className={`rounded-xl border p-4 ${isDarkMode ? "border-indigo-500/30 bg-indigo-500/10" : "border-indigo-100 bg-indigo-50"}`}>
                              <p className="text-xs font-bold uppercase text-indigo-500 mb-1">Primary Peak</p>
                              <p className="text-2xl font-black">
                                {hourlyPeak ? `${String(hourlyPeak.hour).padStart(2, "0")}:00` : "--"}
                              </p>
                              <p className={`text-xs mt-1 ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
                                {hourlyPeak ? `${hourlyPeak.views} views and ${hourlyPeak.uniques} uniques` : "No peak data"}
                              </p>
                            </div>
                            <div className={`rounded-xl border p-4 ${isDarkMode ? "border-slate-800 bg-slate-950" : "border-slate-100 bg-slate-50"}`}>
                              <p className={`text-xs font-bold uppercase ${isDarkMode ? "text-slate-400" : "text-slate-500"} mb-1`}>Secondary Peak</p>
                              <p className="text-xl font-black">
                                {secondaryPeak ? `${String(secondaryPeak.hour).padStart(2, "0")}:00` : "--"}
                              </p>
                              <p className={`text-xs mt-1 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                                {secondaryPeak ? `${secondaryPeak.views} views` : "No secondary peak"}
                              </p>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <p className={`text-xs font-bold uppercase ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>Device Distribution</p>
                            {deviceDistribution.map((device, idx) => (
                              <div key={`${device.label}-${idx}`} className="flex items-center gap-3">
                                <device.Icon className={`w-4 h-4 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`} />
                                <div className="flex-1">
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs font-bold">{device.label}</span>
                                    <span className={`text-xs ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>{device.pct}%</span>
                                  </div>
                                  <div className={`h-1.5 rounded-full ${isDarkMode ? "bg-slate-800" : "bg-slate-100"}`}>
                                    <div className="h-full rounded-full bg-slate-800" style={{ width: `${device.pct}%` }} />
                                  </div>
                                </div>
                              </div>
                            ))}
                            {deviceDistribution.length === 0 && (
                              <p className={`text-sm ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>No device data yet.</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 md:space-y-6">
                      <div className={`rounded-2xl border p-4 md:p-5 ${isDarkMode ? "border-slate-800 bg-slate-900" : "border-slate-200 bg-white"}`}>
                        <h4 className="font-bold mb-4">Traffic Sources</h4>
                        <div className="space-y-3">
                          {sourceBars.map((src, idx) => (
                            <div key={`${src.label}-${idx}`}>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-semibold truncate max-w-[70%]">{src.label}</span>
                                <span className="text-sm font-bold">{src.pct}%</span>
                              </div>
                              <div className={`h-2 rounded-full ${isDarkMode ? "bg-slate-800" : "bg-slate-100"}`}>
                                <div className="h-full rounded-full" style={{ width: `${src.pct}%`, backgroundColor: src.color }} />
                              </div>
                            </div>
                          ))}
                          {sourceBars.length === 0 && (
                            <p className={`text-sm ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>No source data yet.</p>
                          )}
                        </div>
                      </div>

                      <div className={`rounded-2xl border p-4 md:p-5 ${isDarkMode ? "border-slate-800 bg-slate-900" : "border-slate-200 bg-white"}`}>
                        <h4 className="font-bold mb-4 flex items-center gap-2">
                          <Globe2 className="w-4 h-4 text-indigo-500" /> Geographic
                        </h4>
                        <div className="space-y-3">
                          {geoList.map((geo, idx) => (
                            <div key={`${geo.country}-${idx}`} className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-semibold">{geo.country}</p>
                                <p className={`text-xs ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>{geo.visits.toLocaleString()} visits</p>
                              </div>
                              <span className={`text-xs font-black px-2 py-1 rounded-md ${isDarkMode ? "bg-slate-800 text-slate-300" : "bg-slate-100 text-slate-700"}`}>
                                {geo.percentage}%
                              </span>
                            </div>
                          ))}
                          {geoList.length === 0 && (
                            <p className={`text-sm ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>No country data yet.</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
                {/* Geographic Distribution */}
                <div className={`xl:col-span-2 rounded-3xl border p-4 md:p-6 flex flex-col md:flex-row gap-5 md:gap-8 ${cardClass}`}>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-5 md:mb-6">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl ${isDarkMode ? "bg-indigo-500/20 text-indigo-400" : "bg-indigo-50 text-indigo-600"}`}>
                          <Globe2 size={24} />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold">Geographic Distribution</h3>
                          <p className={`text-sm ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>Visitor locations across the globe</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setFullMapView("countries");
                          setShowFullMap(true);
                        }}
                        className={`text-sm font-bold text-indigo-600 ${isDarkMode ? "hover:text-indigo-400" : "hover:text-indigo-800"}`}
                      >
                        View Full Map
                      </button>
                    </div>

                    <div
                      className={`h-[230px] sm:h-64 w-full relative rounded-2xl overflow-hidden border ${
                        isDarkMode
                          ? "bg-[#f6f7f3] border-slate-700/40"
                          : "bg-[#f6f7f3] border-slate-200"
                      }`}
                    >
                      <WorldMap
                        mapMode={mapMode}
                        highlightCountries={highlightCountries}
                        cityMarkers={cityMarkers}
                        isDarkMode={isDarkMode}
                      />
                    </div>
                  </div>
                  <div className="w-full md:w-[350px] flex flex-col justify-center space-y-4 md:space-y-6">
                    {countryList.length > 0 ? countryList.map((country, idx) => (
                      <div key={idx} className="flex flex-col gap-2">
                        <div className="flex items-center justify-between font-bold text-sm">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-400 text-xs w-6">{country.code}</span>
                            <span className="truncate max-w-[180px]">{country.label}</span>
                          </div>
                          <span>{country.pct}%</span>
                        </div>
                        <div className={`h-1.5 w-full rounded-full ${isDarkMode ? "bg-slate-800" : "bg-slate-100"}`}>
                          <div className={`h-full rounded-full ${idx === 0 ? "bg-indigo-600" : "bg-indigo-300"}`} style={{ width: `${country.pct}%` }}></div>
                        </div>
                      </div>
                    )) : (
                      <span className={isDarkMode ? "text-slate-500" : "text-slate-400"}>No country data yet.</span>
                    )}
                  </div>
                </div>

                {/* Content Performance */}
                <div id="content-performance" className={`xl:col-span-2 rounded-3xl border p-4 md:p-6 flex flex-col ${cardClass}`}>
                  <div className="flex items-center justify-between mb-5 md:mb-6">
                    <h3 className="text-xl font-bold">Content Performance</h3>
                    {/* <button className={`text-sm font-bold text-indigo-600 ${isDarkMode ? "hover:text-indigo-400" : "hover:text-indigo-800"}`}>
                      Full Report
                    </button> */}
                  </div>
                  <div className="space-y-3 md:space-y-4">
                    {stats.topLinks.slice(0, 3).map((link, idx) => (
                      <div key={link.linkUrl} className={`p-4 rounded-2xl flex items-center justify-between gap-3 ${isDarkMode ? "bg-slate-900/50" : "bg-slate-50"}`}>
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="font-bold text-slate-400 w-4">{idx + 1}</span>
                          <span className="font-semibold truncate max-w-[160px] sm:max-w-[260px] md:max-w-md">{link.linkText || link.linkUrl}</span>
                        </div>
                        <span className="font-bold">{link.count} <span className="text-slate-400 text-xs font-normal">views</span></span>
                      </div>
                    ))}
                    {stats.topLinks.length === 0 && (
                      <p className={`text-center py-4 text-sm ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>No content data yet.</p>
                    )}
                  </div>
                </div>

                {/* Device Usage */}
                <div className={`rounded-3xl border p-4 md:p-6 flex flex-col ${cardClass}`}>
                  <h3 className="text-xl font-bold mb-6 md:mb-8">Device Usage</h3>
                  <div className="space-y-4 md:space-y-6">
                    {deviceUsageList.map((device, idx) => (
                      <div key={idx} className="flex flex-col gap-2">
                        <div className="flex items-center justify-between text-sm font-bold">
                          <div className="flex items-center gap-3">
                            <span className="opacity-50 grayscale">{device.icon}</span>
                            <span>{device.label}</span>
                          </div>
                          <span>{device.pct}%</span>
                        </div>
                        <div className={`h-1.5 w-full rounded-full ${isDarkMode ? "bg-slate-800" : "bg-slate-100"} ${device.border && 'border ' + device.border}`}>
                          <div className={`h-full rounded-full ${device.color}`} style={{ width: `${device.pct}%` }}></div>
                        </div>
                      </div>
                    ))}
                    {deviceUsageList.length === 0 && (
                      <span className={isDarkMode ? "text-slate-500" : "text-slate-400"}>No device data yet.</span>
                    )}
                  </div>
                </div>

                {/* Top Browser */}
                <div className={`rounded-3xl border p-4 md:p-6 flex flex-col ${cardClass}`}>
                  <h3 className="text-xl font-bold mb-5 md:mb-6">Top Browser</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {topBrowserList.length > 0 ? topBrowserList.slice(0, 4).map((browser, idx) => (
                      <div key={idx} className={`p-4 rounded-2xl border flex flex-col gap-1 ${isDarkMode ? "border-slate-800 bg-slate-900/30" : "border-slate-100 bg-white shadow-sm"}`}>
                        <span className={`text-xs font-bold tracking-wider truncate ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>{browser.label}</span>
                        <span className="text-2xl font-black">{browser.pct}%</span>
                      </div>
                    )) : (
                      <span className={`col-span-2 ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>No browser data yet.</span>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <div
              className={`p-5 md:p-6 rounded-3xl border ${cardClass} ${isDarkMode ? "" : ""
                }`}
            >
              <div className="flex items-center justify-between mb-2">
                <p className={isDarkMode ? "text-xs font-bold uppercase tracking-wider text-slate-400" : "text-xs font-bold uppercase tracking-wider text-slate-500"}>
                Total Links
                </p>
                <Share2 className={isDarkMode ? "w-4 h-4 text-indigo-400" : "w-4 h-4 text-indigo-600"} />
              </div>
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter">{totalShortLinks}</h3>
              <div className="text-xs font-bold mt-4 text-emerald-600">
                Active: {activeShortLinks}
              </div>
            </div>
            <div
              className={`p-5 md:p-6 rounded-3xl border ${cardClass} ${isDarkMode ? "" : ""
                }`}
            >
              <div className="flex items-center justify-between mb-2">
                <p className={isDarkMode ? "text-xs font-bold uppercase tracking-wider text-slate-400" : "text-xs font-bold uppercase tracking-wider text-slate-500"}>
                Total Clicks
                </p>
                <MousePointer2 className={isDarkMode ? "w-4 h-4 text-emerald-400" : "w-4 h-4 text-emerald-600"} />
              </div>
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter">{totalShortClicks}</h3>
              <div className="text-xs font-bold mt-4 text-emerald-600">
                Avg per link: {avgShortClicks}
              </div>
            </div>
            <div
              className={`p-5 md:p-6 rounded-3xl border ${cardClass} ${isDarkMode ? "" : ""
                }`}
            >
              <div className="flex items-center justify-between mb-2">
                <p className={isDarkMode ? "text-xs font-bold uppercase tracking-wider text-slate-400" : "text-xs font-bold uppercase tracking-wider text-slate-500"}>
                Active Links
                </p>
                <Activity className={isDarkMode ? "w-4 h-4 text-amber-400" : "w-4 h-4 text-amber-600"} />
              </div>
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter">{activeShortLinks}</h3>
              <div className="text-xs font-bold mt-4 text-emerald-600">
                {totalShortLinks ? Math.round((activeShortLinks / totalShortLinks) * 100) : 0}% active
              </div>
            </div>
            <div
              className={`p-5 md:p-6 rounded-3xl border ${cardClass} ${isDarkMode ? "" : ""
                }`}
            >
              <div className="flex items-center justify-between mb-2">
                <p className={isDarkMode ? "text-xs font-bold uppercase tracking-wider text-slate-400" : "text-xs font-bold uppercase tracking-wider text-slate-500"}>
                Avg Clicks
                </p>
                <TrendingUp className={isDarkMode ? "w-4 h-4 text-violet-400" : "w-4 h-4 text-violet-600"} />
              </div>
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter">{avgShortClicks}</h3>
              <div className="text-xs font-bold mt-4 text-emerald-600">Per link</div>
            </div>
          </div>

          {totalShortLinks === 0 ? (
            <div
              className={`p-8 md:p-10 rounded-3xl border text-center ${cardClass} ${isDarkMode ? "" : ""
                }`}
            >
              <h3 className="text-xl font-bold mb-2">No short links yet</h3>
              <p className={isDarkMode ? "text-slate-500 text-sm mb-6" : "text-slate-500 text-sm mb-6"}>
                Create your first short link to start tracking clicks.
              </p>
              <Link
                href="/URLshorten"
                className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold ${isDarkMode ? "bg-white text-black" : "bg-slate-900 text-white"
                  } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/60`}
              >
                Create a short link
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div
                className={`p-6 md:p-8 rounded-3xl border ${cardClass} ${isDarkMode ? "" : ""
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
                className={`p-6 md:p-8 rounded-3xl border ${cardClass} ${isDarkMode ? "" : ""
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

      {showFullMap && (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            aria-label="Close full map"
            onClick={() => setShowFullMap(false)}
            className="absolute inset-0 bg-black/55"
          />

          <div className="absolute inset-0 p-3 sm:p-5 md:p-8">
            <div className={`h-full w-full rounded-3xl border overflow-hidden flex flex-col ${isDarkMode ? "bg-slate-950 border-slate-800" : "bg-white border-slate-200"}`}>
              <div className={`px-4 py-3 md:px-6 md:py-4 border-b flex items-center justify-between ${isDarkMode ? "border-slate-800" : "border-slate-200"}`}>
                <div>
                  <h3 className="text-base md:text-lg font-black">Geographic Distribution</h3>
                  <p className={`text-xs md:text-sm ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                    Full map view of visitor locations
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`inline-flex rounded-xl border p-1 ${isDarkMode ? "border-slate-700 bg-slate-900" : "border-slate-200 bg-slate-50"}`}>
                    <button
                      type="button"
                      onClick={() => setFullMapView("countries")}
                      className={`px-3 py-2 text-xs font-bold rounded-lg min-h-10 ${
                        fullMapView === "countries"
                          ? isDarkMode
                            ? "bg-white text-slate-900"
                            : "bg-slate-900 text-white"
                          : isDarkMode
                            ? "text-slate-300"
                            : "text-slate-600"
                      }`}
                    >
                      Countries
                    </button>
                    <button
                      type="button"
                      onClick={() => setFullMapView("cities")}
                      className={`px-3 py-2 text-xs font-bold rounded-lg min-h-10 ${
                        fullMapView === "cities"
                          ? isDarkMode
                            ? "bg-white text-slate-900"
                            : "bg-slate-900 text-white"
                          : isDarkMode
                            ? "text-slate-300"
                            : "text-slate-600"
                      }`}
                    >
                      Cities
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowFullMap(false)}
                    className={`inline-flex items-center justify-center h-10 w-10 rounded-xl border ${isDarkMode ? "border-slate-700 text-slate-300 hover:bg-slate-900" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex-1 min-h-0 flex flex-col lg:grid lg:grid-cols-[1fr_320px]">
                <div className={`relative h-[42vh] min-h-[250px] sm:min-h-[300px] lg:h-auto lg:min-h-0 ${isDarkMode ? "bg-[#f6f7f3]" : "bg-[#f6f7f3]"}`}>
                  <WorldMap
                    mapMode={fullMapView}
                    highlightCountries={highlightCountries}
                    cityMarkers={cityMarkers}
                    isDarkMode={isDarkMode}
                  />
                </div>

                <div className={`border-t lg:border-t-0 lg:border-l p-4 md:p-5 overflow-y-auto min-h-0 flex-1 ${isDarkMode ? "border-slate-800" : "border-slate-200"}`}>
                  <p className={`text-xs font-bold uppercase tracking-[0.12em] mb-4 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                    {fullMapView === "countries" ? `All Countries (${fullCountryList.length})` : `All Cities (${fullCityList.length})`}
                  </p>
                  <div className="space-y-3">
                    {(fullMapView === "countries" ? fullCountryList : fullCityList).length > 0 ? (fullMapView === "countries" ? fullCountryList : fullCityList).map((item, idx) => (
                      <div key={`${item.label}-${idx}`} className="space-y-1.5">
                        <div className="flex items-center justify-between text-sm font-semibold">
                          <span className="truncate pr-3">{item.label}</span>
                          <span>{item.pct}%</span>
                        </div>
                        <div className={`h-1.5 w-full rounded-full ${isDarkMode ? "bg-slate-800" : "bg-slate-100"}`}>
                          <div className={`h-full rounded-full ${idx === 0 ? "bg-indigo-600" : "bg-indigo-400"}`} style={{ width: `${item.pct}%` }} />
                        </div>
                        <p className={`text-[11px] ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                          {Number(item.count || 0).toLocaleString()} visits
                        </p>
                      </div>
                    )) : (
                      <p className={`text-sm ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>
                        {fullMapView === "countries" ? "No country data yet." : "No city data yet."}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AnalyticsTab() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AnalyticsContent />
    </Suspense>
  );
}
