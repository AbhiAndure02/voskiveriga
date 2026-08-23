// app/components/admin/Sidebar.tsx
'use client';

import {
  Home,
  Users,
  ShoppingCart,
  BarChart,
  Settings,
  LogOut,
  ChevronRight,
  PlusCircle,
  Layers,
  X,
  Zap,
  Shield,
  Ticket
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const menuItems = [
  {
    name: 'Dashboard',
    icon: <Home size={20} />,
    path: '/admin/dashboard',
    badgeKey: null
  },
  {
    name: 'Users',
    icon: <Users size={20} />,
    path: '/admin/users',
    badgeKey: 'totalCustomers'
  },
  {
    name: 'Coupons & Offers',
    icon: <Ticket size={20} />,
    path: '/admin/coupons',
    badgeKey: 'totalCoupons'
  },
  {
    name: 'Add Product',
    icon: <PlusCircle size={20} />,
    path: '/admin/add-product',
    badgeKey: null
  },
  {
    name: 'Products',
    icon: <Layers size={20} />,
    path: '/admin/get-products',
    badgeKey: 'totalProducts'
  },
  {
    name: 'Orders',
    icon: <ShoppingCart size={20} />,
    path: '/admin/orders',
    badgeKey: 'todayOrdersCount'
  },
  {
    name: 'Analytics',
    icon: <BarChart size={20} />,
    path: '/admin/analytics',
    badgeKey: null
  },
  {
    name: 'Settings',
    icon: <Settings size={20} />,
    path: '/admin/settings',
    badgeKey: null
  },
];

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const [metrics, setMetrics] = useState<Record<string, number>>({});
  const [admin, setAdmin] = useState<{ name?: string; email?: string; role?: string } | null>(null);

  useEffect(() => {
    const fetchLiveAdminData = async () => {
      try {
        const [dashboardRes, adminRes] = await Promise.all([
          fetch('/api/admin/dashboard', { cache: 'no-store' }),
          fetch('/api/admin/me', { cache: 'no-store' }),
        ]);
        const dashboardData = await dashboardRes.json();
        const adminData = await adminRes.json();

        if (dashboardData.success) {
          setMetrics(dashboardData.data.metrics || {});
        }
        if (adminData.success) {
          setAdmin(adminData.data);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchLiveAdminData();
  }, []);

  const adminName = admin?.name || 'Admin';
  const adminEmail = admin?.email || '';
  const initials = adminName
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'A';

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden transition-all duration-200"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-40 h-screen
        transform transition-all duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        w-64 lg:translate-x-0 lg:w-64
      `}>
        {/* Sidebar Container */}
        <div className="relative h-full bg-white border-r border-gray-200 shadow-xl">

          {/* Sidebar Content */}
          <div className="h-full flex flex-col">

            {/* Sidebar Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <Link href="/admin/dashboard" className="flex items-center gap-3 group">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h1 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      Voskiveriga
                    </h1>
                    <p className="text-xs text-gray-500">Admin Panel</p>
                  </div>
                </Link>

                {/* Close Button - Mobile Only */}
                <button
                  onClick={onToggle}
                  className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 overflow-y-auto">
              <div className="mb-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">
                  Main Menu
                </p>
              </div>

              <ul className="space-y-1">
                {menuItems.map((item) => {
                  const isActive = pathname === item.path || pathname?.startsWith(item.path + '/');
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.path}
                        className={`
                          group flex items-center justify-between px-3 py-3 rounded-lg
                          transition-all duration-200 relative
                          ${isActive
                            ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
                            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                          }
                        `}
                      >
                        {/* Icon and Text */}
                        <div className="flex items-center gap-3">
                          <div className={`
                            transition-colors duration-200
                            ${isActive
                              ? 'text-blue-600'
                              : 'text-gray-500 group-hover:text-gray-700'
                            }
                          `}>
                            {item.icon}
                          </div>
                          <span className="font-medium text-sm">
                            {item.name}
                          </span>
                        </div>

                        {/* Badge */}
                        {item.badgeKey && metrics[item.badgeKey] !== undefined && (
                          <span className={`
                            text-xs font-semibold px-2 py-1 rounded-full
                            ${isActive
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200 group-hover:text-gray-800'
                            }
                          `}>
                            {metrics[item.badgeKey]}
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>

              {/* Admin Stats */}
              <div className="mt-8 px-3">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                  <div className="flex items-center gap-3 mb-3">
                    <Shield className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-semibold text-gray-900">Admin Status</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total Products</span>
                      <span className="font-semibold text-gray-900">{metrics.totalProducts ?? 0}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Active Users</span>
                      <span className="font-semibold text-gray-900">{metrics.totalCustomers ?? 0}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Today's Orders</span>
                      <span className="font-semibold text-gray-900">{metrics.todayOrdersCount ?? 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            </nav>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">{initials}</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">{adminName}</p>
                  <p className="text-xs text-gray-500">{admin?.role || 'Admin'}</p>
                  {adminEmail && <p className="text-[11px] text-gray-400 truncate">{adminEmail}</p>}
                </div>
              </div>

              <button className="group flex items-center gap-3 w-full px-4 py-3 rounded-lg bg-white border border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200">
                <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-gray-200 transition-colors">
                  <LogOut className="w-4 h-4 text-gray-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  Logout
                </span>
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Desktop Toggle Button (When Sidebar Hidden) */}
      {!isOpen && (
        <button
          onClick={onToggle}
          className="fixed top-6 left-6 z-40 p-3 bg-white border border-gray-300 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:bg-gray-50 lg:hidden"
        >
          <ChevronRight className="w-5 h-5 text-gray-700" />
        </button>
      )}
    </>
  );
}
