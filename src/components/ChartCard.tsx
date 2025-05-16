import React from 'react';

interface ChartCardProps {
  coin: string;
  timeframe: string;
  entry?: number;
  target?: number;
  stop?: number;
  direction?: 'LONG' | 'SHORT';
}

const ChartCard: React.FC<ChartCardProps> = ({ 
  coin, 
  timeframe, 
  entry, 
  target, 
  stop, 
  direction 
}) => {
  // Simulação de dados de gráfico para visualização
  // Na implementação real, estes dados viriam das APIs
  const generateChartData = () => {
    const data = [];
    let price = entry || 100;
    for (let i = 0; i < 20; i++) {
      price = price * (1 + (Math.random() * 0.02 - 0.01));
      data.push(price);
    }
    return data;
  };

  const chartData = generateChartData();
  const min = Math.min(...chartData) * 0.995;
  const max = Math.max(...chartData) * 1.005;
  const range = max - min;

  return (
    <div className="glass p-4 rounded-lg mb-4 animate-fade-in">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold">{coin} ({timeframe})</h3>
        {direction && (
          <span className={`text-sm font-medium px-2 py-0.5 rounded ${
            direction === 'LONG' ? 'bg-long/20 text-long' : 'bg-short/20 text-short'
          }`}>
            {direction}
          </span>
        )}
      </div>
      
      <div className="relative h-40 w-full">
        {/* Gráfico simplificado */}
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <polyline
            points={chartData.map((price, i) => 
              `${i * (100 / (chartData.length - 1))},${100 - ((price - min) / range) * 100}`
            ).join(' ')}
            fill="none"
            stroke={direction === 'SHORT' ? 'var(--color-short)' : 'var(--color-long)'}
            strokeWidth="2"
          />
          
          {/* Linhas de entrada, alvo e stop */}
          {entry && (
            <line
              x1="0"
              y1={100 - ((entry - min) / range) * 100}
              x2="100"
              y2={100 - ((entry - min) / range) * 100}
              stroke="#6366f1"
              strokeWidth="1"
              strokeDasharray="2,2"
            />
          )}
          
          {target && (
            <line
              x1="0"
              y1={100 - ((target - min) / range) * 100}
              x2="100"
              y2={100 - ((target - min) / range) * 100}
              stroke={direction === 'LONG' ? 'var(--color-long)' : 'var(--color-short)'}
              strokeWidth="1"
              strokeDasharray="2,2"
            />
          )}
          
          {stop && (
            <line
              x1="0"
              y1={100 - ((stop - min) / range) * 100}
              x2="100"
              y2={100 - ((stop - min) / range) * 100}
              stroke="var(--color-short)"
              strokeWidth="1"
              strokeDasharray="2,2"
            />
          )}
        </svg>
        
        {/* Legendas */}
        <div className="absolute right-0 top-0 text-xs space-y-1">
          {entry && (
            <div className="flex items-center">
              <span className="w-3 h-0.5 bg-indigo-500 mr-1"></span>
              <span>Entrada: ${entry.toFixed(2)}</span>
            </div>
          )}
          {target && (
            <div className="flex items-center">
              <span className={`w-3 h-0.5 ${direction === 'LONG' ? 'bg-long' : 'bg-short'} mr-1`}></span>
              <span>Alvo: ${target.toFixed(2)}</span>
            </div>
          )}
          {stop && (
            <div className="flex items-center">
              <span className="w-3 h-0.5 bg-short mr-1"></span>
              <span>Stop: ${stop.toFixed(2)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChartCard;
