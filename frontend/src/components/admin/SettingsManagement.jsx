import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Globe, Palette, Bell, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';

const SettingsManagement = () => {
  const [settings, setSettings] = useState({
    site: {
      name: 'Dent O Dent Dental Clinic',
      description: 'Premier dental clinic in Kolkata',
      keywords: 'dentist, dental clinic, kolkata, teeth, implants',
      language: 'en'
    },
    appearance: {
      theme: 'light',
      primaryColor: '#0ea5e9',
      secondaryColor: '#0891b2'
    },
    notifications: {
      email: true,
      sms: true,
      whatsapp: true
    },
    security: {
      twoFactor: false,
      passwordExpiry: 90
    }
  });

  const handleSave = () => {
    // In a real implementation, this would save to a backend
    toast.success('Settings saved successfully!');
  };

  return (
    <div className="w-full max-w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Settings Management</h2>
        <Button 
          onClick={handleSave}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          <Save className="w-4 h-4 mr-2" />
          Save Settings
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Site Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg border border-gray-200 p-6"
        >
          <div className="flex items-center mb-4">
            <Globe className="w-5 h-5 text-blue-600 mr-2" />
            <h3 className="text-lg font-semibold">Site Settings</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Site Name</label>
              <input
                type="text"
                value={settings.site.name}
                onChange={(e) => setSettings({
                  ...settings,
                  site: {
                    ...settings.site,
                    name: e.target.value
                  }
                })}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={settings.site.description}
                onChange={(e) => setSettings({
                  ...settings,
                  site: {
                    ...settings.site,
                    description: e.target.value
                  }
                })}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="3"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Keywords</label>
              <input
                type="text"
                value={settings.site.keywords}
                onChange={(e) => setSettings({
                  ...settings,
                  site: {
                    ...settings.site,
                    keywords: e.target.value
                  }
                })}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
              <select
                value={settings.site.language}
                onChange={(e) => setSettings({
                  ...settings,
                  site: {
                    ...settings.site,
                    language: e.target.value
                  }
                })}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="en">English</option>
                <option value="hi">Hindi</option>
                <option value="bn">Bengali</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Appearance Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg border border-gray-200 p-6"
        >
          <div className="flex items-center mb-4">
            <Palette className="w-5 h-5 text-blue-600 mr-2" />
            <h3 className="text-lg font-semibold">Appearance</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Theme</label>
              <select
                value={settings.appearance.theme}
                onChange={(e) => setSettings({
                  ...settings,
                  appearance: {
                    ...settings.appearance,
                    theme: e.target.value
                  }
                })}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Primary Color</label>
              <div className="flex items-center">
                <input
                  type="color"
                  value={settings.appearance.primaryColor}
                  onChange={(e) => setSettings({
                    ...settings,
                    appearance: {
                      ...settings.appearance,
                      primaryColor: e.target.value
                    }
                  })}
                  className="w-10 h-10 border border-gray-300 rounded cursor-pointer"
                />
                <span className="ml-2 text-sm text-gray-600">{settings.appearance.primaryColor}</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Color</label>
              <div className="flex items-center">
                <input
                  type="color"
                  value={settings.appearance.secondaryColor}
                  onChange={(e) => setSettings({
                    ...settings,
                    appearance: {
                      ...settings.appearance,
                      secondaryColor: e.target.value
                    }
                  })}
                  className="w-10 h-10 border border-gray-300 rounded cursor-pointer"
                />
                <span className="ml-2 text-sm text-gray-600">{settings.appearance.secondaryColor}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Notification Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg border border-gray-200 p-6"
        >
          <div className="flex items-center mb-4">
            <Bell className="w-5 h-5 text-blue-600 mr-2" />
            <h3 className="text-lg font-semibold">Notifications</h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Email Notifications</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications.email}
                  onChange={(e) => setSettings({
                    ...settings,
                    notifications: {
                      ...settings.notifications,
                      email: e.target.checked
                    }
                  })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-700">SMS Notifications</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications.sms}
                  onChange={(e) => setSettings({
                    ...settings,
                    notifications: {
                      ...settings.notifications,
                      sms: e.target.checked
                    }
                  })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-700">WhatsApp Notifications</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications.whatsapp}
                  onChange={(e) => setSettings({
                    ...settings,
                    notifications: {
                      ...settings.notifications,
                      whatsapp: e.target.checked
                    }
                  })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </motion.div>

        {/* Security Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg border border-gray-200 p-6"
        >
          <div className="flex items-center mb-4">
            <Shield className="w-5 h-5 text-blue-600 mr-2" />
            <h3 className="text-lg font-semibold">Security</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Two-Factor Authentication</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.security.twoFactor}
                  onChange={(e) => setSettings({
                    ...settings,
                    security: {
                      ...settings.security,
                      twoFactor: e.target.checked
                    }
                  })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password Expiry (days)</label>
              <input
                type="number"
                min="1"
                max="365"
                value={settings.security.passwordExpiry}
                onChange={(e) => setSettings({
                  ...settings,
                  security: {
                    ...settings.security,
                    passwordExpiry: parseInt(e.target.value)
                  }
                })}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SettingsManagement;