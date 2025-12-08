'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    {
      name: 'Dashboard',
      icon: '🏠',
      path: '/dashboard',
      description: 'Overview & Quick Actions'
    },
    {
      name: 'AI Chat',
      icon: '💬',
      path: '/dashboard/chat',
      description: 'General AI Assistant'
    },
    {
      name: 'Report Generator',
      icon: '📊',
      path: '/dashboard/report',
      description: 'Generate Work Reports'
    },
    {
      name: 'Task Planner',
      icon: '📋',
      path: '/dashboard/tasks',
      description: 'Manage Your Tasks'
    },
    {
      name: 'Document Writer',
      icon: '📝',
      path: '/dashboard/document',
      description: 'Create Documents'
    },
    {
      name: 'Creative Studio',
      icon: '🎨',
      path: '/dashboard/creative',
      description: 'Design & Content Ideas'
    },
    {
      name: 'Code Helper',
      icon: '💻',
      path: '/dashboard/code',
      description: 'Code Assistant'
    },
  ];

  return (
    <div className={`${isCollapsed ? 'w-20' : 'w-72'} bg-gradient-to-b from-blue-900 to-purple-900 text-white h-screen fixed left-0 top-0 transition-all duration-300 shadow-2xl z-50`}>
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div>
              <h1 className="text-2xl font-bold">Gia AI</h1>
              <p className="text-xs text-blue-200 mt-1">Your Smart Assistant ✨</p>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            {isCollapsed ? '→' : '←'}
          </button>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="p-4 space-y-2 overflow-y-auto h-[calc(100vh-180px)]">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`
                flex items-center gap-4 p-3 rounded-xl transition-all duration-200
                ${isActive 
                  ? 'bg-white text-blue-900 shadow-lg' 
                  : 'hover:bg-white/10 text-white'
                }
              `}
            >
              <span className="text-2xl">{item.icon}</span>
              {!isCollapsed && (
                <div className="flex-1">
                  <div className={`font-semibold ${isActive ? 'text-blue-900' : 'text-white'}`}>
                    {item.name}
                  </div>
                  <div className={`text-xs ${isActive ? 'text-blue-700' : 'text-blue-200'}`}>
                    {item.description}
                  </div>
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
        {!isCollapsed && (
          <div className="text-xs text-center text-blue-200">
            <p>Powered by Groq AI</p>
            <p className="mt-1">Llama 3.3 70B</p>
          </div>
        )}
      </div>
    </div>
  );
}
