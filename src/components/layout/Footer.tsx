"use client";

import Link from "next/link";
import { Phone, Mail, Clock, Globe, Settings, ArrowUpRight, Check } from "lucide-react";
import Logo from "./Logo";
import { useContent } from "@/lib/content-store";
import { useNewsletterSignup } from "@/lib/use-newsletter";

// Default placeholder URLs shipped in the CMS defaults — hide the icon
// rather than link out to a generic, non-functional profile until the
// client sets their real one via the admin panel.
const PLACEHOLDER_SOCIAL_URLS = new Set([
  "https://instagram.com",
  "https://instagram.com/",
  "https://facebook.com",
  "https://facebook.com/",
  "https://google.com",
  "https://google.com/",
]);

function isRealLink(url?: string) {
  return Boolean(url) && !PLACEHOLDER_SOCIAL_URLS.has(url!.trim());
}

const footerLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/services", label: "Services" },
  { href: "/special-offers", label: "Special Offers" },
  { href: "/board", label: "Board" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export default function Footer() {
  const { content } = useContent();
  const { contact } = content;
  const newsletter = useNewsletterSignup();
  const hasSocialLinks = isRealLink(contact.instagram) || isRealLink(contact.facebook) || isRealLink(contact.google);

  return (
    <footer className="relative overflow-hidden bg-gray-950 font-sans text-white">
      <div className="absolute inset-0 mesh-gradient-dark opacity-50" />
      <div className="absolute inset-0 grid-pattern opacity-10" />

      <div className="relative border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <Logo size="md" />
              <p className="mt-4 max-w-md text-sm leading-relaxed text-white/60">
                {content.tagline}. Empowering individuals through faith, community, and professional life coaching since 2010.
              </p>
              {hasSocialLinks && (
                <div className="mt-6 flex gap-3">
                  {isRealLink(contact.instagram) && (
                    <a href={contact.instagram} target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/70 transition-all hover:bg-secondary hover:text-white" aria-label="Instagram">
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /></svg>
                    </a>
                  )}
                  {isRealLink(contact.facebook) && (
                    <a href={contact.facebook} target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/70 transition-all hover:bg-secondary hover:text-white" aria-label="Facebook">
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                    </a>
                  )}
                  {isRealLink(contact.google) && (
                    <a href={contact.google} target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/70 transition-all hover:bg-secondary hover:text-white" aria-label="Google">
                      <Globe className="h-4 w-4" />
                    </a>
                  )}
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
              <h3 className="font-display text-lg font-bold">Stay Connected</h3>
              <p className="mt-2 text-sm text-white/60">Get updates on programs and community events.</p>
              {newsletter.status === "success" ? (
                <p className="mt-4 flex items-center gap-2 text-sm font-medium text-secondary">
                  <Check className="h-4 w-4" /> You&rsquo;re subscribed — thank you!
                </p>
              ) : (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const fd = new FormData(e.currentTarget);
                    const email = (fd.get("email") as string || "").trim();
                    if (!email) return;
                    const ok = await newsletter.subscribe(email);
                    if (ok) e.currentTarget.reset();
                  }}
                  className="mt-4 flex gap-2"
                >
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="Your email"
                    disabled={newsletter.status === "loading"}
                    className="flex-1 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:border-secondary focus:outline-none disabled:opacity-60"
                  />
                  <button
                    type="submit"
                    disabled={newsletter.status === "loading"}
                    className="rounded-full bg-secondary px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-secondary/90 disabled:opacity-60"
                  >
                    {newsletter.status === "loading" ? "Joining…" : "Join"}
                  </button>
                </form>
              )}
              {newsletter.status === "error" && (
                <p className="mt-2 text-xs text-red-300">{newsletter.error}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/40">Navigation</h3>
            <ul className="space-y-2.5">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="group inline-flex items-center gap-1 text-sm text-white/70 transition-colors hover:text-white">
                    {link.label}
                    <ArrowUpRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/40">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-white/70">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                <a href={`tel:${contact.phone.replace(/\D/g, "")}`} className="hover:text-white">{contact.phone}</a>
              </li>
              <li className="flex items-start gap-3 text-sm text-white/70">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                <a href={`mailto:${contact.email}`} className="hover:text-white">{contact.email}</a>
              </li>
              <li className="flex items-start gap-3 text-sm text-white/70">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                {contact.hours}
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/40">Programs</h3>
            <ul className="space-y-2.5">
              {content.services.items.slice(0, 4).map((s) => (
                <li key={s.id}>
                  <Link href="/services" className="text-sm text-white/70 transition-colors hover:text-white">
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/admin" className="mt-6 inline-flex items-center gap-1.5 text-xs text-white/50 transition-colors hover:text-white/80">
              <Settings className="h-3.5 w-3.5" />
              Admin Access
            </Link>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-sm text-white/40">
            &copy; {new Date().getFullYear()} {content.siteName}. All rights reserved.
          </p>
          <p className="text-xs text-white/40">Built with faith &amp; purpose</p>
        </div>
      </div>
    </footer>
  );
}
