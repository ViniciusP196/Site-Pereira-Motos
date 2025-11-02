import React from 'react';
import Dashboard from './components/Dashboard';

const App: React.FC = () => {
  // Login page temporarily disabled for testing purposes.
  // We directly render the Dashboard.
  return (
    <div className="bg-gray-100 min-h-screen">
      <Dashboard />
    </div>
  );
};

export default App;