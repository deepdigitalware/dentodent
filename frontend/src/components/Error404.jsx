import React from 'react';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Search, HelpCircle, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const Error404 = () => {
  const handleGoHome = () => {
    window.location.href = '/';
  };

  const handleGoBack = () => {
    window.history.back();
  };

  const handleContactSupport = () => {
    toast({
      title: "📞 Contact Support",
      description: "Our support team will help you find what you're looking for!"
    });
  };

  const handleSearch = () => {
    toast({
      title: "🔍 Search",
      description: "Opening our search feature..."
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center">
        {/* 404 Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
          className="mb-8"
        >
          <div className="relative">
            {/* Large 404 Text */}
            <h1 className="text-9xl lg:text-[12rem] font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600 leading-none">
              404
            </h1>
            
            {/* Floating Elements */}
            <motion.div
              animate={{ 
                y: [0, -20, 0],
                rotate: [0, 5, 0]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute top-10 left-10 w-16 h-16 bg-blue-200 rounded-full opacity-60"
            />
            <motion.div
              animate={{ 
                y: [0, 15, 0],
                rotate: [0, -5, 0]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
              className="absolute top-20 right-20 w-12 h-12 bg-cyan-200 rounded-full opacity-60"
            />
            <motion.div
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 3, 0]
              }}
              transition={{ 
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5
              }}
              className="absolute bottom-10 left-20 w-8 h-8 bg-purple-200 rounded-full opacity-60"
            />
            <motion.div
              animate={{ 
                y: [0, 12, 0],
                rotate: [0, -3, 0]
              }}
              transition={{ 
                duration: 3.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1.5
              }}
              className="absolute bottom-20 right-10 w-10 h-10 bg-pink-200 rounded-full opacity-60"
            />
          </div>
        </motion.div>

        {/* Error Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="text-4xl lg:text-5xl font-display font-bold text-gray-800 mb-4">
            Oops! Page Not Found
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            The page you're looking for seems to have vanished into the digital void. 
            Don't worry, even the best dental websites sometimes have missing pages!
          </p>
        </motion.div>

        {/* Dental-themed Illustration */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mb-12"
        >
          <div className="relative inline-block">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, 0]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="text-6xl"
              >
                🦷
              </motion.div>
            </div>
            <motion.div
              animate={{ 
                opacity: [0.5, 1, 0.5]
              }}
              transition={{ 
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-white text-sm font-bold"
            >
              ?
            </motion.div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
        >
          <Button
            onClick={handleGoHome}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-8 py-3 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Home className="w-5 h-5 mr-2" />
            Go Home
          </Button>
          
          <Button
            onClick={handleGoBack}
            variant="outline"
            className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-3 rounded-full font-semibold text-lg transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Go Back
          </Button>
        </motion.div>

        {/* Helpful Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="bg-white rounded-2xl shadow-lg p-8 mb-8"
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Let's Get You Back on Track</h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-800 mb-2">Search Our Site</h4>
              <p className="text-gray-600 text-sm mb-4">Find what you're looking for using our search feature</p>
              <Button
                onClick={handleSearch}
                variant="outline"
                className="border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                Search Now
              </Button>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <HelpCircle className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-800 mb-2">Browse Services</h4>
              <p className="text-gray-600 text-sm mb-4">Explore our dental services and treatments</p>
              <Button
                onClick={() => window.location.href = '#services'}
                variant="outline"
                className="border-green-600 text-green-600 hover:bg-green-50"
              >
                View Services
              </Button>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-purple-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-800 mb-2">Contact Support</h4>
              <p className="text-gray-600 text-sm mb-4">Get help from our friendly team</p>
              <Button
                onClick={handleContactSupport}
                variant="outline"
                className="border-purple-600 text-purple-600 hover:bg-purple-50"
              >
                Contact Us
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-8 text-white"
        >
          <h3 className="text-2xl font-bold mb-4">Need Immediate Help?</h3>
          <p className="text-lg mb-6 opacity-90">
            Our dental team is here to assist you with any questions or concerns.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5" />
              <div>
                <p className="font-semibold">Call Us</p>
                <p className="text-blue-100">+91 6290093271</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5" />
              <div>
                <p className="font-semibold">Email Us</p>
                <p className="text-blue-100">info@dentodent.com</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-5 h-5 flex items-center justify-center">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <div>
                <p className="font-semibold">Emergency</p>
                <p className="text-blue-100">24/7 Available</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Fun Facts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.3 }}
          className="mt-12 text-center"
        >
          <p className="text-gray-500 text-sm">
            Fun fact: The average person spends 38.5 days brushing their teeth over a lifetime! 
            That's a lot of dental care. 🦷✨
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Error404;
