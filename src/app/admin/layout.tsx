// app/components/layout/AdminLayout.tsx
'use client';

import { useState } from 'react';
import Sidebar from '@/components/admin/Sidebar';
import Header from '@/components/admin/Header';
import { ReactNode } from 'react';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />

      <div className={`transition-all duration-500 ease-out ${sidebarOpen ? 'lg:pl-64' : 'lg:pl-0'}`}>
        <Header sidebarOpen={sidebarOpen} onToggleSidebar={toggleSidebar} />

        <main className="p-6 transition-all duration-300">
          <div className={`transition-all duration-500 ${sidebarOpen ? 'lg:max-w-[calc(100vw-20rem)]' : 'lg:max-w-full'}`}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}