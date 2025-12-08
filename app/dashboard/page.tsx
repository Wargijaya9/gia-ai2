'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Dashboard() {
  const [greeting] = useState(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Selamat Pagi';
    if (hour < 18) return 'Selamat Siang';
    return 'Selamat Malam';
  });

  const quickActions = [
    {
      title: 'Generate Laporan',
      description: 'Buat laporan pekerjaan otomatis dengan AI',
      icon: '📊',
      color: 'from-blue-500 to-blue-600',
      path: '/dashboard/report',
    },
    {
      title: 'Chat dengan AI',
      description: 'Tanya apapun ke AI assistant',
      icon: '💬',
      color: 'from-purple-500 to-purple-600',
      path: '/dashboard/chat',
    },
    {
      title: 'Tulis Dokumen',
      description: 'Buat surat, proposal, atau dokumen lainnya',
      icon: '📝',
      color: 'from-green-500 to-green-600',
      path: '/dashboard/document',
    },
    {
      title: 'Creative Studio',
      description: 'Ide design, copywriting, dan konten kreatif',
      icon: '🎨',
      color: 'from-pink-500 to-pink-600',
      path: '/dashboard/creative',
    },
    {
      title: 'Code Helper',
      description: 'Debug, review, dan improve code Anda',
      icon: '💻',
      color: 'from-indigo-500 to-indigo-600',
      path: '/dashboard/code',
    },
    {
      title: 'Task Planner',
      description: 'Organize dan schedule pekerjaan',
      icon: '📅',
      color: 'from-orange-500 to-orange-600',
      path: '/dashboard/tasks',
    },
  ];

  const recentActivities = [
    { type: 'report', title: 'Laporan Progress Mingguan', time: '2 jam lalu' },
    { type: 'chat', title: 'Brainstorming Fitur Baru', time: '5 jam lalu' },
    { type: 'document', title: 'Proposal Project Mobile App', time: '1 hari lalu' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-8">
      <div className="">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {greeting}! 👋
          </h1>
          <p className="text-xl text-gray-600">
            Aku Gia! Yuk kita bikin hari ini lebih produktif! ✨
          </p>
        </div>

        {/* Quick Actions Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickActions.map((action, idx) => (
              <Link
                key={idx}
                href={action.path}
                className="group"
              >
                <div className={`
                  bg-gradient-to-br ${action.color}
                  p-6 rounded-2xl shadow-lg hover:shadow-2xl
                  transform hover:-translate-y-2 transition-all duration-300
                  cursor-pointer
                `}>
                  <div className="flex items-start gap-4">
                    <div className="text-5xl">{action.icon}</div>
                    <div className="flex-1 text-white">
                      <h3 className="text-xl font-bold mb-2">
                        {action.title}
                      </h3>
                      <p className="text-sm text-white/90">
                        {action.description}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-white/80 text-sm font-medium group-hover:text-white transition-colors">
                    Mulai →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Laporan</p>
                <h3 className="text-3xl font-bold text-gray-900">0</h3>
              </div>
              <div className="text-4xl">📊</div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Chat Sessions</p>
                <h3 className="text-3xl font-bold text-gray-900">0</h3>
              </div>
              <div className="text-4xl">💬</div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Dokumen Dibuat</p>
                <h3 className="text-3xl font-bold text-gray-900">0</h3>
              </div>
              <div className="text-4xl">📝</div>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Aktivitas Terakhir</h2>
          <div className="space-y-3">
            {recentActivities.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                Belum ada aktivitas. Mulai gunakan AI Assistant sekarang!
              </p>
            ) : (
              recentActivities.map((activity, idx) => (
                <div key={idx} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    {activity.type === 'report' && '📊'}
                    {activity.type === 'chat' && '💬'}
                    {activity.type === 'document' && '📝'}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{activity.title}</p>
                    <p className="text-sm text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* AI Tips */}
        <div className="mt-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white">
          <div className="flex items-start gap-4">
            <div className="text-4xl">💡</div>
            <div>
              <h3 className="text-xl font-bold mb-2">Tips Hari Ini</h3>
              <p className="text-white/90">
                Gunakan fitur Chat AI untuk brainstorming ide atau memecahkan masalah kompleks. 
                AI dapat membantu Anda dari berbagai sudut pandang!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
