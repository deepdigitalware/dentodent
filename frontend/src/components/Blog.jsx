import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, Clock, Search, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useContent } from '@/contexts/ContentContext';

const Blog = () => {
  const { content } = useContent();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  // Use API data when available, otherwise fall back to initial seeded posts
  const blogPostsData = (() => {
    if (Array.isArray(content.blogPosts) && content.blogPosts.length > 0) {
      return content.blogPosts;
    }
    return [
      {
        id: 1,
        slug: 'painless-root-canal-kolkata',
        title: 'Painless Root Canal Treatment in Kolkata: Step-by-Step Guide',
        category: 'root-canal',
        date: '2024-01-10',
        excerpt: 'Learn how modern rotary instruments, digital X-rays, and proper anaesthesia make root canal treatment almost painless at Dent \'O\' Dent.',
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

  // Build categories dynamically from available posts
  const categories = [
    { id: 'all', label: 'All Articles', count: blogPostsData.length },
    ...Array.from(new Set(blogPostsData.map(post => post && post.category))).filter(Boolean).map(category => ({
      id: category,
      label: category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
      count: blogPostsData.filter(post => post && post.category === category).length
    }))
  ];

  const filteredPosts = blogPostsData.filter(post => {
    // Ensure post exists
    if (!post) return false;
    
    const matchesSearch = (post.title && post.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (post.excerpt && post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (post.tags && Array.isArray(post.tags) && post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
    const matchesCategory = activeCategory === 'all' || (post.category && post.category === activeCategory);
    return matchesSearch && matchesCategory;
  });

  const featuredPosts = blogPostsData.filter(post => post && post.featured);
  const regularPosts = filteredPosts.filter(post => post && !post.featured);

  // Removed mock actions (like, read more, share) for production readiness

  return (
    <section id="blog" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-display font-bold mb-6">
            {content.blog && content.blog.title ? content.blog.title : 'Dental Blog'}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {content.blog && content.blog.subtitle ? content.blog.subtitle : 'Stay informed about the latest in dental health, treatments, and oral care tips.'}
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row justify-between items-center mb-12 space-y-4 md:space-y-0"
        >
          {/* Search Bar */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeCategory === category.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                }`}
              >
                {category.label} ({category.count})
              </button>
            ))}
          </div>
        </motion.div>

        {/* Featured Articles */}
        {activeCategory === 'all' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-8">Featured Articles</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredPosts && featuredPosts.length > 0 ? (
                featuredPosts.map((post, index) => (
                  post ? (
                    <a href={`/blog-${post.slug}`} key={post.id} className="block">
                      <motion.article
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden card-3d group"
                      >
                        <div className="relative">
                          <img
                            src={post.cover}
                            alt={post.title}
                            className="w-full h-48 object-cover"
                            loading="lazy"
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1629909613638-0e4a1fad8f81?w=800';
                            }}
                          />
                          <div className="absolute top-4 left-4">
                            <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                              Featured
                            </span>
                          </div>
                        </div>
                        <div className="p-6">
                          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>{post.date ? new Date(post.date).toLocaleDateString() : 'Unknown date'}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>{post.readTime || 'Unknown'}</span>
                            </div>
                          </div>
                          <h4 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors">
                            {post.title}
                          </h4>
                          <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {post.tags && Array.isArray(post.tags) && post.tags.slice(0, 2).map((tag, tagIndex) => (
                              <span
                                key={tagIndex}
                                className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                              <User className="w-4 h-4" />
                              <span>{post.author || 'Unknown author'}</span>
                            </div>
                          </div>
                        </div>
                      </motion.article>
                    </a>
                  ) : null
                ))
              ) : (
                <div className="col-span-3 text-center py-8">
                  <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-800 mb-2">No featured articles</h3>
                  <p className="text-gray-600">No featured articles available at this time.</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Regular Articles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-8">
            {activeCategory === 'all' ? 'All Articles' : categories.find(cat => cat.id === activeCategory)?.label}
          </h3>
          
          {regularPosts && regularPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularPosts.map((post, index) => (
                post ? (
                  <a href={`/blog-${post.slug}`} key={post.id} className="block">
                    <motion.article
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden card-3d group"
                    >
                      <div className="relative">
                        <img
                          src={post.cover}
                          alt={post.title}
                          className="w-full h-48 object-cover"
                          loading="lazy"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1629909613638-0e4a1fad8f81?w=800';
                          }}
                        />
                      </div>
                      <div className="p-6">
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{post.date ? new Date(post.date).toLocaleDateString() : 'Unknown date'}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{post.readTime || 'Unknown'}</span>
                          </div>
                        </div>
                        <h4 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors">
                          {post.title}
                        </h4>
                        <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.tags && Array.isArray(post.tags) && post.tags.slice(0, 2).map((tag, tagIndex) => (
                            <span
                              key={tagIndex}
                              className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.article>
                  </a>
                ) : null
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-800 mb-2">No articles found</h3>
              <p className="text-gray-600">
                {searchTerm 
                  ? 'Try adjusting your search terms.' 
                  : 'No articles available in this category yet.'
                }
              </p>
            </div>
          )}
        </motion.div>

        {/* Newsletter Signup */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-3xl p-8 md:p-12 text-white text-center mt-16"
        >
          <h3 className="text-2xl md:text-3xl font-bold mb-4">Stay Updated with Dental Health Tips</h3>
          <p className="text-lg md:text-xl mb-6 opacity-90">
            Subscribe to our newsletter for the latest dental health insights,
            <br />
            treatment updates, and oral care tips delivered to your inbox.
          </p>
          
          <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-3 sm:items-stretch">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-4 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <Button className="bg-white text-blue-600 hover:bg-gray-100 px-6 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl h-full sm:h-auto sm:px-6 sm:py-3">
              Subscribe
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Blog;
