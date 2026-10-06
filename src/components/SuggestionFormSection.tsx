import React, { useState } from 'react';
import { submitAnonymousSuggestion } from '../lib/supabase';
import { Department, Year, SuggestionCategory, DEPARTMENTS } from '../types';
import { 
  MessageSquarePlus, 
  Send, 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  HelpCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

const YEARS: Year[] = [
  'First Year',
  'Second Year',
  'Third Year',
  'Fourth Year'
];

const CATEGORIES: SuggestionCategory[] = [
  'Cultural Programs',
  'Games and Sports',
  'Food and Refreshments',
  'Decoration',
  'Volunteers and Activities',
  'Other'
];

const TITLE_MAX = 100;
const DESC_MIN = 10;
const DESC_MAX = 600;

export const SuggestionFormSection: React.FC = () => {
  const [department, setDepartment] = useState<Department | ''>('');
  const [year, setYear] = useState<Year | ''>('');
  const [category, setCategory] = useState<SuggestionCategory | ''>('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    if (!department) {
      setErrorMessage('Please select your department.');
      return;
    }
    if (!year) {
      setErrorMessage('Please select your study year.');
      return;
    }
    if (!category) {
      setErrorMessage('Please select a suggestion category.');
      return;
    }

    const trimmedTitle = title.trim();
    if (!trimmedTitle || trimmedTitle.length < 5) {
      setErrorMessage('Please enter a descriptive suggestion title (minimum 5 characters).');
      return;
    }

    const trimmedDesc = description.trim();
    if (!trimmedDesc || trimmedDesc.length < DESC_MIN) {
      setErrorMessage(`Please provide more detail in your description (minimum ${DESC_MIN} characters).`);
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await submitAnonymousSuggestion({
        department,
        year,
        category,
        title: trimmedTitle,
        description: trimmedDesc
      });

      if (res.success) {
        setSuccessMessage('Awesome! Your suggestion is now live on the suggestions board.');
        setDepartment('');
        setYear('');
        setCategory('');
        setTitle('');
        setDescription('');
        window.dispatchEvent(new CustomEvent('hostel-suggestion-added', { detail: res.suggestion }));
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 }
        });
      } else {
        setErrorMessage(
          res.message || 'Supabase service is temporarily unavailable. Please try again shortly.'
        );
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to submit your suggestion. Please check your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="share-suggestion" className="py-20 bg-festival-cream-50 relative">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header & Call to action */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-festival-orange-100 text-festival-orange-800 text-xs sm:text-sm font-bold uppercase tracking-wider mb-4 border border-festival-orange-200">
            <MessageSquarePlus className="w-4 h-4 text-festival-orange-600" />
            Student Suggestion Box
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-festival-purple-950 font-display">
            Share Your Idea for Hostel Day
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Have a game idea, performance idea, or special decoration concept? We want to hear it!
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-200 relative">
          
          {/* Privacy Notice Box Above Form */}
          <div className="mb-8 p-4 rounded-2xl bg-festival-purple-50/80 border border-festival-purple-200 flex items-start gap-3 text-festival-purple-900">
            <ShieldCheck className="w-5 h-5 text-festival-purple-700 shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-bold">
                No login required. Share your idea anonymously by selecting your department and year.
              </p>
              <p className="text-xs text-festival-purple-700/80 mt-0.5">
                Your suggestion is instantly published on the board below for fellow hostellers to upvote!
              </p>
            </div>
          </div>

          {/* Success Banner */}
          {successMessage && (
            <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fadeIn">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-base">{successMessage}</p>
                  <p className="text-xs text-emerald-700 mt-0.5">
                    It has been added to the Student Suggestions section below. You can vote for it right now!
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById('view-suggestions');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="shrink-0 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm"
              >
                View & Vote ↓
              </button>
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
            
            {/* Department & Year Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              
              {/* Department Dropdown */}
              <div>
                <label htmlFor="department" className="block text-sm font-bold text-slate-800 mb-1.5">
                  Department <span className="text-rose-500">*</span>
                </label>
                <select
                  id="department"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value as Department)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-800 text-sm focus:ring-2 focus:ring-festival-purple-500 focus:border-festival-purple-500 shadow-sm transition-all"
                >
                  <option value="" disabled>Select your department</option>
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              {/* Year Dropdown */}
              <div>
                <label htmlFor="year" className="block text-sm font-bold text-slate-800 mb-1.5">
                  Year <span className="text-rose-500">*</span>
                </label>
                <select
                  id="year"
                  value={year}
                  onChange={(e) => setYear(e.target.value as Year)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-800 text-sm focus:ring-2 focus:ring-festival-purple-500 focus:border-festival-purple-500 shadow-sm transition-all"
                >
                  <option value="" disabled>Select your year</option>
                  {YEARS.map((yr) => (
                    <option key={yr} value={yr}>{yr}</option>
                  ))}
                </select>
              </div>

            </div>

            {/* Suggestion Category Dropdown */}
            <div>
              <label htmlFor="category" className="block text-sm font-bold text-slate-800 mb-1.5">
                Suggestion Category <span className="text-rose-500">*</span>
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value as SuggestionCategory)}
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-800 text-sm focus:ring-2 focus:ring-festival-purple-500 focus:border-festival-purple-500 shadow-sm transition-all"
              >
                <option value="" disabled>Select a category</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Suggestion Title */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label htmlFor="title" className="block text-sm font-bold text-slate-800">
                  Suggestion Title <span className="text-rose-500">*</span>
                </label>
                <span className="text-xs text-slate-400">
                  {title.length}/{TITLE_MAX}
                </span>
              </div>
              <input
                id="title"
                type="text"
                maxLength={TITLE_MAX}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Brief, catchy summary of your idea"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-800 text-sm focus:ring-2 focus:ring-festival-purple-500 focus:border-festival-purple-500 shadow-sm placeholder:text-slate-400 transition-all"
              />
            </div>

            {/* Suggestion Description with Live Character Counter */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label htmlFor="description" className="block text-sm font-bold text-slate-800">
                  Suggestion Description <span className="text-rose-500">*</span>
                </label>
                <span className={`text-xs ${
                  description.length >= DESC_MAX ? 'text-rose-600 font-bold' : 'text-slate-400'
                }`}>
                  {description.length}/{DESC_MAX}
                </span>
              </div>
              <textarea
                id="description"
                rows={4}
                maxLength={DESC_MAX}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain your idea clearly. Mention how it works and why students would love it..."
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-800 text-sm focus:ring-2 focus:ring-festival-purple-500 focus:border-festival-purple-500 shadow-sm placeholder:text-slate-400 resize-none transition-all"
              />
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5" />
                Minimum {DESC_MIN} characters required. Keep it constructive and fun!
              </p>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 rounded-2xl font-bold text-white text-base bg-gradient-to-r from-festival-orange-500 to-amber-500 hover:from-festival-orange-600 hover:to-amber-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-festival-orange-500/25 hover:shadow-festival-orange-500/35 transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-4 focus:ring-festival-orange-300"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Submitting Your Anonymous Suggestion...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 text-white" />
                    <span>Submit Anonymous Suggestion</span>
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
