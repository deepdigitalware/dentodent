import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useContent } from '@/contexts/ContentContext';

export default function BlogPost({ slug }) {
  const { content } = useContent();
  const posts = Array.isArray(content.blogPosts) ? content.blogPosts : [];
  const post = posts.find((p) => p.slug === slug);
  if (!post) {
    return (
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-2xl font-semibold">Post not found</h1>
          <p className="text-gray-600">The blog article you’re looking for does not exist.</p>
        </div>
      </section>
    );
  }

  const canonicalUrl = (typeof window !== 'undefined')
    ? `${window.location.origin}/blog-${post.slug}`
    : `https://dentodentdentalclinic.com/blog-${post.slug}`;

  const isRemote = typeof post.cover === 'string' && post.cover.startsWith('http');
  const coverMain = isRemote ? `${post.cover}?w=1200&h=630&fit=crop` : post.cover;

  return (
    <article className="py-16">
      <Helmet>
        <title>{post.title} | Dent 'O' Dent Blog</title>
        <meta name="description" content={post.excerpt} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={`${post.title} | Dent 'O' Dent Blog`} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={isRemote ? `${post.cover}?w=1200&h=630&fit=crop` : post.cover} />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: post.title,
          image: post.cover,
          datePublished: post.date,
          author: { '@type': 'Person', name: 'Dr. Setketu Chakraborty' },
          publisher: {
            '@type': 'Organization',
            name: "Dent 'O' Dent",
            logo: { '@type': 'ImageObject', url: 'https://dentodentdentalclinic.com/logo.png' }
          },
          mainEntityOfPage: canonicalUrl,
          keywords: post.keywords,
        })}</script>
      </Helmet>

      <div className="max-w-3xl mx-auto px-4">
        {post.cover && (
          <img src={coverMain} alt={post.title} className="rounded-xl mb-6" />
        )}
        <h1 className="text-4xl font-display font-bold mb-4">{post.title}</h1>
        <p className="text-sm text-gray-500">{post.category} • {new Date(post.date).toLocaleDateString()}</p>
        <div className="prose prose-blue max-w-none mt-6">
          <p>{post.content}</p>
        </div>
      </div>
    </article>
  );
}
