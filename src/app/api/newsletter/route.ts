import { createSubmissionCollectionRoute } from "@/lib/submission-routes";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const { GET, POST } = createSubmissionCollectionRoute(
  "newsletter_subscribers",
  (body) => {
    const email = typeof body.email === "string" ? body.email.trim() : "";
    if (!EMAIL_RE.test(email)) return "Please enter a valid email address.";
    if (email.length > 200) return "Email is too long.";
    return null;
  },
  {
    adminSubject: (b) => `New newsletter subscriber: ${b.email}`,
    adminBody: (b) => `${b.email} just subscribed to the newsletter.`,
    confirmation: {
      subject: "You're subscribed",
      body: () => "Thanks for subscribing — you'll hear from us with updates on programs and community events.",
    },
  }
);
