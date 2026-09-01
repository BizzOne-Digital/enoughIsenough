"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail } from "lucide-react";
import type { BoardMember } from "@/types/content";

interface BoardMemberCardProps {
  member: BoardMember;
  index: number;
}

export default function BoardMemberCard({ member, index }: BoardMemberCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.08 }}
        whileHover={{ y: -8 }}
        onClick={() => setExpanded(true)}
        className="group cursor-pointer overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 transition-shadow hover:shadow-xl hover:ring-primary/20 card-lift"
      >
        <div className="relative aspect-[3/4] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={member.image}
            alt={member.name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-5">
            <h3 className="font-display text-lg font-bold text-white">{member.name}</h3>
            <p className="text-sm font-medium text-secondary">{member.title}</p>
          </div>
          <div className="absolute inset-0 flex items-center justify-center bg-primary/0 opacity-0 transition-all group-hover:bg-primary/20 group-hover:opacity-100">
            <span className="rounded-full bg-white/90 px-4 py-2 text-xs font-semibold text-primary">
              View Profile
            </span>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4"
            onClick={() => setExpanded(false)}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative flex max-h-[85vh] w-full max-w-md flex-col overflow-hidden rounded-3xl bg-white shadow-2xl"
            >
              <div className="relative h-48 shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={member.image} alt={member.name} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <button
                  type="button"
                  onClick={() => setExpanded(false)}
                  className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="overflow-y-auto p-6">
                <h3 className="font-display text-2xl font-bold text-gray-900">{member.name}</h3>
                <p className="text-sm font-semibold text-secondary">{member.title}</p>
                {member.bio && (
                  <div className="mt-4 space-y-3 leading-relaxed text-gray-600">
                    {member.bio.split(/\n{2,}/).map((paragraph, i) => (
                      <p key={i}>{paragraph}</p>
                    ))}
                  </div>
                )}
                {member.email && (
                  <a
                    href={`mailto:${member.email}`}
                    className="mt-4 inline-flex items-center gap-2 text-sm text-primary hover:underline"
                  >
                    <Mail className="h-4 w-4" /> {member.email}
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
