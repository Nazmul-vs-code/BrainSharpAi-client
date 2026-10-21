"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  ArrowRight,
  Image as ImageIcon,
  Loader2,
  LockKeyhole,
  Mail,
  UserRound,
  UserRoundPlus,
} from "lucide-react";
import {
  Button,
  FieldError,
  Form,
  Input,
  Label,
  TextField,
} from "@heroui/react";
import { signUp } from "@/lib/auth-client";

export default function SignUpPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const fullName = formData.get("fullName") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const avatarUrl = formData.get("avatarUrl") as string;

    try {
      const { data, error } = await signUp.email({
        email,
        password,
        name: fullName,
        image: avatarUrl || undefined,
        callbackURL: "/",
      });

      if (error) {
        toast.error(error.message || "Failed to create account. Please try again.");
        setLoading(false);
        return;
      }

      toast.success("Account created successfully! Welcome to BrainSharp.ai");
      router.push("/");
    } catch (err) {
      console.error("Signup error:", err);
      toast.error("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <section className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-black px-4 py-8 text-white selection:bg-orange-500 selection:text-white sm:px-6 lg:px-8">
      {/* Ambient background */}
      <div className="pointer-events-none absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-orange-600/10 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-emerald-600/10 blur-[120px]" />

      {/* Shared frame keeps the image and form visually connected. */}
      <div className="relative z-10 mx-auto grid w-full max-w-5xl grid-cols-1 items-stretch overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-950 shadow-2xl lg:grid-cols-2">
        {/* Image panel */}
        <div className="relative hidden min-h-[640px] overflow-hidden bg-neutral-950 lg:block">
          <Image
            src="/images/Auth-img.png"
            alt="BrainSharp AI mental wellness and focus"
            fill
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover object-center"
          />

          {/* Image readability overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

          {/* Image content */}
          <div className="absolute inset-x-0 bottom-0 z-10 p-8 xl:p-10">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-orange-400">
              BRAINSHARP.AI
            </p>

            <h2 className="max-w-md text-3xl font-bold leading-tight tracking-tight text-white xl:text-4xl">
              Sharpen Your Mind. Build Better Habits.
            </h2>

            <p className="mt-4 max-w-md text-sm leading-6 text-neutral-300">
              Your personal companion for mental wellness, better focus,
              productive habits, and meaningful daily progress.
            </p>
          </div>
        </div>

        {/* Signup form panel */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="flex min-h-[640px] w-full items-center justify-center bg-neutral-950/90 p-6 backdrop-blur-xl sm:p-8 lg:border-l lg:border-neutral-800 lg:p-10"
        >
          <div className="w-full max-w-md">
            {/* Text-only branding */}
            <div className="mb-8 text-center">
              <p className="mb-5 text-sm font-semibold tracking-[0.25em] text-orange-400">
                BRAINSHARP.AI
              </p>

              <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Create your account
              </h1>

              <p className="mt-2 text-sm leading-6 text-neutral-400">
                Start your personalized wellness and habit journey.
              </p>
            </div>

            <Form className="flex flex-col gap-5" onSubmit={onSubmit}>
              {/* Full name */}
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.08 }}>
                <TextField isRequired name="fullName" type="text" className="w-full">
                <Label className="mb-2 text-sm font-medium text-neutral-300">
                  Full name
                </Label>
                  <div className="group relative">
                    <UserRound aria-hidden="true" size={17} className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-neutral-500 transition-colors group-focus-within:text-orange-400" />
                    <Input
                      placeholder="Enter your full name"
                      autoComplete="name"
                      className="w-full rounded-xl border border-neutral-800 bg-neutral-900/70 py-3 pl-11 pr-4 text-white outline-none placeholder:text-neutral-500 focus:border-orange-500"
                    />
                  </div>
                <FieldError />
                </TextField>
              </motion.div>

              {/* Avatar URL */}
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.14 }}>
                <TextField name="avatarUrl" type="url" className="w-full">
                <Label className="mb-2 text-sm font-medium text-neutral-300">
                  Profile image URL (optional)
                </Label>
                  <div className="group relative">
                    <ImageIcon aria-hidden="true" size={17} className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-neutral-500 transition-colors group-focus-within:text-orange-400" />
                    <Input
                      placeholder="https://example.com/avatar.jpg"
                      autoComplete="url"
                      className="w-full rounded-xl border border-neutral-800 bg-neutral-900/70 py-3 pl-11 pr-4 text-white outline-none placeholder:text-neutral-500 focus:border-orange-500"
                    />
                  </div>
                <FieldError />
                </TextField>
              </motion.div>

              {/* Email */}
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.2 }}>
                <TextField isRequired name="email" type="email" className="w-full">
                <Label className="mb-2 text-sm font-medium text-neutral-300">
                  Email address
                </Label>
                  <div className="group relative">
                    <Mail aria-hidden="true" size={17} className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-neutral-500 transition-colors group-focus-within:text-orange-400" />
                    <Input
                      placeholder="you@example.com"
                      autoComplete="email"
                      className="w-full rounded-xl border border-neutral-800 bg-neutral-900/70 py-3 pl-11 pr-4 text-white outline-none placeholder:text-neutral-500 focus:border-orange-500"
                    />
                  </div>
                <FieldError />
                </TextField>
              </motion.div>

              {/* Password */}
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.26 }}>
                <TextField isRequired name="password" type="password" className="w-full">
                <Label className="mb-2 text-sm font-medium text-neutral-300">
                  Password
                </Label>
                  <div className="group relative">
                    <LockKeyhole aria-hidden="true" size={17} className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-neutral-500 transition-colors group-focus-within:text-orange-400" />
                    <Input
                      placeholder="Create a password"
                      autoComplete="new-password"
                      className="w-full rounded-xl border border-neutral-800 bg-neutral-900/70 py-3 pl-11 pr-4 text-white outline-none placeholder:text-neutral-500 focus:border-orange-500"
                    />
                  </div>
                <FieldError />
                </TextField>
              </motion.div>

              {/* HeroUI submit button with loading state */}
              <motion.div
                className="mt-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.32 }}
              >
                <Button
                  type="submit"
                  isDisabled={loading}
                  className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-white font-semibold text-black shadow-lg transition-colors hover:bg-neutral-200 disabled:opacity-70"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin text-black" />
                  ) : (
                    <>
                      <UserRoundPlus size={17} />
                      Create account
                      <motion.span
                        aria-hidden="true"
                        animate={{ x: [0, 3, 0] }}
                        transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 1 }}
                      >
                        <ArrowRight size={18} />
                      </motion.span>
                    </>
                  )}
                </Button>
              </motion.div>
            </Form>

            <p className="mt-7 text-center text-sm text-neutral-400">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-orange-400 underline underline-offset-4 transition-colors hover:text-orange-300"
              >
                Sign in
              </Link>
            </p>

            <p className="mt-8 text-center text-xs text-neutral-600">
              Small steps. Big changes.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}