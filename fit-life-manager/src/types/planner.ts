export interface DayPlan {
    meals: string[];
    workouts: string[];
}

export type WeekDays = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';

export type WeeklyPlan = {
    [key in WeekDays]: DayPlan;
};

export type Meal = {
    name: string;
    ingredients: string[];
    sourceUrl?: string;
    notes?: string;
  };