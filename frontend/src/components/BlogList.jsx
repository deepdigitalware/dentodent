import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useContent } from '@/contexts/ContentContext';

export default function BlogList({ onNavigate }) {
  const { content } = useContent();
  const canonicalUrl = (typeof window !== 'undefined') ? `${window.location.origin}/blog` : 'https://www.dentodent.in/blog';
  const posts = Array.isArray(content.blogPosts) ? content.blogPosts : [];

  return (
    <section className="py-16">
      <Helmet>
        <title>Dental Blog Kolkata | Tips, Costs, and Treatments</title>
        <meta name="description" content="Expert dental articles for Kolkata: painless RCT, implants, braces vs aligners, whitening, and clinic selection. Updated 2025." />
        <link rel="canonical" href={canonicalUrl} />
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-display font-bold mb-8">Dental Blog</h1>
        <div className="grid md:grid-cols-3 gap-8">
          {posts.map((p) => {
            const isRemote = typeof p.cover === 'string' && p.cover.startsWith('http');
            const coverUrl = isRemote ? `${p.cover}?w=600&h=360&fit=crop` : p.cover;
            return (
              <a
                key={p.slug}
                href={`/blog-${p.slug}`}
                onClick={(e) => {
                  if (onNavigate) {
                    e.preventDefault();
                    onNavigate(`blog-${p.slug}`);
                  }
                }}
                className="bg-white rounded-xl shadow p-4 block hover:shadow-lg transition-shadow"
              >
                <img src={coverUrl} alt={p.title} className="rounded-lg mb-4" />
                <h2 className="text-xl font-semibold">{p.title}</h2>
                <p className="text-gray-600 text-sm mt-2">{p.excerpt}</p>
                <span className="mt-3 inline-block text-blue-600 font-medium">Read Article →</span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
