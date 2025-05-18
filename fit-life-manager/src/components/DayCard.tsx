import React from 'react';
import { type DayPlan, type WeekDays, type WeeklyPlan } from '../types/planner';

interface Props {
    day: string;
    data: DayPlan;
    onDelete: (day: keyof WeeklyPlan, type: 'meals' | 'workouts', index: number) => void;
}

export const DayCard = ({ day, data, onDelete }: Props) => {
    return (
        <div className="mt-2 text-sm text-gray-600">
            {data.meals.length === 0 && data.workouts.length === 0 ? (
                <p>No plans yet</p>
            ) : (
                <>
                    {data.meals.map((meal, i) => (
                        <div key={`meal-${i}`} className="flex justify-between items-center">
                            <span>🍽 {meal}</span>
                            <button
                                className="text-red-500 ml-2 text-xs"
                                onClick={() => onDelete(day as WeekDays, 'meals', i)}
                            >
                                ❌
                            </button>
                        </div>
                    ))}
                    {data.workouts.map((workout, i) => (
                        <div key={`workout-${i}`} className="flex justify-between items-center">
                            <span>💪 {workout}</span>
                            <button
                                className="text-red-500 ml-2 text-xs"
                                onClick={() => onDelete(day as WeekDays, 'workouts', i)}
                            >
                                ❌
                            </button>
                        </div>
                    ))}
                </>
            )}
        </div>

    );
};
