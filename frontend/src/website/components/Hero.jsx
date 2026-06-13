import { useState, useEffect, useRef } from "react";
import { ArrowRight, CheckCircle2, Clock, Users, FolderKanban, ListChecks, Bell, Zap } from "lucide-react";

const WORDS = ["Projects", "Deadlines", "Teams", "Workflows"];

const TypedWord = () => {
  const [idx, setIdx] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);
  
  useEffect(() => {
    const word = WORDS[idx];
    let t;
    if (!deleting && text.length < word.length)
      t = setTimeout(() => setText(word.slice(0, text.length + 1)), 80);
    else if (!deleting && text.length === word.length)
      t = setTimeout(() => setDeleting(true), 1800);
    else if (deleting && text.length > 0)
      t = setTimeout(() => setText(text.slice(0, -1)), 45);
    else { setDeleting(false); setIdx((i) => (i + 1) % WORDS.length); }
    return () => clearTimeout(t);
  }, [text, deleting, idx]);
  
  return (
    <span className="relative inline-block">
      <span className="text-primary border-b-2 border-primary/70 pb-0.5">{text}</span>
      <span className="animate-pulse text-primary ml-0.5">|</span>
    </span>
  );
};

const Counter = ({ to, suffix = "" }) => {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  
  useEffect(() => {
    const ob = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      ob.disconnect();
      let start = 0;
      const step = Math.ceil(to / 40);
      const id = setInterval(() => {
        start = Math.min(start + step, to);
        setVal(start);
        if (start >= to) clearInterval(id);
      }, 30);
    });
    if (ref.current) ob.observe(ref.current);
    return () => ob.disconnect();
  }, [to]);
  
  return <span ref={ref}>{val}{suffix}</span>;
};

