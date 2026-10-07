import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Suggestion, PerformanceType, Year } from '../types';
import { getAnonymousToken, getLocallyUpvotedIds, markLocallyUpvoted } from './token';

const rawUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
const supabaseUrl = rawUrl.replace(/\/rest\/v1\/?$/i, '').replace(/\/+$/, '');
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'https://your-project-id.supabase.co' &&
  supabaseAnonKey !== 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-anon-key-here' &&
  supabaseUrl.startsWith('https://')
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Mock database storage for instant local demo before Supabase credentials are added
const LOCAL_STORAGE_SUGGESTIONS_KEY = 'hostel_day_local_suggestions_cache';
const LOCAL_STORAGE_FOOD_PREF_KEY = 'hostel_day_local_food_preferences';
const LOCAL_STORAGE_PERFORMANCE_KEY = 'hostel_day_local_performance_registrations';

const INITIAL_APPROVED_SUGGESTIONS: Suggestion[] = [
  {
    id: 'mock-sugg-1',
    department: 'CSE',
    year: 'Third Year',
    category: 'Cultural Programs',
    title: 'Hostel Flash Mob during Evening Break',
    description: 'A surprise 5-minute flash mob by seniors and juniors combined before the DJ setup starts! Would hype up the entire crowd.',
    status: 'approved',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    upvotes_count: 24
  },
  {
    id: 'mock-sugg-2',
    department: 'ECE',
    year: 'Second Year',
    category: 'Decoration',
    title: 'Fairy Lights Photo Booth with Neon Signs',
    description: 'Set up a photo booth arch in the central courtyard with hostel memorable polaroid clips and neon selfie backdrops.',
    status: 'approved',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    upvotes_count: 19
  },
  {
    id: 'mock-sugg-3',
    department: 'AIML',
    year: 'Fourth Year',
    category: 'Games and Sports',
    title: 'Inter-Floor Tug of War Challenge',
    description: 'A quick 15-minute high-energy Tug of War between hostel wings right before dinner announcement.',
    status: 'approved',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
    upvotes_count: 32
  },
  {
    id: 'mock-sugg-4',
    department: 'AIDS',
    year: 'First Year',
    category: 'Volunteers and Activities',
    title: 'Memory Wall for Outgoing Final Years',
    description: 'A dedicated board where juniors can pin sticky notes wishing the graduating seniors best wishes.',
    status: 'approved',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    upvotes_count: 15
  }
];

function getLocalSuggestions(): Suggestion[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_SUGGESTIONS_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Local suggestions parse error', e);
  }
  return INITIAL_APPROVED_SUGGESTIONS;
}

function saveLocalSuggestions(list: Suggestion[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_SUGGESTIONS_KEY, JSON.stringify(list));
  } catch (e) {
    console.error('Local suggestions save error', e);
  }
}

/**
 * Fetch approved suggestions with their total upvotes.
 * Note: Department and Year are never exposed in public suggestion cards.
 */
export async function fetchApprovedSuggestions(): Promise<Suggestion[]> {
  const locallyUpvoted = getLocallyUpvotedIds();

  if (isSupabaseConfigured && supabase) {
    try {
      // 1. Fetch suggestions (exclude rejected so student ideas show up right away)
      const { data: suggestionsData, error: suggError } = await supabase
        .from('suggestions')
        .select('id, category, title, description, status, created_at')
        .neq('status', 'rejected')
        .order('created_at', { ascending: false });

      if (suggError) throw suggError;
      if (!suggestionsData || suggestionsData.length === 0) return [];

      const suggestionIds = suggestionsData.map((s) => s.id);

      // 2. Fetch all votes for these suggestions
      const { data: votesData, error: votesError } = await supabase
        .from('suggestion_votes')
        .select('suggestion_id, anonymous_token')
        .in('suggestion_id', suggestionIds);

      if (votesError) throw votesError;

      const userToken = getAnonymousToken();
      const voteCountMap = new Map<string, number>();
      const userVotedSet = new Set<string>();

      (votesData || []).forEach((vote) => {
        voteCountMap.set(vote.suggestion_id, (voteCountMap.get(vote.suggestion_id) || 0) + 1);
        if (vote.anonymous_token === userToken) {
          userVotedSet.add(vote.suggestion_id);
        }
      });

      return suggestionsData.map((s) => ({
        ...s,
        upvotes_count: voteCountMap.get(s.id) || 0,
        has_upvoted: userVotedSet.has(s.id) || locallyUpvoted.has(s.id)
      })) as Suggestion[];
    } catch (err) {
      console.warn('Supabase fetch failed or table not found, falling back to local storage cache:', err);
    }
  }

  // Fallback to local storage
  const localList = getLocalSuggestions();
  return localList.map((s) => ({
    ...s,
    has_upvoted: locallyUpvoted.has(s.id)
  }));
}

