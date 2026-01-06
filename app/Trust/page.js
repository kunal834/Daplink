import React from 'react';
import { ShieldCheck, Lock, Server, Eye, FileText, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';

const TrustPage = () => {
  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-white text-slate-900">
      
    
      {/* --- Hero Section --- */}
      <section className="relative overflow-hidden bg-slate-50 py-20 sm:py-32">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 mb-6">
            <ShieldCheck className="h-4 w-4" />
            <span>Trust Center</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6">
           {` Your data, <span className="text-blue-600">secure</span> and <span className="text-blue-600">private</span>.`}
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-slate-600 mb-8">
           {` At DapLink, trust is not an afterthought—it's our foundation. We are transparent about how we protect your data, maintain uptime, and respect your privacy.`}
          </p>
          <div className="flex justify-center gap-4">
            <button className="rounded-lg bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-700 transition">
              Privacy Policy
            </button>
            <button className="rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition">
              Contact Security Team
            </button>
          </div>
        </div>
      </section>

      {/* --- Key Trust Pillars --- */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-3">
            {/* Pillar 1 */}
            <div className="rounded-2xl border border-slate-200 p-8 hover:shadow-lg transition">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 text-green-600">
                <Lock className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Data Encryption</h3>
              <p className="text-slate-600">
               {` Your sensitive information is encrypted both in transit (TLS 1.3) and at rest. We use industry-standard protocols to ensure no one sees your data but you.`}
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="rounded-2xl border border-slate-200 p-8 hover:shadow-lg transition">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                <Server className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">{`99.9% Uptime`}</h3>
              <p className="text-slate-600">
               {` Your links need to work when you sleep. Our infrastructure is built on redundant cloud servers to ensure your DapLink profile is always online.`}
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="rounded-2xl border border-slate-200 p-8 hover:shadow-lg transition">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
                <Eye className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">No Hidden Tracking</h3>
              <p className="text-slate-600">
               {` We do not sell your personal browsing history to third-party advertisers. Our analytics are designed to help <em>you</em> grow, not to invade your privacy.`}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- Compliance & Standards --- */}
      <section className="bg-slate-900 py-20 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-6">{`Compliance & Standards`}</h2>
              <p className="text-slate-400 text-lg mb-6">
              {`  We are committed to adhering to global data protection regulations. We are constantly updating our practices to meet the highest standards of security.`}
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-blue-400" />
                  <span>GDPR Compliant Practices</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-blue-400" />
                  <span>{`Secure Payment Processing (Stripe/Razorpay)`}</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-blue-400" />
                  <span>{`Regular Security Audits`}</span>
                </li>
              </ul>
            </div>
            
            {/* Visual Placeholder for Security Badges */}
            <div className="md:w-1/2 flex flex-col items-center justify-center rounded-2xl bg-slate-800 p-10 border border-slate-700">
               <ShieldCheck className="h-24 w-24 text-blue-500 opacity-80 mb-4" />
               <p className="text-slate-400 font-mono text-sm text-center">
                {` DapLink Secure Infrastructure<br/>
                 Verified & Monitored`}
               </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- Report a Vulnerability --- */}
      <section className="py-20 border-t border-slate-100">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <div className="mb-6 mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-600">
            <FileText className="h-8 w-8" />
          </div>
          <h2 className="text-3xl font-bold mb-4">{`Found a vulnerability?`}</h2>
          <p className="text-slate-600 mb-8">
           {` We value the security research community. If you believe you've found a security bug in DapLink, please report it to us immediately. We handle all reports with priority.`}
          </p>
          <a href="mailto:security@daplink.online" className="text-blue-600 font-semibold hover:underline">
           {` Report a Security Issue &rarr;`}
          </a>
        </div>
      </section>

    </div>
    <Footer />
    
    </>
    
  );
};

export default TrustPage;