import React from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { IntroSection } from './components/IntroSection';
import { ScheduleSection } from './components/ScheduleSection';
import { DinnerMenuSection } from './components/DinnerMenuSection';
import { FoodPreferenceSection } from './components/FoodPreferenceSection';
import { SuggestionFormSection } from './components/SuggestionFormSection';
import { ApprovedSuggestionsSection } from './components/ApprovedSuggestionsSection';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-festival-cream-50 font-sans text-slate-800">
      {/* 1. Navigation bar */}
      <Navbar onNavigate={scrollToSection} />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* 2. Hero section */}
        <Hero
          onShareClick={() => scrollToSection('share-suggestion')}
          onViewClick={() => scrollToSection('view-suggestions')}
        />

        {/* 3. Hostel Day introduction */}
        <IntroSection />

        {/* 4. Hostel Day Function Time Table */}
        <ScheduleSection />

        {/* 5. Dinner Menu */}
        <DinnerMenuSection />

        {/* Food Preference Section */}
        <FoodPreferenceSection />

        {/* 6. Student suggestion call-to-action & Form */}
        <SuggestionFormSection />

        {/* 7. Preview of approved student suggestions */}
        <ApprovedSuggestionsSection />
      </main>

      {/* 8. Footer */}
      <Footer />
    </div>
  );
};

export default App;
