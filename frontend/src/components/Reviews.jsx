import React from 'react';
import { motion } from 'framer-motion';
import { useContent } from '@/contexts/ContentContext';

const Stars = ({ rating = 0 }) => {
  const r = Math.max(0, Math.min(5, Math.round(rating)));
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <span key={i} className={i < r ? 'text-yellow-400' : 'text-gray-300'}>★</span>
      ))}
    </div>
  );
};

const Reviews = () => {
  const { content } = useContent();
  
  // Use normalized reviews array from API/content context
  const reviewsData = (() => {
    if (Array.isArray(content.reviews?.items) && content.reviews.items.length > 0) {
      return content.reviews.items;
    }
    if (Array.isArray(content.reviews) && content.reviews.length > 0) {
      return content.reviews;
    }
    // Fallback to initial defaults if API has no reviews
    const defaults = [
      {
        name: 'Priya Sharma',
        rating: 5,
        message: 'Very professional and friendly staff. My root canal was completely painless and the doctor explained every step clearly.',
        date: '2024-01-15'
      },
      {
        name: 'Rahul Verma',
        rating: 5,
        message: 'Clean clinic, modern equipment and excellent treatment. I am very happy with my smile makeover.',
        date: '2024-02-03'
      },
      {
        name: 'Ananya Gupta',
        rating: 4,
        message: 'Got my teeth cleaning and fillings done. The team was patient and made sure I was comfortable throughout.',
        date: '2024-02-20'
      }
    ];
    return defaults;
  })();

  return (
    <section id="reviews" className="py-20 bg-gradient-to-br from-blue-50 to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          {content.reviews?.title && (
            <h2 className="text-4xl lg:text-5xl font-display font-bold mb-4">
              {content.reviews.title}
            </h2>
          )}
          {content.reviews?.subtitle && (
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              {content.reviews.subtitle}
            </p>
          )}
        </motion.div>

        {reviewsData.length === 0 ? (
          <p className="text-center text-gray-500">No reviews available yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviewsData.map((review, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 card-3d"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">{review.name}</h3>
                <Stars rating={review.rating} />
              </div>
              <p className="text-gray-700 mb-4">{review.message || review.comment}</p>
              {review.date && (
                <p className="text-xs text-gray-500">
                  {new Date(review.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              )}
            </motion.div>
          ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Reviews;
