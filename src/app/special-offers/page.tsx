"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import SiteLayout from "@/components/layout/SiteLayout";
import PageHero from "@/components/ui/PageHero";
import Button from "@/components/ui/Button";
import { useContent } from "@/lib/content-store";
import { Download, FileText, CheckCircle, Send, Printer, AlertCircle, Loader2 } from "lucide-react";

const formFields = [
  { key: "fullName", label: "Full Legal Name", required: true },
  { key: "address", label: "Current Address", required: true },
  { key: "phone", label: "Phone Number", required: true },
  { key: "email", label: "Email Address", required: true },
  { key: "employer", label: "Employer Name", required: false },
  { key: "position", label: "Position Applied For", required: true },
  { key: "amount", label: "Requested Amount", required: true },
  { key: "purpose", label: "Purpose of Funds", required: true },
];

const requiredFields = formFields.filter((f) => f.required);

export default function SpecialOffersPage() {
  const { content } = useContent();
  const { specialOffers, contact } = content;
  const [form, setForm] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleChange(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit() {
    const missing = requiredFields.filter((f) => !form[f.key]?.trim());
    if (missing.length > 0) {
      setError(`Please fill in: ${missing.map((f) => f.label).join(", ")}.`);
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/fund-applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.error || "Something went wrong. Please try again.");
        return;
      }
      setSubmitted(true);
    } catch {
      setError("Couldn't reach the server. Check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function handleDownload() {
    const text = formFields
      .map((f) => `${f.label}: ${form[f.key] || "________________"}`)
      .join("\n\n");
    const blob = new Blob(
      [`ENOUGH IS ENOUGH FOUNDATION\nJOB APPLICATION FUND FORM\n\n${text}\n\nContact: ${contact.phone}`],
      { type: "text/plain" }
    );
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "Job-Application-Fund-Form.txt";
    a.click();
  }

  function handlePrint() {
    window.print();
  }

  const inputClass =
    "w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm transition-all focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20";

  return (
    <SiteLayout>
      <PageHero title={specialOffers.title} subtitle={specialOffers.subtitle} badge="Resources" />

      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-xl shadow-primary/5"
          >
            <div className="bg-gradient-to-r from-primary to-primary/90 px-8 py-6 text-white sm:px-10">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
                  <FileText className="h-7 w-7" />
                </div>
                <div>
                  <h2 className="font-display text-xl font-bold sm:text-2xl">{specialOffers.formTitle}</h2>
                  <p className="text-sm text-white/70">Fillable Online Form</p>
                </div>
              </div>
            </div>

            <div className="p-8 sm:p-10">
              <p className="leading-relaxed text-gray-600">{specialOffers.formDescription}</p>

              <div className="mt-8 grid gap-5 sm:grid-cols-2">
                {formFields.map((field) => (
                  <div key={field.key} className={field.key === "purpose" ? "sm:col-span-2" : ""}>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      {field.label} {field.required && <span className="text-secondary">*</span>}
                    </label>
                    {field.key === "purpose" ? (
                      <textarea
                        rows={3}
                        value={form[field.key] || ""}
                        onChange={(e) => handleChange(field.key, e.target.value)}
                        className={inputClass}
                      />
                    ) : (
                      <input
                        type={field.key === "email" ? "email" : field.key === "phone" ? "tel" : "text"}
                        value={form[field.key] || ""}
                        onChange={(e) => handleChange(field.key, e.target.value)}
                        className={inputClass}
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-6 grid gap-2 rounded-xl bg-surface p-4 sm:grid-cols-2">
                {requiredFields.map((f) => (
                  <div key={f.key} className="flex items-center gap-2 text-xs text-gray-500">
                    <CheckCircle className={`h-3.5 w-3.5 shrink-0 ${form[f.key]?.trim() ? "text-green-500" : "text-gray-300"}`} />
                    {f.label} {form[f.key]?.trim() ? "— completed" : "— pending"}
                  </div>
                ))}
              </div>

              {submitted ? (
                <div className="mt-8 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-green-700">
                  <CheckCircle className="h-5 w-5 shrink-0" />
                  <p className="text-sm">
                    Application submitted — our team will review it and follow up at the email or phone number you provided.
                  </p>
                </div>
              ) : (
                <>
                  {error && (
                    <p className="mt-6 flex items-center gap-1.5 text-sm text-red-500">
                      <AlertCircle className="h-4 w-4 shrink-0" /> {error}
                    </p>
                  )}
                  <div className="mt-8 flex flex-wrap gap-3">
                    <Button onClick={handleSubmit} size="lg" disabled={submitting}>
                      {submitting ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="mr-2 h-4 w-4" />
                      )}
                      {submitting ? "Submitting…" : "Submit Application"}
                    </Button>
                    <Button onClick={handleDownload} variant="outline" size="lg">
                      <Download className="mr-2 h-4 w-4" />
                      Download a Copy
                    </Button>
                    <Button onClick={handlePrint} variant="ghost" size="lg">
                      <Printer className="mr-2 h-4 w-4" />
                      Print
                    </Button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </SiteLayout>
  );
}
