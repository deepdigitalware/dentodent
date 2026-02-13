import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  AlertCircle, 
  Star,
  FileText
} from 'lucide-react';
import { Button } from '../ui/button';
import { useToast } from '../ui/use-toast';
import { useContent } from '../../contexts/ContentContext';

const ReviewsManagement = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    rating: 5,
    message: '',
    date: new Date().toISOString().split('T')[0]
  });
  const { toast } = useToast();
  const { content, updateContent } = useContent();

  // Load reviews from content context
  useEffect(() => {
    loadReviews();
  }, [content]);

  const loadReviews = () => {
    try {
      setLoading(true);
      const reviewsData = Array.isArray(content.reviews?.items) 
        ? content.reviews.items 
        : [];
      setReviews(reviewsData);
      setError('');
    } catch (err) {
      setError('Failed to load reviews');
      console.error('Reviews load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rating' ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const reviewsData = [...reviews];
      
      if (editingReview !== null) {
        // Update existing review
        reviewsData[editingReview] = {
          ...reviewsData[editingReview],
          ...formData
        };
      } else {
        // Add new review
        reviewsData.push({
          ...formData,
          date: formData.date || new Date().toISOString().split('T')[0]
        });
      }

      // Update content
      const updatedContent = {
        ...content.reviews,
        items: reviewsData,
        title: content.reviews?.title || 'Patient Reviews',
        subtitle: content.reviews?.subtitle || 'What our patients say about us'
      };

      await updateContent('reviews', updatedContent);
      
      toast({
        title: 'Success',
        description: editingReview !== null 
          ? 'Review updated successfully!' 
          : 'Review added successfully!'
      });
      
      resetForm();
      loadReviews();
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to save review',
        variant: 'destructive'
      });
      console.error('Review save error:', err);
    }
  };

  const handleEdit = (index) => {
    setEditingReview(index);
    setFormData(reviews[index]);
    setShowForm(true);
  };

  const handleDelete = async (index) => {
    try {
      const reviewsData = [...reviews];
      reviewsData.splice(index, 1);
      
      const updatedContent = {
        ...content.reviews,
        items: reviewsData
      };

      await updateContent('reviews', updatedContent);
      
      toast({
        title: 'Success',
        description: 'Review deleted successfully!'
      });
      
      loadReviews();
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to delete review',
        variant: 'destructive'
      });
      console.error('Review delete error:', err);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      rating: 5,
      message: '',
      date: new Date().toISOString().split('T')[0]
    });
    setEditingReview(null);
    setShowForm(false);
  };

  const Stars = ({ rating, interactive = false, onChange }) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-5 h-5 cursor-pointer ${
              i < rating 
                ? 'text-yellow-400 fill-current' 
                : 'text-gray-300'
            }`}
            onClick={() => interactive && onChange(i + 1)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reviews Management</h1>
          <p className="text-gray-600 mt-1">Manage patient testimonials and reviews</p>
        </div>
        <Button 
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Review</span>
        </Button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {editingReview !== null ? 'Edit Review' : 'Add New Review'}
            </h2>
            <button
              onClick={resetForm}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Patient Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter patient name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rating
              </label>
              <Stars 
                rating={formData.rating} 
                interactive={true} 
                onChange={(rating) => setFormData(prev => ({ ...prev, rating }))}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Review Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter review message"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex space-x-3 pt-4">
              <Button type="submit" className="flex items-center space-x-2">
                <Save className="w-4 h-4" />
                <span>{editingReview !== null ? 'Update Review' : 'Add Review'}</span>
              </Button>
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Existing Reviews</h2>
        </div>
        
        {loading ? (
          <div className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading reviews...</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="p-6 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No reviews</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by adding a new review.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reviews.map((review, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{review.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Stars rating={review.rating} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {review.message}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {review.date ? new Date(review.date).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(index)}
                          className="text-indigo-600 hover:text-indigo-900 p-1"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(index)}
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewsManagement;