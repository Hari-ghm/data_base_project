// import React from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Welcome, {user?.name}</h2>
      <div className="space-y-4">
        <div>
          <p className="text-gray-600">Employee ID</p>
          <p className="font-medium">{user?.employeeId}</p>
        </div>
        <div>
          <p className="text-gray-600">Email</p>
          <p className="font-medium">{user?.email}</p>
        </div>
        <div>
          <p className="text-gray-600">School</p>
          <p className="font-medium">{user?.school}</p>
        </div>
      </div>
    </div>
  );
}