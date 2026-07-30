import React, { useEffect, useState } from 'react';
import {
  Bell,
  CheckCheck,
  Trash2,
  Filter,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Info,
  Clock,
  RefreshCw,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { apiClient } from '../../services/apiClient';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  isRead: boolean;
  createdAt: string;
}

export const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [activeTab, setActiveTab] = useState<'ALL' | 'UNREAD' | 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR'>('ALL');
  const [loading, setLoading] = useState<boolean>(true);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      let endpoint = '/notifications?limit=50';
      if (activeTab === 'UNREAD') {
        endpoint += '&isRead=false';
      } else if (activeTab !== 'ALL') {
        endpoint += `&type=${activeTab}`;
      }

      const response = await apiClient.get(endpoint);
      if (response.data?.data) {
        setNotifications(response.data.data.notifications || []);
        setUnreadCount(response.data.data.unreadCount || 0);
      }
    } catch {
      // Fallback mock dataset for frontend preview
      const mockData: NotificationItem[] = [
        {
          id: 'n-101',
          title: 'Payment Successful',
          message: 'Payment of ₹120.00 received for Order ORD-20260730-9941. Invoice CP-INV-9941 generated.',
          type: 'SUCCESS',
          isRead: false,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'n-102',
          title: 'Printing Started',
          message: 'Your print job JOB-20260730-C41A is currently printing on HP LaserJet Pro #2.',
          type: 'INFO',
          isRead: false,
          createdAt: new Date(Date.now() - 3600000).toISOString(),
        },
        {
          id: 'n-103',
          title: 'Order Ready for Pickup',
          message: 'Your print order ORD-20260730-4412 is completed and ready for pickup at Main Print Shop Counter 1.',
          type: 'SUCCESS',
          isRead: true,
          createdAt: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          id: 'n-104',
          title: 'Print Job Warning',
          message: 'Soft binding options updated for document Assignment_V2.pdf based on page count rules.',
          type: 'WARNING',
          isRead: true,
          createdAt: new Date(Date.now() - 172800000).toISOString(),
        },
      ];

      if (activeTab === 'UNREAD') {
        setNotifications(mockData.filter(n => !n.isRead));
      } else if (activeTab !== 'ALL') {
        setNotifications(mockData.filter(n => n.type === activeTab));
      } else {
        setNotifications(mockData);
      }
      setUnreadCount(mockData.filter(n => !n.isRead).length);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [activeTab]);

  const handleMarkRead = async (id: string) => {
    try {
      await apiClient.patch(`/notifications/${id}/read`);
      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch {
      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await apiClient.patch('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch {
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await apiClient.delete(`/notifications/${id}`);
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'SUCCESS':
        return (
          <Badge variant="success" className="flex items-center space-x-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>Success</span>
          </Badge>
        );
      case 'WARNING':
        return (
          <Badge variant="warning" className="flex items-center space-x-1">
            <AlertTriangle className="w-3 h-3" />
            <span>Warning</span>
          </Badge>
        );
      case 'ERROR':
        return (
          <Badge variant="error" className="flex items-center space-x-1">
            <AlertCircle className="w-3 h-3" />
            <span>Error</span>
          </Badge>
        );
      default:
        return (
          <Badge variant="info" className="flex items-center space-x-1">
            <Info className="w-3 h-3" />
            <span>Info</span>
          </Badge>
        );
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fadeIn">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-primary-900 via-primary-800 to-slate-900 p-6 rounded-3xl text-white shadow-xl">
          <div>
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl">
                <Bell className="w-6 h-6 text-primary-300" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Notification Center</h1>
                <p className="text-xs text-primary-200 mt-0.5">
                  Stay updated on print order statuses, payments, and system alerts
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchNotifications}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>

            {unreadCount > 0 && (
              <Button
                size="sm"
                onClick={handleMarkAllRead}
                className="bg-white text-primary-900 hover:bg-slate-100 font-semibold"
              >
                <CheckCheck className="w-4 h-4 mr-2" />
                Mark All Read ({unreadCount})
              </Button>
            )}
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800">
          {(['ALL', 'UNREAD', 'INFO', 'SUCCESS', 'WARNING', 'ERROR'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap ${
                activeTab === tab
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              {tab === 'ALL' ? 'All Notifications' : tab === 'UNREAD' ? `Unread (${unreadCount})` : tab}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <Card className="shadow-lg border-slate-200/80 dark:border-slate-800">
          <CardHeader className="border-b border-slate-100 dark:border-slate-800 flex flex-row items-center justify-between">
            <CardTitle className="text-base font-bold flex items-center space-x-2">
              <Filter className="w-4 h-4 text-primary-600" />
              <span>
                {activeTab === 'ALL' ? 'All Activity' : `${activeTab} Notifications`}
              </span>
            </CardTitle>
            <span className="text-xs text-slate-400 font-medium">
              Showing {notifications.length} notification{notifications.length === 1 ? '' : 's'}
            </span>
          </CardHeader>

          <CardContent className="p-0">
            {loading ? (
              <div className="p-12 text-center text-slate-400">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-primary-500" />
                <p className="text-xs">Loading notifications...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-12 text-center text-slate-400 space-y-2">
                <Bell className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-700" />
                <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">No notifications found</h3>
                <p className="text-xs text-slate-400">
                  {activeTab === 'UNREAD' ? 'You have read all your notifications!' : 'No matching notifications to display.'}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {notifications.map(item => (
                  <div
                    key={item.id}
                    className={`p-5 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                      !item.isRead ? 'bg-primary-50/40 dark:bg-primary-950/20' : 'hover:bg-slate-50 dark:hover:bg-slate-800/30'
                    }`}
                  >
                    <div className="flex items-start space-x-4">
                      <div className="mt-1">{getTypeBadge(item.type)}</div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                            {item.title}
                          </h4>
                          {!item.isRead && (
                            <span className="w-2 h-2 rounded-full bg-primary-600 animate-pulse" />
                          )}
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 max-w-2xl leading-relaxed">
                          {item.message}
                        </p>
                        <div className="flex items-center space-x-2 text-[11px] text-slate-400 mt-2">
                          <Clock className="w-3 h-3" />
                          <span>{new Date(item.createdAt).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 sm:self-center self-end">
                      {!item.isRead && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleMarkRead(item.id)}
                          className="text-xs text-primary-600 hover:text-primary-700 dark:text-primary-400"
                        >
                          Mark Read
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(item.id)}
                        className="text-xs text-slate-400 hover:text-rose-600 dark:hover:text-rose-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
  );
};
