import { Link } from "react-router-dom";
import { LayoutGrid } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="max-w-6xl mx-auto relative z-10 flex items-center justify-between px-8 md:px-16 py-5 border-b border-white/[0.06]"
      style={{ animation: "taskflow-fadeup 0.4s ease both" }}>
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-700 flex items-center justify-center shadow-lg shadow-primary/50">
          <LayoutGrid className="w-4 h-4 text-white" />
        </div>
        <span className="text-lg font-semibold tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          TaskFlow
        </span>
      </div>
      <div className="flex items-center gap-4">
        <Link to="/login" className="text-sm text-white/40 hover:text-white transition-colors hidden sm:block">Sign in</Link>
        <Link to="/signup" className="text-sm bg-white text-black px-4 py-2 rounded-full font-medium hover:bg-primary/20 transition-colors">
          Get started
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
