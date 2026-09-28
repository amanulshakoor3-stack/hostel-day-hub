import React, { useEffect, useState, useCallback } from 'react';
import { submitFoodPreference, fetchFoodPreferenceCounts } from '../lib/supabase';
import { FoodType, Year } from '../types';
import { Salad, Drumstick, CheckCircle, AlertCircle, Loader2, Sparkles, Send, Users, User, GraduationCap } from 'lucide-react';
import confetti from 'canvas-confetti';

const YEARS: Year[] = ['First Year', 'Second Year', 'Third Year', 'Fourth Year'];
const MAX_NAME_LENGTH = 60;

export const FoodPreferenceSection: React.FC = () => {
  const [studentName, setStudentName] = useState('');
  const [year, setYear] = useState<Year | ''>('');
  const [foodType, setFoodType] = useState<FoodType | ''>('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [counts, setCounts] = useState<{ Vegetarian: number; 'Non-Vegetarian': number }>({
    Vegetarian: 0,
    'Non-Vegetarian': 0,
  });
  const [isLoadingCounts, setIsLoadingCounts] = useState(true);

  // Fetch current counters on mount
  const loadCounts = useCallback(async () => {
    try {
      const res = await fetchFoodPreferenceCounts();
      setCounts(res);
    } catch (err) {
      console.error('Failed to load food preference counts:', err);
    } finally {
      setIsLoadingCounts(false);
    }
  }, []);

  useEffect(() => {
    loadCounts();
  }, [loadCounts]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    const trimmedName = studentName.trim();
    if (!trimmedName) {
      setErrorMessage('Please enter your name.');
      return;
    }

    if (!year) {
      setErrorMessage('Please select your year.');
      return;
    }

    if (!foodType) {
      setErrorMessage('Please select your food preference (Vegetarian or Non-Vegetarian).');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await submitFoodPreference({
        student_name: trimmedName,
        year: year as Year,
        food_type: foodType as FoodType,
      });

      if (res.success) {
        setSuccessMessage('Thank you! Your food preference has been recorded.');

        // Update counts optimistically
        setCounts((prev) => ({
          ...prev,
          [foodType]: prev[foodType] + 1,
        }));

        // Reset form
        setStudentName('');
        setYear('');
        setFoodType('');

        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
        });
      } else {
        setErrorMessage(res.message || 'Submission failed. Please try again.');
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

        {/* Outer Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-lg border border-festival-cream-300">

          {/* Section Header */}
          <div className="text-center mb-8">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-festival-orange-100 text-festival-orange-800 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-festival-orange-600" />
              Catering Survey
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-festival-purple-950 font-display">
              Food Preference
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Help our catering team prepare the right quantities and variety for everyone.
            </p>
          </div>

          {/* Counter Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {/* Vegetarian Total */}
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-center gap-4">
              <div className="p-3 bg-emerald-600 text-white rounded-xl shrink-0">
                <Salad className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 block">Vegetarian</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Users className="w-4 h-4 text-emerald-600" />
                  {isLoadingCounts ? (
                    <span className="w-8 h-4 bg-emerald-200 animate-pulse rounded block" />
                  ) : (
                    <span className="font-extrabold text-lg text-emerald-950">
                      {counts.Vegetarian} {counts.Vegetarian === 1 ? 'student' : 'students'}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Non-Vegetarian Total */}
            <div className="p-4 rounded-2xl bg-festival-orange-50/70 border border-festival-orange-200 flex items-center gap-4">
              <div className="p-3 bg-festival-orange-600 text-white rounded-xl shrink-0">
                <Drumstick className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-festival-orange-700 block">Non-Vegetarian</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Users className="w-4 h-4 text-festival-orange-600" />
                  {isLoadingCounts ? (
                    <span className="w-8 h-4 bg-festival-orange-200 animate-pulse rounded block" />
                  ) : (
                    <span className="font-extrabold text-lg text-festival-orange-950">
                      {counts['Non-Vegetarian']} {counts['Non-Vegetarian'] === 1 ? 'student' : 'students'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Success Banner */}
          {successMessage && (
            <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-start gap-3 animate-fadeIn">
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-sm sm:text-base">{successMessage}</p>
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

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* 1. Student Name Input */}
            <div>
              <label htmlFor="student_name" className="block text-sm font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                <User className="w-4 h-4 text-festival-purple-700" />
                <span>Enter your name</span> <span className="text-rose-500">*</span>
              </label>
              <input
                id="student_name"
                type="text"
                value={studentName}
                maxLength={MAX_NAME_LENGTH}
                onChange={(e) => {
                  setStudentName(e.target.value);
                  setErrorMessage('');
                }}
                placeholder="Enter your name"
                required
                className="w-full px-4 py-3 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-festival-purple-500 focus:border-festival-purple-500 bg-slate-50/50 text-slate-900 text-sm placeholder:text-slate-400 transition-all"
              />
            </div>

            {/* 2. Student Year Selection */}
            <div>
              <label htmlFor="student_year" className="block text-sm font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-festival-purple-700" />
                <span>Select your year</span> <span className="text-rose-500">*</span>
              </label>
              <select
                id="student_year"
                value={year}
                onChange={(e) => {
                  setYear(e.target.value as Year);
                  setErrorMessage('');
                }}
                required
                className="w-full px-4 py-3 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-festival-purple-500 focus:border-festival-purple-500 bg-slate-50/50 text-slate-900 text-sm transition-all"
              >
                <option value="" disabled>
                  -- Select your year --
                </option>
                {YEARS.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            {/* 3. Food Preference Radio/Card Selection */}
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2">
                What type of food do you prefer? <span className="text-rose-500">*</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Option 1: Vegetarian */}
                <label
                  className={`relative flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
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
                    <div
                      className={`p-2.5 rounded-xl ${
                        foodType === 'Vegetarian' ? 'bg-emerald-600 text-white' : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      <Salad className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-slate-900 text-base">Vegetarian</span>
                  </div>
                </label>

                {/* Option 2: Non-Vegetarian */}
                <label
                  className={`relative flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
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
                    <div
                      className={`p-2.5 rounded-xl ${
                        foodType === 'Non-Vegetarian'
                          ? 'bg-festival-orange-600 text-white'
                          : 'bg-festival-orange-100 text-festival-orange-700'
                      }`}
                    >
                      <Drumstick className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-slate-900 text-base">Non-Vegetarian</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting || !studentName.trim() || !year || !foodType}
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
