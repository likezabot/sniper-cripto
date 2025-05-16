import React from 'react';

interface IndicatorBarProps {
  indicators: {
    name: string;
    value: number;
    isPositive: boolean;
  }[];
}

const IndicatorBar: React.FC<IndicatorBarProps> = ({ indicators }) => {
  return (
    <div className="glass p-3 rounded-lg mb-4 animate-fade-in">
      <h3 className="text-sm font-medium text-gray-400 mb-2">Indicadores</h3>
      <div className="grid grid-cols-5 gap-2">
        {indicators.map((indicator) => (
          <div key={indicator.name} className="text-center">
            <div className="relative mb-1">
              <div className="w-full bg-gray-700 rounded-full h-1">
                <div
                  className={`h-1 rounded-full ${
                    indicator.isPositive ? 'bg-long' : 'bg-short'
                  }`}
                  style={{ width: `${indicator.value}%` }}
                ></div>
              </div>
            </div>
            <span className="text-xs font-medium">{indicator.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IndicatorBar;
