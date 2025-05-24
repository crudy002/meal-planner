import React from 'react';
import { type WeekDays, type Meal } from '../types/planner';

interface DayCardProps {
  day: WeekDays;
  data: {
    meals: string[]; // Now contains meal IDs
    workouts: string[];
  };
  mealsList: Meal[]; // List of all meals from Supabase
  onDelete: (day: WeekDays, type: 'meals' | 'workouts', index: number) => void;
  onSelectMeal: (mealId: string) => void;
}

export const DayCard: React.FC<DayCardProps> = ({
  day,
  data,
  mealsList,
  onDelete,
  onSelectMeal,
}) => {
  return (
    <div className="bg-white shadow rounded p-4">
      <h3 className="font-semibold mb-2 text-center">{day}</h3>

      {/* Meals Section */}
      <div className="mb-4">
        <h4 className="text-sm font-bold mb-1">Meals:</h4>
        {data.meals.length === 0 ? (
          <p className="text-sm text-gray-500">No meals added.</p>
        ) : (
          data.meals.map((mealId, i) => {
            const meal = mealsList.find(m => m.id === mealId);
            return (
              <div
                key={i}
                className="flex justify-between items-center bg-blue-100 p-2 rounded mb-1 cursor-pointer"
                onClick={() => onSelectMeal(mealId)}
              >
                <span>{meal?.name || 'Unknown Meal'}</span>
                <button
                  className="text-red-500 font-bold"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering onSelectMeal
                    onDelete(day, 'meals', i);
                  }}
                >
                  ✕
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Workouts Section */}
      <div>
        <h4 className="text-sm font-bold mb-1">Workouts:</h4>
        {data.workouts.length === 0 ? (
          <p className="text-sm text-gray-500">No workouts added.</p>
        ) : (
          data.workouts.map((workout, i) => (
            <div
              key={i}
              className="flex justify-between items-center bg-green-100 p-2 rounded mb-1"
            >
              <span>{workout}</span>
              <button
                className="text-red-500 font-bold"
                onClick={() => onDelete(day, 'workouts', i)}
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
