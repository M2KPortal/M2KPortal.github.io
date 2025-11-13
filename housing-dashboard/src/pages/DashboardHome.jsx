import React from 'react';
import { Users, Building, BedDouble, Utensils, AlertCircle } from 'lucide-react';
import { useData } from '../context/DataContext';
import { hasGitHubToken } from '../services/githubService';
import { Link } from 'react-router-dom';

function DashboardHome() {
  const { data, loading } = useData();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Data</h2>
        <p className="text-gray-600">Failed to load housing data. Please try refreshing the page.</p>
      </div>
    );
  }

  // Calculate statistics
  const totalGroups = data.youthGroups?.length || 0;
  const totalTeens = data.youthGroups?.reduce((sum, g) => sum + (g.maleTeens || 0) + (g.femaleTeens || 0), 0) || 0;
  const totalChaperones = data.youthGroups?.reduce((sum, g) => sum + (g.maleChaperones || 0) + (g.femaleChaperones || 0), 0) || 0;
  const totalParticipants = totalTeens + totalChaperones;
  const totalRooms = data.rooms?.length || 0;
  const housingRooms = data.rooms?.filter(r => r.type === 'housing').length || 0;
  const smallGroupRooms = data.rooms?.filter(r => r.type === 'smallGroup').length || 0;
  const assignedGroups = Object.keys(data.housingAssignments?.male || {}).length +
                          Object.keys(data.housingAssignments?.female || {}).length;
  const uniqueAssignedGroups = new Set([
    ...Object.keys(data.housingAssignments?.male || {}),
    ...Object.keys(data.housingAssignments?.female || {})
  ]).size;
  const adaCount = data.adaIndividuals?.length || 0;

  const stats = [
    {
      label: 'Total Youth Groups',
      value: totalGroups,
      icon: Users,
      color: 'blue',
      link: '/dashboard/youth-groups'
    },
    {
      label: 'Total Participants',
      value: totalParticipants,
      subtitle: `${totalTeens} teens, ${totalChaperones} chaperones`,
      icon: Users,
      color: 'green',
      link: '/dashboard/youth-groups'
    },
    {
      label: 'Total Rooms',
      value: totalRooms,
      subtitle: `${housingRooms} housing, ${smallGroupRooms} small group`,
      icon: Building,
      color: 'purple',
      link: '/dashboard/rooms'
    },
    {
      label: 'Groups Assigned',
      value: `${uniqueAssignedGroups}/${totalGroups}`,
      icon: BedDouble,
      color: 'orange',
      link: '/dashboard/housing'
    },
    {
      label: 'ADA Individuals',
      value: adaCount,
      icon: AlertCircle,
      color: 'red',
      link: '/dashboard/ada'
    },
    {
      label: 'Meal Color Groups',
      value: data.activeColors?.length || 0,
      icon: Utensils,
      color: 'yellow',
      link: '/dashboard/meals'
    },
  ];

  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
    red: 'bg-red-100 text-red-600',
    yellow: 'bg-yellow-100 text-yellow-600',
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 mt-2">Welcome to Mount 2K Housing Management System</p>
      </div>

      {/* GitHub Token Warning */}
      {!hasGitHubToken() && (
        <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-yellow-900">GitHub Token Not Configured</h3>
              <p className="text-sm text-yellow-700 mt-1">
                Auto-save to GitHub is disabled. Please configure your GitHub token in{' '}
                <Link to="/dashboard/settings" className="underline font-medium">
                  Settings
                </Link>{' '}
                to enable automatic saving.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Link
              key={index}
              to={stat.link}
              className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition"
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg ${colorClasses[stat.color]}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="text-sm text-gray-600 mb-1">{stat.label}</div>
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  {stat.subtitle && (
                    <div className="text-xs text-gray-500 mt-1">{stat.subtitle}</div>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">System Information</h2>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">Data Version</span>
            <span className="font-medium text-gray-900">{data.version || 'N/A'}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">Last Updated</span>
            <span className="font-medium text-gray-900">
              {data.lastUpdated ? new Date(data.lastUpdated).toLocaleString() : 'N/A'}
            </span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-gray-600">Auto-Save Status</span>
            <span className={`font-medium ${hasGitHubToken() ? 'text-green-600' : 'text-yellow-600'}`}>
              {hasGitHubToken() ? 'Enabled' : 'Disabled'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardHome;
