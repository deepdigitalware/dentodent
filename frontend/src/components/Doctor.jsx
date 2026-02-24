import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Award, Users, Clock, Star, Heart, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useContent } from '@/contexts/ContentContext';
import WhatsAppIcon from '@/components/WhatsAppIcon';

const Doctor = () => {
  const { content, apiUrl } = useContent();
  const doctor = content?.doctor || {};
  const name = doctor.name || 'Dr. Setketu Chakraborty';
  const subtitle = doctor.title || 'Bachelor of Dental Surgery';
  const bioText = doctor.bio;
  const photoUrl = doctor.image;
  
  const education = Array.isArray(doctor.education) && doctor.education.length
    ? doctor.education
    : [];
  
  const certifications = Array.isArray(doctor.certifications) && doctor.certifications.length
    ? doctor.certifications
    : (Array.isArray(doctor.achievements) && doctor.achievements.length ? doctor.achievements : []);
  
  const experience = Array.isArray(doctor.experience) && doctor.experience.length
    ? doctor.experience
    : [];
  
  const specialties = Array.isArray(doctor.specialties) && doctor.specialties.length
    ? doctor.specialties
    : [];

  const achievements = [
    { icon: GraduationCap, title: 'Education', details: education },
    { icon: Users, title: 'Experience', details: experience }
  ].filter(item => Array.isArray(item.details) && item.details.length > 0);
  
  const handleConsultation = () => {
    window.open('https://wa.me/916290093271', '_blank');
  };

  const handleCall = () => {
    // Open phone dialer
    window.location.href = 'tel:+916290093271';
  };

  return (
    <section id="doctor" className="py-16 md:py-20 bg-gradient-to-br from-blue-50 to-cyan-50">
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
            Meet <span className="gradient-text">{name}</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            {subtitle}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-start">
          {/* Left Content - Doctor Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, amount: 0.1 }} // Reduce amount for better performance
            className="relative order-2 md:order-1"
          >
            <div className="relative z-10">
              <img 
                className="w-full h-64 md:h-80 lg:h-96 object-cover rounded-2xl md:rounded-3xl shadow-2xl card-3d" 
                alt={`${name} - Professional dental surgeon`}
               src={(function() {
                 const u = photoUrl;
                 return (typeof u === 'string' && u.startsWith('/assets')) ? `${apiUrl}${u}` : u;
               })()} 
               loading="eager" />
            </div>
            
            {/* Decorative Elements - Reduced size to avoid overlap */}
            <div className="absolute -top-3 -left-3 w-12 h-12 md:w-20 md:h-20 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full opacity-20 blur-xl"></div>
            <div className="absolute -bottom-3 -right-3 w-16 h-16 md:w-24 md:h-24 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full opacity-20 blur-xl"></div>
          </motion.div>

          {/* Right Content - Doctor Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, amount: 0.1 }} // Reduce amount for better performance
            className="space-y-5 md:space-y-6 order-1 md:order-2"
          >
            {/* Bio */}
            <div>
              <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">{name}</h3>
              {bioText && String(bioText).trim() && String(bioText).split(/\n\n+/).map((paragraph, idx) => (
                <p key={idx} className="text-gray-600 leading-relaxed mb-3 md:mb-4 text-sm md:text-base">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Achievements */}
            <div className="space-y-3 md:space-y-4">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true, amount: 0.1 }} // Reduce amount for better performance
                  className="bg-white p-3 md:p-4 rounded-xl md:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 card-3d"
                >
                  <div className="flex items-start space-x-2 md:space-x-3">
                    <achievement.icon className="w-5 h-5 md:w-6 md:h-6 text-blue-600 mt-0.5 md:mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="text-base md:text-lg font-semibold mb-1.5 md:mb-2">{achievement.title}</h4>
                      <ul className="space-y-1">
                        {achievement.details.map((detail, detailIndex) => (
                          <li key={detailIndex} className="text-gray-600 text-xs md:text-sm">
                            • {detail}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Specialties */}
            <div>
              <h4 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Specializations</h4>
              <div className="grid grid-cols-2 gap-2 md:gap-3">
                {specialties.map((specialty, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    viewport={{ once: true, amount: 0.1 }} // Reduce amount for better performance
                    className="bg-gradient-to-r from-blue-100 to-cyan-100 px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium text-blue-800 text-center"
                  >
                    {specialty}
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleConsultation}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-6 py-2.5 md:px-8 md:py-3 rounded-full font-semibold text-base md:text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex-1 flex items-center justify-center"
              >
                <WhatsAppIcon className="w-5 h-5 mr-2" />
                <span className="whitespace-nowrap">Book a Free Appointment</span>
              </Button>
              <Button
                onClick={handleCall}
                variant="outline"
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-6 py-2.5 md:px-8 md:py-3 rounded-full font-semibold text-base md:text-lg transition-all duration-300 flex-1 flex items-center justify-center"
              >
                <Phone className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                Call Now
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Doctor;
