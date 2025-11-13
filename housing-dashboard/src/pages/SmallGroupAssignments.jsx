import React from 'react';
import { useData } from '../context/DataContext';

function SmallGroupAssignments() {
  const { data } = useData();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Small Group Assignments</h1>
        <p className="text-gray-600 mt-1">Assign youth groups to small group rooms</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="space-y-4">
          {data?.youthGroups?.map(group => {
            const rooms = data.smallGroupAssignments?.[group.id] || [];
            return (
              <div key={group.id} className="border border-gray-200 rounded-lg p-4">
                <div className="font-medium text-gray-900">{group.parish}</div>
                <div className="text-sm text-gray-600 mt-1">
                  Leader: {group.leader}
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  Assigned: {rooms.length > 0 ? rooms.join(', ') : 'None'}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default SmallGroupAssignments;
