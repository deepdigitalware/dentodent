import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Mail, Phone, User, Calendar } from 'lucide-react';
import { Button } from '../ui/button';
import { toast } from 'react-hot-toast';
import { useContent } from '../../contexts/ContentContext';

const FormManagement = () => {
  const { apiUrl, fetchWithRefresh } = useContent();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
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
  const [submissions, setSubmissions] = useState({ contact: [], appointment: [] });

  const normalizeSchema = (schema) => {
    // Ensure schema has expected shape
    const enabled = typeof schema?.enabled === 'boolean' ? schema.enabled : true;
    const fields = Array.isArray(schema?.fields) ? schema.fields : [];
    return { enabled, fields };
  };

  const loadSchemas = async () => {
    setLoading(true);
    setError('');
    try {
      const [contactRes, appointmentRes] = await Promise.all([
        fetchWithRefresh(`${apiUrl}/api/forms/schema/contact`),
        fetchWithRefresh(`${apiUrl}/api/forms/schema/appointment`)
      ]);

      const nextForms = { ...forms };
      if (contactRes.ok) {
        const contactSchema = await contactRes.json();
        nextForms.contact = normalizeSchema(contactSchema);
      }
      if (appointmentRes.ok) {
        const appointmentSchema = await appointmentRes.json();
        nextForms.appointment = normalizeSchema(appointmentSchema);
      }
      setForms(nextForms);
    } catch (e) {
      setError('Failed to load form schemas');
    } finally {
      setLoading(false);
    }
  };

  const loadSubmissions = async (formType) => {
    try {
      const res = await fetchWithRefresh(`${apiUrl}/api/forms/submissions/${formType}`);
      if (!res.ok) return;
      const data = await res.json();
      setSubmissions(prev => ({ ...prev, [formType]: data || [] }));
    } catch (e) {
      // swallow
    }
  };

  useEffect(() => {
    loadSchemas().then(() => {
      loadSubmissions('contact');
      loadSubmissions('appointment');
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiUrl]);

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      const [contactSave, appointmentSave] = await Promise.all([
        fetchWithRefresh(`${apiUrl}/api/forms/schema/contact`, {
          method: 'PUT',
          body: JSON.stringify({ schema: forms.contact })
        }),
        fetchWithRefresh(`${apiUrl}/api/forms/schema/appointment`, {
          method: 'PUT',
          body: JSON.stringify({ schema: forms.appointment })
        })
      ]);

      if (!contactSave.ok || !appointmentSave.ok) {
        const cErr = await contactSave.json().catch(() => ({}));
        const aErr = await appointmentSave.json().catch(() => ({}));
        const message = cErr.error || aErr.error || 'Failed to save one or more schemas';
        setError(message);
        toast.error(message);
        return;
      }
      toast.success('Form settings saved successfully!');
      // Reload submissions to reflect any changes downstream
      loadSubmissions('contact');
      loadSubmissions('appointment');
    } catch (e) {
      setError('Failed to save forms');
      toast.error('Failed to save forms');
    } finally {
      setSaving(false);
    }
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
          disabled={saving}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm mb-4">{error}</div>
      )}

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

              {/* Submissions for Contact Form */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-semibold text-gray-800">Recent Submissions</h4>
                  <Button onClick={() => loadSubmissions('contact')} variant="outline" size="sm">Refresh</Button>
                </div>
                {submissions.contact.length === 0 ? (
                  <p className="text-sm text-gray-500">No submissions yet.</p>
                ) : (
                  <div className="space-y-2">
                    {submissions.contact.slice(0, 5).map((row) => (
                      <div key={row.id} className="p-2 border border-gray-200 rounded text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-700">#{row.id}</span>
                          <span className="text-gray-500">{new Date(row.submitted_at).toLocaleString()}</span>
                        </div>
                        <div className="text-gray-600 truncate">{Object.entries(row.submission || {}).map(([k,v]) => `${k}: ${String(v)}`).slice(0,3).join(' • ')}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
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

              {/* Submissions for Appointment Form */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-semibold text-gray-800">Recent Submissions</h4>
                  <Button onClick={() => loadSubmissions('appointment')} variant="outline" size="sm">Refresh</Button>
                </div>
                {submissions.appointment.length === 0 ? (
                  <p className="text-sm text-gray-500">No submissions yet.</p>
                ) : (
                  <div className="space-y-2">
                    {submissions.appointment.slice(0, 5).map((row) => (
                      <div key={row.id} className="p-2 border border-gray-200 rounded text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-700">#{row.id}</span>
                          <span className="text-gray-500">{new Date(row.submitted_at).toLocaleString()}</span>
                        </div>
                        <div className="text-gray-600 truncate">{Object.entries(row.submission || {}).map(([k,v]) => `${k}: ${String(v)}`).slice(0,3).join(' • ')}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default FormManagement;
