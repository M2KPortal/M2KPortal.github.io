import React, { useEffect, useState } from 'react';
import { Home, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { loadHousingData } from '../services/githubService';

function PublicDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const housingData = await loadHousingData();
        setData(housingData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Home className="w-6 h-6 text-primary-600" />
              <h1 className="text-xl font-bold text-gray-900">Mount 2K Housing - Public View</h1>
            </div>
            <button
              onClick={() => navigate('/login')}
              className="flex items-center gap-2 px-4 py-2 text-sm text-primary-600 hover:bg-primary-50 rounded-lg transition"
            >
              <LogIn className="w-4 h-4" />
              Admin Login
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="text-sm text-gray-600 mb-1">Total Youth Groups</div>
            <div className="text-3xl font-bold text-gray-900">{data?.youthGroups?.length || 0}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="text-sm text-gray-600 mb-1">Total Participants</div>
            <div className="text-3xl font-bold text-gray-900">
              {data?.youthGroups?.reduce((sum, g) =>
                sum + (g.maleTeens || 0) + (g.femaleTeens || 0) +
                (g.maleChaperones || 0) + (g.femaleChaperones || 0), 0
              ) || 0}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="text-sm text-gray-600 mb-1">Total Rooms</div>
            <div className="text-3xl font-bold text-gray-900">{data?.rooms?.length || 0}</div>
          </div>
        </div>

        {/* Youth Groups */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Youth Groups</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Parish</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Leader</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Teens</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Chaperones</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data?.youthGroups?.map((group, index) => {
                  const totalTeens = (group.maleTeens || 0) + (group.femaleTeens || 0);
                  const totalChaperones = (group.maleChaperones || 0) + (group.femaleChaperones || 0);
                  const total = totalTeens + totalChaperones;

                  return (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-900">{group.parish}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{group.leader}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-center text-sm text-gray-900">{totalTeens}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-center text-sm text-gray-900">{totalChaperones}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-center text-sm font-semibold text-gray-900">{total}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

export default PublicDashboard;
