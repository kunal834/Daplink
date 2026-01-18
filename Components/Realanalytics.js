'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { geoMercator, geoPath } from 'd3-geo';
import * as topojson from 'topojson-client';
import { Users, Globe, Clock, ChevronDown } from 'lucide-react';

// --- DUMMY DATA ---
const chartData = [
  { name: 'Dec 22', visitors: 400, pageviews: 800, duration: 200 },
  { name: 'Dec 26', visitors: 900, pageviews: 1400, duration: 180 },
  { name: 'Dec 30', visitors: 1100, pageviews: 1600, duration: 220 },
  { name: 'Jan 4', visitors: 750, pageviews: 1100, duration: 190 },
  { name: 'Jan 8', visitors: 1200, pageviews: 1900, duration: 250 },
  { name: 'Jan 12', visitors: 900, pageviews: 1500, duration: 210 },
  { name: 'Jan 16', visitors: 1000, pageviews: 1700, duration: 230 },
];

const statCards = [
  { title: 'Visitors', value: '12.4k', icon: Users },
  { title: 'Pageviews', value: '24.8k', icon: Globe },
  { title: 'Duration', value: '2m 7s', icon: Clock },
];

const revenueStats = [
  { title: 'MRR', value: '$2.48k' },
  { title: 'Revenue', value: '$4.85k' },
  { title: 'Conv. %', value: '3.24%' },
];

const highValueVisitors = [
  { source: 'google.com', value: '$1.6k' },
  { source: '/pricing', value: '$894' },
  { source: 'United States', value: '$789' },
  { source: 'California', value: '$456' },
  { source: 'San Francisco', value: '$345' },
  { source: 'google', value: '$1.2k' },
];

const topPages = [
  { path: '/', value: '$1.6k', visits: '4,523', color: 'bg-emerald-500' },
  { path: '/pricing', value: '$2.3k', visits: '2,341', color: 'bg-emerald-500' },
  { path: '/docs', value: '$450', visits: '1,876', color: 'bg-emerald-500' },
  { path: '/blog', value: '$234', visits: '1,243', color: 'bg-emerald-500' },
  { path: '/about', value: '$123', visits: '987', color: 'bg-emerald-500' },
];

const topReferrers = [
  { source: 'google.com', visits: '3,421' },
  { source: 'twitter.com', visits: '1,876' },
  { source: 'Direct', visits: '1,543' },
  { source: 'chatgpt.com', visits: '1,234' },
];

// --- HELPER FOR STYLES ---
const getStyles = (isDark) => ({
  bg: isDark ? 'bg-black' : 'bg-zinc-50',
  card: isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm',
  textMain: isDark ? 'text-white' : 'text-zinc-900',
  textSub: isDark ? 'text-zinc-400' : 'text-zinc-500',
  border: isDark ? 'border-zinc-800' : 'border-zinc-200',
  gridColor: isDark ? '#333' : '#e5e7eb', // For Charts
  tooltipBg: isDark ? '#18181b' : '#ffffff', // For Charts
  mapFill: isDark ? '#27272a' : '#e4e4e7', // Zinc-800 vs Zinc-200
  mapStroke: isDark ? '#3f3f46' : '#d4d4d8',
});

// --- SUB-COMPONENTS ---

