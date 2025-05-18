import React, { useState } from 'react';
import { type WeeklyPlan } from '../types/planner';
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
    const [plan, setPlan] = useState<WeeklyPlan>(initialPlan);
    // states for user input: what day, meal name, workout name
    const [selectedDay, setSelectedDay] = useState<keyof WeeklyPlan>('Mon');
    const [mealInput, setMealInput] = useState('');
    const [workoutInput, setWorkoutInput] = useState('');

    // Function to add a meal, select the day and input name
    const addMeal = () => {
        if (!mealInput.trim()) return;
        setPlan(prev => ({
            ...prev,
            [selectedDay]: {
                ...prev[selectedDay],
                meals: [...prev[selectedDay].meals, mealInput]
            }
        }));
        setMealInput('');
    };

    // Function to add a workout, select the day and input name
    const addWorkout = () => {
        setPlan(prev => ({
            ...prev,
            Mon: {
                ...prev.Mon,
                workouts: [...prev.Mon.workouts, 'Leg Day - Squats & Lunges']
            }
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
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
                    {Object.entries(plan).map(([day, data]) => (
                        <DayCard key={day} day={day} data={data} />
                    ))}
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
