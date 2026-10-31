"use client";

import { FormEvent, useState } from "react";
import { ArrowUpRight, Lightbulb, Send } from "lucide-react";

const WHATSAPP_NUMBER = "8801311834044";

export default function FeatureRequestForm() {
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const formData = new FormData(event.currentTarget);
    const title = String(formData.get("title") ?? "").trim();
    const details = String(formData.get("details") ?? "").trim();

    if (!title || !details) {
      setError("Please add a feature title and tell us a little more.");
      return;
    }

    const message = [
      "BrainSharp AI feature request",
      "",
      `Title: ${title}`,
      `Details: ${details}`,
    ].join("\n");
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    const whatsappWindow = window.open(whatsappUrl, "_blank");

    if (!whatsappWindow) {
      setError("Your browser blocked the WhatsApp window. Allow pop-ups and try again.");
      return;
    }

    whatsappWindow.opener = null;
  }

  return (
    <section
      id="feature-request"
      aria-labelledby="feature-request-heading"
      className="relative isolate overflow-hidden bg-[#050507] px-5 py-20 sm:px-8 sm:py-24"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute left-1/2 top-1/2 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-500/[0.06] blur-[110px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#050507_78%)]" />
      </div>

      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-20">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/[0.06] px-3 py-1.5 font-mono text-[0.65rem] font-medium uppercase tracking-[0.18em] text-orange-300 sm:text-xs">
            <Lightbulb aria-hidden="true" className="h-3.5 w-3.5" />
            Help shape what&apos;s next
          </span>
          <h2
            id="feature-request-heading"
            className="mt-5 max-w-lg text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl"
          >
            Have an idea for a{" "}
            <span className="bg-gradient-to-r from-orange-300 via-amber-200 to-yellow-300 bg-clip-text text-transparent">
              sharper experience?
            </span>
          </h2>
          <p className="mt-4 max-w-lg text-sm leading-7 text-zinc-400 sm:text-base">
            Tell us what would make your BrainSharp journey better. Your idea
            opens directly in WhatsApp, ready for you to review and send.
          </p>
          <p className="mt-5 inline-flex items-center gap-2 text-sm text-zinc-500">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-400 shadow-[0_0_10px_rgba(249,115,22,0.7)]" />
            No account details are shared with the message.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-orange-500/20 bg-neutral-900/40 p-5 shadow-[0_0_40px_rgba(249,115,22,0.08)] backdrop-blur-2xl sm:p-8"
        >
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-white">
                Feature request
              </h3>
              <p className="mt-1 text-xs text-zinc-500">
                Share an idea with the BrainSharp team.
              </p>
            </div>
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-orange-400/20 bg-orange-500/[0.08] text-orange-300">
              <Lightbulb aria-hidden="true" className="h-5 w-5" />
            </span>
          </div>

          <label
            htmlFor="feature-title"
            className="mb-2 block text-sm font-medium text-zinc-200"
          >
            Feature title
          </label>
          <input
            id="feature-title"
            name="title"
            type="text"
            required
            maxLength={120}
            placeholder="A short name for your idea"
            className="min-h-12 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-orange-400/50 focus:ring-2 focus:ring-orange-400/15"
          />

          <label
            htmlFor="feature-details"
            className="mb-2 mt-5 block text-sm font-medium text-zinc-200"
          >
            Tell us about it
          </label>
          <textarea
            id="feature-details"
            name="details"
            required
            rows={4}
            maxLength={1500}
            placeholder="What should it do, and how would it help you?"
            className="w-full resize-y rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-zinc-600 focus:border-orange-400/50 focus:ring-2 focus:ring-orange-400/15"
          />

          {error && (
            <p role="alert" className="mt-3 text-sm text-red-300">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="group mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 px-5 py-3 text-sm font-semibold text-[#160b05] shadow-[0_0_30px_rgba(249,115,22,0.18)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_40px_rgba(249,115,22,0.32)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-300"
          >
            <Send aria-hidden="true" className="h-4 w-4" />
            Continue to WhatsApp
            <ArrowUpRight
              aria-hidden="true"
              className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </button>
        </form>
      </div>
    </section>
  );
}