const OverviewChart = ({ isDark }) => {
  const styles = getStyles(isDark);
  
  return (
    <div className={`col-span-1 lg:col-span-2 rounded-2xl p-4 border transition-colors duration-300 ${styles.card}`}>
      <h3 className={`text-xs mb-4 ${styles.textSub}`}>Traffic Overview</h3>
      <div className="h-[300px] w-full min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorPageviews" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#eab308" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#eab308" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorDuration" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={styles.gridColor} vertical={false} />
            <XAxis dataKey="name" tick={{ fill: isDark ? '#71717a' : '#a1a1aa', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: isDark ? '#71717a' : '#a1a1aa', fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: styles.tooltipBg, 
                border: isDark ? 'none' : '1px solid #e5e7eb', 
                borderRadius: '8px',
                color: isDark ? '#fff' : '#000',
                boxShadow: isDark ? 'none' : '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
              }} 
            />
            <Area type="monotone" dataKey="visitors" stroke="#ef4444" fillOpacity={1} fill="url(#colorVisitors)" strokeWidth={2} />
            <Area type="monotone" dataKey="pageviews" stroke="#eab308" fillOpacity={1} fill="url(#colorPageviews)" strokeWidth={2} />
            <Area type="monotone" dataKey="duration" stroke="#22c55e" fillOpacity={1} fill="url(#colorDuration)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const MetricBlocks = ({ isDark }) => {
  const styles = getStyles(isDark);
  return (
    <div className="col-span-1 grid grid-cols-2 gap-4">
      {/* Top 3 Metrics */}
      <div className={`col-span-2 grid grid-cols-3 gap-2 rounded-2xl p-4 border transition-colors duration-300 ${styles.card}`}>
        {statCards.map((stat, idx) => (
          <div key={idx}>
            <div className={`flex items-center text-xs mb-1 ${styles.textSub}`}>
              <stat.icon size={12} className="mr-1" /> {stat.title}
            </div>
            <div className={`text-xl font-bold ${styles.textMain}`}>{stat.value}</div>
          </div>
        ))}
      </div>
      {/* Revenue & Conv Stats */}
      {revenueStats.map((stat, idx) => (
        <div key={idx} className={`rounded-2xl p-4 border transition-colors duration-300 ${styles.card}`}>
          <div className={`text-xs mb-1 ${styles.textSub}`}>{stat.title}</div>
          <div className={`text-xl font-bold ${styles.textMain}`}>{stat.value}</div>
        </div>
      ))}
    </div>
  );
};

const HighValueVisitorsCard = ({ isDark }) => {
  const styles = getStyles(isDark);
  return (
    <div className={`col-span-1 rounded-2xl p-4 border transition-colors duration-300 ${styles.card}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className={`text-sm font-medium ${styles.textMain}`}>High Value Visitors</h3>
        <div className={`text-xs ${styles.textSub}`}>{`#1 #2 #3`}</div>
      </div>
      <div className="space-y-3">
        {highValueVisitors.map((item, idx) => (
          <div key={idx} className="flex justify-between items-center text-sm">
            <div className={`flex items-center ${styles.textSub}`}>
              <div className="w-4 h-4 bg-zinc-500/20 rounded-full mr-2"></div>
              {item.source}
            </div>
            <div className={`font-medium ${styles.textMain}`}>{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const RealTimeMap = ({ isDark }) => {
  const styles = getStyles(isDark);
  const [geographies, setGeographies] = useState([]);

  useEffect(() => {
    fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
      .then((response) => response.json())
      .then((data) => {
        const features = topojson.feature(data, data.objects.countries).features;
        setGeographies(features);
        console.log(data)
      });
  }, []);

  const projection = useMemo(() => {
    return geoMercator().scale(80).translate([180, 140]).center([0, 20]);
  }, []);

  const pathGenerator = useMemo(() => {
    return geoPath().projection(projection);
  }, [projection]);

  const activeCountries = ["United States", "United Kingdom", "Germany", "India"];

  return (
    <div className={`col-span-1 lg:col-span-2 rounded-2xl p-4 border relative overflow-hidden transition-colors duration-300 ${styles.card}`}>
      <div className="absolute top-4 left-4 z-10 pointer-events-none">
        <div className={`text-lg font-bold ${styles.textMain}`}>35 visitors online</div>
        <div className={`text-xs flex items-center mt-1 ${styles.textSub}`}>
          <span className="relative flex h-2 w-2 mr-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          Live activity
        </div>
      </div>

      <div className="h-[300px] w-full ml-10 mt-10">
        <svg viewBox="0 0 600 350" className="w-full h-full">
          <g>
            {geographies.map((geo, i) => {
              const isActive = activeCountries.includes(geo.properties.name);
              return (
                <path
                  key={i}
                  d={pathGenerator(geo)}
                  fill={isActive ? "#ef4444" : styles.mapFill}
                  stroke={styles.mapStroke}
                  strokeWidth={0.5}
                  className="transition-colors duration-300"
                />
              );
            })}
          </g>
          <circle cx={projection([-74, 40])[0]} cy={projection([-74, 40])[1]} r="3" fill="#ef4444" className="animate-ping" />
          <circle cx={projection([-74, 40])[0]} cy={projection([-74, 40])[1]} r="2" fill={isDark ? "white" : "black"} />
          
          <circle cx={projection([10, 51])[0]} cy={projection([10, 51])[1]} r="3" fill="#ef4444" className="animate-ping" />
          <circle cx={projection([10, 51])[0]} cy={projection([10, 51])[1]} r="2" fill={isDark ? "white" : "black"} />
        </svg>
      </div>
    </div>
  );
};

const DataTables = ({ isDark }) => {
  const styles = getStyles(isDark);
  return (
    <div className="col-span-1 lg:col-span-2 grid grid-cols-2 gap-4">
      {/* Pages Table */}
      <div className={`rounded-2xl p-4 border font-mono text-sm transition-colors duration-300 ${styles.card}`}>
        <div className={`flex justify-between items-center mb-4 text-xs ${styles.textSub}`}>
          <div>Pages</div>
          <div className="flex space-x-2">
            <span className={`cursor-pointer ${styles.textMain}`}>Top</span>
            <span className="cursor-pointer">Entry</span>
            <span className="cursor-pointer">Exit</span>
          </div>
        </div>
        <div className="space-y-2">
          {topPages.map((page, idx) => (
            <div key={idx} className="relative flex items-center justify-between p-1 z-10">
              <div className={`absolute inset-0 opacity-10 rounded ${page.color}`} style={{ width: `${100 - (idx * 15)}%` }}></div>
              <span className={`z-20 relative truncate ${styles.textMain}`}>{page.path}</span>
              <div className="flex space-x-4 z-20 relative">
                <span className={`${page.color.replace('bg-', 'text-')}`}>{page.value}</span>
                <span className={styles.textSub}>{page.visits}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Referrers Table */}
      <div className={`rounded-2xl p-4 border font-mono text-sm transition-colors duration-300 ${styles.card}`}>
        <div className={`flex justify-between items-center mb-4 text-xs ${styles.textSub}`}>
          <div>Referrers</div>
          <div className="flex space-x-2">
            <span className={`cursor-pointer ${styles.textMain}`}>Top</span>
            <span className="cursor-pointer">Exit</span>
          </div>
        </div>
        <div className="space-y-2">
          {topReferrers.map((ref, idx) => (
            <div key={idx} className="relative flex items-center justify-between p-1 z-10">
              <div className={`absolute inset-0 rounded ${isDark ? 'bg-zinc-800' : 'bg-zinc-100'}`} style={{ width: `${100 - (idx * 20)}%` }}></div>
              <span className={`z-20 relative flex items-center ${styles.textMain}`}>
                <div className="w-4 h-4 bg-zinc-500/20 rounded-full mr-2"></div>
                {ref.source}
              </span>
              <span className={`z-20 relative ${styles.textSub}`}>{ref.visits}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---
export default function Realanalytics({ theme }) {
  // Logic: Default to dark if theme prop is missing, otherwise check string
  const isDark = theme === 'dark' || !theme; 
  const styles = getStyles(isDark);

  return (
    <section className={`min-h-screen p-6 lg:p-12 flex justify-center items-center transition-colors duration-500 ${styles.bg}`}>
      <div className="max-w-6xl w-full">
        
        {/* Header & Filters */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h2 className={`text-2xl font-bold mb-4 sm:mb-0 ${styles.textMain}`}>Analytics Overview</h2>
          <div className="flex space-x-2">
            <button className={`flex items-center px-3 py-1.5 rounded-full text-xs border transition-colors ${styles.card} ${styles.textSub}`}>
              <Clock size={14} className="mr-1.5" /> Last 30 days <ChevronDown size={14} className="ml-1.5"/>
            </button>
             <button className={`flex items-center px-3 py-1.5 rounded-full text-xs border transition-colors ${styles.card} ${styles.textSub}`}>
              Filters <ChevronDown size={14} className="ml-1.5"/>
            </button>
          </div>
        </div>

        {/* Dashboard Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <OverviewChart isDark={isDark} />
          <MetricBlocks isDark={isDark} />
          <HighValueVisitorsCard isDark={isDark} />
          <RealTimeMap isDark={isDark} />
          <DataTables isDark={isDark} />
        </div>

      </div>
    </section>
  );
}