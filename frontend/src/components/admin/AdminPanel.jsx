import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, 
  Users, 
  FileText, 
  Image, 
  Mail, 
  BarChart3, 
  LogOut, 
  Menu, 
  X,
  Eye,
  Edit,
  Save,
  Upload,
  Database
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import AdminLogin from './AdminLogin';
import ContentManager from './ContentManagement';
import ImageManager from './ImageManagement';
import SettingsManager from './SettingsManagement';
import FormManager from './FormManagement';
import BackupManager from './BackupManagement';

const AdminPanel = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already authenticated
    const authToken = localStorage.getItem('admin_token');
    if (authToken) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (credentials) => {
    // Authentication is now handled by AdminLogin component
    setIsAuthenticated(true);
    toast({
      title: "✅ Login Successful",
      description: "Welcome to the admin panel!"
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setIsAuthenticated(false);
    setActiveTab('dashboard');
    toast({
      title: "👋 Logged Out",
      description: "You have been successfully logged out."
    });
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'content', label: 'Content Management', icon: FileText },
    { id: 'images', label: 'Image Management', icon: Image },
    { id: 'forms', label: 'Form Management', icon: Mail },
    { id: 'backup', label: 'Backup & Migration', icon: Database },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'content':
        return <ContentManager />;
      case 'images':
        return <ImageManager />;
      case 'forms':
        return <FormManager />;
      case 'backup':
        return <BackupManager />;
      case 'settings':
        return <SettingsManager />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex">
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className="fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-blue-900 to-blue-800 text-white z-50 shadow-2xl overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">D</span>
                  </div>
                  <div>
                    <h1 className="text-lg font-bold">Admin Panel</h1>
                    <p className="text-blue-200 text-sm">Dent "O" Dent</p>
                  </div>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-1 hover:bg-blue-700 rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="space-y-2">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      activeTab === item.id
                        ? 'bg-blue-600 shadow-lg'
                        : 'hover:bg-blue-700'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>

              <div className="absolute bottom-6 left-6 right-6">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-4 py-3 bg-red-600 hover:bg-red-700 rounded-lg transition-all duration-200"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'ml-0'} w-full`}>
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>
              <h2 className="text-xl font-semibold text-gray-800">
                {menuItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
              </h2>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => window.open('/', '_blank')}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <Eye className="w-4 h-4" />
                <span>View Website</span>
              </Button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6 w-full max-w-full overflow-x-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

// Dashboard Component
const AdminDashboard = () => {
  const stats = [
    { label: 'Total Visitors', value: '12,345', change: '+12%', color: 'from-blue-500 to-blue-600' },
    { label: 'Contact Forms', value: '89', change: '+5%', color: 'from-green-500 to-green-600' },
    { label: 'Appointments', value: '156', change: '+18%', color: 'from-purple-500 to-purple-600' },
    { label: 'Page Views', value: '45,678', change: '+8%', color: 'from-orange-500 to-orange-600' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl p-6 shadow-lg"
          >
            <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center mb-4`}>
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
            <p className="text-gray-600">{stat.label}</p>
            <span className="text-green-500 text-sm font-medium">{stat.change}</span>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-6 shadow-lg"
        >
          <h3 className="text-lg font-semibold mb-4">Recent Activities</h3>
          <div className="space-y-3">
            {[
              'New contact form submission',
              'Website content updated',
              'New appointment booked',
              'Image gallery updated'
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-700">{activity}</span>
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
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Edit Homepage', icon: Edit },
              { label: 'Upload Images', icon: Upload },
              { label: 'View Forms', icon: Mail },
              { label: 'Settings', icon: Settings }
            ].map((action, index) => (
              <button
                key={index}
                className="flex flex-col items-center space-y-2 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 rounded-lg transition-all duration-200"
              >
                <action.icon className="w-6 h-6 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">{action.label}</span>
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminPanel;