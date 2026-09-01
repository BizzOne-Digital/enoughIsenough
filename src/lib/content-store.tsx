"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { SiteContent } from "@/types/content";

interface ContentContextValue {
  content: SiteContent;
  /** True while a save/reset request to the database is in flight. */
  saving: boolean;
  /** Message from the most recent failed save/reset/login, if any. */
  error: string | null;
  clearError: () => void;
  /** Whether MONGODB_URI is set on the server — false means reads still
   *  work (from bundled defaults) but writes will be rejected. */
  dbConfigured: boolean;
  /** Whether SMTP + ADMIN_EMAIL are set — false means forms still save
   *  to the database but no email notifications go out. */
  emailConfigured: boolean;
  /** Persists `updates` to MongoDB and updates local state on success.
   *  Resolves to true/false so callers can show inline save feedback. */
  updateContent: (updates: Partial<SiteContent>) => Promise<boolean>;
  resetContent: () => Promise<boolean>;
  isAdmin: boolean;
  login: (password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const ContentContext = createContext<ContentContextValue | null>(null);

function applyThemeColors(theme: SiteContent["theme"]) {
  if (typeof document === "undefined") return;
  document.documentElement.style.setProperty("--primary", theme.primary);
  document.documentElement.style.setProperty("--secondary", theme.secondary);
  document.documentElement.style.setProperty("--background", theme.background);
}

async function parseErrorMessage(res: Response, fallback: string): Promise<string> {
  try {
    const body = await res.json();
    if (typeof body?.error === "string") return body.error;
  } catch {
    // ignore — use fallback
  }
  return fallback;
}

export function ContentProvider({
  children,
  initialContent,
  initialIsAdmin,
  initialDbConfigured,
  initialEmailConfigured,
}: {
  children: ReactNode;
  initialContent: SiteContent;
  initialIsAdmin: boolean;
  initialDbConfigured: boolean;
  initialEmailConfigured: boolean;
}) {
  // Content is provided synchronously from the server on first paint —
  // there is no client-only "loading" gate, which is what previously
  // caused the whole header/hero tree to pop in after a delay.
  const [content, setContent] = useState<SiteContent>(initialContent);
  const [isAdmin, setIsAdmin] = useState(initialIsAdmin);
  const [dbConfigured] = useState(initialDbConfigured);
  const [emailConfigured] = useState(initialEmailConfigured);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    applyThemeColors(content.theme);
  }, [content.theme]);

  const clearError = useCallback(() => setError(null), []);

  const updateContent = useCallback(async (updates: Partial<SiteContent>) => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) {
        setError(await parseErrorMessage(res, "Failed to save changes."));
        return false;
      }
      const data = await res.json();
      setContent(data.content as SiteContent);
      return true;
    } catch {
      setError("Couldn't reach the server. Check your connection and try again.");
      return false;
    } finally {
      setSaving(false);
    }
  }, []);

  const resetContent = useCallback(async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/content/reset", { method: "POST" });
      if (!res.ok) {
        setError(await parseErrorMessage(res, "Failed to reset content."));
        return false;
      }
      const data = await res.json();
      setContent(data.content as SiteContent);
      return true;
    } catch {
      setError("Couldn't reach the server. Check your connection and try again.");
      return false;
    } finally {
      setSaving(false);
    }
  }, []);

  const login = useCallback(async (password: string) => {
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        setError(await parseErrorMessage(res, "Incorrect password."));
        return false;
      }
      setIsAdmin(true);
      return true;
    } catch {
      setError("Couldn't reach the server. Check your connection and try again.");
      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } finally {
      setIsAdmin(false);
    }
  }, []);

  const value = useMemo(
    () => ({
      content,
      saving,
      error,
      clearError,
      dbConfigured,
      emailConfigured,
      updateContent,
      resetContent,
      isAdmin,
      login,
      logout,
    }),
    [
      content,
      saving,
      error,
      clearError,
      dbConfigured,
      emailConfigured,
      updateContent,
      resetContent,
      isAdmin,
      login,
      logout,
    ]
  );

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error("useContent must be used within ContentProvider");
  return ctx;
}
