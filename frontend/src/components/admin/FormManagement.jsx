import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Mail, Phone, User, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';

const FormManagement = () => {
  const [forms, setForms] = useState({
    contact: {
      enabled: true,
      fields: [
        { name: 'name', label: 'Full Name', type: 'text', required: true },
        { name: 'email', label: 'Email Address', type: 'email', required: true },
        { name: 'phone', label: 'Phone Number', type: 'tel', required: true },
        { name: 'service', label: 'Service Interested In', type: 'select', required: true, options: ['General Dentistry', 'Cosmetic Dentistry', 'Orthodontics', 'Oral Surgery'] },
        { name: 'message', label: 'Message', type: 'textarea', required: false }
      ]
    },
    appointment: {
      enabled: true,
      fields: [
        { name: 'name', label: 'Full Name', type: 'text', required: true },
        { name: 'email', label: 'Email Address', type: 'email', required: true },
        { name: 'phone', label: 'Phone Number', type: 'tel', required: true },
        { name: 'date', label: 'Preferred Date', type: 'date', required: true },
        { name: 'time', label: 'Preferred Time', type: 'time', required: true },
        { name: 'service', label: 'Service', type: 'select', required: true, options: ['General Dentistry', 'Cosmetic Dentistry', 'Orthodontics', 'Oral Surgery'] },
        { name: 'message', label: 'Additional Information', type: 'textarea', required: false }
      ]
    }
  });

  const handleSave = () => {
    // In a real implementation, this would save to a backend
    toast.success('Form settings saved successfully!');
  };

  const toggleForm = (formName) => {
    setForms({
      ...forms,
      [formName]: {
        ...forms[formName],
        enabled: !forms[formName].enabled
      }
    });
  };

  const addField = (formName) => {
    const newField = {
      name: `field${forms[formName].fields.length + 1}`,
      label: `New Field ${forms[formName].fields.length + 1}`,
      type: 'text',
      required: false
    };
    
    setForms({
      ...forms,
      [formName]: {
        ...forms[formName],
        fields: [...forms[formName].fields, newField]
      }
    });
  };

  const removeField = (formName, index) => {
    const newFields = [...forms[formName].fields];
    newFields.splice(index, 1);
    
    setForms({
      ...forms,
      [formName]: {
        ...forms[formName],
        fields: newFields
      }
    });
  };

  const updateField = (formName, index, field, value) => {
    const newFields = [...forms[formName].fields];
    newFields[index] = {
      ...newFields[index],
      [field]: value
    };
    
    setForms({
      ...forms,
      [formName]: {
        ...forms[formName],
        fields: newFields
      }
    });
  };

  return (
    <div className="w-full max-w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Form Management</h2>
        <Button 
          onClick={handleSave}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          <Save className="w-4 h-4 mr-2" />
          Save Settings
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg border border-gray-200 p-6"
        >
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <Mail className="w-5 h-5 text-blue-600 mr-2" />
              <h3 className="text-lg font-semibold">Contact Form</h3>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={forms.contact.enabled}
                onChange={() => toggleForm('contact')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          {forms.contact.enabled && (
            <div className="space-y-4">
              {forms.contact.fields.map((field, index) => (
                <div key={index} className="p-3 border border-gray-200 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Field Label</label>
                      <input
                        type="text"
                        value={field.label}
                        onChange={(e) => updateField('contact', index, 'label', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Field Type</label>
                      <select
                        value={field.type}
                        onChange={(e) => updateField('contact', index, 'type', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded text-sm"
                      >
                        <option value="text">Text</option>
                        <option value="email">Email</option>
                        <option value="tel">Phone</option>
                        <option value="select">Select</option>
                        <option value="textarea">Textarea</option>
                        <option value="date">Date</option>
                        <option value="time">Time</option>
                      </select>
                    </div>
                  </div>
                  
                  {field.type === 'select' && (
                    <div className="mb-2">
                      <label className="block text-xs font-medium text-gray-500 mb-1">Options (comma separated)</label>
                      <input
                        type="text"
                        value={field.options ? field.options.join(', ') : ''}
                        onChange={(e) => updateField('contact', index, 'options', e.target.value.split(',').map(opt => opt.trim()))}
                        className="w-full p-2 border border-gray-300 rounded text-sm"
                      />
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={field.required}
                        onChange={(e) => updateField('contact', index, 'required', e.target.checked)}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-600">Required</span>
                    </label>
                    <Button
                      onClick={() => removeField('contact', index)}
                      className="bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-1"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
              
              <Button
                onClick={() => addField('contact')}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800"
              >
                Add Field
              </Button>
            </div>
          )}
        </motion.div>

        {/* Appointment Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg border border-gray-200 p-6"
        >
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <Calendar className="w-5 h-5 text-blue-600 mr-2" />
              <h3 className="text-lg font-semibold">Appointment Form</h3>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={forms.appointment.enabled}
                onChange={() => toggleForm('appointment')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          {forms.appointment.enabled && (
            <div className="space-y-4">
              {forms.appointment.fields.map((field, index) => (
                <div key={index} className="p-3 border border-gray-200 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Field Label</label>
                      <input
                        type="text"
                        value={field.label}
                        onChange={(e) => updateField('appointment', index, 'label', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Field Type</label>
                      <select
                        value={field.type}
                        onChange={(e) => updateField('appointment', index, 'type', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded text-sm"
                      >
                        <option value="text">Text</option>
                        <option value="email">Email</option>
                        <option value="tel">Phone</option>
                        <option value="select">Select</option>
                        <option value="textarea">Textarea</option>
                        <option value="date">Date</option>
                        <option value="time">Time</option>
                      </select>
                    </div>
                  </div>
                  
                  {field.type === 'select' && (
                    <div className="mb-2">
                      <label className="block text-xs font-medium text-gray-500 mb-1">Options (comma separated)</label>
                      <input
                        type="text"
                        value={field.options ? field.options.join(', ') : ''}
                        onChange={(e) => updateField('appointment', index, 'options', e.target.value.split(',').map(opt => opt.trim()))}
                        className="w-full p-2 border border-gray-300 rounded text-sm"
                      />
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={field.required}
                        onChange={(e) => updateField('appointment', index, 'required', e.target.checked)}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-600">Required</span>
                    </label>
                    <Button
                      onClick={() => removeField('appointment', index)}
                      className="bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-1"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
              
              <Button
                onClick={() => addField('appointment')}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800"
              >
                Add Field
              </Button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default FormManagement;