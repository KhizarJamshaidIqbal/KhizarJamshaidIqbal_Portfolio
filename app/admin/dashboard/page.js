'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiZap, FiFolder, FiUsers, FiEye } from 'react-icons/fi';

const StatCard = ({ icon: Icon, title, mainValue, subValue, percentage }) => (
  <div className="bg-white rounded-xl p-6 relative">
    <h3 className="text-gray-600 text-sm font-medium">{title}</h3>
    <div className="flex items-baseline mt-2">
      <span className="text-2xl font-semibold text-gray-900">{mainValue}</span>
      <span className="ml-2 text-sm text-gray-600">{subValue}</span>
    </div>
    {percentage && (
      <div className="mt-2">
        <span className="text-sm font-medium text-green-600">↑ {percentage}</span>
      </div>
    )}
    <div className="absolute top-6 right-6">
      <div className="p-2 bg-blue-50 rounded-lg">
        <Icon className="w-5 h-5 text-blue-500" />
      </div>
    </div>
  </div>
);

const QuickAction = ({ icon: Icon, title, href, bgColor = "bg-blue-50", iconColor = "text-blue-500" }) => (
  <Link href={href} className="flex items-center p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
    <div className={`p-3 ${bgColor} rounded-lg`}>
      <Icon className={`w-6 h-6 ${iconColor}`} />
    </div>
    <div className="ml-4">
      <p className="text-sm font-medium text-gray-900">{title}</p>
    </div>
  </Link>
);

export default function Dashboard() {
  const [stats, setStats] = useState({
    skills: { total: 0, new: 0, percentage: '0%' },
    projects: { total: 0, completed: 0, percentage: '0%' },
    users: { total: 0, active: 0, percentage: '0%' },
    visitors: { total: 0, percentage: '0%' }
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/dashboard');
        if (!response.ok) throw new Error('Failed to fetch stats');
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard
          icon={FiFolder}
          title="Total Projects"
          mainValue={stats.projects.total}
          subValue={`${stats.projects.completed} completed`}
          percentage={stats.projects.percentage}
        />
        <StatCard
          icon={FiZap}
          title="Total Skills"
          mainValue={stats.skills.total}
          subValue={`${stats.skills.new} new`}
          percentage={stats.skills.percentage}
        />
        <StatCard
          icon={FiEye}
          title="Live Visitors"
          mainValue={stats.visitors.total}
          subValue="Active in last 5 minutes"
          percentage={stats.visitors.percentage}
        />
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <QuickAction
          icon={FiZap}
          title="Manage Skills"
          href="/admin/skills"
          bgColor="bg-blue-50"
          iconColor="text-blue-500"
        />
        <QuickAction
          icon={FiFolder}
          title="Manage Projects"
          href="/admin/projects"
          bgColor="bg-purple-50"
          iconColor="text-purple-500"
        />
      </div>
    </div>
  );
}
