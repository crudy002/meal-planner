import React from 'react';
import { type DayPlan } from '../types/planner';

interface Props {
  day: string;
  data: DayPlan;
}

export const DayCard = ({ day, data }: Props) => {
  return (
    <div className="bg-white rounded shadow p-4">
      <h3 className="font-semibold">{day}</h3>
      <div className="mt-2 text-sm text-gray-600">
        {data.meals.length === 0 && data.workouts.length === 0 ? (
          <p>No plans yet</p>
        ) : (
          <>
            {data.meals.map((meal, i) => (
              <p key={`meal-${i}`}>🍽 {meal}</p>
            ))}
            {data.workouts.map((workout, i) => (
              <p key={`workout-${i}`}>💪 {workout}</p>
            ))}
          </>
        )}
      </div>
    </div>
  );
};
