// server.js

const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Mock meal plans
const mealPlans = [
    { id: 1, day: 'Monday', meals: ['Breakfast', 'Lunch', 'Dinner'] },
    { id: 2, day: 'Tuesday', meals: ['Breakfast', 'Lunch', 'Dinner'] },
    // Add more meal plans as needed
];


// Route handler for the root path
app.get('/', (req, res) => {
    res.send('MealPlanner Backend is running!');
});

app.get('/meals', (req, res) => {
    res.json(mealPlans);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
