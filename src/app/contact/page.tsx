"use client";

import { motion } from "framer-motion";
import SiteLayout from "@/components/layout/SiteLayout";
import PageHero from "@/components/ui/PageHero";
import ContactForm from "@/components/ui/ContactForm";
import FAQAccordion from "@/components/ui/FAQAccordion";
import { useContent } from "@/lib/content-store";
import { Phone, Mail, Clock, MapPin, MessageCircle } from "lucide-react";

export default function ContactPage() {
  const { content } = useContent();
  const { contact } = content;

  const infoItems = [
    { icon: Phone, label: "Phone", value: contact.phone, href: `tel:${contact.phone.replace(/\D/g, "")}`, color: "from-blue-500 to-primary" },
    { icon: Mail, label: "Email", value: contact.email, href: `mailto:${contact.email}`, color: "from-secondary to-pink-600" },
    { icon: Clock, label: "Hours", value: contact.hours, color: "from-emerald-500 to-teal-600" },
    { icon: MapPin, label: "Location", value: contact.address || "Serving communities nationwide", color: "from-violet-500 to-purple-600" },
  ];

  return (
    <SiteLayout>
      <PageHero
        title="Contact Us"
        subtitle="We're here to lift you up. Reach out today and take the first step toward your destiny."
        badge="Get In Touch"
        dark
      />

      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {infoItems.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 card-lift"
              >
                <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${item.color} text-white shadow-lg`}>
                  <item.icon className="h-6 w-6" />
                </div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">{item.label}</p>
                {item.href ? (
                  <a href={item.href} className="mt-1 block font-semibold text-gray-900 transition-colors group-hover:text-primary">
                    {item.value}
                  </a>
                ) : (
                  <p className="mt-1 font-semibold text-gray-900">{item.value}</p>
                )}
              </motion.div>
            ))}
          </div>

          <div className="mt-16 grid gap-12 lg:grid-cols-5">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-2"
            >
              <div className="sticky top-28 space-y-6">
                <div className="flex items-center gap-3">
                  <MessageCircle className="h-8 w-8 text-primary" />
                  <h2 className="font-display text-2xl font-bold text-gray-900">Send Us a Message</h2>
                </div>
                <p className="text-gray-600">
                  Have questions about our programs or need support? Fill out the form and our team
                  will respond promptly during business hours.
                </p>
                <div className="rounded-2xl bg-gradient-to-br from-primary to-primary/90 p-6 text-white">
                  <p className="font-display text-lg font-bold">Need immediate help?</p>
                  <p className="mt-2 text-sm text-white/80">Call us directly during business hours.</p>
                  <a
                    href={`tel:${contact.phone.replace(/\D/g, "")}`}
                    className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-secondary hover:text-white"
                  >
                    <Phone className="h-4 w-4" />
                    {contact.phone}
                  </a>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-3 rounded-3xl border border-gray-100 bg-white p-8 shadow-xl shadow-primary/5 sm:p-10"
            >
              <ContactForm />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="bg-surface py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-center font-display text-2xl font-bold text-gray-900">
            Common Questions
          </h2>
          <FAQAccordion faqs={content.faqs.slice(0, 3)} />
        </div>
      </section>
    </SiteLayout>
  );
}
