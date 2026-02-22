import React from 'react';
import { motion } from 'framer-motion';
import { Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import WhatsAppIcon from '@/components/WhatsAppIcon';

const Error404 = () => {
  const openWhatsApp = () => {
    window.open('https://wa.me/916290093271', '_blank');
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
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="mt-2"
        />

        {/* Immediate Help */}
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
          <div className="flex justify-center items-center">
            <Button
              onClick={openWhatsApp}
              className="bg-white hover:bg-white text-black px-6 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center border border-gray-200"
            >
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[#25D366] mr-2">
                <WhatsAppIcon className="w-4 h-4" />
              </span>
              Chat on WhatsApp
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Error404;
