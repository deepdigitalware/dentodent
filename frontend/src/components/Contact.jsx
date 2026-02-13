import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import WhatsAppIcon from '@/components/WhatsAppIcon';
import { useContent } from '@/contexts/ContentContext';

const Contact = () => {
  const { content, apiUrl } = useContent();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${apiUrl}/api/forms/submit/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ submission: formData })
      });
      if (!res.ok) throw new Error('Failed to submit contact form');
      toast({
        title: "📧 Message Sent!",
        description: "Thank you for contacting us. We'll get back to you within 24 hours."
      });
      setFormData({ name: '', email: '', phone: '', service: '', message: '' });
    } catch (err) {
      toast({ title: "Error", description: err.message });
    }
  };

  const handleEmergencyCall = () => {
    // Open phone dialer for emergency calls
    window.location.href = 'tel:+916290093271';
  };

  const handleWhatsAppChat = () => {
    // Open WhatsApp chat
    window.open('https://wa.me/916290093271', '_blank');
  };

  // Use only API data, no fallbacks
  const services = content.contact?.services || [];

  return (
    <section id="contact" className="py-16 md:py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, amount: 0.1 }} // Reduce amount for better performance
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-display font-bold mb-4 md:mb-6">
            {content.contact.title}
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            {content.contact.subtitle}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8 lg:gap-16">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, amount: 0.1 }} // Reduce amount for better performance
            className="bg-white rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-8 shadow-xl order-1 md:order-1"
          >
            <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Schedule an Appointment</h3>
            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5 md:mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2.5 md:px-4 md:py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm md:text-base"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5 md:mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2.5 md:px-4 md:py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm md:text-base"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5 md:mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2.5 md:px-4 md:py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm md:text-base"
                    placeholder="+91 6290093271"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5 md:mb-2">
                    Service Needed
                  </label>
                  <select
                    name="service"
                    value={formData.service}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 md:px-4 md:py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm md:text-base"
                  >
                    <option value="">Select a service</option>
                    {services.map((service, index) => (
                      <option key={index} value={service}>{service}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 md:mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2.5 md:px-4 md:py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm md:text-base"
                  placeholder="Tell us about your dental concerns or questions..."
                ></textarea>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white py-2.5 md:py-3 rounded-lg font-semibold text-base md:text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Send className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                Send Message
              </Button>
            </form>
          </motion.div>

          {/* Contact Information and Map */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, amount: 0.1 }} // Reduce amount for better performance
            className="space-y-6 md:space-y-8 order-2 md:order-2 h-full"
          >
            {/* Google Maps */}
            <div className="bg-white rounded-2xl md:rounded-3xl shadow-xl overflow-hidden h-full min-h-[600px]">
              <div className="w-full h-full">
                <iframe
                  src={content.map?.embedUrl || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3684.1234567890!2d88.3569182!3d22.4769517!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a02716fdf94eb89%3A0xdddb71badc260474!2s1%2F8%2F1%2C%20near%20Master%20Da%20Surya%20Sen%20Club%2C%20Suryanagar%2C%20Regent%20Grove%2C%20Bansdroni%2C%20Kolkata%2C%20West%20Bengal%20700040!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin"}
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: '600px' }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Dent O Dent Location"
                  className="w-full h-full"
                ></iframe>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;

