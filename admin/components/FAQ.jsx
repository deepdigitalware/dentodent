import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Phone, Mail, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const FAQ = () => {
  const [openItems, setOpenItems] = useState(new Set());

  const faqData = [
    {
      id: 1,
      question: 'What is the cost of root canal treatment in Kolkata?',
      answer: 'The cost of root canal treatment in Kolkata varies depending on the tooth and complexity. At Dent "O" Dent, our root canal treatments start from ₹3,500 for front teeth and ₹4,500 for back teeth. We use advanced techniques and high-quality materials to ensure the best results.'
    },
    {
      id: 2,
      question: 'Are you still looking for the best dentist in Kolkata?',
      answer: 'If you are having any sort of dental issues, you must be searching for the top dentist in Kolkata. Then we might help you; Dent "O" Dent has a team of the best dentists in Kolkata who have experience of over fifteen years. Get the best dental care at the best dental clinic in Kolkata; we are ready to serve you with dental services at an unbeatable price. We use high-quality products that will improve your oral health, and if taken care of properly, you will surely get them working for a lifetime.'
    },
    {
      id: 3,
      question: 'Is dental insurance available with us in Kolkata?',
      answer: 'Yes, we accept most major dental insurance plans in Kolkata. We work with leading insurance providers to make dental care more accessible. Our team will help you understand your coverage and maximize your benefits. We also offer flexible payment plans for treatments not covered by insurance.'
    },
    {
      id: 4,
      question: 'How often should I consult a dentist?',
      answer: 'Dental care is the best thing that can improve your oral health and overall physical health. You need to consult a dentist at regular intervals, preferably every three months. The best dentist in Kolkata will examine your teeth and prescribe you the required mouth floss you need to use or even the treatment that you may require. Visit the dentist that satisfies your questions and recalls you on your appointment dates for smooth treatment.'
    },
    {
      id: 5,
      question: 'How many years of experience does Dent "O" Dent have?',
      answer: 'Dent "O" Dent has been serving the Kolkata community for over 15 years with excellence in dental care. Our experienced team of dentists brings decades of combined experience in various dental specialties, ensuring you receive the highest quality treatment and care.'
    },
    {
      id: 6,
      question: 'Does this dental clinic offer no-cost EMI services in Kolkata?',
      answer: 'Yes, we offer flexible EMI options for expensive dental treatments. We understand that dental care can be a significant investment, so we provide no-cost EMI services through our partner financial institutions. This makes quality dental care accessible to everyone without financial stress.'
    },
    {
      id: 7,
      question: 'Does Dent "O" Dent provide Dental Emergency services?',
      answer: 'Yes, we provide 24/7 dental emergency services in Kolkata. Our emergency dental care includes treatment for severe tooth pain, dental trauma, broken teeth, and other urgent dental issues. Call our emergency line at +91 6290093271 for immediate assistance.'
    },
    {
      id: 8,
      question: 'How many branches of Dent "O" Dent are there near me?',
      answer: 'Dent "O" Dent currently operates from our main clinic located at 1/8/1, near Master Da Surya Sen Club, Suryanagar, Regent Grove, Bansdroni, Kolkata, West Bengal 700040. We are strategically located to serve patients from across Kolkata with easy accessibility and ample parking facilities.'
    },
    {
      id: 9,
      question: 'What dental services are provided here?',
      answer: 'We provide comprehensive dental services including general dentistry, cosmetic dentistry, orthodontics, oral surgery, dental implants, pediatric care, teeth whitening, root canal treatment, dental crowns, bridges, and emergency dental care. Our state-of-the-art facility is equipped with the latest dental technology.'
    },
    {
      id: 10,
      question: 'How should I choose the best dental clinic near me?',
      answer: 'When choosing a dental clinic, consider factors like the dentist\'s experience and qualifications, clinic location and accessibility, available services, technology and equipment, patient reviews and testimonials, insurance acceptance, and emergency care availability. Dent "O" Dent excels in all these areas, making us the preferred choice for dental care in Kolkata.'
    }
  ];

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
            Frequently Asked <span className="gradient-text">Questions</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Find answers to common questions about our dental services, appointments, 
            treatments, and more. Can't find what you're looking for? Contact us directly.
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
          
          <div className="flex justify-center">
            <Button
              onClick={() => window.open('https://wa.me/916290093271?text=Hi%20Dent%20O%20Dent%2C%20I%20have%20a%20question%20about%20your%20dental%20services.', '_blank')}
              className="bg-[#25D366] hover:bg-[#128C7E] text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
              </svg>
              Chat on WhatsApp
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;
