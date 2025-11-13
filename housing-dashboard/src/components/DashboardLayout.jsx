import React, { useState } from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import {
  Home, Users, Building, BedDouble, UserSquare2, Utensils,
  Accessibility, Settings, LogOut, Menu, X, Save, CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

// Import page components (we'll create these)
import DashboardHome from '../pages/DashboardHome';
import YouthGroups from '../pages/YouthGroups';
import Rooms from '../pages/Rooms';
import HousingAssignments from '../pages/HousingAssignments';
import SmallGroupAssignments from '../pages/SmallGroupAssignments';
import MealColors from '../pages/MealColors';
import ADAIndividuals from '../pages/ADAIndividuals';
import SettingsPage from '../pages/SettingsPage';

function DashboardLayout() {
  const location = useLocation();
  const { currentUser, logout } = useAuth();
  const { saving, lastSaved, error } = useData();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', path: '/dashboard', icon: Home },
    { name: 'Youth Groups', path: '/dashboard/youth-groups', icon: Users },
    { name: 'Rooms', path: '/dashboard/rooms', icon: Building },
    { name: 'Housing Assignments', path: '/dashboard/housing', icon: BedDouble },
    { name: 'Small Groups', path: '/dashboard/small-groups', icon: UserSquare2 },
    { name: 'Meal Colors', path: '/dashboard/meals', icon: Utensils },
    { name: 'ADA Individuals', path: '/dashboard/ada', icon: Accessibility },
    { name: 'Settings', path: '/dashboard/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
  };

  const formatLastSaved = () => {
    if (!lastSaved) return 'Not saved';
    const now = new Date();
    const diff = Math.floor((now - lastSaved) / 1000); // seconds

    if (diff < 10) return 'Just now';
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return lastSaved.toLocaleTimeString();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo & Mobile Menu Toggle */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <h1 className="text-xl font-bold text-gray-900">Mount 2K Housing</h1>
            </div>

            {/* Save Status & User Info */}
            <div className="flex items-center gap-4">
              {/* Auto-save status */}
              <div className="hidden sm:flex items-center gap-2 text-sm">
                {saving ? (
                  <>
                    <Save className="w-4 h-4 text-blue-500 animate-pulse" />
                    <span className="text-blue-600">Saving...</span>
                  </>
                ) : error ? (
                  <>
                    <AlertCircle className="w-4 h-4 text-red-500" />
                    <span className="text-red-600">Save failed</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-gray-600">{formatLastSaved()}</span>
                  </>
                )}
              </div>

              {/* User info */}
              <div className="text-right hidden md:block">
                <div className="text-sm font-medium text-gray-900">{currentUser?.name}</div>
                <div className="text-xs text-gray-500">{currentUser?.role}</div>
              </div>

              {/* Logout button */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile save status */}
        {(saving || error) && (
          <div className="sm:hidden px-4 pb-2">
            <div className="flex items-center gap-2 text-xs">
              {saving ? (
                <>
                  <Save className="w-3 h-3 text-blue-500 animate-pulse" />
                  <span className="text-blue-600">Saving...</span>
                </>
              ) : error ? (
                <>
                  <AlertCircle className="w-3 h-3 text-red-500" />
                  <span className="text-red-600">Save failed</span>
                </>
              ) : null}
            </div>
          </div>
        )}
      </header>

      <div className="flex">
        {/* Sidebar Navigation */}
        <aside
          className={`
            ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
            lg:translate-x-0 fixed lg:sticky top-16 left-0 z-40
            w-64 bg-white border-r border-gray-200 h-[calc(100vh-4rem)]
            transition-transform duration-300 ease-in-out
            overflow-y-auto
          `}
        >
          <nav className="p-4 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg transition
                    ${
                      isActive
                        ? 'bg-primary-50 text-primary-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Mobile menu overlay */}
        {mobileMenuOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30 top-16"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Routes>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="/" element={<DashboardHome />} />
            <Route path="/youth-groups" element={<YouthGroups />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/housing" element={<HousingAssignments />} />
            <Route path="/small-groups" element={<SmallGroupAssignments />} />
            <Route path="/meals" element={<MealColors />} />
            <Route path="/ada" element={<ADAIndividuals />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
