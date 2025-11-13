import React from 'react';
import { AlertCircle } from 'lucide-react';
import { useData } from '../context/DataContext';

function ADAIndividuals() {
  const { data } = useData();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">ADA Individuals</h1>
        <p className="text-gray-600 mt-1">Track individuals with special accommodations</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        {data?.adaIndividuals && data.adaIndividuals.length > 0 ? (
          <div className="space-y-4">
            {data.adaIndividuals.map((individual, index) => {
              const group = data.youthGroups?.find(g => g.id === individual.groupId);
              return (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5" />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{individual.name}</div>
                      <div className="text-sm text-gray-600 mt-1">
                        Group: {group?.parish || 'Unknown'}
                      </div>
                      {individual.roomAssignment && (
                        <div className="text-sm text-gray-600">
                          Room: {individual.roomAssignment}
                        </div>
                      )}
                      <div className="text-sm text-gray-700 mt-2">
                        {individual.accommodations}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No ADA individuals registered yet.
          </div>
        )}
      </div>
    </div>
  );
}

export default ADAIndividuals;
