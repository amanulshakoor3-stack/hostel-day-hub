import React from 'react';
import { PROGRAMME_SCHEDULE, SCHEDULE_ENDING_MESSAGE } from '../data/schedule';
import { 
  Clock, 
  Mic, 
  Coffee, 
  Gift, 
  Camera, 
  Music, 
  Flame, 
  Utensils, 
  Radio, 
  Disc, 
  CheckCircle2, 
  Sparkles,
  CalendarCheck
} from 'lucide-react';
import { ProgrammeItem } from '../types';

export const ScheduleSection: React.FC = () => {
  const getIconForCategory = (item: ProgrammeItem) => {
    const text = item.programme.toLowerCase();
    if (text.includes('welcome') || text.includes('intro')) return <Sparkles className="w-4 h-4 text-festival-purple-600" />;
    if (text.includes('speech')) return <Mic className="w-4 h-4 text-festival-blue-600" />;
    if (text.includes('refreshment')) return <Coffee className="w-4 h-4 text-amber-600" />;
    if (text.includes('dress')) return <Gift className="w-4 h-4 text-emerald-600" />;
    if (text.includes('photo')) return <Camera className="w-4 h-4 text-indigo-600" />;
    if (text.includes('singer')) return <Music className="w-4 h-4 text-rose-600" />;
    if (text.includes('dance')) return <Flame className="w-4 h-4 text-festival-orange-600" />;
    if (text.includes('dinner')) return <Utensils className="w-4 h-4 text-festival-orange-600" />;
    if (text.includes('dj')) return <Disc className="w-4 h-4 text-purple-600" />;
    if (text.includes('ends')) return <CheckCircle2 className="w-4 h-4 text-slate-500" />;
    return <Radio className="w-4 h-4 text-festival-blue-600" />;
  };

  const getBadgeStyle = (item: ProgrammeItem) => {
    const text = item.programme.toLowerCase();
    if (text.includes('dinner')) return 'bg-festival-orange-50 border-festival-orange-200 text-festival-orange-700';
    if (text.includes('dj')) return 'bg-purple-50 border-purple-200 text-purple-700';
    if (text.includes('dance') || text.includes('singer')) return 'bg-pink-50 border-pink-200 text-pink-700';
    if (text.includes('refreshment')) return 'bg-amber-50 border-amber-200 text-amber-700';
    if (text.includes('dress') || text.includes('photo')) return 'bg-emerald-50 border-emerald-200 text-emerald-700';
    return 'bg-festival-blue-50 border-festival-blue-200 text-festival-blue-800';
  };

  return (
    <section id="timetable" className="py-20 bg-festival-cream-50 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-festival-purple-100 text-festival-purple-800 text-xs sm:text-sm font-bold uppercase tracking-wider mb-4 border border-festival-purple-200">
            <CalendarCheck className="w-4 h-4 text-festival-purple-700" />
            Official Event Flow
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-festival-purple-950 font-display">
            Hostel Day Function Time Table
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600 font-medium">
            Please be on time for all segments to enjoy every moment with our hostel family.
          </p>
        </div>

        {/* Timeline Container - Mobile stacked cards + Desktop dual layout */}
        <div className="relative">
          {/* Central spine line for desktop */}
          <div className="hidden md:block absolute left-1/2 top-4 bottom-12 w-0.5 bg-gradient-to-b from-festival-purple-400 via-festival-blue-400 to-festival-orange-400 -translate-x-1/2 z-0" />

          {/* Schedule Items */}
          <div className="space-y-4 md:space-y-6 relative z-10">
            {PROGRAMME_SCHEDULE.map((item, index) => {
              const isEven = index % 2 === 0;
              const isGrandEnd = item.id === 18;
              const isDinner = item.programme.toLowerCase().includes('dinner');
              const isDJ = item.programme.toLowerCase().includes('dj party');

              return (
                <div
                  key={item.id}
                  className={`flex flex-col md:flex-row items-center ${
                    isEven ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  {/* Content Card (Half width on desktop) */}
                  <div className="w-full md:w-[calc(50%-2rem)]">
                    <div
                      className={`p-4 sm:p-5 rounded-2xl bg-white border transition-all duration-200 hover:-translate-y-0.5 shadow-sm hover:shadow-md ${
                        isDJ
                          ? 'border-purple-300 ring-2 ring-purple-200/60 bg-gradient-to-br from-purple-50/70 to-white'
                          : isDinner
                          ? 'border-festival-orange-300 ring-2 ring-festival-orange-200/60 bg-gradient-to-br from-festival-orange-50/60 to-white'
                          : isGrandEnd
                          ? 'border-slate-300 bg-slate-50'
                          : 'border-slate-200/90 hover:border-festival-blue-300'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          {/* Time badge */}
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs sm:text-sm font-bold bg-slate-100 text-slate-800 mb-2 border border-slate-200">
                            <Clock className="w-3.5 h-3.5 text-festival-orange-600" />
                            <span>{item.time}</span>
                          </div>

                          {/* Programme Name */}
                          <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                            <span>{item.programme}</span>
                            {isDJ && <span className="text-xs px-2 py-0.5 rounded-full bg-purple-600 text-white font-medium">Highlight</span>}
                            {isDinner && <span className="text-xs px-2 py-0.5 rounded-full bg-festival-orange-600 text-white font-medium">Feast</span>}
                          </h3>
                        </div>

                        {/* Category icon */}
                        <div className={`p-2.5 rounded-xl border shrink-0 ${getBadgeStyle(item)}`}>
                          {getIconForCategory(item)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Center Node dot on desktop */}
                  <div className="hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-white border-2 border-festival-purple-600 shadow-md z-20 mx-2 text-festival-purple-700 font-extrabold text-xs">
                    {item.id}
                  </div>

                  {/* Empty spacer for alternating layout on desktop */}
                  <div className="hidden md:block w-[calc(50%-2rem)]" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Function Ending Message Box as requested */}
        <div className="mt-14 max-w-xl mx-auto text-center">
          <div className="p-6 rounded-2xl bg-gradient-to-r from-festival-purple-950 via-festival-blue-900 to-festival-purple-900 text-white shadow-xl border border-festival-purple-700/60">
            <div className="w-12 h-12 mx-auto rounded-full bg-white/10 flex items-center justify-center mb-3">
              <Clock className="w-6 h-6 text-festival-orange-400" />
            </div>
            <p className="text-sm font-semibold tracking-widest uppercase text-festival-cream-200 mb-1">
              Official Conclusion
            </p>
            <h4 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
              {SCHEDULE_ENDING_MESSAGE}
            </h4>
            <p className="mt-2 text-xs sm:text-sm text-festival-cream-100/80">
              Please maintain hostel discipline and return safely to your respective rooms after the DJ session.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};
