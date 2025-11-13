import React, { useState } from 'react';
import { useData } from '../context/DataContext';

function HousingAssignments() {
  const { data, updateHousingAssignment } = useData();
  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedGender, setSelectedGender] = useState('male');

  const handleAssignRoom = (groupId, gender, roomKey) => {
    const currentAssignments = data.housingAssignments[gender][groupId] || [];
    const newAssignments = currentAssignments.includes(roomKey)
      ? currentAssignments.filter(r => r !== roomKey)
      : [...currentAssignments, roomKey];
    updateHousingAssignment(groupId, gender, newAssignments);
  };

  const housingRooms = data?.rooms?.filter(r => r.type === 'housing') || [];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Housing Assignments</h1>
        <p className="text-gray-600 mt-1">Assign youth groups to housing rooms</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Male Housing */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Male Housing</h2>
          <div className="space-y-4">
            {data?.youthGroups?.map(group => {
              if (group.maleTeens === 0 && group.maleChaperones === 0) return null;
              const rooms = data.housingAssignments?.male?.[group.id] || [];
              return (
                <div key={group.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="font-medium text-gray-900">{group.parish}</div>
                  <div className="text-sm text-gray-600">
                    {group.maleTeens} teens, {group.maleChaperones} chaperones
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    Assigned: {rooms.length > 0 ? rooms.join(', ') : 'None'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Female Housing */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Female Housing</h2>
          <div className="space-y-4">
            {data?.youthGroups?.map(group => {
              if (group.femaleTeens === 0 && group.femaleChaperones === 0) return null;
              const rooms = data.housingAssignments?.female?.[group.id] || [];
              return (
                <div key={group.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="font-medium text-gray-900">{group.parish}</div>
                  <div className="text-sm text-gray-600">
                    {group.femaleTeens} teens, {group.femaleChaperones} chaperones
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

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          Full assignment interface will be enhanced in the next update. Currently showing assigned rooms.
        </p>
      </div>
    </div>
  );
}

export default HousingAssignments;
