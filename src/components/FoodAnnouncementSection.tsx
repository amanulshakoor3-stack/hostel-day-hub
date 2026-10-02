import React from 'react';
import { UtensilsCrossed, Bell } from 'lucide-react';

export const FoodAnnouncementSection: React.FC = () => {
  return (
    <section id="food-announcement" className="py-20 bg-white relative overflow-hidden border-b border-festival-cream-200">
      {/* Decorative background gradient */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-festival-orange-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-festival-purple-100/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-festival-orange-100 text-festival-orange-800 text-xs sm:text-sm font-bold uppercase tracking-wider mb-4 border border-festival-orange-200">
            <UtensilsCrossed className="w-4 h-4 text-festival-orange-700" />
            Stay Tuned
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-festival-purple-950 font-display">
            Food Announcement
          </h2>
        </div>

        {/* Announcement Card */}
        <div className="bg-gradient-to-br from-festival-orange-50 via-white to-festival-cream-100 rounded-3xl p-8 sm:p-12 border border-festival-orange-200/80 shadow-lg text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-festival-orange-500 text-white flex items-center justify-center mb-6 shadow-md">
            <Bell className="w-8 h-8" />
          </div>

          <p className="text-xl sm:text-2xl font-bold text-slate-900 leading-relaxed">
            Food details will be announced later.
          </p>

          <p className="mt-4 text-sm text-slate-500 font-medium max-w-md mx-auto">
            You can still share your food preference below to help our catering team prepare accordingly.
          </p>

          <a
            href="#food-preference"
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-festival-purple-900 hover:bg-festival-purple-950 text-white text-sm font-semibold transition-colors shadow-md hover:shadow-lg"
          >
            <UtensilsCrossed className="w-4 h-4 text-festival-orange-400" />
            Share Your Food Preference
          </a>
        </div>

      </div>
    </section>
  );
};
