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
      title: 'Community & Skill Swap',
      description: 'Connect with creators, collaborate, and exchange skills.'
    },
    {
      icon: Palette,
      title: 'Custom Bio Page',
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
    <main className="min-h-screen bg-[#F8F9FA] text-zinc-900">
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16 text-center">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
          Everything You Need to Grow
        </h1>
        <p className="text-zinc-600 max-w-2xl mx-auto text-lg">
          DapLink provides powerful tools to manage links, track performance,
          and build your creator presence from one dashboard.
        </p>
      </section>

      {/* Features Grid */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-zinc-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
