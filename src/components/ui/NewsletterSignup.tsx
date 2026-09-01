"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Send, CheckCircle } from "lucide-react";
import { useNewsletterSignup } from "@/lib/use-newsletter";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const { status, error, subscribe } = useNewsletterSignup();
  const submitted = status === "success";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    const ok = await subscribe(email);
    if (ok) setEmail("");
  }

  return (
    <section className="relative overflow-hidden py-16 lg:py-20">
      <div className="absolute inset-0 mesh-gradient" />
      <div className="relative mx-auto max-w-2xl px-4 text-center sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl gradient-border p-8 sm:p-12"
        >
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-7 w-7 text-primary" />
          </div>
          <h2 className="font-display text-2xl font-bold text-gray-900 sm:text-3xl">
            Stay Connected
          </h2>
          <p className="mt-3 text-gray-600">
            Get community updates, life coaching insights, and program announcements delivered to your inbox.
          </p>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-6 flex items-center justify-center gap-2 text-green-600"
            >
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">You&apos;re subscribed! Thank you.</span>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                disabled={status === "loading"}
                className="flex-1 rounded-full border border-gray-200 px-5 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-primary/90 hover:shadow-lg disabled:opacity-60"
              >
                <Send className="h-4 w-4" />
                {status === "loading" ? "Subscribing…" : "Subscribe"}
              </button>
            </form>
          )}
          {status === "error" && <p className="mt-3 text-sm text-red-500">{error}</p>}
        </motion.div>
      </div>
    </section>
  );
}
