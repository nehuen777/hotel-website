import React from 'react';
import { Outlet } from 'react-router-dom';

const AdminPanel = () => {
  return (
    <div className="container mt-4">
      <Outlet />
    </div>
  );
};

export default AdminPanel;
