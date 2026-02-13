import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, Clock, ArrowRight, Search, Tag, BookOpen, Heart, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useContent } from '../contexts/ContentContext';

const Blog = () => {
  const { content } = useContent();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  // Use blog posts from the content context instead of hardcoded data
  const blogPosts = content.blogPosts || [];

  const categories = [
    { id: 'all', label: 'All Articles', count: blogPosts.length },
    { id: 'oral-health', label: 'Oral Health', count: blogPosts.filter(post => post && post.category === 'oral-health').length },
    { id: 'treatments', label: 'Treatments', count: blogPosts.filter(post => post && post.category === 'treatments').length },
    { id: 'prevention', label: 'Prevention', count: blogPosts.filter(post => post && post.category === 'prevention').length },
    { id: 'cosmetic', label: 'Cosmetic', count: blogPosts.filter(post => post && post.category === 'cosmetic').length }
  ];

  const filteredPosts = blogPosts.filter(post => {
    // Ensure post has required properties
    if (!post) return false;
    
    const matchesSearch = (post.title && post.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (post.excerpt && post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (post.tags && Array.isArray(post.tags) && post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
    const matchesCategory = activeCategory === 'all' || (post.category && post.category === activeCategory);
    return matchesSearch && matchesCategory;
  });

  const featuredPosts = blogPosts.filter(post => post && post.featured);
  const regularPosts = filteredPosts.filter(post => post && !post.featured);

  const handleReadMore = (post) => {
    toast({
      title: "📖 Article",
      description: `Opening "${post.title}" - This feature will be implemented soon!`
    });
  };

  const handleLike = (postId) => {
    toast({
      title: "❤️ Liked",
      description: "Thank you for your appreciation!"
    });
  };

  const handleShare = (post) => {
    toast({
      title: "🔗 Share",
      description: "Share link copied to clipboard!"
    });
  };

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
            Dental <span className="gradient-text">Blog</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stay informed about the latest in dental health, treatments, and oral care tips. 
            Our expert articles help you maintain a healthy smile and make informed decisions 
            about your dental care.
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
                    <motion.article
                      key={post.slug || post.id || index}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden card-3d group"
                    >
                      <div className="relative">
                        <img
                          src={post.image || post.cover}
                          alt={post.title}
                          className="w-full h-48 object-cover"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1629909613638-0e4a1fad8f81?w=800';
                          }}
                        />
                        <div className="absolute top-4 left-4">
                          <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                            Featured
                          </span>
                        </div>
                        <div className="absolute top-4 right-4">
                          <button
                            onClick={() => handleLike(post.id)}
                            className="bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"
                          >
                            <Heart className={`w-4 h-4 ${post.likes > 40 ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
                          </button>
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
                          <Button
                            onClick={() => handleReadMore(post)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300"
                          >
                            Read More
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </div>
                      </div>
                    </motion.article>
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
                  <motion.article
                    key={post.slug || post.id || index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden card-3d group"
                  >
                    <div className="relative">
                      <img
                        src={post.image || post.cover}
                        alt={post.title}
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1629909613638-0e4a1fad8f81?w=800';
                        }}
                      />
                      <div className="absolute top-4 right-4">
                        <button
                          onClick={() => handleLike(post.id)}
                          className="bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"
                        >
                          <Heart className={`w-4 h-4 ${post.likes > 40 ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
                        </button>
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
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Heart className="w-4 h-4" />
                            <span>{post.likes || 0}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <BookOpen className="w-4 h-4" />
                            <span>{post.views || 0}</span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            onClick={() => handleShare(post)}
                            variant="outline"
                            size="sm"
                            className="text-gray-600 hover:text-blue-600"
                          >
                            <Share2 className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={() => handleReadMore(post)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300"
                          >
                            Read More
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.article>
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
          className="mt-16 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-3xl p-8 text-white text-center"
        >
          <h3 className="text-3xl font-bold mb-4">Stay Updated with Dental Health Tips</h3>
          <p className="text-xl mb-6 opacity-90">
            Subscribe to our newsletter for the latest dental health insights, 
            treatment updates, and oral care tips delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-4 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <Button className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold transition-all duration-300">
              Subscribe
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Blog;