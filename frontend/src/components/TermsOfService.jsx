import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Scale, Users, Shield, AlertTriangle, CheckCircle, Phone, Mail, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useContent } from '@/contexts/ContentContext';

const TermsOfService = () => {
  const handleContact = () => {
    toast({
      title: "📧 Contact Us",
      description: "We'll get back to you within 24 hours regarding any questions about our terms."
    });
  };

  const handleAcceptTerms = () => {
    toast({
      title: "✅ Terms Accepted",
      description: "Thank you for accepting our terms of service!"
    });
  };

  const { content } = useContent();
  const dynamicText = content?.termsOfService?.content;
  const dynamicTitle = content?.termsOfService?.title || 'Terms of Service';
  const effective = content?.termsOfService?.effectiveDate || 'January 1, 2024';
  const updated = content?.termsOfService?.lastUpdated || 'January 15, 2024';

  const sections = [
    {
      id: 'introduction',
      title: 'Introduction and Acceptance',
      icon: FileText,
      content: `Welcome to Dent "O" Dent Dental Clinic. These Terms of Service ("Terms") govern your use of our website, services, and dental care provided by our clinic. By accessing our website, scheduling appointments, or receiving treatment, you agree to be bound by these Terms.

**Acceptance of Terms:**
- By using our services, you acknowledge that you have read, understood, and agree to these Terms
- If you do not agree with any part of these Terms, you must not use our services
- These Terms constitute a legally binding agreement between you and Dent "O" Dent Dental Clinic

**Modifications:**
- We reserve the right to modify these Terms at any time
- Changes will be posted on our website with an updated effective date
- Continued use of our services after changes constitutes acceptance of the new Terms
- We will notify you of significant changes via email or website notice`
    },
    {
      id: 'services',
      title: 'Dental Services and Treatment',
      icon: Users,
      content: `We provide comprehensive dental care services in accordance with professional standards:

**Scope of Services:**
- General dentistry including cleanings, fillings, and preventive care
- Cosmetic dentistry including whitening, veneers, and smile makeovers
- Orthodontic treatment including braces and clear aligners
- Oral surgery including extractions and implants
- Emergency dental care and urgent treatment

**Professional Standards:**
- All treatments are performed by licensed dental professionals
- We maintain the highest standards of care and safety
- Treatment plans are developed based on individual patient needs
- We follow established medical protocols and best practices

**Treatment Limitations:**
- Results may vary based on individual circumstances
- Some treatments may require multiple visits
- Certain conditions may require referral to specialists
- We cannot guarantee specific outcomes or results

**Patient Responsibilities:**
- Provide accurate medical history and information
- Follow treatment instructions and care recommendations
- Attend scheduled appointments or provide adequate notice for changes
- Pay for services as agreed in the payment terms`
    },
    {
      id: 'appointments',
      title: 'Appointment Scheduling and Cancellation',
      icon: Calendar,
      content: `Our appointment system is designed to provide efficient and convenient care:

**Scheduling Appointments:**
- Appointments can be scheduled online, by phone, or in person
- We recommend booking appointments in advance
- Emergency appointments are available for urgent situations
- Appointment times are estimates and may vary based on treatment needs

**Cancellation Policy:**
- Cancellations must be made at least 24 hours in advance
- Late cancellations (less than 24 hours) may incur a cancellation fee
- No-show appointments may result in a fee and affect future scheduling
- Emergency cancellations are handled on a case-by-case basis

**Rescheduling:**
- Appointments can be rescheduled subject to availability
- We will make reasonable efforts to accommodate your preferred times
- Multiple reschedules may require a deposit for future appointments
- We reserve the right to limit rescheduling frequency

**Late Arrivals:**
- Patients arriving more than 15 minutes late may need to reschedule
- We will make reasonable efforts to accommodate late arrivals
- Treatment time may be reduced for late arrivals
- Emergency situations are handled with priority`
    },
    {
      id: 'payment',
      title: 'Payment Terms and Billing',
      icon: Shield,
      content: `Payment for services is due at the time of treatment unless other arrangements are made:

**Payment Methods:**
- We accept cash, credit cards, debit cards, and digital payments
- Insurance claims are filed on your behalf when applicable
- Payment plans may be available for extensive treatments
- All payments are processed securely and confidentially

**Insurance Coverage:**
- We work with most major insurance providers
- Coverage varies by plan and treatment type
- You are responsible for any deductibles, copayments, or non-covered services
- We will provide estimates of costs before treatment begins

**Billing and Invoices:**
- Detailed invoices are provided for all services
- Payment is due within 30 days of service unless other arrangements are made
- Late payments may incur interest charges
- Outstanding balances may affect future appointment scheduling

**Refund Policy:**
- Refunds are provided for services not rendered
- Partial refunds may be available for incomplete treatments
- Refund requests must be made within 30 days of service
- Processing fees may apply to refunds`
    },
    {
      id: 'privacy',
      title: 'Privacy and Confidentiality',
      icon: Shield,
      content: `We are committed to protecting your privacy and maintaining confidentiality:

**Medical Confidentiality:**
- All medical information is treated as confidential
- We follow HIPAA and other applicable privacy regulations
- Information is shared only with your consent or as required by law
- Staff members are bound by confidentiality agreements

**Information Security:**
- We implement appropriate security measures to protect your data
- Electronic records are encrypted and securely stored
- Physical records are kept in secure, locked areas
- Regular security audits and updates are performed

**Information Sharing:**
- We may share information with other healthcare providers with your consent
- Information may be shared as required by law or court order
- We do not sell or rent your personal information
- Marketing communications are sent only with your consent

**Your Rights:**
- You have the right to access your medical records
- You can request corrections to inaccurate information
- You can request restrictions on information sharing
- You can withdraw consent for non-essential uses`
    },
    {
      id: 'liability',
      title: 'Limitation of Liability and Disclaimers',
      icon: AlertTriangle,
      content: `While we strive to provide the best possible care, certain limitations apply:

**Medical Disclaimer:**
- Dental treatment involves inherent risks and potential complications
- Results may vary based on individual circumstances
- We cannot guarantee specific outcomes or treatment results
- Patients should discuss risks and benefits with their dentist

**Limitation of Liability:**
- Our liability is limited to the cost of services provided
- We are not liable for indirect, incidental, or consequential damages
- Liability is limited to the extent permitted by applicable law
- Professional liability insurance provides additional protection

**Force Majeure:**
- We are not liable for delays or cancellations due to circumstances beyond our control
- This includes natural disasters, pandemics, or government restrictions
- We will make reasonable efforts to reschedule affected appointments
- Emergency services will be maintained when possible

**Third-Party Services:**
- We are not responsible for third-party services or websites
- Links to external sites are provided for convenience only
- We do not endorse or guarantee third-party services
- Use of third-party services is at your own risk`
    },
    {
      id: 'conduct',
      title: 'Patient Conduct and Behavior',
      icon: Users,
      content: `We expect all patients to maintain appropriate conduct:

**Respectful Behavior:**
- Treat all staff and other patients with respect and courtesy
- Use appropriate language and maintain professional demeanor
- Follow clinic policies and procedures
- Report any concerns through appropriate channels

**Prohibited Conduct:**
- Harassment, discrimination, or inappropriate behavior is not tolerated
- Disruptive behavior that affects other patients or staff
- Failure to follow treatment instructions or safety protocols
- Any illegal activities on clinic premises

**Consequences:**
- Violation of conduct policies may result in termination of services
- We reserve the right to refuse service to anyone
- Legal action may be taken for serious violations
- We will work with patients to resolve issues when possible

**Safety Requirements:**
- Follow all safety instructions and protocols
- Report any safety concerns immediately
- Comply with health and safety regulations
- Maintain appropriate hygiene standards`
    },
    {
      id: 'intellectual-property',
      title: 'Intellectual Property Rights',
      icon: FileText,
      content: `All content and materials on our website and in our clinic are protected:

**Website Content:**
- All text, images, graphics, and other content are our property
- Content is protected by copyright and other intellectual property laws
- You may not reproduce, distribute, or modify content without permission
- Educational use is permitted for personal, non-commercial purposes

**Trademarks:**
- The Dent "O" Dent name and logo are our trademarks
- Use of our trademarks without permission is prohibited
- Other trademarks belong to their respective owners
- We respect the intellectual property rights of others

**Patient Records:**
- Medical records remain your property
- We maintain copies for treatment and legal purposes
- You have the right to access and copy your records
- Records are subject to applicable retention requirements

**Photography and Media:**
- Before and after photos may be used for treatment purposes
- Consent is required for any marketing or promotional use
- You can request that photos not be used for marketing
- All media is stored securely and confidentially`
    },
    {
      id: 'termination',
      title: 'Termination of Services',
      icon: AlertTriangle,
      content: `Either party may terminate the patient-provider relationship:

**Patient Termination:**
- You may terminate services at any time
- We will provide copies of your records upon request
- Outstanding balances must be paid
- We will assist with transfer to another provider

**Provider Termination:**
- We may terminate services for violation of these Terms
- Non-payment of fees may result in service termination
- Inappropriate conduct may result in immediate termination
- We will provide reasonable notice when possible

**Continuity of Care:**
- We will provide emergency care during transition periods
- Records will be transferred to new providers upon request
- We will assist with finding alternative care when appropriate
- Emergency contact information will be provided

**Record Retention:**
- Medical records are retained according to legal requirements
- You may request copies of your records at any time
- Records are securely stored and disposed of appropriately
- Access to records is subject to applicable laws`
    },
    {
      id: 'governing-law',
      title: 'Governing Law and Dispute Resolution',
      icon: Scale,
      content: `These Terms are governed by applicable laws and regulations:

**Governing Law:**
- These Terms are governed by the laws of West Bengal, India
- Any disputes will be resolved in the courts of Kolkata
- We comply with all applicable dental practice regulations
- International patients are subject to local laws

**Dispute Resolution:**
- We encourage resolution of disputes through direct communication
- Mediation may be used to resolve disputes amicably
- Legal action should be considered only as a last resort
- We will work in good faith to resolve any issues

**Regulatory Compliance:**
- We are licensed by the West Bengal Dental Council
- We comply with all applicable healthcare regulations
- Professional standards are maintained at all times
- Regular audits ensure continued compliance

**Changes to Terms:**
- These Terms may be updated to reflect changes in law or practice
- Significant changes will be communicated to patients
- Continued use of services constitutes acceptance of changes
- Previous versions of Terms are available upon request`
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
            <Scale className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-display font-bold mb-6">
            {dynamicTitle.split(' ').slice(0, 1).join(' ')}{' '}
            <span className="gradient-text">{dynamicTitle.split(' ').slice(1).join(' ') || 'of Service'}</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            These terms govern your use of our dental services and website. 
            Please read them carefully as they contain important information about your rights and responsibilities.
          </p>
          <div className="flex items-center justify-center space-x-4 mt-4 text-sm text-gray-500">
            <span>Last Updated: {updated}</span>
            <span>•</span>
            <span>Effective: {effective}</span>
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

        {/* Terms Content */}
        {dynamicText ? (
          <div className="space-y-8">
            {String(dynamicText).split(/\n\n+/).map((paragraph, idx) => (
              <motion.section
                key={`p-${idx}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl shadow-lg p-8"
              >
                <p className="text-gray-700 leading-relaxed">{paragraph}</p>
              </motion.section>
            ))}
          </div>
        ) : (
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
        )}

        {/* Acceptance Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16 bg-gradient-to-r from-green-600 to-blue-600 rounded-3xl p-8 text-white text-center"
        >
          <h3 className="text-3xl font-bold mb-4">Acceptance of Terms</h3>
          <p className="text-xl mb-6 opacity-90">
            By using our services, you acknowledge that you have read, understood, 
            and agree to be bound by these Terms of Service.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button
              onClick={handleAcceptTerms}
              className="bg-white text-green-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-300"
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              I Accept These Terms
            </Button>
            <Button
              onClick={handleContact}
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-green-600 px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-300"
            >
              <Phone className="w-5 h-5 mr-2" />
              Have Questions?
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center text-sm">
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4" />
              <span>+91 6290093271</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4" />
              <span>legal@dentodent.com</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>Mon-Sat: 9AM-8PM</span>
            </div>
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
            These terms are designed to protect both you and our practice while ensuring 
            the highest quality of dental care. If you have any questions, please contact us.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsOfService;
