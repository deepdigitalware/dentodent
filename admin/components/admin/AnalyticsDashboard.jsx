import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Eye, 
  Calendar, 
  Mail, 
  FileText, 
  PieChart, 
  Activity,
  Filter,
  Download,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { Button } from '../ui/button';
import { useToast } from '../ui/use-toast';
import { useContent } from '../../contexts/ContentContext';

const AnalyticsDashboard = () => {
  const [metrics, setMetrics] = useState({
    totalVisitors: 0,
    pageViews: 0,
    contactForms: 0,
    appointments: 0,
    imagesCount: 0,
    contentSections: 0,
    formsSubmissions: 0,
    recentActivities: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dateRange, setDateRange] = useState('7d');
  const [trafficData, setTrafficData] = useState([]);
  const [topPages, setTopPages] = useState([]);
  const { toast } = useToast();
  const { apiUrl } = useContent();

  const fetchWithRefresh = async (url, options = {}) => {
    const token = localStorage.getItem('admin_token');
    const refreshToken = localStorage.getItem('admin_refresh_token');
    const opts = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    };
    let res = await fetch(url, opts);
    if (res.status === 401 || res.status === 403) {
      if (refreshToken) {
        const r = await fetch(`${apiUrl}/api/token/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken })
        });
        if (r.ok) {
          const data = await r.json();
          if (data.token) {
            localStorage.setItem('admin_token', data.token);
            opts.headers.Authorization = `Bearer ${data.token}`;
            res = await fetch(url, opts);
          }
        }
      }
    }
    return res;
  };

  const fetchMetrics = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetchWithRefresh(`${apiUrl}/api/metrics`);
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || `Failed to load metrics (${response.status})`);
      }
      const data = await response.json();
      setMetrics(data);
    } catch (e) {
      setError(e.message);
      toast({
        title: "Error",
        description: `Failed to load metrics: ${e.message}`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      // Mock data for demonstration
      setTrafficData([
        { date: '2025-11-01', visitors: 120, pageViews: 340 },
        { date: '2025-11-02', visitors: 180, pageViews: 420 },
        { date: '2025-11-03', visitors: 150, pageViews: 380 },
        { date: '2025-11-04', visitors: 210, pageViews: 520 },
        { date: '2025-11-05', visitors: 190, pageViews: 480 },
        { date: '2025-11-06', visitors: 240, pageViews: 610 },
        { date: '2025-11-07', visitors: 220, pageViews: 550 }
      ]);
      
      setTopPages([
        { page: '/home', views: 1240 },
        { page: '/services', views: 890 },
        { page: '/about', views: 720 },
        { page: '/contact', views: 650 },
        { page: '/blog', views: 580 }
      ]);
    } catch (e) {
      toast({
        title: "Error",
        description: `Failed to load analytics data: ${e.message}`,
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchMetrics();
    fetchAnalytics();
  }, [apiUrl]);

  const handleRefresh = () => {
    fetchMetrics();
    fetchAnalytics();
  };

  const handleExport = () => {
    toast({ title: "Info", description: "Export functionality would be implemented here." });
  };

  const statCards = [
    { 
      label: 'Total Visitors', 
      value: metrics.totalVisitors, 
      color: 'from-blue-500 to-blue-600', 
      icon: Users,
      change: '+12% from last week'
    },
    { 
      label: 'Page Views', 
      value: metrics.pageViews, 
      color: 'from-green-500 to-green-600', 
      icon: Eye,
      change: '+8% from last week'
    },
    { 
      label: 'Contact Forms', 
      value: metrics.contactForms, 
      color: 'from-purple-500 to-purple-600', 
      icon: Mail,
      change: '+5% from last week'
    },
    { 
      label: 'Appointments', 
      value: metrics.appointments, 
      color: 'from-orange-500 to-orange-600', 
      icon: Calendar,
      change: '+15% from last week'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">View website traffic and user analytics</p>
        </div>
        <div className="flex space-x-3">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
          </div>
          <Button onClick={handleRefresh} variant="outline" className="flex items-center space-x-2">
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </Button>
          <Button onClick={handleExport} variant="outline" className="flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-4 sm:p-6 shadow-lg">
            <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center mb-3 sm:mb-4`}>
              <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800">{loading ? '—' : stat.value.toLocaleString()}</h3>
            <p className="text-gray-600 text-sm sm:text-base">{stat.label}</p>
            <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Traffic Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Traffic Overview</h2>
            <BarChart3 className="w-5 h-5 text-gray-500" />
          </div>
          <div className="h-64 flex items-center justify-center">
            {loading ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            ) : (
              <div className="text-center">
                <BarChart3 className="w-16 h-16 text-gray-300 mx-auto" />
                <p className="mt-2 text-gray-500">Traffic chart visualization would be implemented here</p>
              </div>
            )}
          </div>
        </div>

        {/* Top Pages */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Top Pages</h2>
            <FileText className="w-5 h-5 text-gray-500" />
          </div>
          <div className="space-y-3">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-10"></div>
                </div>
              ))
            ) : (
              topPages.map((page, index) => (
                <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-blue-800">{index + 1}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{page.page}</span>
                  </div>
                  <span className="text-sm text-gray-600">{page.views.toLocaleString()}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activities</h2>
            <Activity className="w-5 h-5 text-gray-500" />
          </div>
          <div className="space-y-3">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                </div>
              ))
            ) : metrics.recentActivities && metrics.recentActivities.length > 0 ? (
              metrics.recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {activity.action}{activity.section ? `: ${activity.section}` : ''}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(activity.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Activity className="w-12 h-12 text-gray-300 mx-auto" />
                <p className="mt-2 text-gray-500">No recent activities</p>
              </div>
            )}
          </div>
        </div>

        {/* Engagement Metrics */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Engagement Metrics</h2>
            <TrendingUp className="w-5 h-5 text-gray-500" />
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Bounce Rate</span>
                <span className="font-medium">32%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '32%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Avg. Session Duration</span>
                <span className="font-medium">2m 45s</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '65%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Pages per Session</span>
                <span className="font-medium">3.2</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: '72%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">New Visitors</span>
                <span className="font-medium">68%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-orange-600 h-2 rounded-full" style={{ width: '68%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;