import React from 'react';
import { motion } from 'framer-motion';
import { useContent } from '@/contexts/ContentContext';

const CallToAction = () => {
  const { content } = useContent();
  
  return (
    <motion.p
      className='text-md text-white max-w-lg mx-auto'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.8 }}
    >
      {content.cta?.text || "Let's turn your ideas into reality."}
    </motion.p>
  );
};

export default CallToAction;