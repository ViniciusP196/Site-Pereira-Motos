import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="relative bg-gray-800 text-white p-6 text-center shadow-lg">
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
        <span className="text-red-500">PEREIRA</span> MOTOS
      </h1>
      <p className="text-md text-gray-300">Dashboard de Gestão</p>
      {/* Logout button removed while login is disabled */}
    </header>
  );
};

export default Header;