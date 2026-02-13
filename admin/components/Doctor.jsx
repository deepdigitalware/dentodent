import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Award, Users, Clock, Star, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const Doctor = () => {
  const achievements = [
    {
      icon: GraduationCap,
      title: 'Education',
      details: ['BDS - Calcutta University', 'MDS - Oral Surgery', 'Advanced Implantology Certification']
    },
    {
      icon: Award,
      title: 'Certifications',
      details: ['Board Certified Oral Surgeon', 'Invisalign Certified Provider', 'Advanced Cosmetic Dentistry']
    },
    {
      icon: Users,
      title: 'Experience',
      details: ['15+ Years Practice', '5000+ Successful Treatments', 'Expert in Complex Cases']
    }
  ];

  const specialties = [
    'Oral & Maxillofacial Surgery',
    'Dental Implants',
    'Cosmetic Dentistry',
    'Root Canal Treatment',
    'Orthodontics',
    'Periodontics'
  ];

  const handleConsultation = () => {
    toast({
      title: "👨‍⚕️ Doctor Consultation",
      description: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀"
    });
  };

  return (
    <section id="doctor" className="py-20 bg-gradient-to-br from-blue-50 to-cyan-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-display font-bold mb-6">
            Meet <span className="gradient-text">Dr. Setketu Chakraborty</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Leading dental expert with over 15 years of experience in transforming 
            smiles and providing exceptional oral healthcare in Kolkata.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left Content - Doctor Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative order-2 lg:order-1"
          >
            <div className="relative z-10">
              <img 
                className="w-full h-80 lg:h-96 object-cover rounded-3xl shadow-2xl card-3d" 
                alt="Dr. Setketu Chakraborty - Professional dental surgeon"
               src="https://images.unsplash.com/photo-1683349370055-7eba66a404c6" />
            </div>
            
            {/* Floating Stats - Repositioned to avoid overlap */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="absolute top-4 right-4 bg-white rounded-2xl p-3 shadow-xl glass-effect"
            >
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-yellow-500" />
                <div>
                  <div className="text-xl font-bold text-gray-800">4.9</div>
                  <div className="text-xs text-gray-600">Rating</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
              className="absolute bottom-4 left-4 bg-white rounded-2xl p-3 shadow-xl glass-effect"
            >
              <div className="flex items-center space-x-2">
                <Heart className="w-5 h-5 text-red-500" />
                <div>
                  <div className="text-xl font-bold text-gray-800">5000+</div>
                  <div className="text-xs text-gray-600">Patients</div>
                </div>
              </div>
            </motion.div>

            {/* Decorative Elements - Reduced size to avoid overlap */}
            <div className="absolute -top-5 -left-5 w-20 h-20 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full opacity-20 blur-xl"></div>
            <div className="absolute -bottom-5 -right-5 w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full opacity-20 blur-xl"></div>
          </motion.div>

          {/* Right Content - Doctor Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6 order-1 lg:order-2"
          >
            {/* Bio */}
            <div>
              <h3 className="text-2xl font-bold mb-4">About Dr. Chakraborty</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Dr. Setketu Chakraborty is a renowned dental surgeon with over 15 years 
                of experience in comprehensive dental care. He completed his BDS from 
                Calcutta University and pursued advanced training in oral surgery and 
                implantology.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Known for his gentle approach and commitment to excellence, Dr. Chakraborty 
                has successfully treated thousands of patients, earning recognition as one 
                of Kolkata's most trusted dental professionals.
              </p>
            </div>

            {/* Achievements */}
            <div className="space-y-4">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 card-3d"
                >
                  <div className="flex items-start space-x-3">
                    <achievement.icon className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="text-base font-semibold mb-2">{achievement.title}</h4>
                      <ul className="space-y-1">
                        {achievement.details.map((detail, detailIndex) => (
                          <li key={detailIndex} className="text-gray-600 text-sm">
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
              <h4 className="text-lg font-semibold mb-4">Specializations</h4>
              <div className="grid grid-cols-2 gap-3">
                {specialties.map((specialty, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    viewport={{ once: true }}
                    className="bg-gradient-to-r from-blue-100 to-cyan-100 px-4 py-2 rounded-full text-sm font-medium text-blue-800"
                  >
                    {specialty}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <Button
              onClick={handleConsultation}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-8 py-3 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Book a Free Appointment
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Doctor;