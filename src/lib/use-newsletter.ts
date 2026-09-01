"use client";

import { useCallback, useState } from "react";

export type NewsletterStatus = "idle" | "loading" | "success" | "error";

/** Shared newsletter-signup logic backed by /api/newsletter (MongoDB) —
 *  used by both the footer form and the dedicated NewsletterSignup block
 *  so there's one implementation instead of two copies drifting apart. */
export function useNewsletterSignup() {
  const [status, setStatus] = useState<NewsletterStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  const subscribe = useCallback(async (email: string) => {
    setStatus("loading");
    setError(null);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.error || "Something went wrong. Please try again.");
        setStatus("error");
        return false;
      }
      setStatus("success");
      return true;
    } catch {
      setError("Couldn't reach the server. Check your connection and try again.");
      setStatus("error");
      return false;
    }
  }, []);

  const reset = useCallback(() => {
    setStatus("idle");
    setError(null);
  }, []);

  return { status, error, subscribe, reset };
}
