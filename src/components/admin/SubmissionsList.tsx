"use client";

import { useCallback, useEffect, useState } from "react";
import { RefreshCw, Trash2, CheckCircle, Circle } from "lucide-react";

interface BaseSubmission {
  _id: string;
  read?: boolean;
  createdAt: string;
}

interface SubmissionsListProps<T extends BaseSubmission> {
  endpoint: string;
  emptyLabel: string;
  readLabel?: string;
  renderItem: (item: T) => React.ReactNode;
}

export default function SubmissionsList<T extends BaseSubmission>({
  endpoint,
  emptyLabel,
  readLabel = "Mark reviewed",
  renderItem,
}: SubmissionsListProps<T>) {
  const [items, setItems] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(endpoint);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.error || "Failed to load submissions.");
        return;
      }
      const data = await res.json();
      setItems(data.items as T[]);
    } catch {
      setError("Couldn't reach the server.");
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    // Fetching admin-only data on mount — there's no route loader available
    // here since this list is one tab of a client-rendered panel.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  async function toggleRead(item: T) {
    setItems((prev) => prev?.map((i) => (i._id === item._id ? { ...i, read: !item.read } : i)) ?? null);
    try {
      await fetch(`${endpoint}/${item._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: !item.read }),
      });
    } catch {
      // best-effort — a manual refresh will resync if this failed
    }
  }

  async function remove(item: T) {
    if (!window.confirm("Delete this entry permanently? This cannot be undone.")) return;
    setItems((prev) => prev?.filter((i) => i._id !== item._id) ?? null);
    try {
      await fetch(`${endpoint}/${item._id}`, { method: "DELETE" });
    } catch {
      load();
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-500">{items ? `${items.length} total` : "Loading…"}</p>
        <button
          type="button"
          onClick={load}
          disabled={loading}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>}
      {items && items.length === 0 && !error && (
        <p className="rounded-lg bg-surface p-6 text-center text-sm text-gray-400">{emptyLabel}</p>
      )}

      {items?.map((item) => (
        <div
          key={item._id}
          className={`rounded-lg border p-4 ${item.read ? "border-gray-100" : "border-primary/25 bg-primary/[0.03]"}`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1 text-sm text-gray-700">{renderItem(item)}</div>
            <div className="flex shrink-0 items-center gap-3">
              <button
                type="button"
                onClick={() => toggleRead(item)}
                title={item.read ? "Mark unread" : readLabel}
                className="text-gray-400 transition-colors hover:text-primary"
              >
                {item.read ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Circle className="h-4 w-4" />}
              </button>
              <button
                type="button"
                onClick={() => remove(item)}
                title="Delete"
                className="text-gray-400 transition-colors hover:text-red-500"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
          <p className="mt-2 text-[11px] text-gray-400">{new Date(item.createdAt).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}
