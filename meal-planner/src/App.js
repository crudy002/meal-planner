// src/App.js
import React, { useState } from 'react';
import './App.css'; // You can add your own styles in App.css

function App() {
  // State for meal plans (example data for now)
  const [mealPlans, setMealPlans] = useState([
    { id: 1, day: 'Monday', meals: ['Breakfast', 'Lunch', 'Dinner'] }
  ]);

  // Function to add a new meal plan
  const addMealPlan = () => {
    const newDay = prompt('Enter a new day:');
    if (newDay) {
      const newMealPlan = {
        id: mealPlans.length + 1,
        day: newDay,
        meals: ['Breakfast', 'Lunch', 'Dinner'],
      };
      setMealPlans([...mealPlans, newMealPlan]);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>MealPlanner</h1>
      </header>

      <main>
        <button onClick={addMealPlan}>Add Meal Plan</button>

        {/* Display Meal Plans */}
        {mealPlans.map((mealPlan) => (
          <div key={mealPlan.id} className="meal-plan">
            <h2>{mealPlan.day}</h2>
            <ul>
              {mealPlan.meals.map((meal) => (
                <li key={meal}>{meal}</li>
              ))}
            </ul>
          </div>
        ))}
      </main>
    </div>
  );
}

export default App;
