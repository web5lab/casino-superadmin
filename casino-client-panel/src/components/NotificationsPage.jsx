import React from 'react';
import { Bell, CheckCircle, AlertCircle, Clock, Filter, Trash2 } from 'lucide-react';

const allNotifications = [
  {
    id: '1',
    title: 'New Withdrawal Request',
    message: 'User John Doe requested withdrawal of 2.5 BTC',
    type: 'pending',
    time: '2 min ago',
  },
  {
    id: '2',
    title: 'KYC Verification Complete',
    message: 'Alice Smith has completed KYC verification',
    type: 'success',
    time: '1 hour ago',
  },
  {
    id: '3',
    title: 'Suspicious Activity Detected',
    message: 'Multiple failed login attempts detected',
    type: 'alert',
    time: '2 hours ago',
  },
  {
    id: '4',
    title: 'System Update',
    message: 'System maintenance scheduled for tonight',
    type: 'info',
    time: '5 hours ago',
  },
  {
    id: '5',
    title: 'New User Registration',
    message: 'Bob Wilson has created a new account',
    type: 'info',
    time: '1 day ago',
  },
  {
    id: '6',
    title: 'Large Transaction Alert',
    message: 'Transaction over $100,000 detected',
    type: 'alert',
    time: '1 day ago',
  },
  {
    id: '7',
    title: 'Server Performance',
    message: 'High CPU usage detected on main server',
    type: 'alert',
    time: '2 days ago',
  },
  {
    id: '8',
    title: 'Compliance Update',
    message: 'New compliance rules will be effective from next month',
    type: 'info',
    time: '2 days ago',
  },
];

export default function NotificationsPage() {
  const [selectedType, setSelectedType] = React.useState<string>('all');
  
  const filteredNotifications = selectedType === 'all' 
    ? allNotifications 
    : allNotifications.filter(n => n.type === selectedType);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">Notifications</h1>
        <div className="flex gap-3">
          <select
            className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="all">All Notifications</option>
            <option value="pending">Pending</option>
            <option value="success">Success</option>
            <option value="alert">Alerts</option>
            <option value="info">Information</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 text-red-600 border border-gray-200 rounded-lg hover:bg-red-50">
            <Trash2 className="w-4 h-4" />
            Clear All
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-50 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-xl font-semibold">
                {allNotifications.filter(n => n.type === 'pending').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-50 rounded-lg">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Alerts</p>
              <p className="text-xl font-semibold">
                {allNotifications.filter(n => n.type === 'alert').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Completed</p>
              <p className="text-xl font-semibold">
                {allNotifications.filter(n => n.type === 'success').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm">
        <div className="overflow-hidden">
          {filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className="p-4 border-b border-gray-100 hover:bg-gray-50"
            >
              <div className="flex gap-3">
                <div className="mt-1">
                  {notification.type === 'success' && (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  )}
                  {notification.type === 'alert' && (
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  )}
                  {notification.type === 'pending' && (
                    <Clock className="w-5 h-5 text-yellow-500" />
                  )}
                  {notification.type === 'info' && (
                    <Bell className="w-5 h-5 text-blue-500" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">{notification.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                    </div>
                    <p className="text-xs text-gray-500">{notification.time}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}