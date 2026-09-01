import { createSubmissionCollectionRoute } from "@/lib/submission-routes";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const { GET, POST } = createSubmissionCollectionRoute(
  "contact_submissions",
  (body) => {
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const message = typeof body.message === "string" ? body.message.trim() : "";
    if (!name) return "Please enter your name.";
    if (!EMAIL_RE.test(email)) return "Please enter a valid email address.";
    if (!message) return "Please enter a message.";
    if (name.length > 200 || email.length > 200 || message.length > 5000) return "One of the fields is too long.";
    return null;
  },
  {
    adminSubject: (b) => `New contact message from ${b.name}`,
    adminBody: (b) =>
      [
        `Name: ${b.name}`,
        `Email: ${b.email}`,
        b.phone ? `Phone: ${b.phone}` : null,
        b.subject ? `Subject: ${b.subject}` : null,
        "",
        String(b.message),
        "",
        "Reply directly to this email to respond, or open the Messages tab in the admin panel.",
      ]
        .filter(Boolean)
        .join("\n"),
    confirmation: {
      subject: "We received your message",
      body: (b) =>
        `Hi ${b.name},\n\nThanks for reaching out — we received your message and will get back to you soon.\n\nYour message:\n${b.message}\n`,
    },
  }
);
