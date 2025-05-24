export interface DayPlan {
    meals: string[];
    workouts: string[];
}

export type WeekDays = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';

export type WeeklyPlan = {
    [key in WeekDays]: DayPlan;
};

// export type Meal = {
//     name: string;
//     ingredients: string[];
//     sourceUrl?: string;
//     notes?: string;
//   };

export type Meal = {
    id: string;
    name: string;
    ingredients: string[];
    source_link?: string;
    recipe_notes?: string;
  };