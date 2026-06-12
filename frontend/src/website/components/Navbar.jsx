import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <header className="bg-white shadow p-4 flex justify-between items-center">
      <div className="text-xl font-bold">TaskFlow</div>
      <nav className="space-x-4">
        <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
        <Link to="/signup" className="bg-blue-600 text-white px-4 py-2 rounded">Sign Up</Link>
      </nav>
    </header>
  );
};

export default Navbar;
