// import "./style.css"
// import { Planner } from "./components/Planner"

// function App() {
//   return (
//     <div className="min-h-screen bg-gray-100 flex">
//       {/* You can add <Sidebar /> here later */}
//       <Planner />
//     </div>
//   );
// }

// export default App;

import { Routes, Route } from 'react-router-dom';
import PlannerPage from './pages/PlannerPage';
import { MealsPage } from './pages/MealsPage';
import Sidebar from './components/Sidebar';

export default function App() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 p-6">
        <Routes>
          <Route path="/" element={<PlannerPage />} />
          <Route path="/meals" element={<MealsPage />} />
        </Routes>
      </main>
    </div>
  );
}

