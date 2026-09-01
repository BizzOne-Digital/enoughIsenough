import { createSubmissionCollectionRoute } from "@/lib/submission-routes";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const { GET, POST } = createSubmissionCollectionRoute(
  "fund_applications",
  (body) => {
    const required = ["fullName", "address", "phone", "email", "position", "amount", "purpose"];
    for (const key of required) {
      if (typeof body[key] !== "string" || !(body[key] as string).trim()) {
        return "Please fill in all required fields.";
      }
    }
    const email = (body.email as string).trim();
    if (!EMAIL_RE.test(email)) return "Please enter a valid email address.";
    return null;
  },
  {
    adminSubject: (b) => `New Job Application Fund request from ${b.fullName}`,
    adminBody: (b) =>
      [
        `Name: ${b.fullName}`,
        `Email: ${b.email}`,
        `Phone: ${b.phone}`,
        `Address: ${b.address}`,
        b.employer ? `Employer: ${b.employer}` : null,
        `Position applied for: ${b.position}`,
        `Requested amount: ${b.amount}`,
        "",
        `Purpose: ${b.purpose}`,
        "",
        "Open the Fund Applications tab in the admin panel for the full record.",
      ]
        .filter(Boolean)
        .join("\n"),
    confirmation: {
      subject: "We received your Job Application Fund request",
      body: (b) =>
        `Hi ${b.fullName},\n\nWe received your Job Application Fund request and our team will review it and follow up soon.\n\nRequested amount: ${b.amount}\nPurpose: ${b.purpose}\n`,
    },
  }
);
