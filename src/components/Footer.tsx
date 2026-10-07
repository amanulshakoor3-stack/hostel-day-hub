import React from 'react';
import { Sparkles, Heart, Shield, ArrowUp, Calendar, MapPin, Lock } from 'lucide-react';

interface FooterProps {
  onAdminClick?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onAdminClick }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-festival-purple-950 text-white pt-16 pb-10 border-t border-festival-purple-800/60 relative overflow-hidden">
      {/* Decorative glows */}
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-festival-orange-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-72 h-72 bg-festival-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-12 border-b border-festival-purple-800/70">
          
          {/* Col 1: Brand Info */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-festival-orange-500 to-festival-purple-600 flex items-center justify-center shadow-md">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-extrabold text-2xl text-white tracking-tight">
                Hostel Day <span className="text-festival-orange-400">Hub</span>
              </span>
            </div>
            <p className="text-sm text-festival-purple-100/80 leading-relaxed mb-4">
              The official portal for our Annual Hostel Day celebration. Connecting every hosteller through shared memories, delicious food, and anonymous student ideas.
            </p>
            <div className="inline-flex items-center gap-1.5 text-xs text-festival-orange-300 font-semibold bg-festival-orange-500/10 px-3 py-1.5 rounded-lg border border-festival-orange-500/20">
              <Shield className="w-4 h-4" />
              <span>100% Anonymous & Privacy First</span>
            </div>
          </div>

          <div>
            <h4 className="text-base font-bold text-white font-display uppercase tracking-wider mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-festival-orange-400" />
              Hostel Day Highlights
            </h4>
            <ul className="space-y-2.5 text-sm text-festival-purple-100/80">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-festival-orange-400" />
                <span>Welcome Address and Official Speeches</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-festival-orange-400" />
                <span>Senior Speech and Dress Distribution</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-festival-orange-400" />
                <span>Solo Singing, Solo Dance and Group Dance</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-festival-orange-400" />
                <span>Grand DJ Party to End the Night</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Guidelines & Back to top */}
          <div>
            <h4 className="text-base font-bold text-white font-display uppercase tracking-wider mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-festival-blue-400" />
              Venue & Discipline
            </h4>
            <p className="text-sm text-festival-purple-100/80 leading-relaxed mb-5">
              Hostel Central Quadrangle & Banquet Hall. All students are requested to wear their distributed event dress, maintain hostel decorum, and support the student volunteer squad.
            </p>
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs sm:text-sm font-semibold transition-all text-festival-cream-100"
            >
              <ArrowUp className="w-4 h-4 text-festival-orange-400" />
              Back to Top
            </button>
          </div>

        </div>

        {/* Bottom copyright line */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-festival-purple-100/60">
          <p>© {new Date().getFullYear()} Hostel Day Hub. Made with care for all hostellers.</p>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-festival-purple-100/70">
              <span>Celebrate together with pride</span>
              <Heart className="w-3.5 h-3.5 text-festival-orange-400 fill-festival-orange-400 mx-1" />
            </div>

            {onAdminClick && (
              <button
                onClick={onAdminClick}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-festival-purple-900/80 hover:bg-festival-purple-800 text-festival-purple-300 hover:text-white border border-festival-purple-700/50 text-xs font-semibold transition-all shadow-sm group"
                title="Authorized Administrator Access"
              >
                <Lock className="w-3.5 h-3.5 text-festival-orange-400 group-hover:scale-110 transition-transform" />
                <span>Admin Access</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </footer>
  );
};
