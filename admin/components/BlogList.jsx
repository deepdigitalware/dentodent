import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useContent } from '../contexts/ContentContext';

export default function BlogList({ onNavigate }) {
  const { content } = useContent();
  const blogPosts = content.blogPosts || [];
  
  const canonicalUrl = (typeof window !== 'undefined') ? `${window.location.origin}/blog` : 'https://dentodentdentalclinic.com/blog';
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
          {blogPosts && blogPosts.length > 0 ? (
            blogPosts.map((p) => {
              // Auto resolve local cover by slug
              const localCovers = import.meta.glob('@/assets/blog/*.{jpg,jpeg,png,webp,avif,svg}', { eager: true, as: 'url' });
              const localMatch = Object.entries(localCovers).find(([path]) => {
                const file = path.split('/').pop() || '';
                return file.startsWith(p.slug);
              });
              const localCoverUrl = localMatch ? localMatch[1] : null;

              const isRemote = typeof p.cover === 'string' && p.cover.startsWith('http');
              const coverUrl = localCoverUrl ? localCoverUrl : (isRemote ? `${p.cover}?w=600&h=360&fit=crop` : p.cover);

              return (
              <article key={p.slug} className="bg-white rounded-xl shadow p-4">
                <img src={coverUrl} alt={p.title} className="rounded-lg mb-4" />
                <h2 className="text-xl font-semibold">{p.title}</h2>
                <p className="text-gray-600 text-sm mt-2">{p.excerpt}</p>
                <button className="mt-4 text-blue-600 hover:underline" onClick={() => onNavigate(`blog-${p.slug}`)}>
                  Read More
                </button>
              </article>
            )})
          ) : (
            <div className="col-span-3 text-center py-8">
              <p>No blog posts available</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}