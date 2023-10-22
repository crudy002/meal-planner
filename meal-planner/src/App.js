// src/App.js
import React, { useState, useEffect} from 'react';
import './App.css'; // You can add your own styles in App.css

function App() {
  // State for meal plans (starts out empty)
  const [mealPlans, setMealPlans] = useState([]);

  useEffect(() => {
    //fetch('http://localhost:5000/meals')
    fetch('https://5000-crudy002-mealplanner-cxws9s6yx88.ws-us105.gitpod.io/meals')
      .then((response) => response.json())
      .then((data) => setMealPlans(data))
      .catch((error) => console.error('Error fetching meal plans:', error));
  }, []);


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
