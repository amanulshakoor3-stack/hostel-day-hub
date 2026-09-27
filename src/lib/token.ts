// Anonymous browser token utility
const ANONYMOUS_TOKEN_KEY = 'hostel_day_hub_anon_token';
const UPVOTED_IDS_KEY = 'hostel_day_hub_upvoted_ids';

export function getAnonymousToken(): string {
  try {
    let token = localStorage.getItem(ANONYMOUS_TOKEN_KEY);
    if (!token) {
      token = 'anon_' + Math.random().toString(36).substring(2, 15) + '_' + Date.now().toString(36);
      localStorage.setItem(ANONYMOUS_TOKEN_KEY, token);
    }
    return token;
  } catch (e) {
    // In case localStorage is blocked (private mode)
    return 'anon_session_' + Date.now().toString(36);
  }
}

export function getLocallyUpvotedIds(): Set<string> {
  try {
    const raw = localStorage.getItem(UPVOTED_IDS_KEY);
    if (raw) {
      const arr = JSON.parse(raw);
      if (Array.isArray(arr)) {
        return new Set<string>(arr);
      }
    }
  } catch (e) {
    console.error('Failed reading local upvoted ids', e);
  }
  return new Set<string>();
}

export function markLocallyUpvoted(suggestionId: string): void {
  try {
    const set = getLocallyUpvotedIds();
    set.add(suggestionId);
    localStorage.setItem(UPVOTED_IDS_KEY, JSON.stringify(Array.from(set)));
  } catch (e) {
    console.error('Failed saving local upvoted ids', e);
  }
}
