import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon?: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon }) => {
  return (
    <div className="glass p-4 rounded-lg animate-fade-in">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-medium text-gray-400">{title}</h3>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {change !== undefined && (
            <p className={`text-xs mt-1 ${change >= 0 ? 'text-long' : 'text-short'}`}>
              {change >= 0 ? '+' : ''}{change}%
            </p>
          )}
        </div>
        {icon && <div className="text-indigo-400">{icon}</div>}
      </div>
    </div>
  );
};

export default StatCard;
