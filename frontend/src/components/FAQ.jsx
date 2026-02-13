import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Phone, Mail, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import WhatsAppIcon from '@/components/WhatsAppIcon';
import { useContent } from '@/contexts/ContentContext';

const FAQ = () => {
  const { content } = useContent();
  const [openItems, setOpenItems] = useState(new Set());

  // Use only API data, no fallbacks
  const faqData = content.faq?.items || [];

  const toggleItem = (id) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id);
    } else {
      newOpenItems.add(id);
    }
    setOpenItems(newOpenItems);
  };

  const handleContactSupport = () => {
    toast({
      title: "📞 Contact Support",
      description: "Our support team will get back to you within 24 hours!"
    });
  };

  const handleLiveChat = () => {
    toast({
      title: "💬 Live Chat",
      description: "Connecting you with our support team..."
    });
  };

  return (
    <section id="faq" className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-display font-bold mb-6">
            {content.faq.title}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {content.faq.subtitle}
          </p>
        </motion.div>

        {/* FAQ Items - Simple Accordion Style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="space-y-0 mb-12"
        >
          {faqData.map((faq, index) => (
            <motion.div
              key={faq.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="border-b border-gray-200 last:border-b-0"
            >
              <button
                onClick={() => toggleItem(faq.id)}
                className={`w-full p-6 text-left flex items-center justify-between transition-all duration-300 ${
                  openItems.has(faq.id)
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-800 hover:bg-gray-50'
                }`}
              >
                <h3 className="text-lg font-medium pr-4">{faq.question}</h3>
                {openItems.has(faq.id) ? (
                  <ChevronUp className="w-5 h-5 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 flex-shrink-0" />
                )}
              </button>

              <AnimatePresence>
                {openItems.has(faq.id) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 bg-white">
                      <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>

        {/* Contact Support */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-3xl p-8 text-white text-center"
        >
          <h3 className="text-3xl font-bold mb-4">Still Have Questions?</h3>
          <p className="text-xl mb-6 opacity-90">
            Can't find the answer you're looking for? Our friendly team is here to help!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              onClick={() => window.open('https://wa.me/916290093271?text=Hi%20Dent%20O%20Dent%2C%20I%20have%20a%20question%20about%20your%20dental%20services.', '_blank')}
              className="bg-[#25D366] hover:bg-[#128C7E] text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center"
            >
              <WhatsAppIcon className="w-5 h-5 mr-2" />
              Chat on WhatsApp
            </Button>
            <Button
              onClick={handleContactSupport}
              className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center"
            >
              <Mail className="w-5 h-5 mr-2" />
              Email Support
            </Button>
            <Button
              onClick={handleLiveChat}
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Live Chat
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;