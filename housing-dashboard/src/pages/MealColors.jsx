import React from 'react';
import { useData } from '../context/DataContext';

function MealColors() {
  const { data, updateMealColorAssignment } = useData();

  const colors = ['Blue', 'Red', 'Orange', 'Yellow', 'Green', 'Purple', 'Brown', 'Grey'];

  const colorClasses = {
    Blue: 'bg-blue-100 text-blue-800',
    Red: 'bg-red-100 text-red-800',
    Orange: 'bg-orange-100 text-orange-800',
    Yellow: 'bg-yellow-100 text-yellow-800',
    Green: 'bg-green-100 text-green-800',
    Purple: 'bg-purple-100 text-purple-800',
    Brown: 'bg-amber-100 text-amber-800',
    Grey: 'bg-gray-100 text-gray-800',
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Meal Color Assignments</h1>
        <p className="text-gray-600 mt-1">Assign meal color groups to youth groups</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Group Assignments</h2>
          <div className="space-y-3">
            {data?.youthGroups?.map(group => {
              const assignedColor = data.mealColorAssignments?.[group.id];
              return (
                <div key={group.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">{group.parish}</div>
                    <div className="text-xs text-gray-500">{group.leader}</div>
                  </div>
                  <div>
                    {assignedColor ? (
                      <span className={`px-3 py-1 text-sm rounded-full ${colorClasses[assignedColor]}`}>
                        {assignedColor}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-400">Not assigned</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Meal Times by Color</h2>
          <div className="space-y-3">
            {colors.map(color => (
              <div key={color} className="p-3 border border-gray-200 rounded-lg">
                <span className={`px-2 py-1 text-xs rounded-full ${colorClasses[color]}`}>
                  {color}
                </span>
                <div className="mt-2 text-xs text-gray-600 space-y-1">
                  <div>Sat Breakfast: {data?.mealTimes?.[color]?.satBreakfast || 'N/A'}</div>
                  <div>Sat Lunch: {data?.mealTimes?.[color]?.satLunch || 'N/A'}</div>
                  <div>Sat Dinner: {data?.mealTimes?.[color]?.satDinner || 'N/A'}</div>
                  <div>Sun Breakfast: {data?.mealTimes?.[color]?.sunBreakfast || 'N/A'}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MealColors;
