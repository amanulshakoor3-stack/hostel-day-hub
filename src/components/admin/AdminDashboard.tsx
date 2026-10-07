import React, { useState, useEffect, useMemo } from 'react';
import {
  Sparkles,
  LogOut,
  RefreshCw,
  Search,
  Download,
  Utensils,
  Music,
  ShieldCheck,
  ExternalLink,
  MessageSquare,
} from 'lucide-react';
import {
  adminLogout,
  fetchAllPerformanceRegistrations,
  fetchAllFoodPreferences,
} from '../../lib/adminAuth';
import { supabase } from '../../lib/supabase';

interface PerformanceRecord {
  id: string;
  performance_type: string;
  performance_name?: string | null;
  participant_name: string;
  department: string;
  year: string;
  group_name?: string | null;
  group_members?: string | null;
  description?: string | null;
  created_at: string;
}

interface FoodRecord {
  id: string;
  student_name: string;
  year: string;
  food_type: string;
  created_at: string;
}

interface SuggestionRecord {
  id: string;
  student_name?: string | null;
  department: string;
  year: string;
  category: string;
  title: string;
  description: string;
  status: string;
  created_at: string;
}

interface AdminDashboardProps {
  onLogout: () => void;
  onBackToHome: () => void;
}

type TabType = 'performances' | 'food' | 'suggestions';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onLogout,
  onBackToHome,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('performances');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [performances, setPerformances] = useState<PerformanceRecord[]>([]);
  const [foodPreferences, setFoodPreferences] = useState<FoodRecord[]>([]);
  const [suggestions, setSuggestions] = useState<SuggestionRecord[]>([]);

  // Filters for Performances
  const [perfSearch, setPerfSearch] = useState('');
  const [perfTypeFilter, setPerfTypeFilter] = useState('all');
  const [perfYearFilter, setPerfYearFilter] = useState('all');
  const [perfDeptFilter, setPerfDeptFilter] = useState('all');

  // Filters for Food
  const [foodSearch, setFoodSearch] = useState('');
  const [foodTypeFilter, setFoodTypeFilter] = useState('all');
  const [foodYearFilter, setFoodYearFilter] = useState('all');

  // Filters for Suggestions
  const [suggSearch, setSuggSearch] = useState('');
  const [suggCategoryFilter, setSuggCategoryFilter] = useState('all');

  const loadAllData = async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const [perfRes, foodRes] = await Promise.all([
        fetchAllPerformanceRegistrations(),
        fetchAllFoodPreferences(),
      ]);

      if (perfRes.data) setPerformances(perfRes.data as PerformanceRecord[]);
      if (foodRes.data) setFoodPreferences(foodRes.data as FoodRecord[]);

      // Fetch suggestions if supabase client available
      if (supabase) {
        const { data: suggData } = await supabase
          .from('suggestions')
          .select('*')
          .order('created_at', { ascending: false });
        if (suggData) setSuggestions(suggData as SuggestionRecord[]);
      }
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleLogout = async () => {
    await adminLogout();
    onLogout();
  };

  // Performance Stats
  const perfStats = useMemo(() => {
    const total = performances.length;
    const soloDance = performances.filter((p) => p.performance_type === 'Solo Dance').length;
    const groupDance = performances.filter((p) => p.performance_type === 'Group Dance').length;
    const soloSong = performances.filter((p) => p.performance_type === 'Solo Song').length;
    const groupSong = performances.filter((p) => p.performance_type === 'Group Song').length;
    const rampwalk = performances.filter((p) => p.performance_type === 'Rampwalk').length;
    const extra = performances.filter((p) => p.performance_type === 'Extra Performance').length;
    return { total, soloDance, groupDance, soloSong, groupSong, rampwalk, extra };
  }, [performances]);

  // Food Stats
  const foodStats = useMemo(() => {
    const total = foodPreferences.length;
    const veg = foodPreferences.filter((f) => f.food_type === 'Vegetarian').length;
    const nonVeg = foodPreferences.filter((f) => f.food_type === 'Non-Vegetarian').length;

    const years = ['First Year', 'Second Year', 'Third Year', 'Fourth Year'];
    const byYear = years.map((yr) => {
      const yrRecords = foodPreferences.filter((f) => f.year === yr);
      const v = yrRecords.filter((f) => f.food_type === 'Vegetarian').length;
      const nv = yrRecords.filter((f) => f.food_type === 'Non-Vegetarian').length;
      return { year: yr, total: yrRecords.length, veg: v, nonVeg: nv };
    });

    return { total, veg, nonVeg, byYear };
  }, [foodPreferences]);

  // Filtered Performances
  const filteredPerformances = useMemo(() => {
    return performances.filter((p) => {
      const q = perfSearch.toLowerCase().trim();
      const matchesSearch =
        !q ||
        p.participant_name.toLowerCase().includes(q) ||
        (p.group_name && p.group_name.toLowerCase().includes(q)) ||
        (p.group_members && p.group_members.toLowerCase().includes(q)) ||
        p.department.toLowerCase().includes(q) ||
        (p.performance_name && p.performance_name.toLowerCase().includes(q));

      const matchesType = perfTypeFilter === 'all' || p.performance_type === perfTypeFilter;
      const matchesYear = perfYearFilter === 'all' || p.year === perfYearFilter;
      const matchesDept = perfDeptFilter === 'all' || p.department === perfDeptFilter;

      return matchesSearch && matchesType && matchesYear && matchesDept;
    });
  }, [performances, perfSearch, perfTypeFilter, perfYearFilter, perfDeptFilter]);

  // Filtered Food Records
  const filteredFood = useMemo(() => {
    return foodPreferences.filter((f) => {
      const q = foodSearch.toLowerCase().trim();
      const matchesSearch =
        !q || f.student_name.toLowerCase().includes(q) || f.year.toLowerCase().includes(q);

      const matchesType = foodTypeFilter === 'all' || f.food_type === foodTypeFilter;
      const matchesYear = foodYearFilter === 'all' || f.year === foodYearFilter;

      return matchesSearch && matchesType && matchesYear;
    });
  }, [foodPreferences, foodSearch, foodTypeFilter, foodYearFilter]);

  // Filtered Suggestions
  const filteredSuggestions = useMemo(() => {
    return suggestions.filter((s) => {
      const q = suggSearch.toLowerCase().trim();
      const matchesSearch =
        !q ||
        s.title.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.department.toLowerCase().includes(q) ||
        (s.student_name && s.student_name.toLowerCase().includes(q));

      const matchesCategory = suggCategoryFilter === 'all' || s.category === suggCategoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [suggestions, suggSearch, suggCategoryFilter]);

  // Export CSV for Performances
  const exportPerformanceCSV = () => {
    if (performances.length === 0) return;
    const headers = [
      'Sl No',
      'Performance Type',
      'Participant / Lead Name',
      'Department',
      'Year',
      'Performance / Act Name',
      'Group Name',
      'Group Members',
      'Notes & Description',
      'Registered Date & Time',
    ];

    const rows = filteredPerformances.map((p, index) => [
      index + 1,
      `"${p.performance_type || ''}"`,
      `"${p.participant_name || ''}"`,
      `"${p.department || ''}"`,
      `"${p.year || ''}"`,
      `"${p.performance_name || ''}"`,
      `"${p.group_name || ''}"`,
      `"${(p.group_members || '').replace(/"/g, '""')}"`,
      `"${(p.description || '').replace(/"/g, '""')}"`,
      `"${new Date(p.created_at).toLocaleString()}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `HostelDay_Performance_Registrations_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export CSV for Food
  const exportFoodCSV = () => {
    if (foodPreferences.length === 0) return;
    const headers = ['Sl No', 'Student Name', 'Year', 'Food Preference', 'Submitted Date & Time'];

    const rows = filteredFood.map((f, index) => [
      index + 1,
      `"${f.student_name || ''}"`,
      `"${f.year || ''}"`,
      `"${f.food_type || ''}"`,
      `"${new Date(f.created_at).toLocaleString()}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `HostelDay_Food_Preferences_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getPerformanceBadgeColor = (type: string) => {
    switch (type) {
      case 'Solo Dance':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Group Dance':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'Solo Song':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Group Song':
        return 'bg-teal-100 text-teal-800 border-teal-200';
      case 'Rampwalk':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Extra Performance':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans pb-20">
      {/* Top Admin Header */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          {/* Logo & Admin Status */}
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToHome}
              className="w-10 h-10 rounded-xl bg-gradient-to-tr from-festival-orange-500 to-festival-purple-600 flex items-center justify-center shadow hover:scale-105 transition-transform"
              title="Return to public site"
            >
              <Sparkles className="w-5 h-5 text-white" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-extrabold text-white font-display tracking-tight">
                  Hostel Day <span className="text-festival-orange-400">Admin Hub</span>
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Authenticated
                </span>
              </div>
              <p className="text-xs text-slate-400">Single Administrator Access Control</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => loadAllData(true)}
              disabled={refreshing || loading}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs sm:text-sm font-semibold text-slate-200 border border-slate-700 hover:border-slate-600 transition-all disabled:opacity-50"
              title="Reload latest data from Supabase"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-festival-orange-400' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <button
              onClick={onBackToHome}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs sm:text-sm font-semibold text-slate-200 border border-slate-700 transition-all"
            >
              <ExternalLink className="w-4 h-4" />
              <span className="hidden sm:inline">View Site</span>
            </button>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs sm:text-sm font-semibold transition-all hover:scale-[1.02]"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-1 border-t border-slate-800/80 overflow-x-auto py-1">
          <button
            onClick={() => setActiveTab('performances')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'performances'
                ? 'bg-festival-purple-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Music className="w-4 h-4" />
            <span>Performances</span>
            <span className="ml-1.5 px-2 py-0.5 rounded-full text-[11px] bg-slate-900/60 text-slate-300">
              {performances.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('food')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'food'
                ? 'bg-festival-purple-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Utensils className="w-4 h-4" />
            <span>Food Preferences</span>
            <span className="ml-1.5 px-2 py-0.5 rounded-full text-[11px] bg-slate-900/60 text-slate-300">
              {foodPreferences.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('suggestions')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'suggestions'
                ? 'bg-festival-purple-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Suggestions</span>
            <span className="ml-1.5 px-2 py-0.5 rounded-full text-[11px] bg-slate-900/60 text-slate-300">
              {suggestions.length}
            </span>
          </button>
        </div>
      </header>

      {/* Main Admin Content Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* TAB 1: PERFORMANCES */}
        {activeTab === 'performances' && (
          <div className="space-y-6">
            {/* Overview Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
              <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-4 shadow-sm">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Registrations</p>
                <p className="text-2xl sm:text-3xl font-extrabold text-white mt-1 font-display">{perfStats.total}</p>
              </div>

              <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-4 shadow-sm">
                <p className="text-xs font-semibold text-purple-400 uppercase tracking-wider">Solo Dance</p>
                <p className="text-2xl sm:text-3xl font-extrabold text-purple-300 mt-1 font-display">{perfStats.soloDance}</p>
              </div>

              <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-4 shadow-sm">
                <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">Group Dance</p>
                <p className="text-2xl sm:text-3xl font-extrabold text-indigo-300 mt-1 font-display">{perfStats.groupDance}</p>
              </div>

              <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-4 shadow-sm">
                <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Solo Song</p>
                <p className="text-2xl sm:text-3xl font-extrabold text-emerald-300 mt-1 font-display">{perfStats.soloSong}</p>
              </div>

              <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-4 shadow-sm">
                <p className="text-xs font-semibold text-teal-400 uppercase tracking-wider">Group Song</p>
                <p className="text-2xl sm:text-3xl font-extrabold text-teal-300 mt-1 font-display">{perfStats.groupSong}</p>
              </div>

              <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-4 shadow-sm">
                <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Ramp & Extra</p>
                <p className="text-2xl sm:text-3xl font-extrabold text-amber-300 mt-1 font-display">
                  {perfStats.rampwalk + perfStats.extra}
                </p>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={perfSearch}
                    onChange={(e) => setPerfSearch(e.target.value)}
                    placeholder="Search by participant name, group, department, or performance name..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-festival-purple-500 focus:ring-1 focus:ring-festival-purple-500"
                  />
                </div>

                {/* CSV Download Button */}
                <button
                  onClick={exportPerformanceCSV}
                  disabled={filteredPerformances.length === 0}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                >
                  <Download className="w-4 h-4" />
                  <span>Export CSV ({filteredPerformances.length})</span>
                </button>
              </div>

              {/* Dropdown Filters */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-700/60">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Performance Type
                  </label>
                  <select
                    value={perfTypeFilter}
                    onChange={(e) => setPerfTypeFilter(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-festival-purple-500"
                  >
                    <option value="all">All Types ({performances.length})</option>
                    <option value="Solo Dance">Solo Dance</option>
                    <option value="Group Dance">Group Dance</option>
                    <option value="Solo Song">Solo Song</option>
                    <option value="Group Song">Group Song</option>
                    <option value="Rampwalk">Rampwalk</option>
                    <option value="Extra Performance">Extra Performance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Year of Study
                  </label>
                  <select
                    value={perfYearFilter}
                    onChange={(e) => setPerfYearFilter(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-festival-purple-500"
                  >
                    <option value="all">All Years</option>
                    <option value="First Year">First Year</option>
                    <option value="Second Year">Second Year</option>
                    <option value="Third Year">Third Year</option>
                    <option value="Fourth Year">Fourth Year</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Department
                  </label>
                  <select
                    value={perfDeptFilter}
                    onChange={(e) => setPerfDeptFilter(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-festival-purple-500"
                  >
                    <option value="all">All Departments</option>
                    <option value="CSE">CSE</option>
                    <option value="AIML">AIML</option>
                    <option value="CYBER">CYBER</option>
                    <option value="AIDS">AIDS</option>
                    <option value="ECE">ECE</option>
                    <option value="BME">BME</option>
                    <option value="FT">FT</option>
                    <option value="IT">IT</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Performance Registrations Table */}
            <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl shadow overflow-hidden">
              <div className="p-4 sm:p-5 border-b border-slate-700/80 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base text-white">Registered Acts & Performers</h3>
                  <p className="text-xs text-slate-400">Showing {filteredPerformances.length} of {performances.length} registrations</p>
                </div>
              </div>

              {loading ? (
                <div className="p-12 text-center text-slate-400">
                  <RefreshCw className="w-8 h-8 animate-spin mx-auto text-festival-purple-400 mb-2" />
                  <p className="text-sm">Loading registrations from Supabase...</p>
                </div>
              ) : filteredPerformances.length === 0 ? (
                <div className="p-12 text-center text-slate-400">
                  <p className="text-base font-semibold">No performance registrations found matching filters.</p>
                  <p className="text-xs text-slate-500 mt-1">Try changing your search term or filter options.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-950/60 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-700/60">
                        <th className="py-3 px-4">#</th>
                        <th className="py-3 px-4">Type</th>
                        <th className="py-3 px-4">Participant / Lead</th>
                        <th className="py-3 px-4">Dept & Year</th>
                        <th className="py-3 px-4">Group / Performance Info</th>
                        <th className="py-3 px-4">Notes</th>
                        <th className="py-3 px-4">Registered At</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/60 text-xs sm:text-sm">
                      {filteredPerformances.map((perf, index) => (
                        <tr key={perf.id} className="hover:bg-slate-700/40 transition-colors">
                          <td className="py-3.5 px-4 font-mono text-slate-400 text-xs">{index + 1}</td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${getPerformanceBadgeColor(
                                perf.performance_type
                              )}`}
                            >
                              {perf.performance_type}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-bold text-white">
                            {perf.participant_name}
                          </td>
                          <td className="py-3.5 px-4 text-slate-300">
                            <span className="font-semibold text-festival-orange-400">{perf.department}</span>
                            <span className="text-slate-400"> • {perf.year}</span>
                          </td>
                          <td className="py-3.5 px-4 text-slate-300 max-w-xs">
                            {perf.performance_name && (
                              <div className="font-semibold text-white mb-0.5">
                                Title: <span className="text-festival-cream-100">{perf.performance_name}</span>
                              </div>
                            )}
                            {perf.group_name && (
                              <div className="text-xs text-indigo-300 font-semibold mb-0.5">
                                Group: {perf.group_name}
                              </div>
                            )}
                            {perf.group_members && (
                              <div className="text-xs text-slate-400 truncate" title={perf.group_members}>
                                Members: {perf.group_members}
                              </div>
                            )}
                            {!perf.performance_name && !perf.group_name && !perf.group_members && (
                              <span className="text-slate-500 italic">—</span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-slate-400 max-w-xs truncate" title={perf.description || ''}>
                            {perf.description || <span className="text-slate-600 italic">None</span>}
                          </td>
                          <td className="py-3.5 px-4 text-slate-400 text-xs whitespace-nowrap">
                            {new Date(perf.created_at).toLocaleDateString()}{' '}
                            <span className="text-slate-500">
                              {new Date(perf.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: FOOD PREFERENCES */}
        {activeTab === 'food' && (
          <div className="space-y-6">
            {/* Food Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-5 shadow-sm">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Food Submissions</p>
                <p className="text-3xl sm:text-4xl font-extrabold text-white mt-2 font-display">{foodStats.total}</p>
                <p className="text-xs text-slate-400 mt-1">Total student responses</p>
              </div>

              <div className="bg-slate-800/90 border border-emerald-500/30 rounded-2xl p-5 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />
                <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Vegetarian Total</p>
                <p className="text-3xl sm:text-4xl font-extrabold text-emerald-300 mt-2 font-display">{foodStats.veg}</p>
                <p className="text-xs text-emerald-400/80 mt-1">
                  {foodStats.total > 0 ? ((foodStats.veg / foodStats.total) * 100).toFixed(1) : 0}% of all hostellers
                </p>
              </div>

              <div className="bg-slate-800/90 border border-rose-500/30 rounded-2xl p-5 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/10 rounded-full blur-xl pointer-events-none" />
                <p className="text-xs font-semibold text-rose-400 uppercase tracking-wider">Non-Vegetarian Total</p>
                <p className="text-3xl sm:text-4xl font-extrabold text-rose-300 mt-2 font-display">{foodStats.nonVeg}</p>
                <p className="text-xs text-rose-400/80 mt-1">
                  {foodStats.total > 0 ? ((foodStats.nonVeg / foodStats.total) * 100).toFixed(1) : 0}% of all hostellers
                </p>
              </div>
            </div>

            {/* Year-by-Year Food Breakdown Table */}
            <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl shadow overflow-hidden">
              <div className="p-4 sm:p-5 border-b border-slate-700/80">
                <h3 className="font-bold text-base text-white">Year-by-Year Headcount for Catering</h3>
                <p className="text-xs text-slate-400">Direct breakdown to provide caterers with accurate meal numbers</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-950/60 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-700/60">
                      <th className="py-3 px-5">Academic Year</th>
                      <th className="py-3 px-5 text-emerald-400">Vegetarian Count</th>
                      <th className="py-3 px-5 text-rose-400">Non-Veg Count</th>
                      <th className="py-3 px-5 text-white">Year Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/60 text-xs sm:text-sm">
                    {foodStats.byYear.map((yr) => (
                      <tr key={yr.year} className="hover:bg-slate-700/40">
                        <td className="py-3.5 px-5 font-bold text-white">{yr.year}</td>
                        <td className="py-3.5 px-5 font-semibold text-emerald-400 font-mono">{yr.veg}</td>
                        <td className="py-3.5 px-5 font-semibold text-rose-400 font-mono">{yr.nonVeg}</td>
                        <td className="py-3.5 px-5 font-bold text-white font-mono">{yr.total}</td>
                      </tr>
                    ))}
                    <tr className="bg-slate-950/80 font-bold border-t-2 border-slate-700">
                      <td className="py-3.5 px-5 text-festival-orange-400 uppercase tracking-wider text-xs">
                        Grand Total
                      </td>
                      <td className="py-3.5 px-5 text-emerald-400 font-mono text-base">{foodStats.veg}</td>
                      <td className="py-3.5 px-5 text-rose-400 font-mono text-base">{foodStats.nonVeg}</td>
                      <td className="py-3.5 px-5 text-white font-mono text-base">{foodStats.total}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Individual Submissions & Filters */}
            <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={foodSearch}
                    onChange={(e) => setFoodSearch(e.target.value)}
                    placeholder="Search by student name..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-festival-purple-500"
                  />
                </div>

                <button
                  onClick={exportFoodCSV}
                  disabled={filteredFood.length === 0}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow transition-all disabled:opacity-50 shrink-0"
                >
                  <Download className="w-4 h-4" />
                  <span>Export Food CSV ({filteredFood.length})</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-700/60">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Food Type
                  </label>
                  <select
                    value={foodTypeFilter}
                    onChange={(e) => setFoodTypeFilter(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-festival-purple-500"
                  >
                    <option value="all">All Food Types</option>
                    <option value="Vegetarian">Vegetarian ({foodStats.veg})</option>
                    <option value="Non-Vegetarian">Non-Vegetarian ({foodStats.nonVeg})</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Year of Study
                  </label>
                  <select
                    value={foodYearFilter}
                    onChange={(e) => setFoodYearFilter(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-festival-purple-500"
                  >
                    <option value="all">All Years</option>
                    <option value="First Year">First Year</option>
                    <option value="Second Year">Second Year</option>
                    <option value="Third Year">Third Year</option>
                    <option value="Fourth Year">Fourth Year</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Individual Records Table */}
            <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl shadow overflow-hidden">
              <div className="p-4 sm:p-5 border-b border-slate-700/80">
                <h3 className="font-bold text-base text-white">Student Food Preference Submissions</h3>
                <p className="text-xs text-slate-400">Showing {filteredFood.length} of {foodPreferences.length} student submissions</p>
              </div>

              {loading ? (
                <div className="p-12 text-center text-slate-400">
                  <RefreshCw className="w-8 h-8 animate-spin mx-auto text-festival-purple-400 mb-2" />
                  <p className="text-sm">Loading food preferences...</p>
                </div>
              ) : filteredFood.length === 0 ? (
                <div className="p-12 text-center text-slate-400">
                  <p className="text-base font-semibold">No food preferences found matching filters.</p>
                </div>
              ) : (
                <div className="overflow-x-auto max-h-[600px]">
                  <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 bg-slate-950 z-10">
                      <tr className="text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-700/60">
                        <th className="py-3 px-4">#</th>
                        <th className="py-3 px-4">Student Name</th>
                        <th className="py-3 px-4">Year</th>
                        <th className="py-3 px-4">Preference</th>
                        <th className="py-3 px-4">Submitted At</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/60 text-xs sm:text-sm">
                      {filteredFood.map((item, index) => (
                        <tr key={item.id} className="hover:bg-slate-700/40 transition-colors">
                          <td className="py-3.5 px-4 font-mono text-slate-400 text-xs">{index + 1}</td>
                          <td className="py-3.5 px-4 font-bold text-white">{item.student_name}</td>
                          <td className="py-3.5 px-4 text-slate-300">{item.year}</td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                                item.food_type === 'Vegetarian'
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              }`}
                            >
                              {item.food_type}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-slate-400 text-xs whitespace-nowrap">
                            {new Date(item.created_at).toLocaleDateString()}{' '}
                            <span className="text-slate-500">
                              {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: SUGGESTIONS */}
        {activeTab === 'suggestions' && (
          <div className="space-y-6">
            <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={suggSearch}
                    onChange={(e) => setSuggSearch(e.target.value)}
                    placeholder="Search suggestions by title, idea, or department..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-festival-purple-500"
                  />
                </div>

                <select
                  value={suggCategoryFilter}
                  onChange={(e) => setSuggCategoryFilter(e.target.value)}
                  className="px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-festival-purple-500"
                >
                  <option value="all">All Categories</option>
                  <option value="DJ & Music">DJ & Music</option>
                  <option value="Food & Feast">Food & Feast</option>
                  <option value="Events & Games">Events & Games</option>
                  <option value="Decorations">Decorations</option>
                  <option value="General Idea">General Idea</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {loading ? (
                <div className="col-span-full p-12 text-center text-slate-400">
                  <RefreshCw className="w-8 h-8 animate-spin mx-auto text-festival-purple-400 mb-2" />
                  <p className="text-sm">Loading suggestions...</p>
                </div>
              ) : filteredSuggestions.length === 0 ? (
                <div className="col-span-full p-12 text-center text-slate-400">
                  <p className="text-base font-semibold">No suggestions found.</p>
                </div>
              ) : (
                filteredSuggestions.map((s) => (
                  <div
                    key={s.id}
                    className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-5 shadow-sm flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-festival-orange-500/20 text-festival-orange-300 border border-festival-orange-500/30">
                          {s.category}
                        </span>
                        <span className="text-xs text-slate-400">
                          {new Date(s.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-white mb-2">{s.title}</h4>
                      <p className="text-sm text-slate-300 leading-relaxed mb-3">{s.description}</p>
                      {/* Student Name — shown only in the protected Admin Panel */}
                      <div className="flex items-center gap-1.5 text-xs">
                        <span className="font-semibold text-slate-400">Student Name:</span>
                        <span className={s.student_name ? 'text-festival-orange-300 font-medium' : 'text-slate-500 italic'}>
                          {s.student_name || 'Name not provided'}
                        </span>
                      </div>
                    </div>
                    <div className="pt-4 mt-4 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
                      <span>
                        Dept: <strong className="text-festival-orange-400">{s.department}</strong> ({s.year})
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-semibold">
                        {s.status || 'approved'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
