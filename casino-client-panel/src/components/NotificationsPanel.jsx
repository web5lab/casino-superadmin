import React from 'react';
import { Bell, X, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const notifications = [
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
];



export default function NotificationsPanel({ isOpen, onClose }) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleViewAll = () => {
    onClose();
    navigate('/notifications');
  };

  return (
    <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-lg border border-gray-200 z-50">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-blue-600" />
          <h2 className="font-semibold">Notifications</h2>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <div className="max-h-[480px] overflow-y-auto">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
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
              <div>
                <h3 className="font-medium text-gray-900">{notification.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleViewAll}
          className="w-full text-center text-sm text-blue-600 hover:text-blue-700"
        >
          View all notifications
        </button>
      </div>
    </div>
  );
}