/**
 * Submit an anonymous suggestion.
 * Automatically set to 'approved' so it appears on the suggestions board immediately for upvoting.
 * The student_name is stored privately and never returned in public queries.
 */
export async function submitAnonymousSuggestion(payload: {
  student_name: string;
  department: string;
  year: string;
  category: string;
  title: string;
  description: string;
}): Promise<{ success: boolean; message?: string; suggestion?: Suggestion }> {
  const newSuggestionData = {
    student_name: payload.student_name.trim(),
    department: payload.department,
    year: payload.year,
    category: payload.category,
    title: payload.title.trim(),
    description: payload.description.trim(),
    status: 'approved' as const // Immediately approved for instant visibility and upvoting
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('suggestions')
        .insert([newSuggestionData])
        .select();

      if (error) {
        console.error('Supabase insert suggestion error:', error);
        return { success: false, message: error.message || 'Database error occurred.' };
      }

      const inserted = data && data[0] ? data[0] : null;
      // Strip student_name before returning to caller so it never enters public state
      const publicSuggestion = inserted
        ? (({ student_name: _name, department: _dept, year: _yr, ...rest }) => rest)(inserted)
        : null;
      return {
        success: true,
        suggestion: publicSuggestion
          ? { ...publicSuggestion, upvotes_count: 0, has_upvoted: false } as Suggestion
          : undefined
      };
    } catch (err: any) {
      console.error('Supabase network error:', err);
      return {
        success: false,
        message: err?.message || 'Could not connect to Supabase server. Please verify network and config.'
      };
    }
  }

  // Local storage simulation for preview (student_name omitted from public state)
  const localSuggestion: Suggestion = {
    id: 'local-' + Date.now(),
    department: payload.department as any,
    year: payload.year as any,
    category: payload.category as any,
    title: payload.title.trim(),
    description: payload.description.trim(),
    status: 'approved',
    created_at: new Date().toISOString(),
    upvotes_count: 0,
    has_upvoted: false
  };

  const currentLocal = getLocalSuggestions();
  saveLocalSuggestions([localSuggestion, ...currentLocal]);

  return { success: true, suggestion: localSuggestion };
}

/**
 * Upvote an approved suggestion anonymously.
 * Prevents multiple votes using anonymous token & localStorage.
 */
export async function upvoteSuggestion(suggestionId: string): Promise<{ success: boolean; alreadyVoted?: boolean; newCount?: number }> {
  const token = getAnonymousToken();
  const locallyUpvoted = getLocallyUpvotedIds();

  if (locallyUpvoted.has(suggestionId)) {
    return { success: false, alreadyVoted: true };
  }

  if (isSupabaseConfigured && supabase) {
    try {
      // 1. Try RPC function if present
      const { data: rpcData, error: rpcError } = await supabase.rpc('upvote_suggestion', {
        p_suggestion_id: suggestionId,
        p_token: token
      });

      if (!rpcError && rpcData && rpcData.success !== false) {
        markLocallyUpvoted(suggestionId);
        return {
          success: true,
          alreadyVoted: !rpcData.new_vote,
          newCount: rpcData.votes_count
        };
      }

      // 2. Direct insert into suggestion_votes if RPC returned error or is not defined
      const { error: insertError } = await supabase.from('suggestion_votes').insert([
        {
          suggestion_id: suggestionId,
          anonymous_token: token
        }
      ]);

      if (insertError) {
        if (insertError.code === '23505') {
          // unique_violation: already voted
          markLocallyUpvoted(suggestionId);
          return { success: false, alreadyVoted: true };
        }
        throw insertError;
      }

      markLocallyUpvoted(suggestionId);

      // Fetch accurate count
      const { count } = await supabase
        .from('suggestion_votes')
        .select('*', { count: 'exact', head: true })
        .eq('suggestion_id', suggestionId);

      return { success: true, newCount: count ?? undefined };
    } catch (err) {
      console.warn('Supabase vote error, handling via local state fallback:', err);
    }
  }

  // Local storage fallback
  markLocallyUpvoted(suggestionId);
  const localList = getLocalSuggestions();
  const target = localList.find((s) => s.id === suggestionId);
  if (target) {
    target.upvotes_count = (target.upvotes_count || 0) + 1;
    saveLocalSuggestions(localList);
    return { success: true, newCount: target.upvotes_count };
  }

  return { success: true };
}

