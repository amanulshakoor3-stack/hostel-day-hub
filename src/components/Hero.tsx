import React from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, MessageSquarePlus, MessageSquare, ShieldCheck, HeartHandshake } from 'lucide-react';

interface HeroProps {
  onShareClick: () => void;
  onViewClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onShareClick, onViewClick }) => {
  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ea580c', '#3b82f6', '#8b5cf6', '#facc15', '#ec4899']
    });
  };

  return (
    <section id="hero" className="relative pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden bg-festival-gradient text-white">
      {/* Decorative festive background elements */}
      <div className="absolute inset-0 bg-festival-glow pointer-events-none" />
      
      {/* Floating festive celebration stars / confetti circles */}
      <div className="absolute top-16 left-8 w-24 h-24 rounded-full bg-festival-orange-500/20 blur-2xl animate-pulse pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-40 h-40 rounded-full bg-festival-blue-500/20 blur-3xl pointer-events-none" />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        
        {/* Festivity badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-festival-cream-100 text-xs sm:text-sm font-semibold mb-6 shadow-inner cursor-pointer hover:bg-white/15 transition-all"
             onClick={triggerConfetti}
             title="Click for celebratory confetti!">
          <Sparkles className="w-4 h-4 text-festival-orange-400 animate-spin" style={{ animationDuration: '8s' }} />
          <span>Annual Grand Gala & Cultural Extravaganza</span>
          <span className="text-festival-orange-400 text-xs">🎉 Tap me</span>
        </div>

        {/* Main front-page heading */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white mb-6 font-display leading-[1.15]">
          Hostel Day <span className="text-transparent bg-clip-text bg-gradient-to-r from-festival-orange-400 via-amber-300 to-festival-orange-500">Celebration</span>
        </h1>

        {/* Supporting text */}
        <p className="text-lg sm:text-xl md:text-2xl text-festival-cream-100/90 font-medium max-w-3xl mx-auto mb-10 leading-relaxed">
          Celebrate together, share your ideas, and make our Hostel Day memorable.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto sm:max-w-none">
          {/* Prominent button: Share Your Suggestion */}
          <button
            onClick={() => {
              triggerConfetti();
              onShareClick();
            }}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-festival-orange-500 to-amber-500 hover:from-festival-orange-600 hover:to-amber-600 text-white font-bold text-base sm:text-lg shadow-xl shadow-festival-orange-500/30 hover:shadow-festival-orange-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2.5 focus:outline-none focus:ring-4 focus:ring-festival-orange-400/50"
          >
            <MessageSquarePlus className="w-5 h-5 text-white" />
            <span>Share Your Suggestion</span>
          </button>

          {/* Another button: View Student Suggestions */}
          <button
            onClick={onViewClick}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/25 text-white font-bold text-base sm:text-lg shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2.5 focus:outline-none focus:ring-4 focus:ring-white/30"
          >
            <MessageSquare className="w-5 h-5 text-festival-orange-300" />
            <span>View Student Suggestions</span>
          </button>
        </div>

        {/* Privacy message near the suggestion button */}
        <div className="mt-6 flex items-center justify-center gap-2 text-festival-cream-200/95 text-xs sm:text-sm font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>No login required. We only ask for your department and year.</span>
        </div>

        {/* Quick Highlights Strip */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-3 gap-3 max-w-3xl mx-auto pt-8 border-t border-white/15 text-left">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3.5 border border-white/10 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-festival-orange-500/20 text-festival-orange-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-festival-cream-200">Stage & Events</p>
              <p className="text-sm font-bold text-white">Full Evening Show</p>
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3.5 border border-white/10 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-festival-blue-500/20 text-festival-blue-300">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-festival-cream-200">Grand Feast</p>
              <p className="text-sm font-bold text-white">Special Dinner Awaits</p>
            </div>
          </div>
          <div className="col-span-2 md:col-span-1 bg-white/5 backdrop-blur-sm rounded-xl p-3.5 border border-white/10 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-festival-purple-500/20 text-festival-purple-300">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-festival-cream-200">Student Voices</p>
              <p className="text-sm font-bold text-white">100% Anonymous Ideas</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
