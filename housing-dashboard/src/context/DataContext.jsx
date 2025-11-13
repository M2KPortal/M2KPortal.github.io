import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { loadHousingData, saveHousingData } from '../services/githubService';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [error, setError] = useState(null);

  // Auto-save timeout reference
  const saveTimeoutRef = React.useRef(null);

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const housingData = await loadHousingData();
      setData(housingData);
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load housing data');
    } finally {
      setLoading(false);
    }
  };

  // Auto-save function with debouncing (waits 2 seconds after last change)
  const autoSave = useCallback(async (newData) => {
    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Set new timeout
    saveTimeoutRef.current = setTimeout(async () => {
      try {
        setSaving(true);
        await saveHousingData(newData);
        setLastSaved(new Date());
        setError(null);
      } catch (err) {
        console.error('Auto-save error:', err);
        setError(`Auto-save failed: ${err.message}`);
      } finally {
        setSaving(false);
      }
    }, 2000); // Wait 2 seconds before saving
  }, []);

  // Update data function (triggers auto-save)
  const updateData = useCallback((newData) => {
    setData(newData);
    autoSave(newData);
  }, [autoSave]);

  // Manual save function
  const manualSave = async () => {
    if (!data) return;

    try {
      setSaving(true);
      await saveHousingData(data);
      setLastSaved(new Date());
      setError(null);
      return { success: true };
    } catch (err) {
      console.error('Manual save error:', err);
      setError(`Save failed: ${err.message}`);
      return { success: false, error: err.message };
    } finally {
      setSaving(false);
    }
  };

  // Utility functions for specific data updates
  const addYouthGroup = (group) => {
    const newData = {
      ...data,
      youthGroups: [...data.youthGroups, group],
      lastUpdated: new Date().toISOString()
    };
    updateData(newData);
  };

  const updateYouthGroup = (index, group) => {
    const newGroups = [...data.youthGroups];
    newGroups[index] = group;
    const newData = {
      ...data,
      youthGroups: newGroups,
      lastUpdated: new Date().toISOString()
    };
    updateData(newData);
  };

  const deleteYouthGroup = (index) => {
    const groupId = data.youthGroups[index].id;
    const newData = {
      ...data,
      youthGroups: data.youthGroups.filter((_, i) => i !== index),
      // Remove associated assignments
      housingAssignments: {
        male: Object.fromEntries(Object.entries(data.housingAssignments.male).filter(([id]) => id !== groupId)),
        female: Object.fromEntries(Object.entries(data.housingAssignments.female).filter(([id]) => id !== groupId))
      },
      smallGroupAssignments: Object.fromEntries(Object.entries(data.smallGroupAssignments).filter(([id]) => id !== groupId)),
      mealColorAssignments: Object.fromEntries(Object.entries(data.mealColorAssignments).filter(([id]) => id !== groupId)),
      lastUpdated: new Date().toISOString()
    };
    updateData(newData);
  };

  const addRoom = (room) => {
    const newRooms = [...data.rooms, room];
    const newData = {
      ...data,
      rooms: newRooms,
      housingRooms: newRooms.filter(r => r.type === 'housing'),
      smallGroupRooms: newRooms.filter(r => r.type === 'smallGroup'),
      lastUpdated: new Date().toISOString()
    };
    updateData(newData);
  };

  const updateRoom = (index, room) => {
    const newRooms = [...data.rooms];
    newRooms[index] = room;
    const newData = {
      ...data,
      rooms: newRooms,
      housingRooms: newRooms.filter(r => r.type === 'housing'),
      smallGroupRooms: newRooms.filter(r => r.type === 'smallGroup'),
      lastUpdated: new Date().toISOString()
    };
    updateData(newData);
  };

  const deleteRoom = (index) => {
    const newRooms = data.rooms.filter((_, i) => i !== index);
    const newData = {
      ...data,
      rooms: newRooms,
      housingRooms: newRooms.filter(r => r.type === 'housing'),
      smallGroupRooms: newRooms.filter(r => r.type === 'smallGroup'),
      lastUpdated: new Date().toISOString()
    };
    updateData(newData);
  };

  const updateHousingAssignment = (groupId, gender, rooms) => {
    const newData = {
      ...data,
      housingAssignments: {
        ...data.housingAssignments,
        [gender]: {
          ...data.housingAssignments[gender],
          [groupId]: rooms
        }
      },
      lastUpdated: new Date().toISOString()
    };
    updateData(newData);
  };

  const updateSmallGroupAssignment = (groupId, rooms) => {
    const newData = {
      ...data,
      smallGroupAssignments: {
        ...data.smallGroupAssignments,
        [groupId]: rooms
      },
      lastUpdated: new Date().toISOString()
    };
    updateData(newData);
  };

  const updateMealColorAssignment = (groupId, color) => {
    const newData = {
      ...data,
      mealColorAssignments: {
        ...data.mealColorAssignments,
        [groupId]: color
      },
      lastUpdated: new Date().toISOString()
    };
    updateData(newData);
  };

  const value = {
    data,
    loading,
    saving,
    lastSaved,
    error,
    loadData,
    updateData,
    manualSave,
    // Specific update functions
    addYouthGroup,
    updateYouthGroup,
    deleteYouthGroup,
    addRoom,
    updateRoom,
    deleteRoom,
    updateHousingAssignment,
    updateSmallGroupAssignment,
    updateMealColorAssignment
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
