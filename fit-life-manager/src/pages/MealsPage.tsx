import React, { useEffect, useState } from "react";

type Meal = {
  id: string;
  name: string;
  ingredients: string[];
  recipeLink?: string;
  notes?: string;
};

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newMeal: Meal = {
      id: editingId ?? crypto.randomUUID(),
      name: form.name,
      ingredients: form.ingredients.split(",").map(s => s.trim()),
      recipeLink: form.recipeLink,
      notes: form.notes,
    };

    if (editingId) {
      // Edit existing
      setMeals(prev => prev.map(m => (m.id === editingId ? newMeal : m)));
    } else {
      // Add new
      setMeals(prev => [...prev, newMeal]);
    }

    resetForm();
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
      recipeLink: meal.recipeLink ?? "",
      notes: meal.notes ?? "",
    });
  };

  const deleteMeal = (id: string) => {
    setMeals(prev => prev.filter(m => m.id !== id));
    if (editingId === id) resetForm();
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
            {meal.recipeLink && (
              <a
                href={meal.recipeLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                View Recipe
              </a>
            )}
            {meal.notes && <p>{meal.notes}</p>}
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
