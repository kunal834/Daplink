import React from 'react';
import HeroSection from './HeroSection';
import StorySection from './StorySection';
import MetricsSection from './MetricSection';
import ValuesSection from './ValueSection';
import TeamSection from './TeamSection';
import CTASection from './CTASection';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';

const AboutUsPage = () => {
  return (
    <>
        <Navbar/>
       <div className="bg-white text-gray-800">

      <HeroSection />
      <main>
        <StorySection />
        <MetricsSection />
        <ValuesSection />
        <TeamSection />
      </main>
      <CTASection />

    </div>

    <Footer/>
    
    </>
 
  );
};

export default AboutUsPage;
