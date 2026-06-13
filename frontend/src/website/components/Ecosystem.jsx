import React from 'react';
import {
  Building2,
  FolderSync,
  CheckSquare,
  ShieldAlert,
  UserCheck,
  Zap,
  Layers,
  Crown,
  Users,
  Code2,
  Database,
  Lock
} from 'lucide-react';

export default function Ecosystem() {
  const upperBadges = [
    { icon: <Database className="w-4 h-4 text-blue-400" /> },
    { icon: <Code2 className="w-4 h-4 text-yellow-500" /> },
    { icon: <Layers className="w-4 h-4 text-emerald-400" /> },
    { icon: <Lock className="w-4 h-4 text-purple-400" /> },
    { icon: <Users className="w-4 h-4 text-indigo-400" /> },
    { icon: <Building2 className="w-4 h-4 text-cyan-400" /> },
    { icon: <FolderSync className="w-4 h-4 text-pink-400" /> },
  ];

  const lowerBadges = [
    { icon: <CheckSquare className="w-4 h-4 text-teal-400" /> },
    { icon: <Crown className="w-4 h-4 text-amber-400" /> },
    { icon: <Zap className="w-4 h-4 text-orange-400" /> },
    { icon: <UserCheck className="w-4 h-4 text-sky-400" /> },
    { icon: <ShieldAlert className="w-4 h-4 text-rose-500" /> },
    { icon: <Code2 className="w-4 h-4 text-purple-300" /> },
  ];

  return (
    <div className="relative w-full min-h-[750px] bg-background text-white flex flex-col items-center pt-16 overflow-hidden font-sans selection:bg-purple-500/30">
      <style>{`
        @keyframes float-subtle {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        @keyframes orbit-path-1 {
          0% { transform: rotate(0deg) translateX(280px) rotate(0deg); }
          100% { transform: rotate(360deg) translateX(280px) rotate(-360deg); }
        }
        @keyframes orbit-path-2 {
          0% { transform: rotate(180deg) translateX(380px) rotate(-180deg); }
          100% { transform: rotate(540deg) translateX(380px) rotate(-540deg); }
        }
        .animate-float { animation: float-subtle 4s ease-in-out infinite; }
        .animate-orbit-node-1 { animation: orbit-path-1 50s infinite linear; }
        .animate-orbit-node-2 { animation: orbit-path-2 70s infinite linear; }
      `}</style>

      <div className="text-center z-20 px-4 max-w-2xl mb-12 animate-float">
        <h2 className="text-2xl md:text-3xl font-light tracking-wide text-slate-100">
          Building a robust <span className="text-primary font-normal">multi-tenant SaaS</span> backend
        </h2>
        <p className="text-sm text-slate-400 font-light mt-3 max-w-lg mx-auto tracking-normal">
          Implementing explicit plan constraints, tiered project limits, and automated role validations.
        </p>
      </div>

      <div className="z-20 flex flex-col items-center gap-3 px-4 max-w-4xl w-full">
        <div className="flex flex-wrap justify-center gap-3">
          {upperBadges.map((badge, idx) => (
            <div
              key={`up-${idx}`}
              className="flex items-center gap-2 bg-surface/80 border border-primary/40 hover:border-primary/50 transition-all duration-300 rounded-full py-1.5 px-3.5 shadow-lg shadow-black/40 backdrop-blur-sm cursor-help"
            >
              <div className="bg-purple-950/60 p-1 rounded-full border border-purple-500/20">{badge.icon}</div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-3 mt-1">
          {lowerBadges.map((badge, idx) => (
            <div
              key={`low-${idx}`}
              className="flex items-center gap-2 bg-surface/90 border border-primary/10 hover:border-primary/30 transition-all duration-300 rounded-md py-1.5 px-3.5 shadow-md shadow-black/40 cursor-help"
            >
              <div className="bg-purple-900/20 p-1 rounded-md">{badge.icon}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative w-full max-w-[1100px] h-[450px] mt-4 flex items-center justify-center">
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-90" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="stream-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a855f7" stopOpacity="0" />
              <stop offset="30%" stopColor="#6366f1" stopOpacity="0.2" />
              <stop offset="70%" stopColor="#a855f7" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#d946ef" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d="M 450,0 Q 520,120 530,280" stroke="url(#stream-grad)" strokeWidth="1.5" fill="none" />
          <path d="M 500,0 Q 530,130 535,280" stroke="url(#stream-grad)" strokeWidth="1.5" fill="none" />
          <path d="M 550,0 Q 540,140 540,280" stroke="url(#stream-grad)" strokeWidth="1.5" fill="none" />
          <path d="M 600,0 Q 550,130 545,280" stroke="url(#stream-grad)" strokeWidth="1.5" fill="none" />
          <path d="M 650,0 Q 560,120 550,280" stroke="url(#stream-grad)" strokeWidth="1.5" fill="none" />
        </svg>

        <div className="absolute bottom-[10%] w-[480px] h-[140px] bg-gradient-to-t from-purple-900/20 to-indigo-600/5 rounded-full blur-[70px] transform -rotate-6 pointer-events-none" />
        <div className="absolute bottom-[15%] w-[250px] h-[70px] bg-purple-500/20 rounded-full blur-[45px] pointer-events-none" />

        <div className="absolute bottom-[15%] w-[750px] h-[250px] border border-purple-500/10 rounded-full transform -rotate-12 pointer-events-none">
          <div className="absolute inset-0 animate-orbit-node-1">
            <div className="w-7 h-7 bg-surface border border-purple-500/30 rounded-md flex items-center justify-center opacity-40 transform rotate-12">
              <Code2 className="w-3.5 h-3.5 text-purple-400" />
            </div>
          </div>
        </div>

        <div className="absolute bottom-[10%] w-[960px] h-[300px] border border-purple-800/10 rounded-full transform -rotate-12 pointer-events-none">
          <div className="absolute inset-0 animate-orbit-node-2">
            <div className="w-6 h-6 bg-surface border border-purple-900/50 rounded-full flex items-center justify-center opacity-30 transform rotate-12">
              <Database className="w-3 h-3 text-indigo-400" />
            </div>
          </div>
        </div>

        <div className="absolute right-[20%] top-[45%] opacity-25 transform rotate-45 scale-75 pointer-events-none">
          <Code2 className="w-5 h-5 text-purple-400" />
        </div>
        <div className="absolute right-[10%] bottom-[35%] opacity-35 pointer-events-none">
          <div className="p-1.5 bg-surface border border-purple-950 rounded-md text-[10px] text-purple-300 font-mono">JS</div>
        </div>
        <div className="absolute left-[15%] bottom-[15%] opacity-20 pointer-events-none">
          <div className="p-1 bg-surface border border-purple-950 rounded text-[9px] text-purple-400 font-mono">PY</div>
        </div>

      </div>
    </div>
  );
}
