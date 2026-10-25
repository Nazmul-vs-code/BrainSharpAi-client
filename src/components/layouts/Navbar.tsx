"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { Button, Avatar } from "@heroui/react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  ArrowUpRight,
  House,
  BrainCircuit,
  Sparkles,
  Info,
  Menu,
  Trophy,
  X,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import LivingBrainLogo from "../shared/logo/LivingBrainLogo";
import { LimelightNav } from "../ui/LimelightNav";
import SoundSettings from "./SoundSettings";
import { useSound } from "@/components/providers/SoundProvider";
import { authClient, useSession } from "@/lib/auth-client";

const navigation = [
  { label: "Home", href: "/", icon: House },
  { label: "BrainSharp AI", href: "/brainsharp-ai", icon: Sparkles },
  { label: "The Quest", href: "/quest", icon: BrainCircuit },
  { label: "Leaderboard", href: "/leaderboard", icon: Trophy },
  { label: "About", href: "/about", icon: Info },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const { playSound } = useSound();
  const { data: session, isPending } = useSession();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            toast.success("Signed out successfully");
            setDropdownOpen(false);
            router.push("/login");
          },
        },
      });
    } catch (err) {
      console.error("Logout error:", err);
      toast.error("Failed to sign out");
    }
  };

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const activeIndex = navigation.findIndex((item) =>
    item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
  );

  const navItems = navigation.map((item) => ({
    id: item.href,
    href: item.href,
    label: item.label,
    icon: <item.icon size={16} strokeWidth={1.8} />,
  }));

  const closeMenu = () => setMobileOpen(false);

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <header
      data-grid-avoid
      className="sticky top-0 z-50 w-full border-b border-orange-500/20 bg-[#050507]/85 shadow-[0_8px_30px_rgba(249,115,22,0.08)] backdrop-blur-xl"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
        {/* Brand / Logo */}
        <Link
          href="/"
          className="group flex shrink-0 items-center transition-transform duration-200 hover:scale-[1.03] active:scale-[0.97]"
          aria-label="BrainSharp AI home"
          onClick={() => {
            playSound("navigation", 0.7);
            closeMenu();
          }}
          onMouseEnter={() => playSound("hover", 0.25)}
        >
          <LivingBrainLogo width={160} />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex h-16 items-center justify-center">
          <LimelightNav
            items={navItems}
            activeIndex={activeIndex}
            className="h-16"
          />
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <SoundSettings />

          {!isPending && (
            session?.user ? (
              /* Logged In Dropdown */
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => {
                    playSound("click", 0.5);
                    setDropdownOpen((prev) => !prev);
                  }}
                  className="flex items-center gap-2 rounded-full ring-offset-black transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  aria-label="User menu"
                >
                  <Avatar className="cursor-pointer border border-orange-500/40">
                    <Avatar.Image
                      alt={session.user.name || "User"}
                      src={session.user.image || undefined}
                    />
                    <Avatar.Fallback className="bg-orange-500/20 text-orange-400 font-semibold text-xs">
                      {getInitials(session.user.name)}
                    </Avatar.Fallback>
                  </Avatar>
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="absolute right-0 mt-3 w-56 rounded-2xl border border-neutral-800 bg-neutral-950/95 p-2 shadow-2xl backdrop-blur-2xl"
                    >
                      {/* User Header */}
                      <div className="border-b border-neutral-800/80 px-3 py-2.5">
                        <p className="text-xs font-semibold text-white truncate">
                          {session.user.name}
                        </p>
                        <p className="text-[11px] text-neutral-400 truncate">
                          {session.user.email}
                        </p>
                      </div>

                      {/* Menu Options */}
                      <div className="py-1 space-y-0.5">
                        {/* Profile Item with Glow & Motion */}
                        <Link
                          href="/profile"
                          onClick={() => setDropdownOpen(false)}
                          className="group flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-medium text-neutral-300 transition-all duration-200 hover:bg-orange-500/10 hover:text-white"
                        >
                          <span className="group-hover:translate-x-0.5 transition-transform">
                            Profile
                          </span>
                          <motion.div
                            whileHover={{ scale: 1.15, rotate: 5 }}
                            transition={{ duration: 0.2 }}
                            className="text-neutral-400 group-hover:text-orange-400 group-hover:drop-shadow-[0_0_8px_rgba(249,115,22,0.6)] transition-all"
                          >
                            <User size={15} />
                          </motion.div>
                        </Link>

                        {/* Settings Item */}
                        <Link
                          href="/settings"
                          onClick={() => setDropdownOpen(false)}
                          className="group flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-medium text-neutral-300 transition-all duration-200 hover:bg-white/5 hover:text-white"
                        >
                          <span className="group-hover:translate-x-0.5 transition-transform">
                            Settings
                          </span>
                          <motion.div
                            whileHover={{ rotate: 90 }}
                            transition={{ duration: 0.3 }}
                          >
                            <Settings
                              size={15}
                              className="text-neutral-400 group-hover:text-orange-400 transition-colors"
                            />
                          </motion.div>
                        </Link>
                      </div>

                      {/* Sign Out Action */}
                      <div className="border-t border-neutral-800/80 pt-1">
                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300"
                        >
                          <span>Sign out</span>
                          <LogOut size={15} />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                href="/SignUp"
                className="group inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-400 px-3.5 py-2 text-xs font-semibold text-zinc-950 shadow-[0_0_24px_rgba(249,115,22,0.2)] transition-all duration-200 hover:scale-[1.03] hover:shadow-[0_0_30px_rgba(249,115,22,0.35)] active:translate-y-px active:scale-[0.96] sm:px-4 sm:text-sm"
              >
                <span>SignUp</span>
                <ArrowUpRight
                  size={15}
                  className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
            )
          )}

          <Button
            isIconOnly
            variant="outline"
            size="sm"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="navbar-mobile-menu"
            onPress={() => {
              playSound(mobileOpen ? "close" : "open", 0.7);
              setMobileOpen((open) => !open);
            }}
            className="md:hidden border-white/10 text-white hover:bg-white/10 hover:scale-105 active:scale-95 transition-all duration-150"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileOpen && (
        <div
          id="navbar-mobile-menu"
          className="border-t border-orange-500/15 bg-[#050507]/95 px-6 py-4 backdrop-blur-xl md:hidden animate-in fade-in slide-in-from-top-2 duration-200"
        >
          <nav className="flex flex-col gap-1.5" aria-label="Mobile navigation">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  onClick={() => {
                    playSound("navigation", 0.7);
                    closeMenu();
                  }}
                  className={`flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-all duration-200 hover:translate-x-1.5 active:scale-[0.98] ${
                    isActive(item.href)
                      ? "bg-orange-500/10 text-orange-300 font-semibold"
                      : "text-zinc-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon size={18} strokeWidth={1.8} aria-hidden="true" />
                  <span>{item.label}</span>
                  <ArrowUpRight
                    size={15}
                    className="ml-auto opacity-40 transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </Link>
              );
            })}

            {session?.user && (
              <Link
                href="/profile"
                onClick={() => {
                  playSound("navigation", 0.7);
                  closeMenu();
                }}
                className={`flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-all duration-200 hover:translate-x-1.5 active:scale-[0.98] ${
                  isActive("/profile")
                    ? "bg-orange-500/10 text-orange-400 font-semibold"
                    : "text-zinc-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <User size={18} strokeWidth={1.8} aria-hidden="true" />
                <span>Profile</span>
                <ArrowUpRight
                  size={15}
                  className="ml-auto opacity-40 transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
            )}

            {!session?.user ? (
              <Link
                href="/SignUp"
                onClick={() => {
                  playSound("click");
                  closeMenu();
                }}
                className="mt-3 inline-flex items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-400 px-4 py-2.5 text-sm font-semibold text-zinc-950 shadow-[0_0_24px_rgba(249,115,22,0.2)] transition-all duration-200 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(249,115,22,0.35)] active:scale-[0.97]"
              >
                <span>SignUp</span>
                <ArrowUpRight size={16} />
              </Link>
            ) : (
              <button
                onClick={() => {
                  handleLogout();
                  closeMenu();
                }}
                className="mt-3 inline-flex items-center justify-center gap-1.5 rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-2.5 text-sm font-semibold text-red-400 shadow-sm hover:bg-red-500/20 transition-all duration-200"
              >
                <span>Sign out</span>
                <LogOut size={16} />
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}