import React, { useState, useEffect } from 'react';
import { type WeeklyPlan, type WeekDays, type Meal} from '../types/planner';
import { DayCard } from '../components/DayCard';

import { supabase } from "../lib/supabase";

// type Meal = {
//   id: string;
//   name: string;
// };




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
  // state storing and updating the week and each days meals + workouts
  const [plan, setPlan] = useState<WeeklyPlan>(() => {
    const stored = localStorage.getItem("weeklyPlan");
    return stored ? JSON.parse(stored) : initialPlan;
  }); // either load from local storage or reinitialize
  // states for user input: what day, meal name, workout name
  const [selectedDay, setSelectedDay] = useState<keyof WeeklyPlan>('Mon');
  const [mealInput, setMealInput] = useState('');
  const [workoutInput, setWorkoutInput] = useState('');
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);

  const [meals, setMeals] = useState<Meal[]>([]);

  const handleMealSelect = (mealName: string) => {
    const meal = meals.find(m => m.name === mealName);
    if (meal) {
      setSelectedMeal(meal);
    }
  };  


  useEffect(() => {
    const fetchMeals = async () => {
      const { data, error } = await supabase.from('meals').select('id, name, ingredients, source_link, recipe_notes');

      if (error) {
        console.error("Error fetching meals:", error.message);
      } else {
        setMeals(data || []);
      }
    };

    fetchMeals();
  }, []);

  useEffect(() => {
    localStorage.setItem("weeklyPlan", JSON.stringify(plan));
  }, [plan]);

  // Function to add a meal, select the day and input name
  const addMeal = () => {
    // If the meal input is empty don't add an entry
    if (!mealInput.trim()) return;

    setPlan(prev => ({ // Update the "plan" state using the previous state (prev)
      ...prev,         // Spread all previous days and their data (don't change other days)
      [selectedDay]: { // Only update the selected day (e.g., "Mon", "Tue", etc.)
        ...prev[selectedDay], // Keep all existing data for that day (like workouts)
        meals: [              // Replace the "meals" array with a new one
          ...prev[selectedDay].meals, // Include all current meals for that day
          mealInput                   // Add the new meal input at the end
        ]
      }
    }));

    // Set the meal input back to empty
    setMealInput('');
  };

  // Function to add a workout, select the day and input name
  const addWorkout = () => {
    if (!workoutInput.trim()) return;
    setPlan(prev => ({
      ...prev,
      [selectedDay]: {
        ...prev[selectedDay],
        workouts: [...prev[selectedDay].workouts, workoutInput]
      }
    }))
    setWorkoutInput('');
  };

  //  Function to delete a day item
  const deleteItem = (day: keyof WeeklyPlan, type: 'meals' | 'workouts', index: number) => {
    setPlan((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [type]: prev[day][type].filter((_, i) => i !== index),
      },
    }));
  };



  return (
    <div className="flex min-h-screen bg-gray-100 w-full">
      {/* Main Content */}
      <main className="w-4/5 p-6 overflow-auto">
        <h2 className="text-2xl font-bold mb-4">Weekly Planner</h2>
        <div className="space-y-2">
          {/* Column Headers */}
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
                onDelete={deleteItem}
                onSelectMeal={handleMealSelect}
              />

            ))}
          </div>
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
              {selectedMeal.recipe_notes && <p className="mt-2">{selectedMeal.recipe_notes}</p>}
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

      {/* Right Sidebar */}
      <aside className="w-1/5 bg-white p-4 border-l">
        <h2 className="font-bold mb-4">Quick Actions</h2>

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

        <label className="block mb-1 font-medium">Meal</label>
        <select
          value={mealInput}
          onChange={(e) => setMealInput(e.target.value)}
          className="w-full p-2 border rounded mb-2"
        >
          <option value="">Select a meal</option>
          {meals.map(meal => (
            <option key={meal.id} value={meal.name}>
              {meal.name}
            </option>
          ))}
        </select>
        <button
          onClick={addMeal}
          className="bg-blue-500 text-white px-4 py-2 rounded w-full mb-4"
        >
          Add Meal
        </button>

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
