export type Department = 'CSE' | 'ECE' | 'EEE' | 'MECH' | 'CIVIL' | 'R&A' | 'AIDS' | 'IT' | 'OTHER';
export type Year = 'First Year' | 'Second Year' | 'Third Year' | 'Fourth Year';
export type Category = 'Cultural Programs' | 'Games and Sports' | 'Decoration' | 'Food and Refreshments' | 'Volunteers and Activities' | 'Other';

export interface Suggestion {
  id: string;
  department?: Department;
  year?: Year;
  category: Category;
  title: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  upvotes_count?: number;
  has_upvoted?: boolean;
}

export interface FoodPreference {
  id?: string;
  food_type: 'Vegetarian' | 'Non-Vegetarian';
  preferred_foods: string;
  created_at?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  category: 'Starter' | 'Main Course' | 'Dessert' | 'Drink';
  isVeg: boolean;
  description: string;
}

export interface ScheduleEvent {
  id: string;
  time: string;
  title: string;
  location: string;
  description: string;
  category: 'Ceremony' | 'Cultural' | 'Games' | 'Dinner' | 'DJ Night';
}
