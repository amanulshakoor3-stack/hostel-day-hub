export type Department =
  | 'CSE'
  | 'Cyber'
  | 'AIML'
  | 'AIDS'
  | 'ECE'
  | 'BME'
  | 'IT'
  | 'R&A'
  | 'FT';

export type Year =
  | 'First Year'
  | 'Second Year'
  | 'Third Year'
  | 'Fourth Year';

export type SuggestionCategory =
  | 'Cultural Programs'
  | 'Games and Sports'
  | 'Food and Refreshments'
  | 'Decoration'
  | 'Volunteers and Activities'
  | 'Other';

export type SuggestionStatus = 'pending' | 'approved' | 'rejected';

export interface Suggestion {
  id: string;
  department: Department;
  year: Year;
  category: SuggestionCategory;
  title: string;
  description: string;
  status: SuggestionStatus;
  created_at: string;
  updated_at?: string;
  upvotes_count?: number;
  has_upvoted?: boolean;
}

export type FoodType = 'Vegetarian' | 'Non-Vegetarian';

export interface FoodPreferenceVote {
  id?: string;
  food_type: FoodType;
  anonymous_token: string;
  created_at?: string;
}

export interface ProgrammeItem {
  id: number;
  time: string;
  programme: string;
  category?: 'ceremony' | 'refreshment' | 'special' | 'cultural' | 'food' | 'party' | 'end';
}

export interface DinnerItem {
  id: string;
  name: string;
  category: 'Non-Veg' | 'Veg' | 'Dessert';
  badge: string;
  description: string;
  iconName: string;
}
