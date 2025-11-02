
import React, { useEffect } from 'react';

interface AlertProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

const Alert: React.FC<AlertProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const baseClasses = "p-4 mb-6 rounded-lg flex justify-between items-center shadow-md";
  const typeClasses = {
    success: "bg-green-100 border border-green-200 text-green-800",
    error: "bg-red-100 border border-red-200 text-red-800",
  };

  return (
    <div className={`${baseClasses} ${typeClasses[type]}`}>
      <span>{message}</span>
      <button onClick={onClose} className="text-xl font-bold leading-none">&times;</button>
    </div>
  );
};

export default Alert;
   