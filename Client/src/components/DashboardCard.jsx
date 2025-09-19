// src/components/DashboardCard.jsx
import React from 'react';

const DashboardCard = ({ icon: Icon, title, description, children, glowColor = 'blue', className }) => {
  const glowClasses = {
    blue: 'hover:border-blue-800/80',
    purple: 'hover:border-purple-800/80',
    green: 'hover:border-green-800/80',
  };

  return (
    <div 
      className={`
        bg-gray-900/50 p-6 rounded-lg border border-gray-800 
        transition-all duration-300 group relative
        ${glowClasses[glowColor]}
        ${className}
      `}
    >
      {/* Subtle glow effect */}
      <div 
        className={`
          absolute -inset-px rounded-lg bg-gradient-to-r 
          from-blue-700 via-purple-700 to-green-700 
          opacity-0 group-hover:opacity-30 transition-opacity duration-300 blur-md
        `} 
      />
      <div className="relative z-10">
        <div className="flex items-start gap-4 mb-4">
          {Icon && <Icon className="w-8 h-8 text-blue-500 shrink-0 mt-1" />}
          <div>
            <h2 className="text-lg font-semibold text-white">{title}</h2>
            <p className="text-sm text-gray-400 mt-1">{description}</p>
          </div>
        </div>
        <div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;
