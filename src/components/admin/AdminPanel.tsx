"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Lock,
  LogOut,
  Save,
  RotateCcw,
  Palette,
  Type,
  Image,
  Users,
  Briefcase,
  Phone,
  FileText,
  Plus,
  Trash2,
  Quote,
  BarChart3,
  HelpCircle,
  History,
  Gift,
  Mail,
  Inbox,
  HandHeart,
  AlertTriangle,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { useContent } from "@/lib/content-store";
import ImageField from "./ImageField";
import SubmissionsList from "./SubmissionsList";
import type {
  BoardMember,
  Service,
  BlogPost,
  Testimonial,
  Stat,
  FAQ,
  TimelineItem,
  SiteContent,
} from "@/types/content";

type Tab =
  | "general"
  | "home"
  | "about"
  | "services"
  | "specialOffers"
  | "board"
  | "testimonials"
  | "stats"
  | "faqs"
  | "timeline"
  | "blog"
  | "contact"
  | "theme"
  | "messages"
  | "newsletter"
  | "applications";

const inputClass =
  "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20";
const labelClass = "mb-1 block text-xs font-medium text-gray-600";

interface ContactSubmissionItem {
  _id: string;
  createdAt: string;
  read?: boolean;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}

interface NewsletterSubscriberItem {
  _id: string;
  createdAt: string;
  read?: boolean;
  email: string;
}

interface FundApplicationItem {
  _id: string;
  createdAt: string;
  read?: boolean;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  employer?: string;
  position: string;
  amount: string;
  purpose: string;
}

function uid() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : Date.now().toString();
}

