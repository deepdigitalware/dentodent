import React, { useState } from 'react';
import { Calendar, Clock, User, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '../ui/button';

const AppointmentManagement = () => {
  const [activeTab, setActiveTab] = useState('bookings');

  const tabs = [
    { id: 'schedule', label: 'Schedule', icon: Calendar },
    { id: 'bookings', label: 'Bookings', icon: User },
    { id: 'availability', label: 'Availability', icon: Clock },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="border-b border-gray-100 p-4">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          Appointment Management
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
        <div className="text-center py-12 text-gray-500">
          <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900">No appointments found</h3>
          <p>Appointment data will appear here.</p>
        </div>
      </div>
    </div>
  );
};

export default AppointmentManagement;
