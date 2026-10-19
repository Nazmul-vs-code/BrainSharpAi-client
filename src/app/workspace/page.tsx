import type { Metadata } from "next";
import Link from "next/link";
import { BrainCircuit, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Workspace | BrainSharp AI",
  description: "Access your AI workspace and neural models.",
};

export default function WorkspacePage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-20 text-center">
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-emerald-400 backdrop-blur">
          <BrainCircuit className="size-3.5" />
          <span>Interactive Neural Canvas</span>
        </div>

        <h1
          data-grid-avoid
          className="text-4xl font-bold tracking-tight text-white sm:text-5xl"
        >
          AI Workspace
        </h1>

        <p data-grid-avoid className="text-base text-zinc-400 sm:text-lg">
          Your centralized creative and analytical workspace powered by adaptive intelligence.
        </p>

        <div className="pt-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-zinc-950 transition-colors hover:bg-zinc-200 shadow-sm"
          >
            <span>Back to Home</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </main>
  );
}