export default function AdminPanel() {
  const {
    content,
    updateContent,
    resetContent,
    isAdmin,
    login,
    logout,
    saving,
    error,
    clearError,
    dbConfigured,
    emailConfigured,
  } = useContent();
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loggingIn, setLoggingIn] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("general");
  const [draft, setDraft] = useState<SiteContent>(content);
  const [savedFlash, setSavedFlash] = useState(false);

  // Keep the working draft in sync with the last-saved content (after a
  // successful save/reset) without ever writing to localStorage — the
  // draft only lives in memory until "Save" persists it to MongoDB.
  // Adjusting state during render (rather than in an effect) avoids an
  // extra render pass; content only ever changes here as a *result* of
  // this panel's own save/reset calls, so there's no risk of clobbering
  // in-progress edits.
  const [prevContent, setPrevContent] = useState(content);
  if (content !== prevContent) {
    setPrevContent(content);
    setDraft(content);
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoggingIn(true);
    setLoginError(null);
    const ok = await login(password);
    setLoggingIn(false);
    if (!ok) setLoginError("Incorrect password. Please try again.");
  }

  async function handleSave() {
    const ok = await updateContent(draft);
    if (ok) {
      setSavedFlash(true);
      setTimeout(() => setSavedFlash(false), 2000);
    }
  }

  async function handleReset() {
    if (!window.confirm("Reset all site content back to the original defaults? This cannot be undone.")) return;
    await resetContent();
  }

  function patch(fn: (prev: SiteContent) => SiteContent) {
    setDraft(fn);
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4 mesh-gradient">
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleLogin}
          className="w-full max-w-md overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-2xl shadow-primary/10"
        >
          <div className="bg-gradient-to-r from-primary to-primary/90 px-8 py-10 text-center text-white">
            <Lock className="mx-auto h-10 w-10" />
            <h2 className="mt-4 font-display text-2xl font-bold">Admin Portal</h2>
            <p className="mt-2 text-sm text-white/70">Content Management System</p>
          </div>
          <div className="p-8">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              autoFocus
              className="w-full rounded-xl border border-gray-200 px-4 py-3.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            {loginError && <p className="mt-2 text-sm text-red-500">{loginError}</p>}
            <button
              type="submit"
              disabled={loggingIn}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3.5 text-sm font-semibold text-white transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25 disabled:opacity-60"
            >
              {loggingIn && <Loader2 className="h-4 w-4 animate-spin" />}
              Sign In to Dashboard
            </button>
          </div>
        </motion.form>
      </div>
    );
  }

  const tabs: { id: Tab; label: string; icon: typeof Type }[] = [
    { id: "general", label: "General", icon: Type },
    { id: "home", label: "Home", icon: Image },
    { id: "about", label: "About", icon: FileText },
    { id: "services", label: "Services", icon: Briefcase },
    { id: "specialOffers", label: "Special Offers", icon: Gift },
    { id: "board", label: "Board", icon: Users },
    { id: "testimonials", label: "Testimonials", icon: Quote },
    { id: "stats", label: "Impact Stats", icon: BarChart3 },
    { id: "faqs", label: "FAQs", icon: HelpCircle },
    { id: "timeline", label: "Timeline", icon: History },
    { id: "blog", label: "Blog", icon: FileText },
    { id: "contact", label: "Contact", icon: Phone },
    { id: "theme", label: "Theme", icon: Palette },
    { id: "messages", label: "Messages", icon: Mail },
    { id: "newsletter", label: "Newsletter", icon: Inbox },
    { id: "applications", label: "Fund Applications", icon: HandHeart },
  ];

  const isSubmissionsTab = activeTab === "messages" || activeTab === "newsletter" || activeTab === "applications";

  return (
    <div className="min-h-screen bg-surface font-sans">
      <div className="bg-gradient-to-r from-primary to-primary/90 px-4 py-8 text-white sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold">Content Dashboard</h1>
            <p className="text-sm text-white/70">Manage site content, images, and theme — saved directly to your database</p>
          </div>
          {!isSubmissionsTab && (
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-primary hover:bg-white/90 disabled:opacity-60"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {saving ? "Saving…" : savedFlash ? "Saved!" : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={handleReset}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-2.5 text-sm font-medium hover:bg-white/20 disabled:opacity-60"
              >
                <RotateCcw className="h-4 w-4" />
                Reset to Defaults
              </button>
              <button
                type="button"
                onClick={logout}
                className="inline-flex items-center gap-2 rounded-full bg-red-500/20 px-5 py-2.5 text-sm font-medium hover:bg-red-500/30"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          )}
          {isSubmissionsTab && (
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-2 rounded-full bg-red-500/20 px-5 py-2.5 text-sm font-medium hover:bg-red-500/30"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          )}
        </div>
      </div>

      {!dbConfigured && (
        <div className="border-b border-amber-200 bg-amber-50 px-4 py-3 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-7xl items-start gap-2 text-sm text-amber-800">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <p>
              No database is connected yet, so changes here can&rsquo;t be saved and forms on the site can&rsquo;t
              submit. Add <code className="rounded bg-amber-100 px-1 py-0.5">MONGODB_URI</code> to your environment
              and restart the server to enable saving.
            </p>
          </div>
        </div>
      )}

      {dbConfigured && !emailConfigured && (
        <div className="border-b border-blue-200 bg-blue-50 px-4 py-3 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-7xl items-start gap-2 text-sm text-blue-800">
            <Mail className="mt-0.5 h-4 w-4 shrink-0" />
            <p>
              Email notifications are optional and not set up yet — form submissions are still saved here and in the
              database. Add <code className="rounded bg-blue-100 px-1 py-0.5">SMTP_HOST</code>,{" "}
              <code className="rounded bg-blue-100 px-1 py-0.5">SMTP_USER</code>,{" "}
              <code className="rounded bg-blue-100 px-1 py-0.5">SMTP_PASS</code> and{" "}
              <code className="rounded bg-blue-100 px-1 py-0.5">ADMIN_EMAIL</code> to your environment to get an
              email whenever someone submits a form.
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="border-b border-red-200 bg-red-50 px-4 py-3 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-7xl items-start justify-between gap-2 text-sm text-red-700">
            <span className="flex items-start gap-2">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              {error}
            </span>
            <button type="button" onClick={clearError} className="shrink-0 font-medium hover:underline">
              Dismiss
            </button>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
          <nav className="flex flex-row flex-wrap gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex shrink-0 items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                  activeTab === tab.id ? "bg-primary/10 text-primary" : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            {activeTab === "general" && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">General Settings</h2>
                <div>
                  <label className={labelClass}>Site Name</label>
                  <input
                    className={inputClass}
                    value={draft.siteName}
                    onChange={(e) => patch((p) => ({ ...p, siteName: e.target.value }))}
                  />
                </div>
                <div>
                  <label className={labelClass}>Tagline</label>
                  <input
                    className={inputClass}
                    value={draft.tagline}
                    onChange={(e) => patch((p) => ({ ...p, tagline: e.target.value }))}
                  />
                </div>
              </div>
            )}

            {activeTab === "home" && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Home Page</h2>
                <div>
                  <label className={labelClass}>Hero Badge Text</label>
                  <input
                    className={inputClass}
                    value={draft.home.heroBadge || ""}
                    onChange={(e) => patch((p) => ({ ...p, home: { ...p.home, heroBadge: e.target.value } }))}
                  />
                </div>
                <div>
                  <label className={labelClass}>Hero Headline</label>
                  <textarea
                    className={inputClass}
                    rows={2}
                    value={draft.home.heroHeadline}
                    onChange={(e) => patch((p) => ({ ...p, home: { ...p.home, heroHeadline: e.target.value } }))}
                  />
                </div>
                <div>
                  <label className={labelClass}>Hero Sub-headline</label>
                  <textarea
                    className={inputClass}
                    rows={2}
                    value={draft.home.heroSubheadline}
                    onChange={(e) => patch((p) => ({ ...p, home: { ...p.home, heroSubheadline: e.target.value } }))}
                  />
                </div>
                <div>
                  <label className={labelClass}>Mission Statement</label>
                  <textarea
                    className={inputClass}
                    rows={2}
                    value={draft.home.missionStatement}
                    onChange={(e) => patch((p) => ({ ...p, home: { ...p.home, missionStatement: e.target.value } }))}
                  />
                </div>
                <ImageField
                  label="Hero Image"
                  value={draft.home.heroImage}
                  onChange={(v) => patch((p) => ({ ...p, home: { ...p.home, heroImage: v } }))}
                  inputClass={inputClass}
                  labelClass={labelClass}
                />
                <div>
                  <label className={labelClass}>Life Coach Name</label>
                  <input
                    className={inputClass}
                    value={draft.home.lifeCoachName}
                    onChange={(e) => patch((p) => ({ ...p, home: { ...p.home, lifeCoachName: e.target.value } }))}
                  />
                </div>
                <div>
                  <label className={labelClass}>Life Coach Title</label>
                  <input
                    className={inputClass}
                    value={draft.home.lifeCoachTitle}
                    onChange={(e) => patch((p) => ({ ...p, home: { ...p.home, lifeCoachTitle: e.target.value } }))}
                  />
                </div>
                <div>
                  <label className={labelClass}>Life Coach Bio</label>
                  <textarea
                    className={inputClass}
                    rows={4}
                    value={draft.home.lifeCoachBio}
                    onChange={(e) => patch((p) => ({ ...p, home: { ...p.home, lifeCoachBio: e.target.value } }))}
                  />
                </div>
                <ImageField
                  label="Life Coach Image"
                  value={draft.home.lifeCoachImage}
                  onChange={(v) => patch((p) => ({ ...p, home: { ...p.home, lifeCoachImage: v } }))}
                  inputClass={inputClass}
                  labelClass={labelClass}
                />
              </div>
            )}

            {activeTab === "about" && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">About Page</h2>
                <div>
                  <label className={labelClass}>Page Title</label>
                  <input
                    className={inputClass}
                    value={draft.about.title}
                    onChange={(e) => patch((p) => ({ ...p, about: { ...p.about, title: e.target.value } }))}
                  />
                </div>
                <div>
                  <label className={labelClass}>Mission Title</label>
                  <input
                    className={inputClass}
                    value={draft.about.missionTitle}
                    onChange={(e) => patch((p) => ({ ...p, about: { ...p.about, missionTitle: e.target.value } }))}
                  />
                </div>
                <div>
                  <label className={labelClass}>Mission Text</label>
                  <textarea
                    className={inputClass}
                    rows={4}
                    value={draft.about.missionText}
                    onChange={(e) => patch((p) => ({ ...p, about: { ...p.about, missionText: e.target.value } }))}
                  />
                </div>
                <div>
                  <label className={labelClass}>Overview Title</label>
                  <input
                    className={inputClass}
                    value={draft.about.overviewTitle}
                    onChange={(e) => patch((p) => ({ ...p, about: { ...p.about, overviewTitle: e.target.value } }))}
                  />
                </div>
                <div>
                  <label className={labelClass}>Overview Text</label>
                  <textarea
                    className={inputClass}
                    rows={4}
                    value={draft.about.overviewText}
                    onChange={(e) => patch((p) => ({ ...p, about: { ...p.about, overviewText: e.target.value } }))}
                  />
                </div>
                <ImageField
                  label="About Image"
                  value={draft.about.image}
                  onChange={(v) => patch((p) => ({ ...p, about: { ...p.about, image: v } }))}
                  inputClass={inputClass}
                  labelClass={labelClass}
                />

                <div className="border-t border-gray-100 pt-4">
                  <h3 className="text-sm font-semibold">Core Values</h3>
                  <div className="mt-3 space-y-3">
                    {(draft.about.values || []).map((v, i) => (
                      <div key={i} className="rounded-lg border border-gray-100 p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold">Value {i + 1}</span>
                          <button
                            type="button"
                            onClick={() =>
                              patch((p) => ({
                                ...p,
                                about: { ...p.about, values: (p.about.values || []).filter((_, idx) => idx !== i) },
                              }))
                            }
                            className="text-red-400 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <input
                          className={inputClass}
                          placeholder="Title"
                          value={v.title}
                          onChange={(e) =>
                            patch((p) => {
                              const values = [...(p.about.values || [])];
                              values[i] = { ...values[i], title: e.target.value };
                              return { ...p, about: { ...p.about, values } };
                            })
                          }
                        />
                        <input
                          className={inputClass}
                          placeholder="Description"
                          value={v.description}
                          onChange={(e) =>
                            patch((p) => {
                              const values = [...(p.about.values || [])];
                              values[i] = { ...values[i], description: e.target.value };
                              return { ...p, about: { ...p.about, values } };
                            })
                          }
                        />
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() =>
                        patch((p) => ({
                          ...p,
                          about: {
                            ...p.about,
                            values: [...(p.about.values || []), { title: "New Value", description: "", icon: "sparkles" }],
                          },
                        }))
                      }
                      className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                    >
                      <Plus className="h-4 w-4" /> Add Value
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "services" && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold">Services</h2>
                <div>
                  <label className={labelClass}>Section Title</label>
                  <input
                    className={inputClass}
                    value={draft.services.title}
                    onChange={(e) => patch((p) => ({ ...p, services: { ...p.services, title: e.target.value } }))}
                  />
                </div>
                <div>
                  <label className={labelClass}>Subtitle</label>
                  <input
                    className={inputClass}
                    value={draft.services.subtitle}
                    onChange={(e) => patch((p) => ({ ...p, services: { ...p.services, subtitle: e.target.value } }))}
                  />
                </div>
                <div>
                  <label className={labelClass}>Pricing Note</label>
                  <input
                    className={inputClass}
                    value={draft.services.pricingNote}
                    onChange={(e) =>
                      patch((p) => ({ ...p, services: { ...p.services, pricingNote: e.target.value } }))
                    }
                  />
                </div>
                {draft.services.items.map((service, i) => (
                  <div key={service.id} className="rounded-lg border border-gray-100 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">Program {i + 1}</span>
                      <button
                        type="button"
                        onClick={() =>
                          patch((p) => ({
                            ...p,
                            services: { ...p.services, items: p.services.items.filter((s) => s.id !== service.id) },
                          }))
                        }
                        className="text-red-400 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <input
                      className={inputClass}
                      placeholder="Title"
                      value={service.title}
                      onChange={(e) =>
                        patch((p) => {
                          const items = [...p.services.items];
                          items[i] = { ...service, title: e.target.value };
                          return { ...p, services: { ...p.services, items } };
                        })
                      }
                    />
                    <input
                      className={inputClass}
                      placeholder="Tag (e.g. Popular)"
                      value={service.tag || ""}
                      onChange={(e) =>
                        patch((p) => {
                          const items = [...p.services.items];
                          items[i] = { ...service, tag: e.target.value };
                          return { ...p, services: { ...p.services, items } };
                        })
                      }
                    />
                    <textarea
                      className={inputClass}
                      rows={2}
                      placeholder="Short Description"
                      value={service.description}
                      onChange={(e) =>
                        patch((p) => {
                          const items = [...p.services.items];
                          items[i] = { ...service, description: e.target.value };
                          return { ...p, services: { ...p.services, items } };
                        })
                      }
                    />
                    <textarea
                      className={inputClass}
                      rows={3}
                      placeholder="Long Description (shown in the details modal)"
                      value={service.longDescription || ""}
                      onChange={(e) =>
                        patch((p) => {
                          const items = [...p.services.items];
                          items[i] = { ...service, longDescription: e.target.value };
                          return { ...p, services: { ...p.services, items } };
                        })
                      }
                    />
                    <ImageField
                      label="Image"
                      value={service.image}
                      onChange={(v) =>
                        patch((p) => {
                          const items = [...p.services.items];
                          items[i] = { ...service, image: v };
                          return { ...p, services: { ...p.services, items } };
                        })
                      }
                      inputClass={inputClass}
                      labelClass={labelClass}
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    const newService: Service = {
                      id: uid(),
                      title: "New Program",
                      description: "Program description",
                      image: "",
                      icon: "users",
                    };
                    patch((p) => ({ ...p, services: { ...p.services, items: [...p.services.items, newService] } }));
                  }}
                  className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                >
                  <Plus className="h-4 w-4" /> Add Program
                </button>
              </div>
            )}

            {activeTab === "specialOffers" && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Special Offers Page</h2>
                {(
                  [
                    ["Page Title", "title"],
                    ["Subtitle", "subtitle"],
                    ["Description", "description"],
                    ["Form Title", "formTitle"],
                    ["Form Description", "formDescription"],
                  ] as const
                ).map(([label, key]) => (
                  <div key={key}>
                    <label className={labelClass}>{label}</label>
                    <textarea
                      className={inputClass}
                      rows={key === "description" || key === "formDescription" ? 3 : 1}
                      value={draft.specialOffers[key]}
                      onChange={(e) =>
                        patch((p) => ({ ...p, specialOffers: { ...p.specialOffers, [key]: e.target.value } }))
                      }
                    />
                  </div>
                ))}
              </div>
            )}

            {activeTab === "board" && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold">Board Members</h2>
                {draft.boardMembers.map((member, i) => (
                  <div key={member.id} className="rounded-lg border border-gray-100 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">Member {i + 1}</span>
                      <button
                        type="button"
                        onClick={() =>
                          patch((p) => ({
                            ...p,
                            boardMembers: p.boardMembers.filter((m) => m.id !== member.id),
                          }))
                        }
                        className="text-red-400 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <input
                        className={inputClass}
                        placeholder="Name"
                        value={member.name}
                        onChange={(e) =>
                          patch((p) => {
                            const boardMembers = [...p.boardMembers];
                            boardMembers[i] = { ...member, name: e.target.value };
                            return { ...p, boardMembers };
                          })
                        }
                      />
                      <input
                        className={inputClass}
                        placeholder="Title"
                        value={member.title}
                        onChange={(e) =>
                          patch((p) => {
                            const boardMembers = [...p.boardMembers];
                            boardMembers[i] = { ...member, title: e.target.value };
                            return { ...p, boardMembers };
                          })
                        }
                      />
                    </div>
                    <ImageField
                      label="Photo"
                      value={member.image}
                      onChange={(v) =>
                        patch((p) => {
                          const boardMembers = [...p.boardMembers];
                          boardMembers[i] = { ...member, image: v };
                          return { ...p, boardMembers };
                        })
                      }
                      inputClass={inputClass}
                      labelClass={labelClass}
                    />
                    <div>
                      <label className={labelClass}>Photo Position (fixes cropping — e.g. face cut off)</label>
                      <select
                        className={inputClass}
                        value={member.imagePosition || "center top"}
                        onChange={(e) =>
                          patch((p) => {
                            const boardMembers = [...p.boardMembers];
                            boardMembers[i] = { ...member, imagePosition: e.target.value };
                            return { ...p, boardMembers };
                          })
                        }
                      >
                        <option value="center top">Top-anchored (default)</option>
                        <option value="center 25%">Show a little more below</option>
                        <option value="center center">Centered</option>
                        <option value="center 75%">Show much more below</option>
                        <option value="center bottom">Bottom-anchored</option>
                      </select>
                    </div>
                    <textarea
                      className={inputClass}
                      rows={2}
                      placeholder="Bio"
                      value={member.bio || ""}
                      onChange={(e) =>
                        patch((p) => {
                          const boardMembers = [...p.boardMembers];
                          boardMembers[i] = { ...member, bio: e.target.value };
                          return { ...p, boardMembers };
                        })
                      }
                    />
                    <label className="flex items-center gap-2 text-xs font-medium text-gray-600">
                      <input
                        type="checkbox"
                        checked={Boolean(member.isLeadership)}
                        onChange={(e) =>
                          patch((p) => {
                            const boardMembers = [...p.boardMembers];
                            boardMembers[i] = { ...member, isLeadership: e.target.checked };
                            return { ...p, boardMembers };
                          })
                        }
                      />
                      Show under &ldquo;Leadership&rdquo; on the Board page
                    </label>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    const newMember: BoardMember = { id: uid(), name: "New Member", title: "Board Member", image: "", bio: "" };
                    patch((p) => ({ ...p, boardMembers: [...p.boardMembers, newMember] }));
                  }}
                  className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                >
                  <Plus className="h-4 w-4" /> Add Board Member
                </button>
              </div>
            )}

            {activeTab === "testimonials" && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold">Testimonials</h2>
                {draft.testimonials.map((t, i) => (
                  <div key={t.id} className="rounded-lg border border-gray-100 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">Testimonial {i + 1}</span>
                      <button
                        type="button"
                        onClick={() => patch((p) => ({ ...p, testimonials: p.testimonials.filter((x) => x.id !== t.id) }))}
                        className="text-red-400 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <input
                        className={inputClass}
                        placeholder="Name"
                        value={t.name}
                        onChange={(e) =>
                          patch((p) => {
                            const testimonials = [...p.testimonials];
                            testimonials[i] = { ...t, name: e.target.value };
                            return { ...p, testimonials };
                          })
                        }
                      />
                      <input
                        className={inputClass}
                        placeholder="Role"
                        value={t.role}
                        onChange={(e) =>
                          patch((p) => {
                            const testimonials = [...p.testimonials];
                            testimonials[i] = { ...t, role: e.target.value };
                            return { ...p, testimonials };
                          })
                        }
                      />
                    </div>
                    <textarea
                      className={inputClass}
                      rows={3}
                      placeholder="Quote"
                      value={t.quote}
                      onChange={(e) =>
                        patch((p) => {
                          const testimonials = [...p.testimonials];
                          testimonials[i] = { ...t, quote: e.target.value };
                          return { ...p, testimonials };
                        })
                      }
                    />
                    <ImageField
                      label="Photo"
                      value={t.image}
                      onChange={(v) =>
                        patch((p) => {
                          const testimonials = [...p.testimonials];
                          testimonials[i] = { ...t, image: v };
                          return { ...p, testimonials };
                        })
                      }
                      inputClass={inputClass}
                      labelClass={labelClass}
                    />
                    <div>
                      <label className={labelClass}>Rating (1–5)</label>
                      <input
                        type="number"
                        min={1}
                        max={5}
                        className={inputClass}
                        value={t.rating}
                        onChange={(e) =>
                          patch((p) => {
                            const testimonials = [...p.testimonials];
                            testimonials[i] = { ...t, rating: Math.min(5, Math.max(1, Number(e.target.value) || 1)) };
                            return { ...p, testimonials };
                          })
                        }
                      />
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    const t: Testimonial = { id: uid(), name: "New Name", role: "Program Graduate", quote: "", image: "", rating: 5 };
                    patch((p) => ({ ...p, testimonials: [...p.testimonials, t] }));
                  }}
                  className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                >
                  <Plus className="h-4 w-4" /> Add Testimonial
                </button>
              </div>
            )}

            {activeTab === "stats" && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold">Impact Stats</h2>
                <p className="text-xs text-gray-500">Shown on the homepage hero and Board page (first three are used in the hero).</p>
                {draft.stats.map((s, i) => (
                  <div key={s.id} className="grid gap-3 rounded-lg border border-gray-100 p-4 sm:grid-cols-[1fr_1fr_2fr_auto]">
                    <div>
                      <label className={labelClass}>Value</label>
                      <input
                        type="number"
                        className={inputClass}
                        value={s.value}
                        onChange={(e) =>
                          patch((p) => {
                            const stats = [...p.stats];
                            stats[i] = { ...s, value: Number(e.target.value) || 0 };
                            return { ...p, stats };
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Suffix</label>
                      <input
                        className={inputClass}
                        placeholder="+"
                        value={s.suffix}
                        onChange={(e) =>
                          patch((p) => {
                            const stats = [...p.stats];
                            stats[i] = { ...s, suffix: e.target.value };
                            return { ...p, stats };
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Label</label>
                      <input
                        className={inputClass}
                        value={s.label}
                        onChange={(e) =>
                          patch((p) => {
                            const stats = [...p.stats];
                            stats[i] = { ...s, label: e.target.value };
                            return { ...p, stats };
                          })
                        }
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => patch((p) => ({ ...p, stats: p.stats.filter((x) => x.id !== s.id) }))}
                      className="self-end text-red-400 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    const s: Stat = { id: uid(), value: 0, suffix: "+", label: "New Stat" };
                    patch((p) => ({ ...p, stats: [...p.stats, s] }));
                  }}
                  className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                >
                  <Plus className="h-4 w-4" /> Add Stat
                </button>
              </div>
            )}

            {activeTab === "faqs" && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold">Frequently Asked Questions</h2>
                {draft.faqs.map((f, i) => (
                  <div key={f.id} className="rounded-lg border border-gray-100 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">FAQ {i + 1}</span>
                      <button
                        type="button"
                        onClick={() => patch((p) => ({ ...p, faqs: p.faqs.filter((x) => x.id !== f.id) }))}
                        className="text-red-400 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <input
                      className={inputClass}
                      placeholder="Question"
                      value={f.question}
                      onChange={(e) =>
                        patch((p) => {
                          const faqs = [...p.faqs];
                          faqs[i] = { ...f, question: e.target.value };
                          return { ...p, faqs };
                        })
                      }
                    />
                    <textarea
                      className={inputClass}
                      rows={3}
                      placeholder="Answer"
                      value={f.answer}
                      onChange={(e) =>
                        patch((p) => {
                          const faqs = [...p.faqs];
                          faqs[i] = { ...f, answer: e.target.value };
                          return { ...p, faqs };
                        })
                      }
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    const f: FAQ = { id: uid(), question: "New question?", answer: "" };
                    patch((p) => ({ ...p, faqs: [...p.faqs, f] }));
                  }}
                  className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                >
                  <Plus className="h-4 w-4" /> Add FAQ
                </button>
              </div>
            )}

            {activeTab === "timeline" && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold">Our Journey Timeline</h2>
                {draft.timeline.map((t, i) => (
                  <div key={t.id} className="rounded-lg border border-gray-100 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">Milestone {i + 1}</span>
                      <button
                        type="button"
                        onClick={() => patch((p) => ({ ...p, timeline: p.timeline.filter((x) => x.id !== t.id) }))}
                        className="text-red-400 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-[1fr_2fr]">
                      <input
                        className={inputClass}
                        placeholder="Year"
                        value={t.year}
                        onChange={(e) =>
                          patch((p) => {
                            const timeline = [...p.timeline];
                            timeline[i] = { ...t, year: e.target.value };
                            return { ...p, timeline };
                          })
                        }
                      />
                      <input
                        className={inputClass}
                        placeholder="Title"
                        value={t.title}
                        onChange={(e) =>
                          patch((p) => {
                            const timeline = [...p.timeline];
                            timeline[i] = { ...t, title: e.target.value };
                            return { ...p, timeline };
                          })
                        }
                      />
                    </div>
                    <textarea
                      className={inputClass}
                      rows={2}
                      placeholder="Description"
                      value={t.description}
                      onChange={(e) =>
                        patch((p) => {
                          const timeline = [...p.timeline];
                          timeline[i] = { ...t, description: e.target.value };
                          return { ...p, timeline };
                        })
                      }
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    const t: TimelineItem = { id: uid(), year: new Date().getFullYear().toString(), title: "New Milestone", description: "" };
                    patch((p) => ({ ...p, timeline: [...p.timeline, t] }));
                  }}
                  className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                >
                  <Plus className="h-4 w-4" /> Add Milestone
                </button>
              </div>
            )}

            {activeTab === "blog" && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold">Blog Posts</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className={labelClass}>Section Title</label>
                    <input
                      className={inputClass}
                      value={draft.blog.title}
                      onChange={(e) => patch((p) => ({ ...p, blog: { ...p.blog, title: e.target.value } }))}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Subtitle</label>
                    <input
                      className={inputClass}
                      value={draft.blog.subtitle}
                      onChange={(e) => patch((p) => ({ ...p, blog: { ...p.blog, subtitle: e.target.value } }))}
                    />
                  </div>
                </div>
                {draft.blog.posts.map((post, i) => (
                  <div key={post.id} className="rounded-lg border border-gray-100 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">Post {i + 1}</span>
                      <button
                        type="button"
                        onClick={() =>
                          patch((p) => ({ ...p, blog: { ...p.blog, posts: p.blog.posts.filter((x) => x.id !== post.id) } }))
                        }
                        className="text-red-400 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <input
                      className={inputClass}
                      placeholder="Title"
                      value={post.title}
                      onChange={(e) =>
                        patch((p) => {
                          const posts = [...p.blog.posts];
                          posts[i] = { ...post, title: e.target.value };
                          return { ...p, blog: { ...p.blog, posts } };
                        })
                      }
                    />
                    <textarea
                      className={inputClass}
                      rows={2}
                      placeholder="Excerpt"
                      value={post.excerpt}
                      onChange={(e) =>
                        patch((p) => {
                          const posts = [...p.blog.posts];
                          posts[i] = { ...post, excerpt: e.target.value };
                          return { ...p, blog: { ...p.blog, posts } };
                        })
                      }
                    />
                    <textarea
                      className={inputClass}
                      rows={4}
                      placeholder="Full content"
                      value={post.content}
                      onChange={(e) =>
                        patch((p) => {
                          const posts = [...p.blog.posts];
                          posts[i] = { ...post, content: e.target.value };
                          return { ...p, blog: { ...p.blog, posts } };
                        })
                      }
                    />
                    <div className="grid gap-3 sm:grid-cols-2">
                      <input
                        className={inputClass}
                        placeholder="Category"
                        value={post.category}
                        onChange={(e) =>
                          patch((p) => {
                            const posts = [...p.blog.posts];
                            posts[i] = { ...post, category: e.target.value };
                            return { ...p, blog: { ...p.blog, posts } };
                          })
                        }
                      />
                      <input
                        className={inputClass}
                        placeholder="Author"
                        value={post.author}
                        onChange={(e) =>
                          patch((p) => {
                            const posts = [...p.blog.posts];
                            posts[i] = { ...post, author: e.target.value };
                            return { ...p, blog: { ...p.blog, posts } };
                          })
                        }
                      />
                    </div>
                    <ImageField
                      label="Cover Image"
                      value={post.image}
                      onChange={(v) =>
                        patch((p) => {
                          const posts = [...p.blog.posts];
                          posts[i] = { ...post, image: v };
                          return { ...p, blog: { ...p.blog, posts } };
                        })
                      }
                      inputClass={inputClass}
                      labelClass={labelClass}
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    const newPost: BlogPost = {
                      id: uid(),
                      title: "New Post",
                      excerpt: "Post excerpt",
                      content: "Full content here",
                      category: "Community News",
                      image: "",
                      date: new Date().toISOString().split("T")[0],
                      author: draft.home.lifeCoachName || "Team",
                    };
                    patch((p) => ({ ...p, blog: { ...p.blog, posts: [...p.blog.posts, newPost] } }));
                  }}
                  className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                >
                  <Plus className="h-4 w-4" /> Add Blog Post
                </button>
              </div>
            )}

            {activeTab === "contact" && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Contact Information</h2>
                {(
                  [
                    ["Phone", "phone"],
                    ["Email", "email"],
                    ["Hours", "hours"],
                    ["Address / Service Area", "address"],
                    ["Instagram URL", "instagram"],
                    ["Facebook URL", "facebook"],
                    ["Google URL", "google"],
                  ] as const
                ).map(([label, key]) => (
                  <div key={key}>
                    <label className={labelClass}>{label}</label>
                    <input
                      className={inputClass}
                      value={draft.contact[key] || ""}
                      onChange={(e) => patch((p) => ({ ...p, contact: { ...p.contact, [key]: e.target.value } }))}
                    />
                  </div>
                ))}
              </div>
            )}

            {activeTab === "theme" && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold">Theme Colors</h2>
                {(
                  [
                    ["Primary (Royal Blue)", "primary"],
                    ["Secondary (Fuchsia)", "secondary"],
                    ["Accent (Yellow)", "accent"],
                    ["Background", "background"],
                  ] as const
                ).map(([label, key]) => (
                  <div key={key} className="flex items-center gap-4">
                    <input
                      type="color"
                      value={draft.theme[key] || "#FACC15"}
                      onChange={(e) => patch((p) => ({ ...p, theme: { ...p.theme, [key]: e.target.value } }))}
                      className="h-10 w-10 cursor-pointer rounded-lg border border-gray-200"
                    />
                    <div className="flex-1">
                      <label className={labelClass}>{label}</label>
                      <input
                        className={inputClass}
                        value={draft.theme[key] || ""}
                        onChange={(e) => patch((p) => ({ ...p, theme: { ...p.theme, [key]: e.target.value } }))}
                      />
                    </div>
                  </div>
                ))}
                <div className="rounded-lg bg-gray-50 p-4">
                  <p className="text-sm text-gray-600">Preview:</p>
                  <div className="mt-3 flex gap-3">
                    <div className="h-12 flex-1 rounded-lg" style={{ backgroundColor: draft.theme.primary }} />
                    <div className="h-12 flex-1 rounded-lg" style={{ backgroundColor: draft.theme.secondary }} />
                    <div className="h-12 flex-1 rounded-lg" style={{ backgroundColor: draft.theme.accent || "#FACC15" }} />
                    <div className="h-12 flex-1 rounded-lg border" style={{ backgroundColor: draft.theme.background }} />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "messages" && (
              <div>
                <h2 className="mb-1 text-lg font-semibold">Contact Form Messages</h2>
                <p className="mb-4 text-xs text-gray-500">Every submission from the Contact page, saved straight to your database.</p>
                <SubmissionsList<ContactSubmissionItem>
                  endpoint="/api/contact"
                  emptyLabel="No messages yet."
                  renderItem={(item) => (
                    <div>
                      <p className="font-semibold text-gray-900">
                        {item.name} <span className="font-normal text-gray-400">— {item.email}</span>
                      </p>
                      {item.phone && <p className="text-xs text-gray-500">{item.phone}</p>}
                      {item.subject && <p className="mt-1 text-xs font-medium text-primary">{item.subject}</p>}
                      <p className="mt-1 whitespace-pre-wrap text-gray-600">{item.message}</p>
                    </div>
                  )}
                />
              </div>
            )}

            {activeTab === "newsletter" && (
              <div>
                <h2 className="mb-1 text-lg font-semibold">Newsletter Subscribers</h2>
                <p className="mb-4 text-xs text-gray-500">Everyone who signed up from the site — export or copy from here.</p>
                <SubmissionsList<NewsletterSubscriberItem>
                  endpoint="/api/newsletter"
                  emptyLabel="No subscribers yet."
                  readLabel="Mark reviewed"
                  renderItem={(item) => <p className="font-medium text-gray-900">{item.email}</p>}
                />
              </div>
            )}

            {activeTab === "applications" && (
              <div>
                <h2 className="mb-1 text-lg font-semibold">Job Application Fund Requests</h2>
                <p className="mb-4 text-xs text-gray-500">Submitted from the Special Offers page.</p>
                <SubmissionsList<FundApplicationItem>
                  endpoint="/api/fund-applications"
                  emptyLabel="No applications yet."
                  renderItem={(item) => (
                    <div>
                      <p className="font-semibold text-gray-900">
                        {item.fullName} <span className="font-normal text-gray-400">— {item.email}</span>
                      </p>
                      <p className="text-xs text-gray-500">
                        {item.phone} · {item.address}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        Position: {item.position} · Requested: {item.amount}
                        {item.employer ? ` · Employer: ${item.employer}` : ""}
                      </p>
                      <p className="mt-1 text-gray-600">{item.purpose}</p>
                    </div>
                  )}
                />
              </div>
            )}

            {!isSubmissionsTab && (
              <div className="mt-8 flex items-center justify-end gap-2 border-t border-gray-100 pt-6">
                {savedFlash && (
                  <span className="mr-auto flex items-center gap-1.5 text-sm font-medium text-green-600">
                    <CheckCircle2 className="h-4 w-4" /> Saved to database
                  </span>
                )}
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-60"
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  {saving ? "Saving…" : "Save Changes"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
