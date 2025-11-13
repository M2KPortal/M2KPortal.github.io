import React, { useState } from 'react';
import { Plus, Edit, Trash2, X, Search } from 'lucide-react';
import { useData } from '../context/DataContext';

function YouthGroups() {
  const { data, addYouthGroup, updateYouthGroup, deleteYouthGroup, loading } = useData();
  const [showModal, setShowModal] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    id: '',
    parish: '',
    leader: '',
    seminarianSgl: '',
    religious: '',
    phone: '',
    maleTeens: 0,
    femaleTeens: 0,
    maleChaperones: 0,
    femaleChaperones: 0,
    stayingOffCampus: false,
    specialAccommodations: ''
  });

  const handleAdd = () => {
    setEditIndex(null);
    setFormData({
      id: `group-${Date.now()}`,
      parish: '',
      leader: '',
      seminarianSgl: '',
      religious: '',
      phone: '',
      maleTeens: 0,
      femaleTeens: 0,
      maleChaperones: 0,
      femaleChaperones: 0,
      stayingOffCampus: false,
      specialAccommodations: ''
    });
    setShowModal(true);
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setFormData({ ...data.youthGroups[index] });
    setShowModal(true);
  };

  const handleDelete = (index) => {
    if (window.confirm('Are you sure you want to delete this youth group? All associated assignments will be removed.')) {
      deleteYouthGroup(index);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editIndex !== null) {
      updateYouthGroup(editIndex, formData);
    } else {
      addYouthGroup(formData);
    }

    setShowModal(false);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const filteredGroups = data?.youthGroups?.filter(group =>
    group.parish.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.leader.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Youth Groups</h1>
          <p className="text-gray-600 mt-1">Manage youth group registrations</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition"
        >
          <Plus className="w-5 h-5" />
          Add Group
        </button>
      </div>

      {/* Search */}
      <div className="mb-4">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by parish or leader..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Parish</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Leader</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Teens</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Chaperones</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredGroups.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                    No youth groups found. Click "Add Group" to create one.
                  </td>
                </tr>
              ) : (
                filteredGroups.map((group, index) => {
                  const totalTeens = (group.maleTeens || 0) + (group.femaleTeens || 0);
                  const totalChaperones = (group.maleChaperones || 0) + (group.femaleChaperones || 0);
                  const total = totalTeens + totalChaperones;
                  const originalIndex = data.youthGroups.indexOf(group);

                  return (
                    <tr key={group.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{group.parish}</div>
                        {group.stayingOffCampus && (
                          <span className="text-xs text-yellow-600">Off Campus</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{group.leader}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{group.phone}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                        <div className="text-gray-900 font-medium">{totalTeens}</div>
                        <div className="text-xs text-gray-500">{group.maleTeens}M / {group.femaleTeens}F</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                        <div className="text-gray-900 font-medium">{totalChaperones}</div>
                        <div className="text-xs text-gray-500">{group.maleChaperones}M / {group.femaleChaperones}F</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-semibold text-gray-900">
                        {total}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <button
                          onClick={() => handleEdit(originalIndex)}
                          className="text-primary-600 hover:text-primary-700 mr-3"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(originalIndex)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {editIndex !== null ? 'Edit Youth Group' : 'Add Youth Group'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Parish Name *</label>
                  <input
                    type="text"
                    value={formData.parish}
                    onChange={(e) => handleChange('parish', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Leader Name *</label>
                  <input
                    type="text"
                    value={formData.leader}
                    onChange={(e) => handleChange('leader', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Seminarian/Guide</label>
                  <input
                    type="text"
                    value={formData.seminarianSgl}
                    onChange={(e) => handleChange('seminarianSgl', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Religious Leader</label>
                  <input
                    type="text"
                    value={formData.religious}
                    onChange={(e) => handleChange('religious', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Male Teens</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.maleTeens}
                    onChange={(e) => handleChange('maleTeens', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Female Teens</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.femaleTeens}
                    onChange={(e) => handleChange('femaleTeens', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Male Chaperones</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.maleChaperones}
                    onChange={(e) => handleChange('maleChaperones', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Female Chaperones</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.femaleChaperones}
                    onChange={(e) => handleChange('femaleChaperones', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.stayingOffCampus}
                    onChange={(e) => handleChange('stayingOffCampus', e.target.checked)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Staying Off Campus</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Special Accommodations</label>
                <textarea
                  value={formData.specialAccommodations}
                  onChange={(e) => handleChange('specialAccommodations', e.target.value)}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="List any special needs or accommodations..."
                />
              </div>

              {/* Modal Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg"
                >
                  {editIndex !== null ? 'Update' : 'Add'} Group
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default YouthGroups;
