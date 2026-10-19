import type { Metadata } from "next";
import { Sparkles, Cpu, Layers, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "Features | BrainSharp AI",
  description: "Explore the core features of BrainSharp AI.",
};

const features = [
  {
    icon: Cpu,
    title: "Neural Core",
    description: "Deep contextual reasoning with low latency stream processing.",
  },
  {
    icon: Layers,
    title: "Adaptive Interface",
    description: "Interactive visual canvases that respond fluidly to your workflow.",
  },
  {
    icon: Zap,
    title: "Instant Execution",
    description: "Optimized pipelines with high throughput and instant memory recall.",
  },
];

export default function FeaturesPage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-20 text-center">
      <div className="mx-auto max-w-4xl space-y-10">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-emerald-400 backdrop-blur">
            <Sparkles className="size-3.5" />
            <span>Platform Capabilities</span>
          </div>

          <h1
            data-grid-avoid
            className="text-4xl font-bold tracking-tight text-white sm:text-5xl"
          >
            Features
          </h1>

          <p data-grid-avoid className="mx-auto max-w-xl text-base text-zinc-400 sm:text-lg">
            Explore state-of-the-art tools designed for seamless human-AI collaboration.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3 text-left">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                data-grid-avoid
                className="rounded-xl border border-white/[0.08] bg-zinc-950/60 p-6 backdrop-blur-md transition hover:border-white/20"
              >
                <div className="mb-4 inline-flex rounded-lg border border-white/10 bg-white/5 p-2.5 text-emerald-400">
                  <Icon size={20} />
                </div>
                <h3 className="text-lg font-semibold text-white">{feat.title}</h3>
                <p className="mt-2 text-sm text-zinc-400">{feat.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
