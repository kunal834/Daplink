import React from 'react';
import { 
  Rocket, 
  Zap, 
  Gamepad2, 
  Globe, 
  Cpu, 
  Users, 
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import Navbar from '@/Components/Navbar';
import Link from 'next/link';
import Footer from '@/Components/Footer';
const FutureUpgradesPage = () => {
  return (
    <>
   <Navbar />
     <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      
      {/* --- Hero Section --- */}
      <section className="bg-slate-900 py-20 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 border border-blue-500/20 px-4 py-1.5 text-sm font-medium text-blue-400 mb-6">
            <Rocket className="h-4 w-4" />
            <span>Product Roadmap 2026</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl mb-6">
            The Future of <span className="text-blue-500">DapLink</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-slate-400 mb-10">
            We are building more than just a link-in-bio. We are building a decentralized economy for creators. Here is what we are shipping next.
          </p>
        </div>
      </section>

      {/* --- Q1 2026: The Tech Overhaul (Immediate) --- */}
      <section className="py-20 border-b border-slate-200">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-12 items-start">
            <div className="md:w-1/3">
              <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
                <Zap className="h-8 w-8 text-yellow-500" />
                Performance Core
              </h2>
              <p className="text-slate-600">
                Current Focus: We are migrating our data layer to handle millions of requests with sub-millisecond latency.
              </p>
            </div>
            
            <div className="md:w-2/3 grid gap-6 sm:grid-cols-2">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <Cpu className="h-5 w-5 text-red-500" />
                  <h3 className="font-semibold text-lg">Redis Caching Layer</h3>
                </div>
                <p className="text-sm text-slate-500">
                  Implementing a dedicated Redis cluster to cache user profiles and session data, eliminating database bottlenecks for high-traffic creators.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  <h3 className="font-semibold text-lg">Real-Time Analytics</h3>
                </div>
                <p className="text-sm text-slate-500">
                  Moving from static stats to live dashboards using <strong>Socket.IO</strong>. Creators will see clicks and views happen instantly as they stream.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Q2 2026: Gamification (The XP System) --- */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-3">
              <Gamepad2 className="h-8 w-8 text-purple-600" />
              Project: "Level Up"
            </h2>
            <p className="text-slate-600 text-lg">
              We are turning networking into a game. The more you share, the more you earn.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-slate-50 p-8 rounded-2xl">
              <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 mb-4 font-bold">1</div>
              <h3 className="text-xl font-bold mb-2">DapLink XP</h3>
              <p className="text-slate-600">
                Users earn XP for every unique click, profile update, and verified connection. High XP unlocks premium themes and verified badges.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-50 p-8 rounded-2xl">
              <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 mb-4 font-bold">2</div>
              <h3 className="text-xl font-bold mb-2">Skill Swapping</h3>
              <p className="text-slate-600">
                A tinder-like interface to match creators based on complementary skills (e.g., a Designer matches with a Backend Dev).
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-50 p-8 rounded-2xl">
              <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 mb-4 font-bold">3</div>
              <h3 className="text-xl font-bold mb-2">Leaderboards</h3>
              <p className="text-slate-600">
                Weekly competitions for "Top Creator" in specific niches (Tech, Art, Music) with cash prizes for the winners.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- Q3 2026: Expansion --- */}
      <section className="py-20 border-t border-slate-100">
        <div className="container mx-auto px-4">
           <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="md:w-1/2">
               <h2 className="text-3xl font-bold mb-6">Global Infrastructure</h2>
               <ul className="space-y-4">
                 <li className="flex items-start gap-3">
                   <Globe className="h-6 w-6 text-blue-500 shrink-0" />
                   <div>
                     <span className="font-semibold block">Edge Computing</span>
                     <span className="text-slate-500 text-sm">Deploying user profiles to the Edge (Vercel/Cloudflare) so they load instantly from anywhere in the world.</span>
                   </div>
                 </li>
                 <li className="flex items-start gap-3">
                   <Users className="h-6 w-6 text-blue-500 shrink-0" />
                   <div>
                     <span className="font-semibold block">Team Collaboration</span>
                     <span className="text-slate-500 text-sm">Allowing agencies to manage multiple DapLink profiles from a single "Business Dashboard."</span>
                   </div>
                 </li>
               </ul>
            </div>
            <div className="md:w-1/2 bg-slate-900 rounded-2xl p-8 text-white">
              <h3 className="text-xl font-bold mb-4">Have a feature request?</h3>
              <p className="text-slate-400 mb-6">
                Our roadmap is community-driven. If you need a specific integration or feature, let the engineering team know directly.
              </p>
              <Link href="mailto:features@daplink.online" className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium transition">
                Submit a Request <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
           </div>
        </div>
      </section>

    </div>

    <Footer/>
    </>
   
  );
};

export default FutureUpgradesPage;