import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useContent } from '@/contexts/ContentContext';

export default function BlogList({ onNavigate }) {
  const { content } = useContent();
  const canonicalUrl = (typeof window !== 'undefined') ? `${window.location.origin}/blog` : 'https://www.dentodent.in/blog';
  const posts = (() => {
    const apiPosts = Array.isArray(content.blogPosts) ? content.blogPosts : [];
    if (apiPosts && apiPosts.length > 0) return apiPosts;
    return [
      {
        id: 1,
        slug: 'painless-root-canal-kolkata',
        title: 'Painless Root Canal Treatment in Kolkata: Step-by-Step Guide',
        category: 'root-canal',
        date: '2024-01-10',
        excerpt: "Learn how modern rotary instruments, digital X-rays, and proper anaesthesia make root canal treatment almost painless at Dent 'O' Dent.",
        readTime: '6 min read',
        author: 'Dr. Setketu Chakraborty',
        tags: ['Root Canal', 'Pain Free', 'Kolkata'],
        cover: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=1200&auto=format&fit=crop',
        featured: true
      },
      {
        id: 2,
        slug: 'braces-vs-aligners-kolkata',
        title: 'Braces vs Clear Aligners: Which is Better for You?',
        category: 'orthodontics',
        date: '2024-02-02',
        excerpt: 'Compare treatment time, comfort, cost and appearance of traditional metal braces vs. clear aligners for teens and adults.',
        readTime: '7 min read',
        author: 'Dr. Setketu Chakraborty',
        tags: ['Braces', 'Aligners', 'Smile Makeover'],
        cover: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=1200&auto=format&fit=crop',
        featured: true
      },
      {
        id: 3,
        slug: 'teeth-whitening-tips-at-home-and-clinic',
        title: 'Teeth Whitening in Kolkata: Home vs. Clinic Treatments',
        category: 'teeth-whitening',
        date: '2024-02-20',
        excerpt: 'Understand the difference between over-the-counter whitening kits and professional in‑clinic teeth whitening.',
        readTime: '5 min read',
        author: 'Dr. Setketu Chakraborty',
        tags: ['Whitening', 'Cosmetic Dentistry'],
        cover: 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=1200&auto=format&fit=crop',
        featured: false
      }
    ];
  })();

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
                href={`/blog/${p.slug}`}
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
