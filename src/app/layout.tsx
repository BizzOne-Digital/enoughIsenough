import type { Metadata } from "next";
import { Cormorant_Garamond, Crimson_Pro, Source_Sans_3 } from "next/font/google";
import "./globals.css";
import { ContentProvider } from "@/lib/content-store";
import { getSiteContent } from "@/lib/content-service";
import { isAdminSession } from "@/lib/admin-auth";
import { isDbConfigured } from "@/lib/mongodb";
import { isEmailConfigured } from "@/lib/email";

const sourceSans = Source_Sans_3({
  variable: "--font-ui",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const crimsonPro = Crimson_Pro({
  variable: "--font-content-family",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: {
    default: "Enough Is Enough Foundation",
    template: "%s | Enough Is Enough Foundation",
  },
  description:
    "Empowering individuals through faith-based life coaching, mentorship, and transformative community programs. Lift you up and walk into your destiny.",
  keywords: [
    "life coaching",
    "faith-based",
    "community support",
    "Enough Is Enough Foundation",
    "Sharon Bedford",
    "Men Of Hope",
    "Women Of Destiny",
  ],
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Fetched on the server so the very first paint already has real
  // content and the correct admin state — no client-side loading gate,
  // no flash, no header/hero pop-in.
  const [initialContent, initialIsAdmin] = await Promise.all([getSiteContent(), isAdminSession()]);

  return (
    <html
      lang="en"
      className={`${crimsonPro.variable} ${sourceSans.variable} ${cormorant.variable} h-full antialiased`}
      style={
        {
          "--primary": initialContent.theme.primary,
          "--secondary": initialContent.theme.secondary,
          "--background": initialContent.theme.background,
        } as React.CSSProperties
      }
    >
      <body className="min-h-full flex flex-col bg-background font-content text-foreground">
        <ContentProvider
          initialContent={initialContent}
          initialIsAdmin={initialIsAdmin}
          initialDbConfigured={isDbConfigured()}
          initialEmailConfigured={isEmailConfigured()}
        >
          {children}
        </ContentProvider>
      </body>
    </html>
  );
}
