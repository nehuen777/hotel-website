import React from 'react';
import { Outlet } from 'react-router-dom';

const OperadorPanel = () => {
  return (
    <div className="container mt-4">
      <Outlet />
    </div>
  );
};

export default OperadorPanel;
