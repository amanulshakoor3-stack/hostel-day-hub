export type Department =
  | 'CSE'
  | 'AIML'
  | 'CYBER'
  | 'Cyber'
  | 'AIDS'
  | 'ECE'
  | 'BME'
  | 'FT'
  | 'IT';

export const DEPARTMENTS = [
  'CSE',
  'AIML',
  'CYBER',
  'AIDS',
  'ECE',
  'BME',
  'FT',
  'IT'
] as const;

export type Year =
  | 'First Year'
  | 'Second Year'
  | 'Third Year'
  | 'Fourth Year';

export type PerformanceType =
  | 'Solo Dance'
  | 'Solo Song'
  | 'Group Dance'
  | 'Group Song'
  | 'Rampwalk'
  | 'Extra Performance';

export interface PerformanceRegistration {
  id?: string;
  performance_type: PerformanceType;
  performance_name?: string | null;
  participant_name: string;
  department: string;
  year: Year;
  group_name?: string | null;
  group_members?: string | null;
  description?: string | null;
  created_at?: string;
}

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
  student_name?: string; // Private — never exposed publicly
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

export interface FoodPreference {
  id?: string;
  student_name: string;
  year: Year;
  food_type: FoodType;
  created_at?: string;
}

export interface ProgrammeItem {
  id: number;
  programme: string;
  category?: 'ceremony' | 'refreshment' | 'special' | 'cultural' | 'food' | 'party';
}
