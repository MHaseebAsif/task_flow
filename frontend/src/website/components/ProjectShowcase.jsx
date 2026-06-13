import React from 'react';
import {
  FolderSync,
  CheckSquare,
  MousePointerClick,
} from 'lucide-react';

export default function ProjectShowcase() {
  return (
    <div className="relative w-full min-h-screen bg-background text-white py-24 px-6 md:px-12 lg:px-24 overflow-hidden font-sans">
      <div className="absolute top-[10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[15%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-6xl mx-auto flex flex-col gap-32 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          <div className="w-full lg:w-[45%] order-2 lg:order-1 relative z-20">
            <span className="text-primary font-mono text-xs tracking-widest uppercase block mb-2 font-semibold">
              Featured Domain Engine
            </span>
            <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-100 mb-6">
              Multi-Tenant Project & Limit Validator
            </h3>

            <div className="relative p-6 md:p-8 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-300 hover:border-primary/30 group">
              <div className="absolute -inset-px bg-gradient-to-r from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-500" />
              <p className="text-sm md:text-base text-slate-300 leading-relaxed font-light">
                A robust backend pipeline managing isolated workspace states. Implements strict tenancy rules directly into the query controller layer: prevents <span className="text-primary font-medium">Free Tier</span> accounts from exceeding 2 active projects and restricts orchestration scopes exclusively to Manager and Admin authorization roles.
              </p>
            </div>

            <div className="flex items-center justify-between mt-6 px-2">
              <div className="flex gap-3 text-xs font-mono text-slate-400">
                <span>FastAPI</span>
                <span className="text-primary/50">•</span>
                <span>Tortoise ORM</span>
                <span className="text-primary/50">•</span>
                <span>Pydantic</span>
              </div>
              <div className="flex items-center gap-4 text-slate-400">
                <a href="#docs" className="hover:text-primary transition-colors" title="View Source Branch">
                  <MousePointerClick className="w-5 h-5" />
                </a>
                <a href="#docs" className="hover:text-primary transition-colors" title="API Endpoint Docs">
                  <MousePointerClick className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-[55%] order-1 lg:order-2 group">
            <div className="relative rounded-xl overflow-hidden bg-surface border border-white/10 p-1 shadow-[0_30px_60px_rgba(0,0,0,0.7)] transition-all duration-500 group-hover:scale-[1.02] group-hover:border-primary/20">
              <div className="flex items-center justify-between px-4 py-3 bg-surface border-b border-white/10 text-xs font-mono text-slate-500">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500/40" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/40" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/40" />
                </div>
                <span>POST /projects</span>
              </div>

              <div className="p-8 min-h-[260px] flex flex-col justify-between bg-surface/60">
                <div className="border border-dashed border-primary/20 rounded-lg p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded bg-purple-500/10 border border-primary/20 flex items-center justify-center">
                    <FolderSync className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-slate-700/40 rounded w-1/4" />
                    <div className="h-2 bg-slate-700/20 rounded w-3/4" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mt-6">
                  <div className="border border-white/10 p-3 rounded bg-black/20 space-y-2">
                    <div className="h-2 bg-purple-400/20 rounded w-1/2" />
                    <div className="h-1.5 bg-slate-800 rounded w-5/6" />
                  </div>
                  <div className="border border-white/10 p-3 rounded bg-black/20 space-y-2">
                    <div className="h-2 bg-purple-400/20 rounded w-2/3" />
                    <div className="h-1.5 bg-slate-800 rounded w-4/5" />
                  </div>
                  <div className="border border-primary/20 p-3 rounded bg-purple-500/5 space-y-2 relative">
                    <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-purple-400 rounded-full animate-ping" />
                    <div className="h-2 bg-purple-400/40 rounded w-1/2" />
                    <div className="h-1.5 bg-slate-800 rounded w-3/4" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          <div className="w-full lg:w-[55%] group">
            <div className="relative rounded-xl overflow-hidden bg-surface border border-white/10 p-1 shadow-[0_30px_60px_rgba(0,0,0,0.7)] transition-all duration-500 group-hover:scale-[1.02] group-hover:border-primary/20">
              <div className="flex items-center justify-between px-4 py-3 bg-surface border-b border-white/10 text-xs font-mono text-slate-500">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500/40" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/40" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/40" />
                </div>
                <span>PATCH /tasks/{"{id}"}/status</span>
              </div>

              <div className="p-8 min-h-[260px] flex flex-col justify-between bg-surface/60">
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <div className="h-3 bg-slate-700/50 rounded w-1/3" />
                    <span className="px-2 py-0.5 text-[9px] font-mono rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">RULE 5 PASSED</span>
                  </div>

                  <div className="space-y-2 mt-4">
                    <div className="flex items-center gap-3 bg-black/20 p-2.5 rounded border border-white/10">
                      <div className="w-4 h-4 rounded border border-purple-500/40 flex items-center justify-center bg-purple-500/10">
                        <CheckSquare className="w-2.5 h-2.5 text-primary" />
                      </div>
                      <div className="h-2 bg-slate-400/40 rounded w-1/2" />
                    </div>
                    <div className="flex items-center gap-3 bg-purple-500/5 p-2.5 rounded border border-primary/20">
                      <div className="w-4 h-4 rounded border border-emerald-500 bg-emerald-500/20 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                      </div>
                      <div className="h-2 bg-slate-300/60 rounded w-2/3" />
                    </div>
                  </div>
                </div>

                <div className="h-2 bg-gradient-to-r from-purple-500/30 to-transparent rounded mt-4" />
              </div>
            </div>
          </div>

          <div className="w-full lg:w-[45%] relative z-20">
            <span className="text-primary font-mono text-xs tracking-widest uppercase block mb-2 font-semibold">
              Advanced SaaS Logic
            </span>
            <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-100 mb-6">
              Granular Role-Based Task Workflows
            </h3>

            <div className="relative p-6 md:p-8 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-300 hover:border-primary/30 group">
              <div className="absolute -inset-px bg-gradient-to-r from-transparent to-purple-500/10 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-500" />
              <p className="text-sm md:text-base text-slate-300 leading-relaxed font-light">
                Manages granular transition states (`todo`, `in_progress`, `done`) across company project boards. Leverages dynamic dependency injection to intercept status updates, asserting that <span className="text-primary font-medium">only the explicitly assigned team member</span> holds authority to resolve a task.
              </p>
            </div>

            <div className="flex items-center justify-between mt-6 px-2">
              <div className="flex gap-3 text-xs font-mono text-slate-400">
                <span>PostgreSQL</span>
                <span className="text-primary/50">•</span>
                <span>RBAC Filters</span>
                <span className="text-primary/50">•</span>
                <span>Dependencies</span>
              </div>
              <div className="flex items-center gap-4 text-slate-400">
                <a href="#docs" className="hover:text-primary transition-colors" title="View Source Branch">
                  <MousePointerClick className="w-5 h-5" />
                </a>
                <a href="#docs" className="hover:text-primary transition-colors" title="API Endpoint Docs">
                  <MousePointerClick className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
