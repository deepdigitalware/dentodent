import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = ({ 
  size = 'default', 
  color = 'blue', 
  text = 'Loading...', 
  showText = true,
  fullScreen = false 
}) => {
  const sizeClasses = {
    small: 'w-6 h-6',
    default: 'w-12 h-12',
    large: 'w-16 h-16',
    xl: 'w-20 h-20'
  };

  const colorClasses = {
    blue: 'border-blue-600',
    green: 'border-green-600',
    purple: 'border-purple-600',
    red: 'border-red-600',
    yellow: 'border-yellow-600',
    gray: 'border-gray-600'
  };

  const textSizeClasses = {
    small: 'text-sm',
    default: 'text-base',
    large: 'text-lg',
    xl: 'text-xl'
  };

  const containerClasses = fullScreen 
    ? 'fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50'
    : 'flex items-center justify-center';

  return (
    <div className={containerClasses}>
      <div className="text-center">
        {/* Main Spinner */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className={`${sizeClasses[size]} border-4 border-gray-200 border-t-4 ${colorClasses[color]} rounded-full mx-auto mb-4`}
        />

        {/* Dental-themed Loading Animation */}
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="text-4xl mb-4"
        >
          🦷
        </motion.div>

        {/* Loading Text */}
        {showText && (
          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: 0.5
            }}
            className={`${textSizeClasses[size]} text-gray-600 font-medium`}
          >
            {text}
          </motion.p>
        )}

        {/* Dots Animation */}
        <motion.div
          className="flex justify-center space-x-1 mt-2"
        >
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [0.3, 1, 0.3]
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: index * 0.2
              }}
              className="w-2 h-2 bg-blue-600 rounded-full"
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
