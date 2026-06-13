const FEATURES = [
  {
    title: "JWT Authentication",
    desc: "Secure login, signup & token refresh for all user roles — admin, manager, and member.",
    glowColor: "#7C3AED",
    icon: (
      <svg width="56" height="56" viewBox="0 0 56 56" fill="none" className="relative z-10">
        <rect x="12" y="22" width="32" height="22" rx="6" fill="#6D28D9" opacity=".95" />
        <rect x="12" y="22" width="32" height="22" rx="6" stroke="#A78BFA" strokeWidth="1.2" />
        <path d="M20 22v-6a8 8 0 0116 0v6" stroke="#C4B5FD" strokeWidth="2" strokeLinecap="round" />
        <circle cx="28" cy="33" r="3.5" fill="#EDE9FE" />
        <rect x="26.5" y="33" width="3" height="5" rx="1.5" fill="#C4B5FD" />
        <circle cx="17" cy="38" r="1.5" fill="#7C3AED" opacity=".5" />
        <circle cx="39" cy="26" r="1.5" fill="#A78BFA" opacity=".4" />
      </svg>
    ),
  },
  {
    title: "Company Onboarding",
    desc: "Atomic org signup — creates company and admin user in one endpoint.",
    glowColor: "#0891B2",
    icon: (
      <svg width="56" height="56" viewBox="0 0 56 56" fill="none" className="relative z-10">
        <rect x="12" y="17" width="32" height="24" rx="6" fill="#0E7490" opacity=".9" />
        <rect x="12" y="17" width="32" height="24" rx="6" stroke="#67E8F9" strokeWidth="1.2" />
        <rect x="21" y="27" width="14" height="8" rx="2.5" fill="#CFFAFE" opacity=".85" />
        <rect x="24" y="23" width="8" height="5" rx="1.5" fill="#A5F3FC" />
        <path d="M28 23v-5M24 20l4-3 4 3" stroke="#67E8F9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="16" cy="23" r="1.5" fill="#0E7490" opacity=".5" />
        <circle cx="40" cy="37" r="1.5" fill="#06B6D4" opacity=".4" />
      </svg>
    ),
  },
  {
    title: "Task Assignment",
    desc: "Create tasks, set priorities, assign members and track status from To Do to Done.",
    glowColor: "#BE185D",
    icon: (
      <svg width="56" height="56" viewBox="0 0 56 56" fill="none" className="relative z-10">
        <rect x="12" y="13" width="32" height="30" rx="6" fill="#9D174D" opacity=".9" />
        <rect x="12" y="13" width="32" height="30" rx="6" stroke="#F9A8D4" strokeWidth="1.2" />
        <rect x="20" y="21" width="18" height="3" rx="1.5" fill="#FBCFE8" opacity=".9" />
        <rect x="20" y="27" width="13" height="3" rx="1.5" fill="#FBCFE8" opacity=".7" />
        <rect x="20" y="33" width="9" height="3" rx="1.5" fill="#FBCFE8" opacity=".5" />
        <circle cx="16.5" cy="22.5" r="2" fill="#F472B6" />
        <circle cx="16.5" cy="28.5" r="2" fill="#F472B6" opacity=".6" />
        <circle cx="16.5" cy="34.5" r="2" fill="#F472B6" opacity=".35" />
      </svg>
    ),
  },
  {
    title: "Project Analytics",
    desc: "Track progress, monitor team workload, and get deadline insights across all projects.",
    glowColor: "#D97706",
    icon: (
      <svg width="56" height="56" viewBox="0 0 56 56" fill="none" className="relative z-10">
        <rect x="12" y="15" width="32" height="26" rx="6" fill="#92400E" opacity=".9" />
        <rect x="12" y="15" width="32" height="26" rx="6" stroke="#FCD34D" strokeWidth="1.2" />
        <rect x="17" y="24" width="6" height="11" rx="2" fill="#FDE68A" opacity=".9" />
        <rect x="26" y="20" width="6" height="15" rx="2" fill="#FCD34D" opacity=".85" />
        <rect x="35" y="27" width="5" height="8" rx="2" fill="#FDE68A" opacity=".7" />
        <path d="M17 22l7-4 9 3 7-5" stroke="#FDE68A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="17" cy="22" r="2" fill="#FCD34D" />
        <circle cx="24" cy="18" r="2" fill="#FCD34D" />
        <circle cx="33" cy="21" r="2" fill="#FCD34D" />
        <circle cx="40" cy="16" r="2" fill="#FCD34D" />
      </svg>
    ),
  },
];

export default function Features({ glowImage }) {
  return (
    <div className="relative bg-background text-white overflow-hidden py-14 px-8 md:px-16 font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&display=swap');
        @keyframes tf-fadeup {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .tf-feat-card { animation: tf-fadeup 0.45s ease both; }
        .tf-desc-clamp {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] pointer-events-none z-0">
        {glowImage ? (
          <img
            src={glowImage}
            alt=""
            className="w-full h-full object-contain opacity-80"
          />
        ) : (
          <div className="w-full h-full rounded-full bg-[radial-gradient(circle,rgba(109,40,217,0.55)_0%,rgba(76,29,149,0.25)_40%,transparent_70%)] blur-[8px]" />
        )}
      </div>

      <h2
        className="relative z-10 text-center text-[28px] font-semibold mb-8 tracking-tight"
        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
      >
        Core Features
      </h2>

      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-w-[820px] mx-auto">
        {FEATURES.map(({ title, desc, glowColor, icon }, i) => (
          <div
            key={title}
            className="tf-feat-card flex items-center gap-5 bg-surface border border-white/[0.09] rounded-2xl px-6 py-6 backdrop-blur-md hover:border-primary/40 hover:bg-surface/80 transition-all duration-300"
            style={{ animationDelay: `${i * 0.12 + 0.1}s` }}
          >
            <div className="relative w-[68px] h-[68px] flex-shrink-0 flex items-center justify-center">
              <div
                className="absolute inset-[-4px] rounded-full opacity-60 blur-[16px]"
                style={{ background: glowColor }}
              />
              {icon}
            </div>

            <div className="flex-1 min-w-0">
              <h3
                className="text-[15px] font-semibold text-white mb-1.5 leading-snug"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {title}
              </h3>
              <p className="tf-desc-clamp text-[12.5px] text-white/40 leading-relaxed">
                {desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
