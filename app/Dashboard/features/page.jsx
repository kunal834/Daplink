'use client';

import {
  Link as LinkIcon,
  BarChart3,
  QrCode,
  Users,
  Zap,
  Shield,
  Palette
} from 'lucide-react';

export default function FeaturesPage() {
  const features = [
    {
      icon: LinkIcon,
      title: 'Smart URL Shortener',
      description: 'Create clean, branded short links with analytics and redirection control.'
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Track clicks, views, traffic sources, and performance over time.'
    },
    {
      icon: QrCode,
      title: 'QR Code Generator',
      description: 'Generate scannable QR codes for your links, profiles, and campaigns.'
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Connect with peoples, collaborate, and grow'
    },
    {
      icon: Palette,
      title: 'Custom Bio Templates',
      description: 'Design a personalized bio page that represents your brand.'
    },
    {
      icon: Shield,
      title: 'Secure & Reliable',
      description: 'Enterprise-grade security with reliable infrastructure.'
    },
    {
      icon: Zap,
      title: 'Fast Performance',
      description: 'Optimized for speed with instant navigation and caching.'
    }
  ];

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-zinc-950 transition-colors duration-300 relative overflow-hidden">
      
      {/* Background Decor Elements (Glows) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none -z-10" />

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 pt-24 pb-20 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-sm font-medium mb-6 border border-indigo-100 dark:border-indigo-800">
          <Zap className="w-4 h-4" />
          <span>Supercharge your workflow</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6 text-zinc-900 dark:text-white">
          Everything You Need to <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400">Grow</span>
        </h1>
        
        <p className="text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto text-lg md:text-xl leading-relaxed">
       {`DapLink provides powerful tools to manage links, track performance,
          and build your creator presence from one dashboard.`}
        </p>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-6 pb-24 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              {/* Icon Container */}
              <div className="w-14 h-14 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-500/10 flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                <feature.icon className="w-7 h-7 text-indigo-600 dark:text-indigo-400 group-hover:text-white transition-colors duration-300" />
              </div>

              <h3 className="font-bold text-xl mb-3 text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {feature.title}
              </h3>
              
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))} 
        </div>
      </section>
    </main>
  );
}