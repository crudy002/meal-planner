import React, { useState, useEffect } from 'react';
import { type WeeklyPlan, type WeekDays, type Meal } from '../types/planner';
import { DayCard } from '../components/DayCard';
import { supabase } from "../lib/supabase";

// Initial empty structure for the weekly plan
const initialPlan: WeeklyPlan = {
  Mon: { meals: [], workouts: [] },
  Tue: { meals: [], workouts: [] },
  Wed: { meals: [], workouts: [] },
  Thu: { meals: [], workouts: [] },
  Fri: { meals: [], workouts: [] },
  Sat: { meals: [], workouts: [] },
  Sun: { meals: [], workouts: [] },
};

const PlannerPage = () => {
  // Weekly plan loaded from localStorage or fallback to empty template
  const [plan, setPlan] = useState<WeeklyPlan>(() => {
    const stored = localStorage.getItem("weeklyPlan");
    return stored ? JSON.parse(stored) : initialPlan;
  });

  // User-selected day for adding meals or workouts
  const [selectedDay, setSelectedDay] = useState<keyof WeeklyPlan>('Mon');

  // Form input states
  const [mealInput, setMealInput] = useState<string>(''); // Now storing ID, not name

  const [workoutInput, setWorkoutInput] = useState('');

  // All available meals from the database
  const [meals, setMeals] = useState<Meal[]>([]);

  // The currently selected meal for showing detailed view
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);

  // Handle clicking on a meal in the DayCard to show details
  const handleMealSelect = (mealId: string) => {
    const meal = meals.find(m => m.id === mealId);
    if (meal) {
      setSelectedMeal(meal);
    }
  };

  // Fetch all meals from Supabase when component mounts
  useEffect(() => {
    const fetchMeals = async () => {
      const { data, error } = await supabase
        .from('meals')
        .select('id, name, ingredients, source_link, recipe_notes');

      if (error) {
        console.error("Error fetching meals:", error.message);
      } else {
        setMeals(data || []);
      }
    };

    fetchMeals();
  }, []);

  // Fetch the existing weekly plan from Supabase when component mounts
  useEffect(() => {
    const fetchPlan = async () => {
      const { data, error } = await supabase
        .from('weekly_plans')
        .select('day, meals, workouts');

      if (error) {
        console.error('Error fetching weekly plan:', error.message);
      } else {
        const loadedPlan = data.reduce((acc, curr) => {
          acc[curr.day as keyof WeeklyPlan] = {
            meals: curr.meals || [],
            workouts: curr.workouts || [],
          };
          return acc;
        }, {} as WeeklyPlan);

        // Merge loaded data with default to ensure all 7 days exist
        setPlan({ ...initialPlan, ...loadedPlan });
      }
    };

    fetchPlan();
  }, []);

  // Add a meal to the selected day and update Supabase
  const addMeal = async () => {
    if (!mealInput.trim()) return;

    // Append meal to selected day's meal list
    const updatedDay = {
      ...plan[selectedDay],
      meals: [...plan[selectedDay].meals, mealInput],
    };

    const updatedPlan = {
      ...plan,
      [selectedDay]: updatedDay,
    };

    setPlan(updatedPlan); // Update UI

    // Persist to Supabase (insert or update)
    const { error } = await supabase
      .from('weekly_plans')
      .upsert([
        {
          day: selectedDay,
          meals: updatedDay.meals,
          workouts: updatedDay.workouts,
        },
      ], {
        onConflict: 'day',
      });

    if (error) {
      console.error(`Failed to update ${selectedDay}:`, error.message);
    }

    setMealInput(''); // Clear input
  };

  // Add a workout to the selected day and update Supabase
  const addWorkout = () => {
    if (!workoutInput.trim()) return;

    setPlan(prev => {
      const updated = {
        ...prev,
        [selectedDay]: {
          ...prev[selectedDay],
          workouts: [...prev[selectedDay].workouts, workoutInput],
        },
      };

      // Save updated workouts to Supabase
      updateDayInDatabase(selectedDay, updated);
      return updated;
    });

    setWorkoutInput('');
  };

  // Helper to upsert a single day’s data to Supabase
  const updateDayInDatabase = async (day: keyof WeeklyPlan, updatedPlan: WeeklyPlan) => {
    const { meals, workouts } = updatedPlan[day];

    const { error } = await supabase
      .from('weekly_plans')
      .upsert(
        [{ day, meals, workouts }],
        { onConflict: 'day' }
      );

    if (error) {
      console.error(`Failed to update ${day}:`, error.message);
    }
  };

  const deleteItem = async (
    day: keyof WeeklyPlan,
    type: 'meals' | 'workouts',
    index: number
  ) => {
    setPlan((prev) => {
      const updatedItems = prev[day][type].filter((_, i) => i !== index);
      const updatedDay = {
        ...prev[day],
        [type]: updatedItems,
      };
      const updatedPlan = {
        ...prev,
        [day]: updatedDay,
      };
  
      // ⬇ Update Supabase with new values
      updateDayInDatabase(day, updatedPlan);
  
      return updatedPlan;
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-100 w-full">
      {/* Main Content */}
      <main className="w-4/5 p-6 overflow-auto">
        <h2 className="text-2xl font-bold mb-4">Weekly Planner</h2>
        <div className="space-y-2">

          {/* Column Headers for Days */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4 px-1 text-center font-semibold text-gray-700">
            {Object.keys(plan).map((day) => (
              <div key={day}>{day}</div>
            ))}
          </div>

          {/* Day Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
            {Object.entries(plan).map(([day, data]) => (
              <DayCard
                key={day}
                day={day as WeekDays}
                data={data}
                mealsList={meals} // 👈 pass full meals array
                onDelete={deleteItem}
                onSelectMeal={handleMealSelect}
              />
            ))}
          </div>


          {/* Meal Details Modal */}
          {selectedMeal && (
            <div className="flex justify-center mt-8">
              <div className="bg-white p-4 shadow rounded mt-6 max-w-md">
                <h3 className="text-xl font-bold">{selectedMeal.name}</h3>
                <p className="mt-2">
                  <strong>Ingredients:</strong> {selectedMeal.ingredients?.join(', ') || 'N/A'}
                </p>
                {selectedMeal.source_link && (
                  <p className="mt-2">
                    <a
                      href={selectedMeal.source_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      View Recipe
                    </a>
                  </p>
                )}
                {selectedMeal.recipe_notes && (
                  <p className="mt-2">{selectedMeal.recipe_notes}</p>
                )}
                <button
                  onClick={() => setSelectedMeal(null)}
                  className="mt-4 text-sm text-gray-500 underline"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Right Sidebar - Quick Actions */}
      <aside className="w-1/5 bg-white p-4 border-l">
        <h2 className="font-bold mb-4">Quick Actions</h2>

        {/* Day Selector */}
        <label className="block mb-2 font-medium">Select Day:</label>
        <select
          className="w-full mb-4 p-2 border rounded"
          value={selectedDay}
          onChange={(e) => setSelectedDay(e.target.value as keyof WeeklyPlan)}
        >
          {Object.keys(initialPlan).map((day) => (
            <option key={day} value={day}>{day}</option>
          ))}
        </select>

        {/* Meal Selector */}
        <label className="block mb-1 font-medium">Meal</label>
        <select
          value={mealInput}
          onChange={(e) => setMealInput(e.target.value)}
          className="w-full p-2 border rounded mb-2"
        >
          <option value="">Select a meal</option>
          {meals.map(meal => (
            <option key={meal.id} value={meal.id}>{meal.name}</option>
          ))}
        </select>
        <button
          onClick={addMeal}
          className="bg-blue-500 text-white px-4 py-2 rounded w-full mb-4"
        >
          Add Meal
        </button>

        {/* Workout Input */}
        <label className="block mb-1 font-medium">Workout</label>
        <input
          type="text"
          className="w-full p-2 border rounded mb-2"
          value={workoutInput}
          onChange={(e) => setWorkoutInput(e.target.value)}
          placeholder="e.g. Pushups & Cardio"
        />
        <button
          onClick={addWorkout}
          className="bg-green-500 text-white px-4 py-2 rounded w-full"
        >
          Add Workout
        </button>
      </aside>
    </div>
  );
};

export default PlannerPage;