const FadeUp = ({ delay = 0, children, className = "" }) => {
  return (
    <div
      className={className}
      style={{
        opacity: 0,
        animation: `taskflow-fadeup 0.55s ease forwards ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};

const LiveToast = () => {
  const toasts = [
    { icon: <Bell className="w-3 h-3 text-primary" />, msg: <><span className="text-primary font-medium">Sara</span> assigned you to <span className="text-white/80">PostgreSQL schema</span></> },
    { icon: <CheckCircle2 className="w-3 h-3 text-emerald-400" />, msg: <><span className="text-emerald-400 font-medium">Done</span> — Auth flow merged to main</> },
    { icon: <Zap className="w-3 h-3 text-amber-400" />, msg: <><span className="text-amber-300 font-medium">Ali</span> moved task to <span className="text-white/80">In Review</span></> },
  ];
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(true);
  
  useEffect(() => {
    const id = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setActive((a) => (a + 1) % toasts.length);
        setVisible(true);
      }, 350);
    }, 2800);
    return () => clearInterval(id);
  }, []);
  
  const t = toasts[active];
  return (
    <div
      className="flex items-center gap-2.5 bg-white/[0.05] border border-white/10 rounded-xl px-3.5 py-2.5 backdrop-blur-xl w-full"
      style={{
        transition: "opacity 0.3s ease, transform 0.3s ease",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(4px)",
      }}
    >
      <div className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center shrink-0">
        {t.icon}
      </div>
      <span className="text-xs text-white/50">{t.msg}</span>
    </div>
  );
};

const Hero = () => {
  return (
    <>
      <div className="tf-orbglow absolute -top-48 left-1/2 -translate-x-1/2 w-[820px] h-[820px] rounded-full bg-primary blur-[160px] pointer-events-none" />
      <div className="absolute top-1/2 -right-40 w-[400px] h-[400px] rounded-full bg-indigo-800 opacity-10 blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-8 md:px-16 pt-20 pb-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative flex items-center justify-center order-2 md:order-1 min-h-[400px]">
            <div className="absolute w-72 h-72 rounded-full bg-primary/25 blur-[80px]" />

            <div className="tf-float relative w-full max-w-[320px]">
              <div className="absolute -top-7 -right-5 w-full bg-white/[0.025] border border-white/[0.07] rounded-2xl p-5 backdrop-blur-xl rotate-[3deg]">
                <div className="h-2 w-20 bg-white/[0.08] rounded-full mb-3" />
                <div className="h-2 w-28 bg-white/[0.08] rounded-full mb-3" />
                <div className="h-2 w-16 bg-white/[0.08] rounded-full" />
              </div>

              <div className="relative bg-surface border border-white/[0.1] rounded-2xl p-6 shadow-2xl shadow-primary/60">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-medium text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                    In Progress
                  </span>
                  <span className="text-[11px] font-medium text-orange-300 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">
                    High
                  </span>
                </div>
                <h3 className="text-base font-semibold mb-1.5" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Set up auth flow
                </h3>
                <p className="text-xs text-white/40 leading-relaxed mb-5">
                  JWT login, signup & token refresh for all user roles.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {[
                      "from-primary to-purple-600",
                      "from-blue-400 to-cyan-500",
                      "from-pink-400 to-rose-500",
                    ].map((g, i) => (
                      <div key={i} className={`w-6 h-6 rounded-full bg-gradient-to-br ${g} border-2 border-surface flex items-center justify-center text-[9px] font-bold text-white`}>
                        {["A", "D", "S"][i]}
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-white/30">
                    <Clock className="w-3 h-3" />2 days left
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-white/[0.06]">
                  <div className="flex justify-between text-[10px] text-white/30 mb-1.5">
                    <span>Progress</span><span>65%</span>
                  </div>
                  <div className="h-1 rounded-full bg-white/[0.07] overflow-hidden">
                    <div className="h-full w-[65%] rounded-full bg-gradient-to-r from-primary to-indigo-400" />
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-5 -left-6 bg-surface border border-white/[0.1] rounded-xl px-3.5 py-2.5 flex items-center gap-2 -rotate-[5deg] shadow-xl">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="text-xs text-white/60 whitespace-nowrap">Company onboarding API — done</span>
              </div>

              <div className="mt-8">
                <LiveToast />
              </div>
            </div>
          </div>

          <div className="order-1 md:order-2 w-max">
            <FadeUp delay={100}>
              <div className="inline-flex items-center gap-2 text-[11px] text-primary bg-primary/[0.08] border border-primary/20 px-3 py-1.5 rounded-full mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                Built for small teams that ship fast
              </div>
            </FadeUp>

            <FadeUp delay={180}>
              <h1 className="text-5xl md:text-[3.4rem] font-semibold leading-[1.1] mb-5"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                A tool that helps<br />
                you manage{" "}<br /><TypedWord />
              </h1>
            </FadeUp>

            <FadeUp delay={260}>
              <p className="text-white/45 text-[15px] leading-relaxed mb-7 max-w-md">
                TaskFlow gives small teams one shared place to organize projects, assign work,
                and track progress — without the overhead of enterprise tools.
              </p>
            </FadeUp>

            <FadeUp delay={340}>
              <div className="flex flex-wrap items-center gap-4 mb-10">
                <a href="#" className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 transition-all duration-200 active:scale-95 text-white px-6 py-3 rounded-full font-medium text-sm shadow-lg shadow-primary/40">
                  Start for free <ArrowRight className="w-4 h-4" />
                </a>
                <span className="text-sm text-white/30">No credit card required</span>
              </div>
            </FadeUp>

            <FadeUp delay={420}>
              <div className="flex items-center gap-8 pt-8 border-t border-white/[0.07]">
                {[
                  { to: 500, suffix: "+", label: "Teams onboarded" },
                  { to: 98, suffix: "%", label: "On-time delivery" },
                  { to: 12, suffix: "k+", label: "Tasks completed" },
                ].map(({ to, suffix, label }) => (
                  <div key={label}>
                    <p className="text-xl font-semibold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      <Counter to={to} suffix={suffix} />
                    </p>
                    <p className="text-xs text-white/30 mt-0.5">{label}</p>
                  </div>
                ))}
              </div>
            </FadeUp>
          </div>
        </div>

        <div className="mt-24 grid sm:grid-cols-3 gap-6 border-t border-white/[0.06] pt-12">
          {[
            { icon: <FolderKanban className="w-4 h-4 text-primary" />, title: "Projects, organized", desc: "Group tasks by project so every team always knows what's next." },
            { icon: <Users className="w-4 h-4 text-primary" />, title: "Roles that make sense", desc: "Admins, managers, and members each see exactly what they need." },
            { icon: <ListChecks className="w-4 h-4 text-primary" />, title: "Status at a glance", desc: "Filter by status, priority, or assignee and stay on top of work." },
          ].map(({ icon, title, desc }, i) => (
            <FadeUp key={title} delay={500 + i * 80}>
              <div className="flex items-start gap-3 group">
                <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/15 flex items-center justify-center shrink-0 group-hover:bg-primary/20 group-hover:border-primary/30 transition-colors">
                  {icon}
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">{title}</h4>
                  <p className="text-sm text-white/35 leading-relaxed">{desc}</p>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </>
  );
};

export default Hero;
