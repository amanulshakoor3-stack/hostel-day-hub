import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

interface PerformanceCtaSectionProps {
  onRegisterClick: () => void;
}

export const PerformanceCtaSection: React.FC<PerformanceCtaSectionProps> = ({ onRegisterClick }) => {
  return (
    <section id="performance-cta" className="py-14 bg-festival-cream-50 relative overflow-hidden border-b border-festival-cream-200">
      {/* Decorative ambient gradients */}
      <div className="absolute top-0 left-1/4 w-80 h-80 bg-festival-purple-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-festival-orange-200/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="relative rounded-3xl bg-gradient-to-r from-festival-purple-950 via-festival-purple-900 to-festival-purple-950 p-8 sm:p-12 text-white shadow-xl border border-festival-purple-800/80 overflow-hidden text-center sm:text-left">
          
          {/* Subtle background glitter glow */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-festival-orange-500/20 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-festival-blue-500/20 rounded-full blur-2xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-8 relative z-10">
            {/* Left Content */}
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-festival-orange-500/20 text-festival-orange-300 text-xs sm:text-sm font-bold uppercase tracking-wider mb-4 border border-festival-orange-500/30">
                <Sparkles className="w-4 h-4 text-festival-orange-400" />
                Hostel Day Stage Call
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-display tracking-tight leading-tight">
                Want to Perform on Stage?
              </h2>
              <p className="mt-3 text-sm sm:text-base text-festival-purple-100/80 font-medium leading-relaxed">
                Show your talent and be part of the Hostel Day celebration! Register for Solo Dance, Solo Song, Group Dance, Group Song, Rampwalk, or Extra Performance.
              </p>
            </div>

            {/* Right Action Button: Clearly visible button titled "Register for Performance" */}
            <div className="shrink-0 w-full sm:w-auto">
              <button
                type="button"
                onClick={onRegisterClick}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-festival-orange-500 to-festival-orange-600 hover:from-festival-orange-600 hover:to-festival-orange-700 text-white font-extrabold text-base sm:text-lg shadow-lg shadow-festival-orange-600/30 hover:shadow-xl hover:scale-[1.03] active:scale-[0.98] transition-all duration-200 group"
              >
                <span>Register for Performance</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Quick Category Badges */}
          <div className="mt-8 pt-6 border-t border-festival-purple-800/60 flex flex-wrap items-center justify-center sm:justify-start gap-2.5 text-xs text-festival-purple-200">
            <span className="font-semibold text-festival-orange-300">Available Categories:</span>
            <span className="px-2.5 py-1 rounded-lg bg-white/10 font-medium">Solo Dance</span>
            <span className="px-2.5 py-1 rounded-lg bg-white/10 font-medium">Solo Song</span>
            <span className="px-2.5 py-1 rounded-lg bg-white/10 font-medium">Group Dance</span>
            <span className="px-2.5 py-1 rounded-lg bg-white/10 font-medium">Group Song</span>
            <span className="px-2.5 py-1 rounded-lg bg-white/10 font-medium">Rampwalk</span>
            <span className="px-2.5 py-1 rounded-lg bg-white/10 font-medium">Extra Performance</span>
          </div>

        </div>
      </div>
    </section>
  );
};
