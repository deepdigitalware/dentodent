import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, Phone, Mail, MapPin, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useContent } from '@/contexts/ContentContext';

const AppointmentBooking = () => {
  const { content, apiUrl } = useContent();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Service Selection
    service: '',
    urgency: 'routine',
    
    // Step 2: Date & Time
    preferredDate: '',
    preferredTime: '',
    alternativeDate: '',
    alternativeTime: '',
    
    // Step 3: Patient Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    
    // Step 4: Additional Information
    previousPatient: false,
    insuranceProvider: '',
    symptoms: '',
    notes: '',
    
    // Step 5: Confirmation
    termsAccepted: false,
    privacyAccepted: false
  });

  const defaultServices = [
    {
      id: 'consultation',
      name: 'General Consultation',
      description: 'Comprehensive dental examination and treatment planning',
      duration: '30-45 minutes',
      price: '₹500',
      icon: '🦷'
    },
    {
      id: 'cleaning',
      name: 'Teeth Cleaning',
      description: 'Professional cleaning and polishing',
      duration: '45-60 minutes',
      price: '₹800',
      icon: '✨'
    },
    {
      id: 'whitening',
      name: 'Teeth Whitening',
      description: 'Professional teeth whitening treatment',
      duration: '60-90 minutes',
      price: '₹3,000',
      icon: '💎'
    },
    {
      id: 'filling',
      name: 'Dental Filling',
      description: 'Tooth restoration with composite or amalgam',
      duration: '30-60 minutes',
      price: '₹1,500',
      icon: '🔧'
    },
    {
      id: 'root-canal',
      name: 'Root Canal Treatment',
      description: 'Endodontic treatment to save infected teeth',
      duration: '90-120 minutes',
      price: '₹4,000',
      icon: '🏥'
    },
    {
      id: 'implant',
      name: 'Dental Implant',
      description: 'Permanent tooth replacement solution',
      duration: '120-180 minutes',
      price: '₹25,000',
      icon: '🦴'
    }
  ];

  const dynamicServices = (() => {
    const svcFromSection = Array.isArray(content.services?.services)
      ? content.services.services.map(s => s?.title || s?.name || s)
      : [];
    const svcFromTreatments = Array.isArray(content.treatments)
      ? content.treatments.map(t => t?.title || t?.name || t)
      : [];
    const svcFromContact = Array.isArray(content.contact?.services) ? content.contact.services : [];
    const names = Array.from(new Set([...svcFromSection, ...svcFromTreatments, ...svcFromContact]
      .map(s => String(s || '').trim())
      .filter(Boolean)));
    return names.map(n => ({
      id: n.toLowerCase().replace(/\s+/g, '-'),
      name: n,
      description: '',
      duration: '',
      price: '',
      icon: '🦷'
    }));
  })();

  const services = dynamicServices.length ? dynamicServices : defaultServices;

  const timeSlots = [
    '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM',
    '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM'
  ];

  const urgencyLevels = [
    { id: 'routine', label: 'Routine Checkup', description: 'Regular dental care', color: 'green' },
    { id: 'urgent', label: 'Urgent Care', description: 'Pain or discomfort', color: 'orange' }
  ];

  const steps = [
    { number: 1, title: 'Select Service', description: 'Choose your treatment' },
    { number: 2, title: 'Pick Date & Time', description: 'Schedule your visit' },
    { number: 3, title: 'Patient Info', description: 'Your details' },
    { number: 4, title: 'Additional Info', description: 'Extra details' },
    { number: 5, title: 'Confirmation', description: 'Review & book' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      const submission = {
        service: formData.service,
        urgency: formData.urgency,
        preferredDate: formData.preferredDate,
        preferredTime: formData.preferredTime,
        alternativeDate: formData.alternativeDate,
        alternativeTime: formData.alternativeTime,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        previousPatient: formData.previousPatient,
        insuranceProvider: formData.insuranceProvider,
        symptoms: formData.symptoms,
        notes: formData.notes
      };
      const res = await fetch(`${apiUrl}/api/forms/submit/appointment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ submission })
      });
      if (!res.ok) throw new Error('Failed to submit appointment');
      toast({
        title: "✅ Appointment Booked!",
        description: "Your appointment has been successfully scheduled. You will receive a confirmation SMS and email shortly."
      });
    } catch (e) {
      toast({ title: "Error", description: e.message });
    }
    
    // Reset form after successful submission
    setFormData({
      // Step 1: Service Selection
      service: '',
      urgency: 'routine',
      
      // Step 2: Date & Time
      preferredDate: '',
      preferredTime: '',
      alternativeDate: '',
      alternativeTime: '',
      
      // Step 3: Patient Information
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      gender: '',
      
      // Step 4: Additional Information
      previousPatient: false,
      insuranceProvider: '',
      symptoms: '',
      notes: '',
      
      // Step 5: Confirmation
      termsAccepted: false,
      privacyAccepted: false
    });
    
    // Reset to first step
    setCurrentStep(1);
  };

  const renderStepIndicator = () => (
    <div className="mb-8">
      {/* Desktop Step Indicator */}
      <div className="hidden md:flex items-center justify-center">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
              currentStep >= step.number
                ? 'bg-blue-600 border-blue-600 text-white'
                : 'bg-white border-gray-300 text-gray-500'
            }`}>
              {currentStep > step.number ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                step.number
              )}
            </div>
            <div className="ml-3 text-left">
              <p className={`text-sm font-medium ${
                currentStep >= step.number ? 'text-blue-600' : 'text-gray-500'
              }`}>
                {step.title}
              </p>
              <p className="text-xs text-gray-500">{step.description}</p>
            </div>
            {index < steps.length - 1 && (
              <div className={`w-8 h-0.5 mx-4 ${
                currentStep > step.number ? 'bg-blue-600' : 'bg-gray-300'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Mobile Step Indicator */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
              currentStep >= 1 ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-300 text-gray-500'
            }`}>
              {currentStep > 1 ? <CheckCircle className="w-4 h-4" /> : '1'}
            </div>
            <div className="text-left">
              <p className={`text-sm font-medium ${currentStep >= 1 ? 'text-blue-600' : 'text-gray-500'}`}>
                Select Service
              </p>
              <p className="text-xs text-gray-500">Choose your treatment</p>
            </div>
          </div>
          <div className="flex-1 h-0.5 bg-gray-300 mx-2"></div>
          <div className="flex items-center space-x-2">
            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
              currentStep >= 2 ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-300 text-gray-500'
            }`}>
              {currentStep > 2 ? <CheckCircle className="w-4 h-4" /> : '2'}
            </div>
            <div className="text-left">
              <p className={`text-sm font-medium ${currentStep >= 2 ? 'text-blue-600' : 'text-gray-500'}`}>
                Pick Date & Time
              </p>
              <p className="text-xs text-gray-500">Schedule your visit</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
              currentStep >= 3 ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-300 text-gray-500'
            }`}>
              {currentStep > 3 ? <CheckCircle className="w-4 h-4" /> : '3'}
            </div>
            <div className="text-left">
              <p className={`text-sm font-medium ${currentStep >= 3 ? 'text-blue-600' : 'text-gray-500'}`}>
                Patient Info
              </p>
              <p className="text-xs text-gray-500">Your details</p>
            </div>
          </div>
          <div className="flex-1 h-0.5 bg-gray-300 mx-2"></div>
          <div className="flex items-center space-x-2">
            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
              currentStep >= 4 ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-300 text-gray-500'
            }`}>
              {currentStep > 4 ? <CheckCircle className="w-4 h-4" /> : '4'}
            </div>
            <div className="text-left">
              <p className={`text-sm font-medium ${currentStep >= 4 ? 'text-blue-600' : 'text-gray-500'}`}>
                Additional Info
              </p>
              <p className="text-xs text-gray-500">Extra details</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
              currentStep >= 5 ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-300 text-gray-500'
            }`}>
              {currentStep > 5 ? <CheckCircle className="w-4 h-4" /> : '5'}
            </div>
            <div className="text-left">
              <p className={`text-sm font-medium ${currentStep >= 5 ? 'text-blue-600' : 'text-gray-500'}`}>
                Confirmation
              </p>
              <p className="text-xs text-gray-500">Review & book</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderServiceSelection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Select Your Service</h3>
        <p className="text-gray-600 mb-6">Choose the dental service you need from our comprehensive list.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {services.map((service) => (
          <motion.div
            key={service.id}
            whileHover={{ scale: 1.02 }}
            className={`p-4 md:p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
              formData.service === service.id
                ? 'border-blue-500 bg-blue-50 shadow-lg'
                : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
            }`}
            onClick={() => handleInputChange('service', service.name)}
          >
            <div className="flex items-start space-x-3 md:space-x-4">
              <div className="text-2xl md:text-3xl flex-shrink-0">{service.icon}</div>
              <div className="flex-1 min-w-0">
                <h4 className="text-base md:text-lg font-semibold text-gray-800 mb-2">{service.name}</h4>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{service.description}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">⏱️ {service.duration}</span>
                  <span className="font-semibold text-blue-600">{service.price}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div>
        <h4 className="text-lg font-semibold text-gray-800 mb-4">Urgency Level</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
          {urgencyLevels.map((level) => (
            <div
              key={level.id}
              className={`p-3 md:p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                formData.urgency === level.id
                  ? `border-${level.color}-500 bg-${level.color}-50`
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleInputChange('urgency', level.id)}
            >
              <div className="flex items-center space-x-2 md:space-x-3">
                <div className={`w-3 h-3 rounded-full bg-${level.color}-500 flex-shrink-0`}></div>
                <div className="min-w-0">
                  <h5 className="font-medium text-gray-800 text-sm md:text-base">{level.label}</h5>
                  <p className="text-xs md:text-sm text-gray-600">{level.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderDateTimeSelection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Select Date & Time</h3>
        <p className="text-gray-600 mb-6">Choose your preferred appointment date and time.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Date</label>
          <input
            type="date"
            value={formData.preferredDate}
            onChange={(e) => handleInputChange('preferredDate', e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="w-full p-2 md:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Time</label>
          <select
            value={formData.preferredTime}
            onChange={(e) => handleInputChange('preferredTime', e.target.value)}
            className="w-full p-2 md:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
          >
            <option value="">Select time</option>
            {timeSlots.map((time) => (
              <option key={time} value={time}>{time}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium text-blue-800 mb-2">Alternative Options</h4>
        <p className="text-sm text-blue-700 mb-4">
          If your preferred time is not available, we can suggest alternative slots.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Alternative Date</label>
            <input
              type="date"
              value={formData.alternativeDate}
              onChange={(e) => handleInputChange('alternativeDate', e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full p-2 md:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Alternative Time</label>
            <select
              value={formData.alternativeTime}
              onChange={(e) => handleInputChange('alternativeTime', e.target.value)}
              className="w-full p-2 md:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
            >
              <option value="">Select time</option>
              {timeSlots.map((time) => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPatientInfo = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Patient Information</h3>
        <p className="text-gray-600 mb-6">Please provide your personal details for the appointment.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            required
            className="w-full p-2 md:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
            placeholder="Enter your first name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            required
            className="w-full p-2 md:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
            placeholder="Enter your last name"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            required
            className="w-full p-2 md:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
            placeholder="Your Email"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            required
            className="w-full p-2 md:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
            placeholder="Your Number"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
          <input
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
          <select
            value={formData.gender}
            onChange={(e) => handleInputChange('gender', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
            <option value="prefer-not-to-say">Prefer not to say</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderAdditionalInfo = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Additional Information</h3>
        <p className="text-gray-600 mb-6">Help us provide the best care by sharing additional details.</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="previousPatient"
            checked={formData.previousPatient}
            onChange={(e) => handleInputChange('previousPatient', e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="previousPatient" className="text-sm font-medium text-gray-700">
            I have been a patient at this clinic before
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Insurance Provider</label>
          <input
            type="text"
            value={formData.insuranceProvider}
            onChange={(e) => handleInputChange('insuranceProvider', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your insurance provider (optional)"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Current Symptoms or Concerns</label>
          <textarea
            value={formData.symptoms}
            onChange={(e) => handleInputChange('symptoms', e.target.value)}
            rows={3}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Describe any symptoms or concerns you have..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
          <textarea
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            rows={3}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Any additional information you'd like to share..."
          />
        </div>
      </div>
    </div>
  );

  const renderConfirmation = () => {
    const selectedService = services.find(s => s.name === formData.service);
    
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Confirm Your Appointment</h3>
          <p className="text-gray-600 mb-6">Please review your appointment details before booking.</p>
        </div>

        <div className="bg-gray-50 rounded-2xl p-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Appointment Summary</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Service:</span>
              <span className="font-medium">{selectedService?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Date:</span>
              <span className="font-medium">{formData.preferredDate || 'Not selected'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Time:</span>
              <span className="font-medium">{formData.preferredTime || 'Not selected'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Patient:</span>
              <span className="font-medium">{formData.firstName} {formData.lastName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Contact:</span>
              <span className="font-medium">{formData.phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Estimated Cost:</span>
              <span className="font-medium text-blue-600">{selectedService?.price || '—'}</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="termsAccepted"
              checked={formData.termsAccepted}
              onChange={(e) => handleInputChange('termsAccepted', e.target.checked)}
              className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              required
            />
            <label htmlFor="termsAccepted" className="text-sm text-gray-700">
              I agree to the <a href="#" className="text-blue-600 hover:underline">Terms of Service</a> and 
              <a href="#" className="text-blue-600 hover:underline"> Cancellation Policy</a>
            </label>
          </div>

          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="privacyAccepted"
              checked={formData.privacyAccepted}
              onChange={(e) => handleInputChange('privacyAccepted', e.target.checked)}
              className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              required
            />
            <label htmlFor="privacyAccepted" className="text-sm text-gray-700">
              I consent to the collection and processing of my personal data as described in the 
              <a href="#" className="text-blue-600 hover:underline"> Privacy Policy</a>
            </label>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h5 className="font-medium text-blue-800">Important Reminders</h5>
              <ul className="text-sm text-blue-700 mt-1 space-y-1">
                <li>• Please arrive 15 minutes before your appointment</li>
                <li>• Bring a valid ID and insurance card (if applicable)</li>
                <li>• Cancel or reschedule at least 24 hours in advance</li>
                <li>• You will receive a confirmation email shortly</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderServiceSelection();
      case 2:
        return renderDateTimeSelection();
      case 3:
        return renderPatientInfo();
      case 4:
        return renderAdditionalInfo();
      case 5:
        return renderConfirmation();
      default:
        return null;
    }
  };

  return (
    <section id="appointment" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl lg:text-5xl font-display font-bold mb-6">
            Book Your <span className="gradient-text">Appointment</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Schedule your dental appointment in just a few simple steps. 
            Choose your service, pick a convenient time, and we'll take care of the rest.
          </p>
        </motion.div>

        {/* Step Indicator */}
        {renderStepIndicator()}

        {/* Step Content */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-8"
        >
          {renderStepContent()}
        </motion.div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center">
          <Button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            variant="outline"
            className="px-6 py-3"
          >
            Previous
          </Button>

          {currentStep < 5 ? (
            <Button
              onClick={handleNext}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3"
            >
              Next Step
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!formData.termsAccepted || !formData.privacyAccepted}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Book Appointment
            </Button>
          )}
        </div>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-16 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-3xl p-8 text-white text-center"
        >
          <h3 className="text-2xl font-bold mb-4">Need Help Booking?</h3>
          <p className="text-lg mb-6 opacity-90">
            Our friendly staff is here to help you schedule your appointment.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="flex items-center space-x-2">
              <Phone className="w-5 h-5" />
              <span>+91 6290093271</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="w-5 h-5" />
              <span>appointments@dentodent.com</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span>Mon-Sat: 9AM-8PM</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AppointmentBooking;
