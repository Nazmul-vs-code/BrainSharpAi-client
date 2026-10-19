"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@heroui/react";
import {
  ArrowUpRight,
  House,
  BrainCircuit,
  Sparkles,
  Info,
  Menu,
  X,
} from "lucide-react";
import LivingBrainLogo from "../shared/logo/LivingBrainLogo";
import { LimelightNav } from "../ui/LimelightNav";

const navigation = [
  { label: "Home", href: "/", icon: House },
  { label: "Workspace", href: "/workspace", icon: BrainCircuit },
  { label: "Features", href: "/features", icon: Sparkles },
  { label: "About", href: "/about", icon: Info },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

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

  return (
    <header
      data-grid-avoid
      className="sticky top-0 z-50 w-full border-b border-white/[0.08] bg-[#050507]/98 shadow-2xl shadow-black/90 backdrop-blur-3xl"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
        {/* Brand / Logo with subtle spring hover */}
        <Link
          href="/"
          className="group flex shrink-0 items-center transition-transform duration-200 hover:scale-[1.03] active:scale-[0.97]"
          aria-label="BrainSharp AI home"
          onClick={closeMenu}
        >
          <LivingBrainLogo width={160} />
        </Link>

        {/* Desktop Limelight Navigation */}
        <div className="hidden md:flex h-16 items-center justify-center">
          <LimelightNav
            items={navItems}
            activeIndex={activeIndex !== -1 ? activeIndex : 0}
            className="h-16"
          />
        </div>

        {/* Right Actions with tactile click and animated arrow */}
        <div className="flex items-center gap-3">
          <Link
            href="/workspace"
            className="group inline-flex items-center gap-1.5 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-zinc-950 shadow-sm shadow-white/10 hover:shadow-md hover:shadow-white/20 hover:scale-[1.03] hover:bg-zinc-100 active:scale-[0.96] active:translate-y-[1px] transition-all duration-200"
          >
            <span>Get started</span>
            <ArrowUpRight
              size={16}
              className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>

          <Button
            isIconOnly
            variant="outline"
            size="sm"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="navbar-mobile-menu"
            onPress={() => setMobileOpen((open) => !open)}
            className="md:hidden border-white/10 text-white hover:bg-white/10 hover:scale-105 active:scale-95 transition-all duration-150"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>
      </div>

      {/* Mobile Drawer with smooth item slide & click animations */}
      {mobileOpen && (
        <div
          id="navbar-mobile-menu"
          className="border-t border-white/[0.08] bg-[#050507]/98 px-6 py-4 backdrop-blur-2xl md:hidden animate-in fade-in slide-in-from-top-2 duration-200"
        >
          <nav className="flex flex-col gap-1.5" aria-label="Mobile navigation">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  onClick={closeMenu}
                  className={`flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-all duration-200 hover:translate-x-1.5 active:scale-[0.98] ${
                    isActive(item.href)
                      ? "bg-primary/10 text-primary font-semibold"
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

            <Link
              href="/workspace"
              onClick={closeMenu}
              className="mt-3 inline-flex items-center justify-center gap-1.5 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-zinc-950 shadow-sm hover:bg-zinc-100 hover:scale-[1.02] active:scale-[0.97] transition-all duration-200"
            >
              <span>Get started</span>
              <ArrowUpRight size={16} />
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
