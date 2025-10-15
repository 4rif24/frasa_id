// File: src/components/Spinner.jsx
import React from 'react';

const Spinner = ({ fullScreen = false, size = 'md', color = 'primary' }) => {
  // Variasi ukuran
  const sizeClasses = {
    sm: 'h-5 w-5',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  // Variasi warna
  const colorClasses = {
    primary: 'text-blue-600',
    secondary: 'text-purple-600',
    danger: 'text-red-600',
    success: 'text-green-600',
    light: 'text-gray-300',
    dark: 'text-gray-600'
  };

  // Spinner base class
  const spinnerClass = `animate-spin rounded-full border-2 border-current border-t-transparent ${sizeClasses[size]} ${colorClasses[color]}`;

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
        <div className={spinnerClass} role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center">
      <div className={spinnerClass} role="status">
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export default Spinner;