import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { IntroSection } from './components/IntroSection';
import { ScheduleSection } from './components/ScheduleSection';
import { PerformanceCtaSection } from './components/PerformanceCtaSection';
import { PerformanceRegistrationPage } from './components/PerformanceRegistrationPage';
import { FoodAnnouncementSection } from './components/FoodAnnouncementSection';
import { FoodPreferenceSection } from './components/FoodPreferenceSection';
import { SuggestionFormSection } from './components/SuggestionFormSection';
import { ApprovedSuggestionsSection } from './components/ApprovedSuggestionsSection';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname;
    }
    return '/';
  });

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path: string) => {
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
    }
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavClick = (sectionId: string) => {
    if (currentPath.startsWith('/register-performance')) {
      // Return to home first, then scroll
      navigateTo('/');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const isRegistrationRoute = currentPath.startsWith('/register-performance');

  return (
    <div className="min-h-screen flex flex-col bg-festival-cream-50 font-sans text-slate-800">
      {/* 1. Navigation bar */}
      <Navbar onNavigate={handleNavClick} />

      {/* Main Content Area */}
      <main className="flex-1">
        {isRegistrationRoute ? (
          <PerformanceRegistrationPage
            onBackToHome={() => navigateTo('/')}
          />
        ) : (
          <>
            {/* 2. Hero section */}
            <Hero
              onShareClick={() => handleNavClick('share-suggestion')}
              onViewClick={() => handleNavClick('view-suggestions')}
            />

            {/* 3. Hostel Day introduction */}
            <IntroSection />

            {/* 4. Hostel Day Programmes */}
            <ScheduleSection />

            {/* Button titled "Register for Performance" placed in the main content flow immediately after Hostel Day Programmes */}
            <PerformanceCtaSection
              onRegisterClick={() => navigateTo('/register-performance')}
            />

            {/* 5. Food Announcement */}
            <FoodAnnouncementSection />

            {/* 6. Food Preference Section */}
            <FoodPreferenceSection />

            {/* 7. Student suggestion call-to-action & Form */}
            <SuggestionFormSection />

            {/* 8. Preview of approved student suggestions */}
            <ApprovedSuggestionsSection />
          </>
        )}
      </main>

      {/* 9. Footer */}
      <Footer />
    </div>
  );
};

export default App;
