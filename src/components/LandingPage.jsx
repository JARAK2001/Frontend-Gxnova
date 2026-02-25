import React from 'react';
import LandingHeader from './landing/LandingHeader';
import HeroSection from './landing/HeroSection';
import StatsSection from './landing/StatsSection';
import FeaturesSection from './landing/FeaturesSection';
import HowItWorksSection from './landing/HowItWorksSection';
import TestimonialsSection from './landing/TestimonialsSection';
import FAQSection from './landing/FAQSection';
import DownloadSection from './landing/DownloadSection';
import Footer from './Footer';

const LandingPage = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <LandingHeader />
            <main className="flex-grow">
                <HeroSection />
                <StatsSection />
                <FeaturesSection />
                <HowItWorksSection />
                <TestimonialsSection />
                <FAQSection />
                <DownloadSection />
            </main>
            <Footer />
        </div>
    );
};

export default LandingPage;
