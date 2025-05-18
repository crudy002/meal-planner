import "./style.css"
import { Planner } from "./components/Planner"

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* You can add <Sidebar /> here later */}
      <Planner />
    </div>
  );
}

export default App;
