import React, { useState, useEffect, useMemo } from 'react';
import { Suggestion, SuggestionCategory } from '../types';
import { fetchApprovedSuggestions, upvoteSuggestion } from '../lib/supabase';
import { 
  ThumbsUp, 
  Search, 
  Filter, 
  ArrowUpDown, 
  Clock, 
  Sparkles, 
  UserCheck, 
  Loader2, 
  AlertCircle,
  Inbox,
  Check,
  RotateCw
} from 'lucide-react';
import confetti from 'canvas-confetti';

const CATEGORIES: ('All' | SuggestionCategory)[] = [
  'All',
  'Cultural Programs',
  'Games and Sports',
  'Food and Refreshments',
  'Decoration',
  'Volunteers and Activities',
  'Other'
];

type SortOption = 'most-upvoted' | 'newest' | 'oldest';

export const ApprovedSuggestionsSection: React.FC = () => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | SuggestionCategory>('All');
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  // Voting loading map
  const [votingIds, setVotingIds] = useState<Set<string>>(new Set());

  const loadSuggestions = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchApprovedSuggestions();
      setSuggestions(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to load approved suggestions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSuggestions();

    const handleNewSuggestion = () => {
      loadSuggestions();
    };

    window.addEventListener('hostel-suggestion-added', handleNewSuggestion);
    return () => {
      window.removeEventListener('hostel-suggestion-added', handleNewSuggestion);
    };
  }, []);

  const handleUpvote = async (id: string) => {
    if (votingIds.has(id)) return;

    const currentSugg = suggestions.find((s) => s.id === id);
    if (currentSugg?.has_upvoted) return;

    // Optimistic UI update
    setSuggestions((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              upvotes_count: (s.upvotes_count || 0) + 1,
              has_upvoted: true
            }
          : s
      )
    );

    setVotingIds((prev) => new Set(prev).add(id));

    try {
      const res = await upvoteSuggestion(id);
      if (res.success && res.newCount !== undefined) {
        setSuggestions((prev) =>
          prev.map((s) =>
            s.id === id ? { ...s, upvotes_count: res.newCount, has_upvoted: true } : s
          )
        );
      }
      confetti({
        particleCount: 25,
        spread: 45,
        origin: { y: 0.8 }
      });
    } catch (err) {
      console.error('Failed to vote', err);
    } finally {
      setVotingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const getRelativeTime = (isoString: string) => {
    try {
      const diffMs = Date.now() - new Date(isoString).getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      if (diffHours < 1) {
        const diffMins = Math.max(1, Math.floor(diffMs / (1000 * 60)));
        return `${diffMins}m ago`;
      }
      if (diffHours < 24) return `${diffHours}h ago`;
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays}d ago`;
    } catch {
      return 'Recently';
    }
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Cultural Programs':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Games and Sports':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Food and Refreshments':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Decoration':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Volunteers and Activities':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  // Filtered & Sorted list
  const filteredSuggestions = useMemo(() => {
    let result = [...suggestions];

    // Search by title or description
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (s) => s.title.toLowerCase().includes(q) || s.description.toLowerCase().includes(q)
      );
    }

    // Filter by category
    if (selectedCategory !== 'All') {
      result = result.filter((s) => s.category === selectedCategory);
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'most-upvoted') {
        return (b.upvotes_count || 0) - (a.upvotes_count || 0);
      }
      if (sortBy === 'newest') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      if (sortBy === 'oldest') {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      }
      return 0;
    });

    return result;
  }, [suggestions, searchQuery, selectedCategory, sortBy]);

  return (
    <section id="view-suggestions" className="py-20 bg-white border-b border-festival-cream-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-festival-blue-100 text-festival-blue-800 text-xs sm:text-sm font-bold uppercase tracking-wider mb-4 border border-festival-blue-200">
            <Sparkles className="w-4 h-4 text-festival-blue-700" />
            Approved Community Ideas
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-festival-purple-950 font-display">
            Student Suggestions
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600 font-medium">
            Vote for the events, games, and surprises you want to experience during Hostel Day!
          </p>
        </div>

        {/* Filter & Search Toolbar */}
        <div className="bg-festival-cream-50 p-4 sm:p-6 rounded-3xl border border-festival-cream-300 shadow-sm mb-10 space-y-4">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 items-center">
            
            {/* Search Input */}
            <div className="md:col-span-6 relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search suggestions by title or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-300 bg-white text-slate-800 text-sm focus:ring-2 focus:ring-festival-blue-500 focus:border-festival-blue-500 shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 bg-slate-100 px-2 py-1 rounded-full"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Category Dropdown */}
            <div className="md:col-span-3 relative">
              <div className="relative">
                <Filter className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value as any)}
                  className="w-full pl-10 pr-8 py-3 rounded-2xl border border-slate-300 bg-white text-slate-800 text-sm focus:ring-2 focus:ring-festival-blue-500 focus:border-festival-blue-500 cursor-pointer appearance-none shadow-inner"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat === 'All' ? 'All Categories' : cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Sort Options & Refresh */}
            <div className="md:col-span-3 flex items-center gap-2">
              <div className="relative flex-1">
                <ArrowUpDown className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="w-full pl-10 pr-8 py-3 rounded-2xl border border-slate-300 bg-white text-slate-800 text-sm focus:ring-2 focus:ring-festival-blue-500 focus:border-festival-blue-500 cursor-pointer appearance-none shadow-inner"
                >
                  <option value="newest">Newest First ⏱️</option>
                  <option value="most-upvoted">Most Upvoted 🔥</option>
                  <option value="oldest">Oldest First 📅</option>
                </select>
              </div>
              <button
                type="button"
                onClick={loadSuggestions}
                disabled={loading}
                title="Reload suggestions from database"
                className="p-3 rounded-2xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 transition-colors shadow-inner flex items-center justify-center shrink-0"
              >
                <RotateCw className={`w-4 h-4 ${loading ? 'animate-spin text-festival-blue-600' : ''}`} />
              </button>
            </div>

          </div>

          {/* Quick Category Chips for Touch / Mobile */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider shrink-0 mr-1">
              Quick Filter:
            </span>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-festival-purple-900 text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>

        {/* Loading State */}
        {loading && (
          <div className="py-20 text-center">
            <Loader2 className="w-10 h-10 text-festival-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-slate-600 font-medium">Loading approved student suggestions...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="p-6 rounded-2xl bg-rose-50 border border-rose-200 text-center max-w-xl mx-auto my-12">
            <AlertCircle className="w-10 h-10 text-rose-600 mx-auto mb-3" />
            <p className="font-bold text-rose-800 text-base mb-2">Unable to Load Suggestions</p>
            <p className="text-rose-600 text-sm mb-4">{error}</p>
            <button
              onClick={loadSuggestions}
              className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredSuggestions.length === 0 && (
          <div className="py-16 text-center max-w-md mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-festival-cream-200 text-slate-400 flex items-center justify-center mx-auto mb-4">
              <Inbox className="w-8 h-8" />
            </div>
            <h3 className="font-extrabold text-xl text-slate-800 mb-2 font-display">No Suggestions Found</h3>
            <p className="text-slate-500 text-sm mb-6">
              {searchQuery || selectedCategory !== 'All'
                ? 'Try adjusting your search query or category filter.'
                : 'Be the first hosteller to share a suggestion for this year!'}
            </p>
            <a
              href="#share-suggestion"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-festival-orange-500 hover:bg-festival-orange-600 text-white font-bold text-sm shadow-md transition-all"
            >
              Submit a Suggestion Now
            </a>
          </div>
        )}

        {/* Suggestions Cards Grid - Strictly NO department or year displayed! */}
        {!loading && !error && filteredSuggestions.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSuggestions.map((item) => {
              const isVoted = item.has_upvoted;
              const isVotingThis = votingIds.has(item.id);

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200/90 hover:border-festival-blue-300 shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
                >
                  <div>
                    {/* Top Row: Category & Relative Time */}
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${getCategoryColor(
                          item.category
                        )}`}
                      >
                        {item.category}
                      </span>
                      <div className="flex items-center gap-1 text-slate-400 text-xs font-medium">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{getRelativeTime(item.created_at)}</span>
                      </div>
                    </div>

                    {/* Suggestion Title */}
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2.5 font-display line-clamp-2">
                      {item.title}
                    </h3>

                    {/* Suggestion Description */}
                    <p className="text-sm text-slate-600 leading-relaxed mb-6 whitespace-pre-line">
                      {item.description}
                    </p>
                  </div>

                  {/* Bottom Row: Anonymous Label & Upvote Button */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                    
                    {/* "Submitted anonymously" label */}
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                      <UserCheck className="w-4 h-4 text-emerald-600" />
                      <span>Submitted anonymously</span>
                    </div>

                    {/* Upvote Button */}
                    <button
                      onClick={() => handleUpvote(item.id)}
                      disabled={isVoted || isVotingThis}
                      aria-label={isVoted ? 'Already upvoted' : 'Upvote this suggestion'}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                        isVoted
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 cursor-default'
                          : 'bg-festival-blue-50 hover:bg-festival-blue-600 text-festival-blue-800 hover:text-white border border-festival-blue-200 shadow-sm active:scale-95'
                      }`}
                    >
                      {isVotingThis ? (
                        <Loader2 className="w-4 h-4 animate-spin text-festival-blue-600" />
                      ) : isVoted ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <ThumbsUp className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      )}
                      <span>{item.upvotes_count || 0}</span>
                      <span className="text-[11px] font-normal opacity-85">
                        {isVoted ? 'Upvoted' : 'Upvote'}
                      </span>
                    </button>

                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
};
