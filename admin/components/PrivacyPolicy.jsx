import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Database, Mail, Phone, Calendar, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const PrivacyPolicy = () => {
  const handleContact = () => {
    toast({
      title: "📧 Contact Us",
      description: "We'll get back to you within 24 hours regarding your privacy concerns."
    });
  };

  const handleUpdatePreferences = () => {
    toast({
      title: "⚙️ Preferences",
      description: "Your privacy preferences have been updated successfully!"
    });
  };

  const sections = [
    {
      id: 'introduction',
      title: 'Introduction',
      icon: Shield,
      content: `At Dent "O" Dent Dental Clinic, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, use our services, or interact with our clinic.

We understand that your health information is sensitive and personal. We are dedicated to maintaining the highest standards of privacy protection in accordance with applicable laws and regulations, including the Personal Data Protection Bill and medical confidentiality requirements.`
    },
    {
      id: 'information-collection',
      title: 'Information We Collect',
      icon: Database,
      content: `We collect various types of information to provide you with the best possible dental care and service:

**Personal Information:**
- Name, date of birth, gender, and contact information
- Medical history and dental records
- Insurance information and payment details
- Emergency contact information

**Health Information:**
- Dental examination results and treatment history
- X-rays, photographs, and diagnostic records
- Treatment plans and progress notes
- Medication history and allergies

**Technical Information:**
- Website usage data and analytics
- Device information and IP addresses
- Cookies and similar tracking technologies
- Communication preferences and marketing consent`
    },
    {
      id: 'how-we-use',
      title: 'How We Use Your Information',
      icon: Eye,
      content: `We use your personal and health information for the following purposes:

**Primary Healthcare Services:**
- Providing dental treatment and care
- Maintaining accurate medical records
- Coordinating with other healthcare providers
- Emergency medical situations

**Administrative Purposes:**
- Appointment scheduling and reminders
- Billing and insurance processing
- Quality assurance and improvement
- Legal compliance and reporting

**Communication:**
- Treatment updates and follow-up care
- Health education and preventive care
- Appointment confirmations and changes
- Marketing communications (with your consent)

**Business Operations:**
- Website functionality and user experience
- Service improvement and development
- Security monitoring and fraud prevention
- Legal obligations and regulatory compliance`
    },
    {
      id: 'information-sharing',
      title: 'Information Sharing and Disclosure',
      icon: Lock,
      content: `We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:

**Healthcare Providers:**
- With other dental specialists for treatment coordination
- With your general physician when medically necessary
- With laboratories and diagnostic centers for testing

**Legal Requirements:**
- When required by law or court order
- To protect our rights and prevent fraud
- In emergency situations to protect health and safety
- With law enforcement when legally required

**Business Partners:**
- Insurance companies for claim processing
- Payment processors for billing purposes
- IT service providers under strict confidentiality agreements
- Marketing partners (only with your explicit consent)

**Your Consent:**
- We will always obtain your explicit consent before sharing information for purposes not covered above
- You can withdraw your consent at any time by contacting us`
    },
    {
      id: 'data-security',
      title: 'Data Security and Protection',
      icon: Shield,
      content: `We implement comprehensive security measures to protect your information:

**Technical Safeguards:**
- Encryption of sensitive data in transit and at rest
- Secure servers and databases with access controls
- Regular security updates and vulnerability assessments
- Multi-factor authentication for system access

**Administrative Safeguards:**
- Staff training on privacy and security protocols
- Limited access to patient information on a need-to-know basis
- Regular audits and compliance monitoring
- Incident response and breach notification procedures

**Physical Safeguards:**
- Secure storage of physical records
- Controlled access to clinic premises
- Secure disposal of sensitive documents
- Video surveillance in appropriate areas

**Data Retention:**
- We retain your information only as long as necessary for treatment and legal requirements
- Medical records are typically retained for 7 years after last treatment
- You can request deletion of your information subject to legal requirements`
    },
    {
      id: 'your-rights',
      title: 'Your Rights and Choices',
      icon: CheckCircle,
      content: `You have several rights regarding your personal information:

**Access Rights:**
- Request copies of your medical records
- Review the information we have about you
- Obtain a summary of your treatment history

**Correction Rights:**
- Request correction of inaccurate information
- Update your contact and insurance information
- Add notes to your medical record

**Control Rights:**
- Opt out of marketing communications
- Request restrictions on information sharing
- Withdraw consent for non-essential uses

**Portability Rights:**
- Request transfer of your records to another provider
- Receive your information in a portable format
- Obtain copies of your X-rays and images

**Deletion Rights:**
- Request deletion of non-essential information
- Right to be forgotten (subject to legal requirements)
- Secure disposal of old records

To exercise any of these rights, please contact us using the information provided in the "Contact Us" section.`
    },
    {
      id: 'cookies-tracking',
      title: 'Cookies and Tracking Technologies',
      icon: Database,
      content: `Our website uses cookies and similar technologies to enhance your experience:

**Essential Cookies:**
- Required for website functionality
- Security and authentication purposes
- Cannot be disabled without affecting site performance

**Analytics Cookies:**
- Help us understand website usage
- Improve user experience and site performance
- Anonymous data collection and analysis

**Marketing Cookies:**
- Used only with your consent
- Personalize content and advertisements
- Track campaign effectiveness

**Cookie Management:**
- You can control cookies through your browser settings
- Opt out of non-essential cookies through our cookie banner
- Clear existing cookies at any time

**Third-Party Services:**
- Google Analytics for website analytics
- Social media integration (with your consent)
- Payment processing cookies (essential for transactions)`
    },
    {
      id: 'children-privacy',
      title: 'Children\'s Privacy',
      icon: Shield,
      content: `We are committed to protecting the privacy of children:

**Parental Consent:**
- We require parental consent for patients under 18
- Parents have full access to their child's records
- Special protections for pediatric patient information

**Treatment of Minors:**
- Age-appropriate privacy protections
- Limited information sharing with schools or other institutions
- Special consideration for adolescent patients

**Consent Management:**
- Clear explanation of information collection to parents
- Regular review of consent for ongoing treatment
- Right to withdraw consent at any time

**Emergency Situations:**
- We may provide necessary treatment without consent in emergencies
- Parents will be notified as soon as possible
- Documentation of emergency circumstances`
    },
    {
      id: 'international-transfers',
      title: 'International Data Transfers',
      icon: Database,
      content: `We may transfer your information internationally in limited circumstances:

**Cloud Services:**
- Secure cloud storage with appropriate safeguards
- Data processing agreements with service providers
- Encryption and security measures for international transfers

**Treatment Coordination:**
- Sharing with international specialists (with your consent)
- Telemedicine consultations with overseas experts
- Secure communication channels for international referrals

**Legal Compliance:**
- Compliance with international data protection laws
- Adequate protection measures for cross-border transfers
- Regular review of international data processing activities

**Your Rights:**
- Right to be informed about international transfers
- Ability to restrict international data sharing
- Request information about data processing locations`
    },
    {
      id: 'policy-updates',
      title: 'Policy Updates and Changes',
      icon: Calendar,
      content: `We may update this Privacy Policy from time to time:

**Notification of Changes:**
- We will notify you of significant changes via email or website notice
- Updated policies will be posted on our website
- Previous versions will be available upon request

**Material Changes:**
- Changes to data collection practices
- New uses of your information
- Changes to your rights and choices
- Updates to contact information

**Your Continued Use:**
- Continued use of our services after changes constitutes acceptance
- You can withdraw consent if you disagree with changes
- Right to request deletion of your information

**Effective Date:**
- This policy is effective as of January 1, 2024
- Last updated: January 15, 2024
- Next review scheduled: July 15, 2024`
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-display font-bold mb-6">
            Privacy <span className="gradient-text">Policy</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your privacy and the security of your personal information are our top priorities. 
            This policy explains how we collect, use, and protect your data.
          </p>
          <div className="flex items-center justify-center space-x-4 mt-4 text-sm text-gray-500">
            <span>Last Updated: January 15, 2024</span>
            <span>•</span>
            <span>Effective: January 1, 2024</span>
          </div>
        </motion.div>

        {/* Table of Contents */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-12"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Table of Contents</h2>
          <div className="grid md:grid-cols-2 gap-2">
            {sections.map((section, index) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <section.icon className="w-5 h-5 text-blue-600" />
                <span className="text-gray-700">{index + 1}. {section.title}</span>
              </a>
            ))}
          </div>
        </motion.div>

        {/* Policy Sections */}
        <div className="space-y-8">
          {sections.map((section, index) => (
            <motion.section
              key={section.id}
              id={section.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-lg p-8"
            >
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <section.icon className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">{section.title}</h2>
              </div>
              
              <div className="prose prose-lg max-w-none">
                {section.content.split('\n\n').map((paragraph, pIndex) => (
                  <p key={pIndex} className="text-gray-700 leading-relaxed mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>
            </motion.section>
          ))}
        </div>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-3xl p-8 text-white text-center"
        >
          <h3 className="text-3xl font-bold mb-4">Questions About Your Privacy?</h3>
          <p className="text-xl mb-6 opacity-90">
            We're here to help you understand your privacy rights and answer any questions 
            you may have about how we handle your personal information.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
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
                <p className="text-blue-100">privacy@dentodent.com</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5" />
              <div>
                <p className="font-semibold">Office Hours</p>
                <p className="text-blue-100">Mon-Sat: 9AM-8PM</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handleContact}
              className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold transition-all duration-300"
            >
              <Mail className="w-4 h-4 mr-2" />
              Contact Privacy Officer
            </Button>
            <Button
              onClick={handleUpdatePreferences}
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 px-6 py-3 rounded-lg font-semibold transition-all duration-300"
            >
              <Shield className="w-4 h-4 mr-2" />
              Update Preferences
            </Button>
          </div>
        </motion.div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-12 text-center"
        >
          <p className="text-gray-500 text-sm">
            This privacy policy is designed to be transparent and easy to understand. 
            If you have any questions or concerns, please don't hesitate to contact us.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
