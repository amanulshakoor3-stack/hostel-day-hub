import React from 'react';
import { PROGRAMME_LIST } from '../data/schedule';
import {
  Mic,
  Coffee,
  Gift,
  Camera,
  Music,
  Flame,
  Utensils,
  Radio,
  Disc,
  Sparkles,
  PartyPopper,
  Users,
  Star,
} from 'lucide-react';
import { ProgrammeItem } from '../types';

export const ScheduleSection: React.FC = () => {
  const getIconForProgramme = (item: ProgrammeItem) => {
    const text = item.programme.toLowerCase();
    if (text.includes('welcome') || text.includes('intro')) return <Sparkles className="w-5 h-5" />;
    if (text.includes('speech')) return <Mic className="w-5 h-5" />;
    if (text.includes('refreshment')) return <Coffee className="w-5 h-5" />;
    if (text.includes('dress')) return <Gift className="w-5 h-5" />;
    if (text.includes('photo')) return <Camera className="w-5 h-5" />;
    if (text.includes('singing')) return <Music className="w-5 h-5" />;
    if (text.includes('solo dance')) return <Flame className="w-5 h-5" />;
    if (text.includes('extra')) return <Star className="w-5 h-5" />;
    if (text.includes('dinner')) return <Utensils className="w-5 h-5" />;
    if (text.includes('group dance')) return <Users className="w-5 h-5" />;
    if (text.includes('dj setup')) return <Radio className="w-5 h-5" />;
    if (text.includes('dj party')) return <Disc className="w-5 h-5" />;
    return <PartyPopper className="w-5 h-5" />;
  };

  const getCardStyle = (item: ProgrammeItem) => {
    const text = item.programme.toLowerCase();
    if (text.includes('dj party'))
      return {
        bg: 'bg-gradient-to-br from-purple-50 to-purple-100/80',
        border: 'border-purple-300 hover:border-purple-400',
        icon: 'bg-purple-600 text-white',
        accent: 'bg-purple-500',
      };
    if (text.includes('dj setup'))
      return {
        bg: 'bg-gradient-to-br from-violet-50 to-violet-100/70',
        border: 'border-violet-300 hover:border-violet-400',
        icon: 'bg-violet-600 text-white',
        accent: 'bg-violet-500',
      };
    if (text.includes('group dance'))
      return {
        bg: 'bg-gradient-to-br from-pink-50 to-pink-100/70',
        border: 'border-pink-300 hover:border-pink-400',
        icon: 'bg-pink-600 text-white',
        accent: 'bg-pink-500',
      };
    if (text.includes('dinner'))
      return {
        bg: 'bg-gradient-to-br from-festival-orange-50 to-amber-50',
        border: 'border-festival-orange-300 hover:border-festival-orange-400',
        icon: 'bg-festival-orange-600 text-white',
        accent: 'bg-festival-orange-500',
      };
    if (text.includes('dance') || text.includes('singing') || text.includes('extra'))
      return {
        bg: 'bg-gradient-to-br from-rose-50 to-rose-100/70',
        border: 'border-rose-300 hover:border-rose-400',
        icon: 'bg-rose-600 text-white',
        accent: 'bg-rose-500',
      };
    if (text.includes('refreshment'))
      return {
        bg: 'bg-gradient-to-br from-amber-50 to-amber-100/70',
        border: 'border-amber-300 hover:border-amber-400',
        icon: 'bg-amber-600 text-white',
        accent: 'bg-amber-500',
      };
    if (text.includes('dress') || text.includes('photo'))
      return {
        bg: 'bg-gradient-to-br from-emerald-50 to-emerald-100/70',
        border: 'border-emerald-300 hover:border-emerald-400',
        icon: 'bg-emerald-600 text-white',
        accent: 'bg-emerald-500',
      };
    if (text.includes('welcome') || text.includes('intro'))
      return {
        bg: 'bg-gradient-to-br from-festival-purple-50 to-festival-purple-100/70',
        border: 'border-festival-purple-300 hover:border-festival-purple-400',
        icon: 'bg-festival-purple-600 text-white',
        accent: 'bg-festival-purple-500',
      };
    // Default: speeches
    return {
      bg: 'bg-gradient-to-br from-festival-blue-50 to-festival-blue-100/70',
      border: 'border-festival-blue-300 hover:border-festival-blue-400',
      icon: 'bg-festival-blue-600 text-white',
      accent: 'bg-festival-blue-500',
    };
  };

  return (
    <section id="programmes" className="py-20 bg-festival-cream-50 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-festival-purple-100 text-festival-purple-800 text-xs sm:text-sm font-bold uppercase tracking-wider mb-4 border border-festival-purple-200">
            <PartyPopper className="w-4 h-4 text-festival-purple-700" />
            Official Event Flow
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-festival-purple-950 font-display">
            Hostel Day Programmes
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600 font-medium">
            Enjoy every moment with our hostel family. Here is the lineup of programmes planned for the celebration.
          </p>
        </div>

        {/* Programmes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {PROGRAMME_LIST.map((item) => {
            const style = getCardStyle(item);

            return (
              <div
                key={item.id}
                className={`group relative rounded-2xl p-5 border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg shadow-sm ${style.bg} ${style.border}`}
              >
                {/* Top accent bar */}
                <div className={`absolute top-0 left-6 right-6 h-1 rounded-b-full ${style.accent} opacity-60 group-hover:opacity-100 transition-opacity`} />

                {/* Icon */}
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${style.icon} shadow-md group-hover:scale-110 transition-transform`}>
                  {getIconForProgramme(item)}
                </div>

                {/* Programme Name */}
                <h3 className="text-base font-bold text-slate-900 tracking-tight leading-snug">
                  {item.programme}
                </h3>

                {/* Programme number accent */}
                <span className="mt-3 inline-flex items-center justify-center w-6 h-6 rounded-full bg-white/80 border border-slate-200 text-xs font-bold text-slate-500">
                  {item.id}
                </span>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
