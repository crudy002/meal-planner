import { Link } from 'react-router-dom';

export default function Sidebar() {
  return (
    <aside className="w-1/8 bg-white p-4 border-r">
      <h1 className="text-xl font-bold mb-6">FitLife</h1>
      <nav className="space-y-2">
        <Link to="/" className="block text-gray-800 hover:bg-gray-200 px-2 py-1 rounded">Plan Your Week</Link>
        <Link to="/meals" className="block text-gray-800 hover:bg-gray-200 px-2 py-1 rounded">Meals</Link>
        <Link to="/meals" className="block text-gray-800 hover:bg-gray-200 px-2 py-1 rounded">Workouts</Link>
        <Link to="/meals" className="block text-gray-800 hover:bg-gray-200 px-2 py-1 rounded">Records</Link>
      </nav>
    </aside>
  );
}