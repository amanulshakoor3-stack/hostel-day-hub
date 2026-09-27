import React, { useState } from 'react';
import { submitFoodPreference } from '../lib/supabase';
import { FoodType } from '../types';
import { Salad, Drumstick, CheckCircle, AlertCircle, Loader2, Sparkles, Send } from 'lucide-react';
import confetti from 'canvas-confetti';

const MAX_CHARS = 300;

export const FoodPreferenceSection: React.FC = () => {
  const [foodType, setFoodType] = useState<FoodType | ''>('');
  const [preferredFoods, setPreferredFoods] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    if (!foodType) {
      setErrorMessage('Please choose your food preference (Vegetarian or Non-Vegetarian).');
      return;
    }

    const trimmed = preferredFoods.trim();
    if (!trimmed) {
      setErrorMessage('Please enter at least one preferred food item.');
      return;
    }

    if (trimmed.length < 3) {
      setErrorMessage('Please enter a valid food item (minimum 3 characters).');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await submitFoodPreference({
        food_type: foodType as FoodType,
        preferred_foods: trimmed
      });

      if (res.success) {
        setSuccessMessage('Thank you! Your anonymous food preference has been submitted.');
        setFoodType('');
        setPreferredFoods('');
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 }
        });
      } else {
        setErrorMessage(res.message || 'Submission failed. Please check your connection and try again.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="food-preference" className="py-20 bg-festival-cream-100/60 border-b border-festival-cream-200 relative">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Card Container */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-lg border border-festival-cream-300">
          
          <div className="text-center mb-8">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-festival-orange-100 text-festival-orange-800 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-festival-orange-600" />
              Catering Survey
            </span>
            {/* Title exact wording */}
            <h2 className="text-2xl sm:text-4xl font-extrabold text-festival-purple-950 font-display">
              What type of food do you prefer?
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Anonymous vote. Help our catering team prepare the right quantities and variety for everyone.
            </p>
          </div>

          {/* Success Banner */}
          {successMessage && (
            <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-start gap-3 animate-fadeIn">
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-sm sm:text-base">{successMessage}</p>
                <p className="text-xs text-emerald-600 mt-0.5">Your response has been safely recorded.</p>
              </div>
            </div>
          )}

          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-3 animate-fadeIn">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <p className="text-sm font-semibold">{errorMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Selection cards: Vegetarian vs Non-Vegetarian */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Option 1: Vegetarian */}
              <label
                className={`relative flex items-center gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                  foodType === 'Vegetarian'
                    ? 'border-emerald-500 bg-emerald-50/70 shadow-md ring-2 ring-emerald-200'
                    : 'border-slate-200 bg-slate-50/60 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="food_type"
                  value="Vegetarian"
                  checked={foodType === 'Vegetarian'}
                  onChange={() => {
                    setFoodType('Vegetarian');
                    setErrorMessage('');
                  }}
                  className="w-5 h-5 text-emerald-600 focus:ring-emerald-500 border-slate-300 cursor-pointer"
                />
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${
                    foodType === 'Vegetarian' ? 'bg-emerald-600 text-white' : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    <Salad className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block text-base sm:text-lg">
                      Vegetarian
                    </span>
                    <span className="text-xs text-slate-500">Pure Veg Caterings</span>
                  </div>
                </div>
              </label>

              {/* Option 2: Non-Vegetarian */}
              <label
                className={`relative flex items-center gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                  foodType === 'Non-Vegetarian'
                    ? 'border-festival-orange-500 bg-festival-orange-50/70 shadow-md ring-2 ring-festival-orange-200'
                    : 'border-slate-200 bg-slate-50/60 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="food_type"
                  value="Non-Vegetarian"
                  checked={foodType === 'Non-Vegetarian'}
                  onChange={() => {
                    setFoodType('Non-Vegetarian');
                    setErrorMessage('');
                  }}
                  className="w-5 h-5 text-festival-orange-600 focus:ring-festival-orange-500 border-slate-300 cursor-pointer"
                />
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${
                    foodType === 'Non-Vegetarian' ? 'bg-festival-orange-600 text-white' : 'bg-festival-orange-100 text-festival-orange-700'
                  }`}>
                    <Drumstick className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block text-base sm:text-lg">
                      Non-Vegetarian
                    </span>
                    <span className="text-xs text-slate-500">Biriyani & Starters</span>
                  </div>
                </div>
              </label>

            </div>

            {/* Hint when nothing selected yet */}
            {!foodType && (
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-amber-800 text-sm text-center flex items-center justify-center gap-2">
                <span>👆 Click either <strong>Vegetarian</strong> or <strong>Non-Vegetarian</strong> above to enter your favorite dishes.</span>
              </div>
            )}

            {/* Dynamic Question based on choice */}
            {foodType === 'Vegetarian' && (
              <div className="pt-2 animate-fadeIn">
                <label className="block text-sm font-bold text-slate-800 mb-2">
                  What vegetarian food would you like to have? <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <textarea
                    rows={3}
                    value={preferredFoods}
                    maxLength={MAX_CHARS}
                    onChange={(e) => setPreferredFoods(e.target.value)}
                    placeholder="Example: Paneer biriyani, Gobi 65, veg noodles, mushroom masala"
                    required
                    className="w-full px-4 py-3 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-slate-50/50 text-slate-900 text-sm placeholder:text-slate-400 resize-none transition-all"
                  />
                  <div className="flex justify-between items-center mt-1.5 text-xs text-slate-500 px-1">
                    <span>Be specific with your favorite dishes</span>
                    <span className={preferredFoods.length >= MAX_CHARS ? 'text-rose-500 font-bold' : ''}>
                      {preferredFoods.length} / {MAX_CHARS}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {foodType === 'Non-Vegetarian' && (
              <div className="pt-2 animate-fadeIn">
                <label className="block text-sm font-bold text-slate-800 mb-2">
                  What non-vegetarian food would you like to have? <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <textarea
                    rows={3}
                    value={preferredFoods}
                    maxLength={MAX_CHARS}
                    onChange={(e) => setPreferredFoods(e.target.value)}
                    placeholder="Example: Chicken biriyani, chicken 65, chicken noodles, mutton gravy"
                    required
                    className="w-full px-4 py-3 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-festival-orange-500 focus:border-festival-orange-500 bg-slate-50/50 text-slate-900 text-sm placeholder:text-slate-400 resize-none transition-all"
                  />
                  <div className="flex justify-between items-center mt-1.5 text-xs text-slate-500 px-1">
                    <span>Mention your top non-veg choices</span>
                    <span className={preferredFoods.length >= MAX_CHARS ? 'text-rose-500 font-bold' : ''}>
                      {preferredFoods.length} / {MAX_CHARS}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting || !foodType || !preferredFoods.trim()}
                className="w-full py-4 px-6 rounded-2xl font-bold text-white text-base bg-gradient-to-r from-festival-purple-900 via-festival-blue-800 to-festival-purple-900 hover:from-festival-purple-950 hover:to-festival-blue-900 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-4 focus:ring-festival-purple-300"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Submitting Food Preference...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 text-festival-orange-400" />
                    <span>Submit Food Preference</span>
                  </>
                )}
              </button>
            </div>

          </form>

        </div>

      </div>
    </section>
  );
};