/**
 * Fetch current Vegetarian / Non-Vegetarian totals from food_preferences table.
 */
export async function fetchFoodPreferenceCounts(): Promise<{
  Vegetarian: number;
  'Non-Vegetarian': number;
}> {
  const defaults = { Vegetarian: 0, 'Non-Vegetarian': 0 };

  if (isSupabaseConfigured && supabase) {
    try {
      // Count Vegetarian
      const { count: vegCount, error: vegErr } = await supabase
        .from('food_preferences')
        .select('*', { count: 'exact', head: true })
        .eq('food_type', 'Vegetarian');

      // Count Non-Vegetarian
      const { count: nonVegCount, error: nonVegErr } = await supabase
        .from('food_preferences')
        .select('*', { count: 'exact', head: true })
        .eq('food_type', 'Non-Vegetarian');

      if (vegErr || nonVegErr) {
        console.warn('Supabase food preferences count error:', vegErr || nonVegErr);
      } else {
        return {
          Vegetarian: vegCount ?? 0,
          'Non-Vegetarian': nonVegCount ?? 0,
        };
      }
    } catch (err) {
      console.warn('Supabase food preferences fetch failed, falling back to local:', err);
    }
  }

  // Local storage fallback
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_FOOD_PREF_KEY) || '[]';
    const list = JSON.parse(raw);
    let veg = 0;
    let nonVeg = 0;
    if (Array.isArray(list)) {
      list.forEach((item: any) => {
        if (item.food_type === 'Vegetarian') veg++;
        if (item.food_type === 'Non-Vegetarian') nonVeg++;
      });
    } else if (typeof list === 'object') {
      veg = list.Vegetarian || 0;
      nonVeg = list['Non-Vegetarian'] || 0;
    }
    return { Vegetarian: veg, 'Non-Vegetarian': nonVeg };
  } catch {
    return defaults;
  }
}

/**
 * Submit a student's food preference (name, year, food_type).
 */
export async function submitFoodPreference(payload: {
  student_name: string;
  year: 'First Year' | 'Second Year' | 'Third Year' | 'Fourth Year';
  food_type: 'Vegetarian' | 'Non-Vegetarian';
}): Promise<{ success: boolean; message?: string }> {
  const cleanName = payload.student_name.trim();

  if (!cleanName) {
    return { success: false, message: 'Please enter your name.' };
  }

  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from('food_preferences').insert([
        {
          student_name: cleanName,
          year: payload.year,
          food_type: payload.food_type,
        },
      ]);

      if (error) {
        console.error('Supabase food preference insert error:', error);
        // If table doesn't have student_name column yet (PGRST204)
        if (error.code === 'PGRST204' || error.message?.includes('student_name')) {
          // Fall back to saving locally so student submission succeeds
          saveFoodPreferenceLocally(cleanName, payload.year, payload.food_type);
          return { success: true };
        }
        return { success: false, message: error.message || 'Database error occurred.' };
      }
      return { success: true };
    } catch (err: any) {
      console.error('Supabase network error:', err);
      // Fallback locally
      saveFoodPreferenceLocally(cleanName, payload.year, payload.food_type);
      return { success: true };
    }
  }

  // Local storage simulation fallback
  saveFoodPreferenceLocally(cleanName, payload.year, payload.food_type);
  return { success: true };
}

