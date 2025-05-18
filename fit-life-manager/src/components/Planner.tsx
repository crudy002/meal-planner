import React, { useState, useEffect } from 'react';
import { type WeeklyPlan, type WeekDays } from '../types/planner';
import { DayCard } from './DayCard';

const initialPlan: WeeklyPlan = {
    Mon: { meals: [], workouts: [] },
    Tue: { meals: [], workouts: [] },
    Wed: { meals: [], workouts: [] },
    Thu: { meals: [], workouts: [] },
    Fri: { meals: [], workouts: [] },
    Sat: { meals: [], workouts: [] },
    Sun: { meals: [], workouts: [] },
};

export const Planner = () => {
    // state storing and updating the week and each days meals + workouts
    const [plan, setPlan] = useState<WeeklyPlan>(() => {
        const stored = localStorage.getItem("weeklyPlan");
        return stored ? JSON.parse(stored) : initialPlan;
      }); // either load from local storage or reinitialize
    // states for user input: what day, meal name, workout name
    const [selectedDay, setSelectedDay] = useState<keyof WeeklyPlan>('Mon');
    const [mealInput, setMealInput] = useState('');
    const [workoutInput, setWorkoutInput] = useState('');

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
            {/* Sidebar */}
            <aside className="w-1/5 bg-white p-4 border-r">
                <h1 className="text-xl font-bold mb-6">FitLife</h1>
                <nav className="space-y-2">
                    <button className="block w-full text-left text-gray-800 hover:bg-gray-200 px-2 py-1 rounded">Dashboard</button>
                    <button className="block w-full text-left text-gray-800 hover:bg-gray-200 px-2 py-1 rounded">Meals</button>
                    <button className="block w-full text-left text-gray-800 hover:bg-gray-200 px-2 py-1 rounded">Workouts</button>
                    <button className="block w-full text-left text-gray-800 hover:bg-gray-200 px-2 py-1 rounded">Progress</button>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="w-3/5 p-6 overflow-auto">
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
                        />
                        ))}
                    </div>
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
                <input
                    type="text"
                    className="w-full p-2 border rounded mb-2"
                    value={mealInput}
                    onChange={(e) => setMealInput(e.target.value)}
                    placeholder="e.g. Chicken Stir Fry"
                />
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
