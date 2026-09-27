// Utility to manage anonymous device token for fair voting
const ANONYMOUS_TOKEN_KEY = 'hostel_day_anon_token_v1';
const LOCAL_UPVOTES_KEY = 'hostel_day_local_upvoted_ids_v1';

export function getAnonymousToken(): string {
  let token = localStorage.getItem(ANONYMOUS_TOKEN_KEY);
  if (!token) {
    token = 'anon_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    localStorage.setItem(ANONYMOUS_TOKEN_KEY, token);
  }
  return token;
}

export function getLocallyUpvotedIds(): Set<string> {
  try {
    const raw = localStorage.getItem(LOCAL_UPVOTES_KEY);
    if (raw) {
      return new Set(JSON.parse(raw));
    }
  } catch (e) {
    console.error('Failed to parse local upvotes', e);
  }
  return new Set();
}

export function markLocallyUpvoted(suggestionId: string) {
  const set = getLocallyUpvotedIds();
  set.add(suggestionId);
  try {
    localStorage.setItem(LOCAL_UPVOTES_KEY, JSON.stringify(Array.from(set)));
  } catch (e) {
    console.error('Failed to save local upvote', e);
  }
}
