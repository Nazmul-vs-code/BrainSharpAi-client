"use client";

import Link from "next/link";
import { Activity, ArrowRight } from "lucide-react";
import { Spinner } from "@heroui/react";
import ActivityGraph from "@/components/activity/ActivityGraph";
import { useSession } from "@/lib/auth-client";

export default function ActivityPage() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center">
        <Spinner aria-label="Loading activity" />
      </main>
    );
  }

  if (!session?.user) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center px-4 py-12">
        <section className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center shadow-2xl">
          <Activity aria-hidden="true" className="mx-auto size-9 text-orange-300" />
          <h1 className="mt-4 text-2xl font-semibold text-white">Quest activity</h1>
          <p className="mt-2 text-sm leading-6 text-neutral-400">
            Sign in to view your quest history, progress, and XP.
          </p>
          <Link
            href="/login"
            className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black"
          >
            Sign in
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 py-8 text-white sm:px-6 sm:py-12 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 sm:mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-orange-300">
            Your progress
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Quest activity
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-400">
            Explore your quest history, filter by category or date range, and
            select a chart point for the details.
          </p>
        </header>
        <ActivityGraph session={session} />
      </div>
    </main>
  );
}
