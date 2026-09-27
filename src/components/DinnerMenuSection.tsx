import React from 'react';
import { DINNER_MENU_ITEMS } from '../data/menu';
import { Utensils, Drumstick, Flame, Sparkles, IceCream, ChefHat, Heart } from 'lucide-react';
import { DinnerItem } from '../types';

export const DinnerMenuSection: React.FC = () => {
  const getItemIcon = (iconName: string) => {
    switch (iconName) {
      case 'drumstick':
        return <Drumstick className="w-7 h-7 text-festival-orange-600" />;
      case 'flame':
        return <Flame className="w-7 h-7 text-rose-600" />;
      case 'sparkles':
        return <Sparkles className="w-7 h-7 text-emerald-600" />;
      case 'icecream':
        return <IceCream className="w-7 h-7 text-sky-600" />;
      default:
        return <Utensils className="w-7 h-7 text-festival-orange-600" />;
    }
  };

  const getCardHeaderColor = (item: DinnerItem) => {
    if (item.category === 'Veg') return 'bg-emerald-50 text-emerald-800 border-emerald-200';
    if (item.category === 'Dessert') return 'bg-sky-50 text-sky-800 border-sky-200';
    return 'bg-festival-orange-50 text-festival-orange-800 border-festival-orange-200';
  };

  return (
    <section id="dinner-menu" className="py-20 bg-white relative overflow-hidden border-b border-festival-cream-200">
      {/* Decorative background gradient */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-festival-orange-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-festival-purple-100/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-festival-orange-100 text-festival-orange-800 text-xs sm:text-sm font-bold uppercase tracking-wider mb-4 border border-festival-orange-200">
            <ChefHat className="w-4 h-4 text-festival-orange-700" />
            Special Hostel Banquet
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-festival-purple-950 font-display">
            Dinner Menu
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600 font-medium">
            Prepared with special care for all hostellers. Unlimited serving for all items during the dinner session (7:03 PM – 9:00 PM).
          </p>
        </div>

        {/* Food Menu Cards Grid - EXACTLY the 4 required items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {DINNER_MENU_ITEMS.map((item) => {
            const isVeg = item.category === 'Veg';
            const isDessert = item.category === 'Dessert';

            return (
              <div
                key={item.id}
                className="group relative bg-white rounded-3xl p-6 border border-slate-200/80 hover:border-festival-orange-400 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Top Badge & Icon */}
                  <div className="flex items-center justify-between mb-5">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${getCardHeaderColor(
                        item
                      )}`}
                    >
                      {isVeg && (
                        <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block mr-1"></span>
                      )}
                      {!isVeg && !isDessert && (
                        <span className="w-2 h-2 rounded-full bg-rose-500 inline-block mr-1"></span>
                      )}
                      {isDessert && (
                        <span className="w-2 h-2 rounded-full bg-sky-500 inline-block mr-1"></span>
                      )}
                      {item.badge}
                    </span>

                    <div className="w-12 h-12 rounded-2xl bg-festival-cream-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                      {getItemIcon(item.iconName)}
                    </div>
                  </div>

                  {/* Food Item Name - Exact Name */}
                  <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-festival-orange-700 transition-colors font-display mb-2">
                    {item.name}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-slate-600 leading-relaxed mb-4">
                    {item.description}
                  </p>
                </div>

                {/* Bottom Highlight */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                  <span className="flex items-center gap-1 text-festival-orange-700 font-semibold">
                    <Heart className="w-3.5 h-3.5 fill-festival-orange-500 text-festival-orange-500" />
                    Special Recipe
                  </span>
                  <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-medium">
                    {item.category}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Hygiene and Quality Assurance Banner */}
        <div className="mt-12 bg-festival-cream-100/90 rounded-2xl p-4 sm:p-5 border border-festival-cream-300 max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-festival-orange-500 text-white shrink-0">
              <ChefHat className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                Fresh Catering with Full Dietary Segregation
              </h4>
              <p className="text-xs sm:text-sm text-slate-600">
                Separate serving counters for vegetarian and non-vegetarian food lovers with unlimited servings.
              </p>
            </div>
          </div>
          <a
            href="#food-preference"
            className="shrink-0 px-4 py-2 rounded-xl bg-festival-purple-900 hover:bg-festival-purple-950 text-white text-xs sm:text-sm font-semibold transition-colors shadow-sm"
          >
            Vote Food Preference ↓
          </a>
        </div>

      </div>
    </section>
  );
};
