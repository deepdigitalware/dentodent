import React, { useState } from 'react';
import { Save, Settings, Shield, Globe, Database } from 'lucide-react';
import { Button } from '../ui/button';
import { useToast } from '../ui/use-toast';

const SettingsManagement = () => {
  const [activeTab, setActiveTab] = useState('general');
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Your settings have been saved successfully.",
    });
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'seo', label: 'SEO', icon: Globe },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'backup', label: 'Backup', icon: Database },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="border-b border-gray-100 p-4">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Settings className="w-5 h-5 text-blue-600" />
          System Settings
        </h2>
      </div>

      <div className="flex border-b border-gray-100 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-6">
        <div className="max-w-2xl space-y-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-800 text-sm">
            This section allows you to configure global system settings.
          </div>
          
          <div className="space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-gray-700">Site Name</span>
              <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" defaultValue="Dent 'O' Dent" />
            </label>
            
            <label className="block">
              <span className="text-sm font-medium text-gray-700">Support Email</span>
              <input type="email" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" defaultValue="support@dentodent.com" />
            </label>
          </div>

          <div className="pt-4">
            <Button onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsManagement;
