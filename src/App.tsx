import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import IntroSection from './components/IntroSection';
import SuggestionFormSection from './components/SuggestionFormSection';
import ApprovedSuggestionsSection from './components/ApprovedSuggestionsSection';
import FoodPreferenceSection from './components/FoodPreferenceSection';
import DinnerMenuSection from './components/DinnerMenuSection';
import ScheduleSection from './components/ScheduleSection';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <IntroSection />
        <SuggestionFormSection />
        <ApprovedSuggestionsSection />
        <FoodPreferenceSection />
        <DinnerMenuSection />
        <ScheduleSection />
      </main>
      <Footer />
    </div>
  );
}
