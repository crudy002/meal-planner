# MealPlanner

MealPlanner is a web application that simplifies meal planning, grocery shopping, and recipe management. Make healthier eating choices while saving time and money.

## Key Features

- **Intuitive Meal Planning:**
  Plan your meals for the week with a user-friendly drag-and-drop interface.

- **Smart Grocery Shopping:**
  Optimize your shopping list with real-time prices from your favorite grocery stores.

- **Recipe Repository:**
  Save and organize your favorite recipes for quick access.

- **Nutritional Insights:**
  Get nutritional information for each recipe.

## How it Works

1. **Plan:** Schedule your meals for the week with a simple drag-and-drop interface.
2. **Shop:** Get an optimized shopping list with real-time prices.
3. **Save:** Build your recipe repository with a click.

## Why MealPlanner?

- **Healthier Living:**
  Take the guesswork out of meal planning and make healthier food choices.

- **Save Time and Money:**
  Optimize your grocery shopping and reduce food waste.

- **Community and Collaboration:**
  Join a community of meal planners, share recipes, and discover new ones.

## Progression toward version 1.0

## Plans/ideas for incorperation 

- CI/CD Pipleline for:
Building on certain commits
Pushing to firebase or supabase

- Drag and Drop (Optional Advanced)
Use drag-and-drop to rearrange plans or copy between days.

- Edit Existing Items
Instead of just delete → let users click on a meal/workout to edit it in place.

- Modal or Sidebar for Input
Instead of showing the input form always, show it in a popup/modal. Try @headlessui/react or a custom Tailwind modal.

- Mobile Responsiveness
The layout works on desktop, but it could stack better on small screens. Tailwind's responsive classes make this smooth.

- Export/Import Data
Allow the user to download their weekly plan as JSON or upload one to restore it.

- Connect to Backend (Optional)
Later you can connect to Firebase or Supabase to make this multi-device ready.

## Get Started

Visit [MealPlanner on GitHub](https://github.com/your-username/MealPlanner) to get started.

To start the server in development, navigate to '/fit-life-manager'
- cd ./fit-lif-manager
Using vite server up the app using
- npm run dev

if you have a rogue vite process taking up the port here are some helpful commands
ps aux | grep vite
ps aux | grep node

kill 12345
Or forcefully:
kill -9 12345

🔍 Check a Process on a Specific Port (e.g., port 5173 for Vite):
lsof -i :5173

kill $(lsof -ti :5173)
Or force kill:
kill -9 $(lsof -ti :5173)


## Contributing

MealPlanner is an open-source project under the [GNU General Public License v3.0](LICENSE). Contributions are welcome! Whether you're a developer, designer, or someone passionate about healthy living, join us in making meal planning accessible to all.

## License

This project is licensed under the [GNU General Public License v3.0](LICENSE).

---
