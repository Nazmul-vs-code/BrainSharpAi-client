import type { Metadata } from "next";
import { Info, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "About | BrainSharp AI",
  description: "Learn more about the vision behind BrainSharp AI.",
};

export default function AboutPage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-20 text-center">
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-emerald-400 backdrop-blur">
          <Info className="size-3.5" />
          <span>Our Mission</span>
        </div>

        <h1
          data-grid-avoid
          className="text-4xl font-bold tracking-tight text-white sm:text-5xl"
        >
          About BrainSharp AI
        </h1>

        <p data-grid-avoid className="text-base leading-relaxed text-zinc-400 sm:text-lg">
          BrainSharp AI is built to give researchers, engineers, and creators an intuitive,
          high-performance environment to think and build faster.
        </p>

        <div
          data-grid-avoid
          className="mx-auto mt-6 flex max-w-md items-center gap-3 rounded-xl border border-white/[0.08] bg-zinc-950/60 p-4 text-left backdrop-blur"
        >
          <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-400">
            <ShieldCheck size={20} />
          </div>
          <div>
            <div className="text-sm font-semibold text-white">Privacy & Control First</div>
            <div className="text-xs text-zinc-400">Your data and workspace stay under your complete control.</div>
          </div>
        </div>
      </div>
    </main>
  );
}
