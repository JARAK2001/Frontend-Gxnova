import React from 'react';
import LandingHeader from './LandingHeader';
import HeroSection from './HeroSection';
import StatsSection from './StatsSection';
import FeaturesSection from './FeaturesSection';
import HowItWorksSection from './HowItWorksSection';
import TestimonialsSection from './TestimonialsSection';
import FAQSection from './FAQSection';
import DownloadSection from './DownloadSection';
import Footer from '../../layouts/Footer';

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
