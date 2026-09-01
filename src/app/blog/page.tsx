"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import SiteLayout from "@/components/layout/SiteLayout";
import PageHero from "@/components/ui/PageHero";
import BlogCard from "@/components/ui/BlogCard";
import { useContent } from "@/lib/content-store";
import { cn } from "@/lib/utils";
import { Search, TrendingUp } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function BlogPage() {
  const { content } = useContent();
  const { blog } = content;
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  const categories = ["All", ...Array.from(new Set(blog.posts.map((p) => p.category)))];
  const featured = blog.posts.find((p) => p.featured) || blog.posts[0];

  const filtered = useMemo(() => {
    return blog.posts.filter((p) => {
      const matchCat = activeCategory === "All" || p.category === activeCategory;
      const matchSearch =
        !search ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.excerpt.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch && p.id !== featured?.id;
    });
  }, [blog.posts, activeCategory, search, featured]);

  return (
    <SiteLayout>
      <PageHero title={blog.title} subtitle={blog.subtitle} badge="News & Insights" dark />

      {featured && (
        <section className="py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="group relative overflow-hidden rounded-3xl bg-gray-900 shadow-2xl"
            >
              <div className="grid lg:grid-cols-2">
                <div className="relative aspect-[16/10] overflow-hidden lg:aspect-auto">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={featured.image}
                    alt={featured.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-gray-900/80 lg:block hidden" />
                </div>
                <div className="flex flex-col justify-center p-8 lg:p-12">
                  <span className="mb-3 inline-flex w-fit items-center gap-1.5 rounded-full bg-secondary/20 px-3 py-1 text-xs font-semibold text-secondary">
                    <TrendingUp className="h-3.5 w-3.5" />
                    Featured Article
                  </span>
                  <h2 className="font-display text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
                    {featured.title}
                  </h2>
                  <p className="mt-4 text-white/70">{featured.excerpt}</p>
                  <div className="mt-4 flex items-center gap-4 text-sm text-white/50">
                    <span>{formatDate(featured.date)}</span>
                    <span>•</span>
                    <span>{featured.author}</span>
                    {featured.readTime && (
                      <>
                        <span>•</span>
                        <span>{featured.readTime}</span>
                      </>
                    )}
                  </div>
                  <Link
                    href={`/blog/${featured.id}`}
                    className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-gray-900 transition-all hover:bg-secondary hover:text-white"
                  >
                    Read Full Article →
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      <section className="pb-20 lg:pb-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-medium transition-all",
                    activeCategory === cat
                      ? "bg-primary text-white shadow-md"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                placeholder="Search articles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-full border border-gray-200 py-2.5 pl-11 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 sm:w-72"
              />
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((post, i) => (
              <div key={post.id} id={post.id}>
                <BlogCard post={post} index={i} />
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="py-12 text-center text-gray-500">No articles match your search.</p>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
