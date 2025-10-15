// src/components/SectionTitle/SectionTitle.jsx
import React from 'react';

const SectionTitle = ({ heading, subHeading, color = 'secondary', align = 'center' }) => {
  const colorClasses = {
    primary: 'bg-primary',
    secondary: 'bg-secondary',
    accent: 'bg-accent',
    dark: 'bg-gray-800'
  };

  const alignClasses = {
    center: 'text-center mx-auto',
    left: 'text-left mr-auto',
    right: 'text-right ml-auto'
  };

  return (
    <div className={`mb-12 ${alignClasses[align]}`}>
      <h2 className="text-3xl font-bold text-gray-800 mb-2">{heading}</h2>
      {subHeading && <p className="text-gray-600 max-w-2xl">{subHeading}</p>}
      <div className={`w-20 h-1 ${colorClasses[color]} mt-4`}></div>
    </div>
  );
};

export default SectionTitle;