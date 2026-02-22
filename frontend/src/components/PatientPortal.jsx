import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Calendar, 
  FileText, 
  CreditCard, 
  Settings, 
  LogOut, 
  Bell, 
  Shield, 
  Download,
  Eye,
  Edit,
  Plus,
  Clock,
  CheckCircle,
  AlertCircle,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const PatientPortal = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const [patientData] = useState({
    name: 'John Doe',
    email: 'john.doe@email.com',
    phone: '+91 9876543210',
    dateOfBirth: '1985-06-15',
    gender: 'Male',
    address: '123 Park Street, Kolkata, West Bengal 700016',
    emergencyContact: 'Jane Doe (+91 9876543211)',
    insuranceProvider: 'Health Insurance Co.',
    policyNumber: 'HI123456789'
  });

  const [appointments] = useState([
    {
      id: 1,
      date: '2024-01-20',
      time: '10:00 AM',
      service: 'General Checkup',
      doctor: 'Dr. Setketu Chakraborty',
      status: 'confirmed',
      notes: 'Regular dental examination and cleaning'
    },
    {
      id: 2,
      date: '2024-01-25',
      time: '2:30 PM',
      service: 'Teeth Whitening',
      doctor: 'Dr. Setketu Chakraborty',
      status: 'scheduled',
      notes: 'Professional teeth whitening treatment'
    },
    {
      id: 3,
      date: '2024-01-15',
      time: '4:00 PM',
      service: 'Root Canal',
      doctor: 'Dr. Setketu Chakraborty',
      status: 'completed',
      notes: 'Root canal treatment completed successfully'
    }
  ]);

  const [medicalHistory] = useState([
    {
      id: 1,
      date: '2024-01-15',
      treatment: 'Root Canal Treatment',
      doctor: 'Dr. Setketu Chakraborty',
      notes: 'Treatment completed successfully. No complications.',
      status: 'completed'
    },
    {
      id: 2,
      date: '2023-12-10',
      treatment: 'Dental Cleaning',
      doctor: 'Dr. Setketu Chakraborty',
      notes: 'Regular cleaning and examination. Good oral health.',
      status: 'completed'
    },
    {
      id: 3,
      date: '2023-11-05',
      treatment: 'Dental Filling',
      doctor: 'Dr. Setketu Chakraborty',
      notes: 'Composite filling placed on tooth #14.',
      status: 'completed'
    }
  ]);

  const [billingHistory] = useState([
    {
      id: 1,
      date: '2024-01-15',
      service: 'Root Canal Treatment',
      amount: 4000,
      status: 'paid',
      paymentMethod: 'Credit Card'
    },
    {
      id: 2,
      date: '2023-12-10',
      service: 'Dental Cleaning',
      amount: 800,
      status: 'paid',
      paymentMethod: 'Cash'
    },
    {
      id: 3,
      date: '2024-01-20',
      service: 'General Checkup',
      amount: 500,
      status: 'pending',
      paymentMethod: 'Credit Card'
    }
  ]);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: User },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'medical-history', label: 'Medical History', icon: FileText },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginForm.email && loginForm.password) {
      setIsLoggedIn(true);
      toast({
        title: "✅ Login Successful",
        description: "Welcome to your patient portal!"
      });
    } else {
      toast({
        title: "❌ Login Failed",
        description: "Please enter valid credentials."
      });
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setLoginForm({ email: '', password: '', rememberMe: false });
    toast({
      title: "👋 Logged Out",
      description: "You have been successfully logged out."
    });
  };

  const handleReschedule = (appointmentId) => {
    toast({
      title: "📅 Reschedule Request",
      description: "Your reschedule request has been submitted. We'll contact you soon."
    });
  };

  const handleCancel = (appointmentId) => {
    toast({
      title: "❌ Appointment Cancelled",
      description: "Your appointment has been cancelled successfully."
    });
  };

  const handleDownloadReport = (reportId) => {
    toast({
      title: "📥 Download Started",
      description: "Your medical report is being downloaded."
    });
  };

  const handlePayment = (billId) => {
    toast({
      title: "💳 Payment",
      description: "Redirecting to payment gateway..."
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
      case 'completed':
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'scheduled':
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const renderLoginForm = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Patient Portal</h1>
          <p className="text-gray-600">Access your dental records and appointments</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              value={loginForm.email}
              onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="your.email@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={loginForm.password}
              onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your password"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={loginForm.rememberMe}
                onChange={(e) => setLoginForm({ ...loginForm, rememberMe: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Remember me</span>
            </label>
            <a href="#" className="text-sm text-blue-600 hover:underline">Forgot password?</a>
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white py-3 rounded-lg font-semibold transition-all duration-300"
          >
            Sign In
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <a href="#" className="text-blue-600 hover:underline">Contact us to register</a>
          </p>
        </div>
      </motion.div>
    </div>
  );

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Upcoming Appointments</p>
              <p className="text-2xl font-bold">{appointments.filter(apt => apt.status === 'scheduled' || apt.status === 'confirmed').length}</p>
            </div>
            <Calendar className="w-8 h-8 text-blue-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Completed Treatments</p>
              <p className="text-2xl font-bold">{medicalHistory.length}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Pending Bills</p>
              <p className="text-2xl font-bold">{billingHistory.filter(bill => bill.status === 'pending').length}</p>
            </div>
            <CreditCard className="w-8 h-8 text-purple-200" />
          </div>
        </motion.div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-6 shadow-lg"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Appointments</h3>
          <div className="space-y-3">
            {appointments.slice(0, 3).map((appointment) => (
              <div key={appointment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">{appointment.service}</p>
                  <p className="text-sm text-gray-600">{appointment.date} at {appointment.time}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(appointment.status)}`}>
                  {appointment.status}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl p-6 shadow-lg"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => setActiveTab('appointments')}
              className="bg-blue-600 hover:bg-blue-700 text-white p-3 text-sm"
            >
              Book a Free Appointment
            </Button>
            <Button
              onClick={() => setActiveTab('billing')}
              className="bg-green-600 hover:bg-green-700 text-white p-3 text-sm"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              View Bills
            </Button>
            <Button
              onClick={() => setActiveTab('medical-history')}
              className="bg-purple-600 hover:bg-purple-700 text-white p-3 text-sm"
            >
              <FileText className="w-4 h-4 mr-2" />
              Medical Records
            </Button>
            <Button
              onClick={() => setActiveTab('settings')}
              className="bg-gray-600 hover:bg-gray-700 text-white p-3 text-sm"
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );

  const renderAppointments = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-gray-800">My Appointments</h3>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Book a Free Appointment
        </Button>
      </div>

      <div className="space-y-4">
        {appointments.map((appointment) => (
          <motion.div
            key={appointment.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="text-lg font-semibold text-gray-800">{appointment.service}</h4>
                <p className="text-gray-600">with {appointment.doctor}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(appointment.status)}`}>
                {appointment.status}
              </span>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="flex items-center space-x-2 text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>{appointment.date}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Clock className="w-4 h-4" />
                <span>{appointment.time}</span>
              </div>
            </div>

            {appointment.notes && (
              <p className="text-gray-600 mb-4">{appointment.notes}</p>
            )}

            <div className="flex space-x-2">
              {appointment.status === 'scheduled' && (
                <>
                  <Button
                    onClick={() => handleReschedule(appointment.id)}
                    variant="outline"
                    className="border-blue-600 text-blue-600 hover:bg-blue-50"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Reschedule
                  </Button>
                  <Button
                    onClick={() => handleCancel(appointment.id)}
                    variant="outline"
                    className="border-red-600 text-red-600 hover:bg-red-50"
                  >
                    Cancel
                  </Button>
                </>
              )}
              <Button
                variant="outline"
                className="border-gray-600 text-gray-600 hover:bg-gray-50"
              >
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderMedicalHistory = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-gray-800">Medical History</h3>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Download className="w-4 h-4 mr-2" />
          Download Report
        </Button>
      </div>

      <div className="space-y-4">
        {medicalHistory.map((record) => (
          <motion.div
            key={record.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-6 shadow-lg"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="text-lg font-semibold text-gray-800">{record.treatment}</h4>
                <p className="text-gray-600">by {record.doctor}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">{record.date}</p>
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(record.status)}`}>
                  {record.status}
                </span>
              </div>
            </div>

            <p className="text-gray-600 mb-4">{record.notes}</p>

            <div className="flex space-x-2">
              <Button
                onClick={() => handleDownloadReport(record.id)}
                variant="outline"
                className="border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Report
              </Button>
              <Button
                variant="outline"
                className="border-gray-600 text-gray-600 hover:bg-gray-50"
              >
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderBilling = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-gray-800">Billing History</h3>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Download className="w-4 h-4 mr-2" />
          Download Invoice
        </Button>
      </div>

      <div className="space-y-4">
        {billingHistory.map((bill) => (
          <motion.div
            key={bill.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-6 shadow-lg"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="text-lg font-semibold text-gray-800">{bill.service}</h4>
                <p className="text-gray-600">{bill.date}</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-gray-800">₹{bill.amount}</p>
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(bill.status)}`}>
                  {bill.status}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                Payment Method: {bill.paymentMethod}
              </div>
              <div className="flex space-x-2">
                {bill.status === 'pending' && (
                  <Button
                    onClick={() => handlePayment(bill.id)}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    Pay Now
                  </Button>
                )}
                <Button
                  variant="outline"
                  className="border-gray-600 text-gray-600 hover:bg-gray-50"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-gray-800">Account Settings</h3>

      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h4>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              value={patientData.name}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={patientData.email}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
            <input
              type="tel"
              value={patientData.phone}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
            <input
              type="date"
              value={patientData.dateOfBirth}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
          <textarea
            value={patientData.address}
            rows={3}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <Button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white">
          Save Changes
        </Button>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">Security Settings</h4>
        <div className="space-y-4">
          <Button variant="outline" className="w-full justify-start">
            <Shield className="w-4 h-4 mr-2" />
            Change Password
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <Bell className="w-4 h-4 mr-2" />
            Notification Preferences
          </Button>
        </div>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-red-800 mb-2">Danger Zone</h4>
        <p className="text-red-700 mb-4">These actions cannot be undone.</p>
        <Button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );

  if (!isLoggedIn) {
    return renderLoginForm();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Patient Portal</h1>
            <p className="text-gray-600">Welcome back, {patientData.name}</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-red-600 text-red-600 hover:bg-red-50"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'dashboard' && renderDashboard()}
            {activeTab === 'appointments' && renderAppointments()}
            {activeTab === 'medical-history' && renderMedicalHistory()}
            {activeTab === 'billing' && renderBilling()}
            {activeTab === 'settings' && renderSettings()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PatientPortal;
