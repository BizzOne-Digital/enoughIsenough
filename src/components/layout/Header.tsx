"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Settings } from "lucide-react";
import Logo from "./Logo";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/services", label: "Services" },
  { href: "/special-offers", label: "Special Offers" },
  { href: "/board", label: "Board" },
  { href: "/contact", label: "Contact" },
  { href: "/blog", label: "Blog" },
];

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const ticking = useRef(false);

  // Close the mobile menu when the route changes. Adjusting state during
  // render (rather than in an effect) avoids an extra render pass and a
  // visible flash of the old menu before it closes.
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setMobileOpen(false);
  }

  // A light, always-present glass backdrop (rather than a hard swap
  // between fully transparent and opaque) keeps every nav item legible
  // no matter what renders underneath — including the dark-gradient page
  // heroes on Services/Blog, where a transparent header previously made
  // the gray nav text nearly invisible. Scrolling only deepens it.
  useEffect(() => {
    function onScroll() {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 24);
        ticking.current = false;
      });
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 font-sans transition-[background-color,box-shadow,border-color,backdrop-filter] duration-300",
        scrolled
          ? "bg-white/90 shadow-lg shadow-primary/5 border-b border-gray-100 backdrop-blur-xl"
          : "bg-white/70 border-b border-white/40 backdrop-blur-md"
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" aria-label="Enough Is Enough Foundation Home">
          <Logo size="md" />
        </Link>

        <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Main navigation">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative rounded-lg px-3.5 py-2 text-sm font-medium transition-colors",
                  active ? "text-primary" : "text-gray-700 hover:text-primary"
                )}
              >
                {active && (
                  <motion.span
                    layoutId="nav-indicator"
                    className="absolute inset-0 rounded-lg bg-primary/10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative">{link.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/admin"
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-primary/5 hover:text-primary"
          >
            <Settings className="h-4 w-4" />
            Admin
          </Link>
          <Link
            href="/contact"
            className="relative overflow-hidden rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary/25 transition-all hover:shadow-lg hover:shadow-primary/30"
          >
            <span className="relative z-10">Contact Us</span>
            <span className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-0 transition-opacity hover:opacity-100" />
          </Link>
        </div>

        <button
          type="button"
          className="rounded-xl p-2.5 text-gray-700 transition-colors hover:bg-primary/5 lg:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden border-t border-gray-100 bg-white/95 backdrop-blur-xl lg:hidden"
          >
            <nav className="flex flex-col gap-1 px-4 py-4" aria-label="Mobile navigation">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.2 }}
                >
                  <Link
                    href={link.href}
                    className={cn(
                      "block rounded-xl px-4 py-3.5 text-sm font-medium transition-colors",
                      pathname === link.href
                        ? "bg-primary/10 text-primary"
                        : "text-gray-700 hover:bg-gray-50"
                    )}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <Link
                href="/admin"
                className="flex items-center gap-2 rounded-xl px-4 py-3.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                <Settings className="h-4 w-4" />
                Admin Panel
              </Link>
              <Link
                href="/contact"
                className="mt-2 block rounded-full bg-primary px-4 py-3.5 text-center text-sm font-semibold text-white shadow-md"
              >
                Contact Us
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