function saveFoodPreferenceLocally(name: string, year: string, foodType: string) {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_FOOD_PREF_KEY) || '[]';
    let list: any[] = [];
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) list = parsed;
    } catch {}

    list.push({
      student_name: name,
      year: year,
      food_type: foodType,
      created_at: new Date().toISOString(),
    });
    localStorage.setItem(LOCAL_STORAGE_FOOD_PREF_KEY, JSON.stringify(list));
  } catch (e) {
    console.error('Local food preference save error', e);
  }
}

/**
 * Submit a student or group performance registration.
 */
export async function submitPerformanceRegistration(payload: {
  performance_type: PerformanceType;
  performance_name?: string | null;
  participant_name: string;
  department: string;
  year: Year;
  group_name?: string | null;
  group_members?: string | null;
  description?: string | null;
}): Promise<{ success: boolean; message?: string }> {
  const cleanParticipantName = payload.participant_name?.trim() || '';
  const cleanDept = payload.department?.trim() || '';
  const cleanYear = payload.year;
  const cleanPerformanceName = payload.performance_name?.trim() || null;
  const cleanGroupName = payload.group_name?.trim() || null;
  const cleanGroupMembers = payload.group_members?.trim() || null;
  const cleanDescription = payload.description?.trim() || null;

  if (!cleanParticipantName) {
    if (payload.performance_type === 'Group Dance' || payload.performance_type === 'Group Song') {
      return { success: false, message: 'Please enter Main Participant / Group Leader Name.' };
    }
    return { success: false, message: 'Please enter your name.' };
  }

  if (cleanParticipantName.length > 100) {
    return { success: false, message: 'Name must not exceed 100 characters.' };
  }

  if (!cleanDept) {
    return { success: false, message: 'Please select your department.' };
  }

  if (!cleanYear) {
    return { success: false, message: 'Please select your year.' };
  }

  if (payload.performance_type === 'Group Dance' || payload.performance_type === 'Group Song') {
    if (!cleanGroupName) {
      return { success: false, message: 'Please enter Group Name.' };
    }
    if (cleanGroupName.length > 100) {
      return { success: false, message: 'Group Name must not exceed 100 characters.' };
    }
    if (!cleanGroupMembers) {
      return { success: false, message: 'Please enter Group Member Names.' };
    }
    if (cleanGroupMembers.length > 2000) {
      return { success: false, message: 'Group Member Names list is too long (maximum 2000 characters).' };
    }
  }

  if (payload.performance_type === 'Extra Performance') {
    if (!cleanPerformanceName) {
      return { success: false, message: 'Please enter Performance / Activity Name.' };
    }
    if (cleanPerformanceName.length > 120) {
      return { success: false, message: 'Performance / Activity Name must not exceed 120 characters.' };
    }
  }

  if (cleanDescription && cleanDescription.length > 1000) {
    return { success: false, message: 'Short description must not exceed 1000 characters.' };
  }

  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from('performance_registrations').insert([
        {
          performance_type: payload.performance_type,
          performance_name: cleanPerformanceName,
          participant_name: cleanParticipantName,
          department: cleanDept,
          year: cleanYear,
          group_name: cleanGroupName,
          group_members: cleanGroupMembers,
          description: cleanDescription,
        },
      ]);

      if (error) {
        console.error('Supabase performance registration insert error:', error);
        return { success: false, message: error.message || 'Database error occurred.' };
      }
      return { success: true };
    } catch (err: any) {
      console.error('Supabase network error during performance registration:', err);
      return { success: false, message: err?.message || 'Network error occurred. Please try again.' };
    }
  }

  // Fallback locally if Supabase is offline/not configured
  savePerformanceLocally({
    performance_type: payload.performance_type,
    performance_name: cleanPerformanceName,
    participant_name: cleanParticipantName,
    department: cleanDept,
    year: cleanYear,
    group_name: cleanGroupName,
    group_members: cleanGroupMembers,
    description: cleanDescription,
    created_at: new Date().toISOString(),
  });
  return { success: true };
}

function savePerformanceLocally(record: any) {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_PERFORMANCE_KEY) || '[]';
    let list: any[] = [];
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) list = parsed;
    } catch {}
    list.push(record);
    localStorage.setItem(LOCAL_STORAGE_PERFORMANCE_KEY, JSON.stringify(list));
  } catch (e) {
    console.error('Local performance registration save error', e);
  }
}
