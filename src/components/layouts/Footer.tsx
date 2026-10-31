import Image from "next/image";
import Link from "next/link";
import {
  ArrowUp,
  ArrowUpRight,
  BrainCircuit,
  Compass,
  Code2,
  Heart,
  MessageCircle,
  Trophy,
} from "lucide-react";

const navigation = [
  { href: "/about", label: "About" },
  { href: "/brainsharp-ai", label: "BrainSharp AI" },
  { href: "/quest", label: "Quests", icon: Compass },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
];

export default function Footer() {
  return (
    <footer className="relative isolate overflow-hidden border-t border-orange-500/15 bg-[#050507] px-5 pb-8 pt-16 text-zinc-300 sm:px-8 sm:pt-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -bottom-36 left-1/2 h-96 w-[min(90vw,64rem)] -translate-x-1/2 rounded-full bg-orange-500/[0.06] blur-[110px]" />
        <Image
          src="/images/brainsharp-logo.png"
          alt=""
          width={2103}
          height={748}
          className="absolute -bottom-5 left-1/2 w-[min(96vw,72rem)] -translate-x-1/2 opacity-[0.1]"
        />
      </div>

      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 border-b border-white/[0.08] pb-12 md:grid-cols-[1.3fr_0.7fr] md:gap-16">
          <div className="max-w-xl">
            <Link
              href="/"
              aria-label="BrainSharp AI home"
              className="group inline-flex items-center gap-3 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-300"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-orange-400/25 bg-orange-500/[0.08] text-orange-300 shadow-[0_0_24px_rgba(249,115,22,0.12)] transition group-hover:border-orange-300/50 group-hover:shadow-[0_0_32px_rgba(249,115,22,0.2)]">
                <BrainCircuit aria-hidden="true" className="h-6 w-6" />
              </span>
              <span className="font-display text-sm font-semibold tracking-[0.16em] text-white sm:text-base">
                BRAINSHARP<span className="text-orange-400"> AI</span>
              </span>
            </Link>
            <p className="mt-5 max-w-md text-sm leading-7 text-zinc-400">
              Build sharper habits, strengthen your focus, and make progress
              one intentional quest at a time.
            </p>
            <a
              href="#feature-request"
              className="group mt-5 inline-flex items-center gap-2 text-sm font-medium text-orange-200 transition hover:text-orange-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-300"
            >
              <MessageCircle aria-hidden="true" className="h-4 w-4" />
              Suggest a feature
              <ArrowUpRight
                aria-hidden="true"
                className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </a>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:gap-12">
            <div>
              <h2 className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-zinc-100">
                Explore
              </h2>
              <ul className="mt-5 space-y-3">
                {navigation.map(({ href, label, icon: Icon }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="group inline-flex items-center gap-2 text-sm text-zinc-400 transition hover:text-orange-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-300"
                    >
                      {Icon && (
                        <Icon
                          aria-hidden="true"
                          className="h-3.5 w-3.5 text-orange-400/70 transition group-hover:text-orange-300"
                        />
                      )}
                      {label}
                      <ArrowUpRight
                        aria-hidden="true"
                        className="h-3 w-3 opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-zinc-100">
                Connect
              </h2>
              <ul className="mt-5 space-y-3">
                <li>
                  <a
                    href="https://github.com/Nazmul-vs-code/BrainSharpAi-client"
                    target="_blank"
                    rel="noreferrer"
                    className="group inline-flex items-center gap-2 text-sm text-zinc-400 transition hover:text-orange-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-300"
                  >
                    <Code2 aria-hidden="true" className="h-3.5 w-3.5 text-orange-400/70" />
                    GitHub
                    <ArrowUpRight
                      aria-hidden="true"
                      className="h-3 w-3 opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100"
                    />
                  </a>
                </li>
                <li>
                  <a
                    href="#feature-request"
                    className="group inline-flex items-center gap-2 text-sm text-zinc-400 transition hover:text-orange-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-300"
                  >
                    <Heart aria-hidden="true" className="h-3.5 w-3.5 text-orange-400/70" />
                    Contact via feature form
                    <ArrowUpRight
                      aria-hidden="true"
                      className="h-3 w-3 opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100"
                    />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 pt-6 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
          <p className="inline-flex items-center gap-1.5">
            © BrainSharp AI. Made for a sharper you.
          </p>
          <a
            href="#top"
            className="group inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-zinc-400 transition hover:border-orange-400/30 hover:text-orange-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-300"
          >
            Back to top
            <ArrowUp
              aria-hidden="true"
              className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5"
            />
          </a>
        </div>
      </div>
    </footer>
  );
}