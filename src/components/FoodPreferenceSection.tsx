import React, { useEffect, useState, useCallback } from 'react';
import { castFoodPreferenceVote, fetchFoodPreferenceCounts } from '../lib/supabase';
import { FoodType } from '../types';
import { Salad, Drumstick, CheckCircle, AlertCircle, Loader2, Sparkles, Users } from 'lucide-react';
import confetti from 'canvas-confetti';

/**
 * Food Preference Counter Section
 *
 * Displays two anonymous voting cards (Vegetarian / Non-Vegetarian).
 * Each visitor can vote exactly once from the same browser.
 *
 * NOTE: Because there is no login/signup, one vote per *student* cannot be
 * guaranteed across different devices or browsers. The system prevents repeated
 * votes from the same browser via localStorage + an anonymous token that is
 * also stored server-side with a UNIQUE constraint.
 */

const FOOD_VOTE_KEY = 'hostel_day_food_vote';

function getStoredVote(): FoodType | null {
  try {
    const v = localStorage.getItem(FOOD_VOTE_KEY);
    if (v === 'Vegetarian' || v === 'Non-Vegetarian') return v;
  } catch {
    // localStorage may be blocked in private mode
  }
  return null;
}

function storeVote(foodType: FoodType): void {
  try {
    localStorage.setItem(FOOD_VOTE_KEY, foodType);
  } catch {
    // silent fail
  }
}

export const FoodPreferenceSection: React.FC = () => {
  const [counts, setCounts] = useState<{ Vegetarian: number; 'Non-Vegetarian': number }>({
    Vegetarian: 0,
    'Non-Vegetarian': 0,
  });
  const [hasVoted, setHasVoted] = useState<FoodType | null>(getStoredVote());
  const [isLoading, setIsLoading] = useState(true);
  const [isVoting, setIsVoting] = useState<FoodType | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch current counts on mount
  const loadCounts = useCallback(async () => {
    try {
      const result = await fetchFoodPreferenceCounts();
      setCounts(result);
    } catch (err) {
      console.error('Failed to load food preference counts:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCounts();
  }, [loadCounts]);

  const handleVote = async (foodType: FoodType) => {
    if (hasVoted) return;

    setIsVoting(foodType);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const res = await castFoodPreferenceVote(foodType);

      if (res.success) {
        storeVote(foodType);
        setHasVoted(foodType);
        setSuccessMessage('Your food preference has been recorded.');

        // Update counts optimistically
        setCounts((prev) => ({
          ...prev,
          [foodType]: prev[foodType] + 1,
        }));

        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
        });
      } else if (res.alreadyVoted) {
        // The server detected this token already voted
        storeVote(foodType);
        setHasVoted(foodType);
        setSuccessMessage('You have already submitted your food preference.');
      } else {
        setErrorMessage(res.message || 'Vote failed. Please check your connection and try again.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsVoting(null);
    }
  };

  const alreadyVotedMessage = hasVoted && !successMessage;

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

          {/* Already Voted Banner */}
          {alreadyVotedMessage && (
            <div className="mb-6 p-4 rounded-2xl bg-festival-blue-50 border border-festival-blue-100 text-festival-blue-800 flex items-start gap-3 animate-fadeIn">
              <CheckCircle className="w-5 h-5 text-festival-blue-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-sm sm:text-base">You have already submitted your food preference.</p>
                <p className="text-xs text-festival-blue-600 mt-0.5">
                  You voted for <strong>{hasVoted}</strong>. Thank you!
                </p>
              </div>
            </div>
          )}

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

          {/* Counter Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

            {/* Vegetarian Card */}
            <div
              className={`relative rounded-2xl border-2 p-6 text-center transition-all duration-300 ${
                hasVoted === 'Vegetarian'
                  ? 'border-emerald-500 bg-emerald-50/70 shadow-md ring-2 ring-emerald-200'
                  : 'border-slate-200 bg-slate-50/60'
              }`}
            >
              <div className={`mx-auto mb-3 w-14 h-14 rounded-2xl flex items-center justify-center ${
                hasVoted === 'Vegetarian' ? 'bg-emerald-600 text-white' : 'bg-emerald-100 text-emerald-700'
              }`}>
                <Salad className="w-7 h-7" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900">Vegetarian</h3>
              <div className="mt-2 flex items-center justify-center gap-1.5 text-slate-600">
                <Users className="w-4 h-4" />
                {isLoading ? (
                  <span className="inline-block w-8 h-5 bg-slate-200 rounded animate-pulse" />
                ) : (
                  <span className="font-semibold text-base">
                    {counts.Vegetarian} {counts.Vegetarian === 1 ? 'student' : 'students'}
                  </span>
                )}
              </div>
              <button
                type="button"
                disabled={!!hasVoted || isVoting !== null}
                onClick={() => handleVote('Vegetarian')}
                className={`mt-4 w-full py-3 px-4 rounded-xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 focus:outline-none focus:ring-4 ${
                  hasVoted
                    ? hasVoted === 'Vegetarian'
                      ? 'bg-emerald-600 text-white cursor-default opacity-90'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white hover:from-emerald-700 hover:to-emerald-600 shadow-md hover:shadow-lg focus:ring-emerald-300'
                }`}
              >
                {isVoting === 'Vegetarian' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Casting vote…</span>
                  </>
                ) : hasVoted === 'Vegetarian' ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>Voted</span>
                  </>
                ) : (
                  <span>I Prefer Vegetarian</span>
                )}
              </button>
            </div>

            {/* Non-Vegetarian Card */}
            <div
              className={`relative rounded-2xl border-2 p-6 text-center transition-all duration-300 ${
                hasVoted === 'Non-Vegetarian'
                  ? 'border-festival-orange-500 bg-festival-orange-50/70 shadow-md ring-2 ring-festival-orange-200'
                  : 'border-slate-200 bg-slate-50/60'
              }`}
            >
              <div className={`mx-auto mb-3 w-14 h-14 rounded-2xl flex items-center justify-center ${
                hasVoted === 'Non-Vegetarian' ? 'bg-festival-orange-600 text-white' : 'bg-festival-orange-100 text-festival-orange-700'
              }`}>
                <Drumstick className="w-7 h-7" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900">Non-Vegetarian</h3>
              <div className="mt-2 flex items-center justify-center gap-1.5 text-slate-600">
                <Users className="w-4 h-4" />
                {isLoading ? (
                  <span className="inline-block w-8 h-5 bg-slate-200 rounded animate-pulse" />
                ) : (
                  <span className="font-semibold text-base">
                    {counts['Non-Vegetarian']} {counts['Non-Vegetarian'] === 1 ? 'student' : 'students'}
                  </span>
                )}
              </div>
              <button
                type="button"
                disabled={!!hasVoted || isVoting !== null}
                onClick={() => handleVote('Non-Vegetarian')}
                className={`mt-4 w-full py-3 px-4 rounded-xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 focus:outline-none focus:ring-4 ${
                  hasVoted
                    ? hasVoted === 'Non-Vegetarian'
                      ? 'bg-festival-orange-600 text-white cursor-default opacity-90'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-festival-orange-600 to-festival-orange-500 text-white hover:from-festival-orange-700 hover:to-festival-orange-600 shadow-md hover:shadow-lg focus:ring-festival-orange-300'
                }`}
              >
                {isVoting === 'Non-Vegetarian' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Casting vote…</span>
                  </>
                ) : hasVoted === 'Non-Vegetarian' ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>Voted</span>
                  </>
                ) : (
                  <span>I Prefer Non-Vegetarian</span>
                )}
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
