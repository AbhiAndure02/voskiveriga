// app/components/admin/Header.tsx
'use client';

import {
  Bell,
  Search,
  Menu,
  User,
  ChevronDown,
  HelpCircle,
  Settings,
  LogOut,
  Eye,
  Calendar,
  Activity
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

interface HeaderProps {
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
}

export default function Header({ onToggleSidebar, sidebarOpen }: HeaderProps) {
  const [search, setSearch] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [admin, setAdmin] = useState<{ name?: string; email?: string; role?: string } | null>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchHeaderData = async () => {
      try {
        const [logsRes, adminRes] = await Promise.all([
          fetch('/api/admin/audit-logs?limit=5', { cache: 'no-store' }),
          fetch('/api/admin/me', { cache: 'no-store' }),
        ]);
        const logsData = await logsRes.json();
        const adminData = await adminRes.json();

        if (logsData.success && Array.isArray(logsData.data)) {
          setNotifications(logsData.data);
        }
        if (adminData.success) {
          setAdmin(adminData.data);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchHeaderData();
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const adminName = admin?.name || 'Admin';
  const adminEmail = admin?.email || '';
  const adminRole = admin?.role || 'Admin';
  const initials = adminName
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'A';
  const formatDate = (value: string) =>
    new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(value));

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center gap-6">
            <button
              onClick={onToggleSidebar}
              aria-label={sidebarOpen ? 'Close admin sidebar' : 'Open admin sidebar'}
              className="lg:hidden p-2.5 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-300 transition-all duration-200"
            >
              <Menu className="w-5 h-5 text-gray-700" />
            </button>

            <div className="relative w-80">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <Search className={`w-4 h-4 ${isSearchFocused ? 'text-blue-600' : 'text-gray-400'}`} />
              </div>
              <input
                type="text"
                placeholder="Search dashboard..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200"
              />

            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Date/Time Filter */}
            <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg">
              <Calendar className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-700">Today</span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </div>

            {/* Notifications */}
            <div className="relative" ref={notificationsRef}>
              <button
                onClick={() => {
                  setIsNotificationsOpen(!isNotificationsOpen);
                  setIsProfileOpen(false);
                }}
                className="p-2.5 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-300 transition-all duration-200 relative"
              >
                <Bell className="w-5 h-5 text-gray-700" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </button>

              {/* Notifications Panel */}
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
                  <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-gray-900">Notifications</h3>
                      <span className="text-xs text-slate-500 font-medium">Audit activity</span>
                    </div>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center">
                        <Activity className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                        <p className="text-sm font-medium text-slate-700">No admin activity yet</p>
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <div
                          key={notification._id || notification.id}
                          className="p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-start gap-3">
                            <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                              <Bell className="w-4 h-4" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">
                                {notification.action} {notification.entityType}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {notification.adminEmail || notification.admin?.email || 'Admin'} - {formatDate(notification.createdAt)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <button className="hidden lg:flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Eye className="w-4 h-4" />
              <span className="text-sm font-medium">Quick View</span>
            </button>

            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => {
                  setIsProfileOpen(!isProfileOpen);
                  setIsNotificationsOpen(false);
                }}
                className="flex items-center gap-3 p-1 pl-3 pr-2 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-300 transition-all duration-200"
              >
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">{adminName}</p>
                  <p className="text-xs text-gray-500">{adminRole}</p>
                </div>
                <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">{initials}</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Profile Panel */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center font-bold text-white">
                        {initials}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{adminName}</h3>
                        <p className="text-xs text-gray-600">{adminEmail || 'Signed in admin'}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-2">
                    <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 transition-colors">
                      <User className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">My Profile</span>
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 transition-colors">
                      <Settings className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">Settings</span>
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 transition-colors">
                      <HelpCircle className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">Help</span>
                    </button>
                    <div className="mx-2 my-2 h-px bg-gray-200"></div>
                    <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-red-50 text-red-600 transition-colors">
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm font-medium">Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
