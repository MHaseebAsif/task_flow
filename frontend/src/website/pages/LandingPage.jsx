import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Ecosystem from "../components/Ecosystem";
import ProjectShowcase from "../components/ProjectShowcase";
import Footer from "../components/Footer";

const LandingPage = () => {
  return (
    <div className="container mx-auto font-sans min-h-screen bg-background text-white relative overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&display=swap');
        @keyframes taskflow-fadeup {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes taskflow-float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-10px); }
        }
        @keyframes taskflow-orbglow {
          0%, 100% { opacity: 0.18; transform: scale(1); }
          50%       { opacity: 0.28; transform: scale(1.06); }
        }
        @keyframes taskflow-spin-slow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .tf-float { animation: taskflow-float 5s ease-in-out infinite; }
        .tf-orbglow { animation: taskflow-orbglow 6s ease-in-out infinite; }
        .tf-spin-slow { animation: taskflow-spin-slow 18s linear infinite; }
      `}</style>
      <Navbar />
      <Hero />
      <Features />
      <Ecosystem />
      <ProjectShowcase />
      <Footer />
    </div>
  );
};

export default LandingPage;
