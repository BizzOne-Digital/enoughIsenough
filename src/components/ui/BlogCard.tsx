"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Calendar, User, ArrowUpRight } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { BlogPost } from "@/types/content";

interface BlogCardProps {
  post: BlogPost;
  index: number;
}

export default function BlogCard({ post, index }: BlogCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
      className="group relative overflow-hidden rounded-2xl bg-white ring-1 ring-gray-100 card-lift"
    >
      <Link href={`/blog/${post.id}`} className="block">
        <div className="relative aspect-[16/10] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.image}
            alt={post.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent" />
          <span className="absolute left-4 top-4 rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-white shadow-lg">
            {post.category}
          </span>
          <div className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white opacity-0 backdrop-blur-md transition-all group-hover:opacity-100">
            <ArrowUpRight className="h-5 w-5" />
          </div>
        </div>
        <div className="p-6">
          <div className="mb-3 flex items-center gap-4 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {formatDate(post.date)}
            </span>
            <span className="flex items-center gap-1">
              <User className="h-3.5 w-3.5" />
              {post.author}
            </span>
            {post.readTime && <span>{post.readTime}</span>}
          </div>
          <h3 className="font-display text-lg font-bold text-gray-900 transition-colors group-hover:text-primary">
            {post.title}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-gray-500">{post.excerpt}</p>
        </div>
      </Link>
    </motion.article>
  );
}
