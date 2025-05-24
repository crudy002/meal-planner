import React, { useEffect, useState } from "react";
import { supabase } from '../lib/supabase';
import {type Meal} from '../types/planner'

export const MealsPage = () => {
  const [meals, setMeals] = useState<Meal[]>(() => {
    const stored = localStorage.getItem("meals");
    return stored ? JSON.parse(stored) : [];
  });

  const [form, setForm] = useState({
    name: "",
    ingredients: "",
    recipeLink: "",
    notes: "",
  });

  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem("meals", JSON.stringify(meals));
  }, [meals]);

  const saveMeal = async (meal: Meal) => {
    const { data, error } = await supabase.from('meals').insert([meal]);

    if (error) {
      console.error('Error saving meal:', error.message);
    } else {
      console.log('Meal saved!', data);
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const newMeal: Meal = {
      id: editingId ?? crypto.randomUUID(),
      name: form.name,
      ingredients: form.ingredients.split(",").map(s => s.trim()),
      source_link: form.recipeLink,
      recipe_notes: form.notes,
    };
  
    if (editingId) {
      // Edit in Supabase
      await updateMeal(editingId, newMeal);
    } else {
      // Save to Supabase
      await saveMeal(newMeal);
    }
  
    await fetchMeals(); // Re-sync with DB
    resetForm();
  };

  const fetchMeals = async () => {
    const { data, error } = await supabase.from('meals').select('*');
  
    if (error) {
      console.error('Error fetching meals:', error.message);
    } else {
      setMeals(data);
    }
  };
  
  useEffect(() => {
    fetchMeals();
  }, []);

  const updateMeal = async (id: string, updates: Partial<Meal>) => {
    const { error } = await supabase.from('meals').update(updates).eq('id', id);
    if (error) console.error('Update failed', error.message);
  };
  

  const resetForm = () => {
    setForm({ name: "", ingredients: "", recipeLink: "", notes: "" });
    setEditingId(null);
  };

  const startEditing = (meal: Meal) => {
    setEditingId(meal.id);
    setForm({
      name: meal.name,
      ingredients: meal.ingredients.join(", "),
      recipeLink: meal.source_link ?? "",
      notes: meal.recipe_notes ?? "",
    });
  };

  const deleteMeal = async (mealId: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this meal? It will also be removed from your planner.");
    if (!confirmed) return;
  
    // Step 1: Delete meal from meals table
    const { error: mealError } = await supabase
      .from('meals')
      .delete()
      .eq('id', mealId);
  
    if (mealError) {
      console.error("Error deleting meal:", mealError.message);
      return;
    }
  
    // Step 2: Remove meal from any day in weekly_plans
    const { data: daysData, error: daysError } = await supabase
      .from('weekly_plans')
      .select('day, meals, workouts');
  
    if (daysError) {
      console.error("Error fetching weekly plan:", daysError.message);
      return;
    }
  
    const updates = daysData
      .map(day => {
        const filteredMeals = day.meals?.filter((id: string) => id !== mealId);
        if (filteredMeals.length !== day.meals.length) {
          return {
            day: day.day,
            meals: filteredMeals,
            workouts: day.workouts,
          };
        }
        return null;
      })
      .filter(Boolean);
  
    if (updates.length > 0) {
      const { error: updateError } = await supabase
        .from('weekly_plans')
        .upsert(updates, { onConflict: 'day' });
  
      if (updateError) {
        console.error("Error cleaning planner meals:", updateError.message);
      }
    }
  
    // Refresh your meals list
    fetchMeals();
  };
  

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">
        {editingId ? "Edit Meal" : "Add a Meal"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded shadow">
        <input
          type="text"
          placeholder="Meal name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="text"
          placeholder="Ingredients (comma separated)"
          value={form.ingredients}
          onChange={e => setForm({ ...form, ingredients: e.target.value })}
          className="w-full p-2 border rounded"
        />

        <input
          type="text"
          placeholder="Recipe link (optional)"
          value={form.recipeLink}
          onChange={e => setForm({ ...form, recipeLink: e.target.value })}
          className="w-full p-2 border rounded"
        />

        <textarea
          placeholder="Notes (optional)"
          value={form.notes}
          onChange={e => setForm({ ...form, notes: e.target.value })}
          className="w-full p-2 border rounded"
        />

        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            {editingId ? "Update Meal" : "Add Meal"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <h3 className="text-xl font-semibold mt-8 mb-2">Saved Meals</h3>
      {meals.length === 0 && <p className="text-gray-500">No meals yet.</p>}
      <div className="space-y-4">
        {meals.map(meal => (
          <div
            key={meal.id}
            className="bg-white p-4 rounded shadow border flex flex-col gap-1"
          >
            <h4 className="font-bold text-lg">{meal.name}</h4>
            <p><strong>Ingredients:</strong> {meal.ingredients.join(", ")}</p>
            {meal.source_link && (
              <a
                href={meal.source_link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                View Recipe
              </a>
            )}
            {meal.recipe_notes && <p>{meal.recipe_notes}</p>}
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => startEditing(meal)}
                className="bg-yellow-500 text-white px-2 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => deleteMeal(meal.id)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MealsPage; 
