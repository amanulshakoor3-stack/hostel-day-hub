import React from 'react';
import { Calendar, Users, Trophy, Music } from 'lucide-react';

export const IntroSection: React.FC = () => {
  return (
    <section id="introduction" className="py-16 bg-festival-cream-100/70 border-b border-festival-cream-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-festival-orange-100 text-festival-orange-700 text-xs font-bold uppercase tracking-wider mb-3">
            Welcome to Hostel Day
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-festival-purple-950 font-display">
            A Night of Memories, Fellowship & Joy
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Hostel Day is the most anticipated landmark event of our campus life. It is the time where every hosteller—from freshers to graduating seniors—unites to celebrate our shared bond, hostel pride, extraordinary talents, and lifelong friendships.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-festival-cream-300/80 hover:shadow-md hover:border-festival-orange-300 transition-all text-center">
            <div className="w-12 h-12 mx-auto rounded-xl bg-festival-purple-100 text-festival-purple-700 flex items-center justify-center mb-4">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-800 text-lg mb-1">Grand Programme</h3>
            <p className="text-sm text-slate-500">
              An action-packed lineup of ceremonies, cultural performances, and a grand DJ party.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-festival-cream-300/80 hover:shadow-md hover:border-festival-orange-300 transition-all text-center">
            <div className="w-12 h-12 mx-auto rounded-xl bg-festival-orange-100 text-festival-orange-600 flex items-center justify-center mb-4">
              <Trophy className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-800 text-lg mb-1">Honouring Seniors</h3>
            <p className="text-sm text-slate-500">
              Dress distribution, heartfelt senior speeches, and the grand traditional group photo session.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-festival-cream-300/80 hover:shadow-md hover:border-festival-orange-300 transition-all text-center">
            <div className="w-12 h-12 mx-auto rounded-xl bg-festival-blue-100 text-festival-blue-600 flex items-center justify-center mb-4">
              <Music className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-800 text-lg mb-1">Electrifying Stages</h3>
            <p className="text-sm text-slate-500">
              Soulful solo singing, dynamic solo & group dance performances, followed by our high-octane DJ bash.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-festival-cream-300/80 hover:shadow-md hover:border-festival-orange-300 transition-all text-center">
            <div className="w-12 h-12 mx-auto rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-800 text-lg mb-1">Student Voice</h3>
            <p className="text-sm text-slate-500">
              100% anonymous suggestions and food preference voting powered by this student portal.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
