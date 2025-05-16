import React from 'react';

interface SignalCardProps {
  coin: string;
  direction: 'LONG' | 'SHORT';
  entry: number;
  target: number;
  stop: number;
  confidence: number;
  timeframe: string;
  reason: string;
  timestamp: Date;
}

const SignalCard: React.FC<SignalCardProps> = ({
  coin,
  direction,
  entry,
  target,
  stop,
  confidence,
  timeframe,
  reason,
  timestamp,
}) => {
  const isLong = direction === 'LONG';
  const profitPercentage = isLong
    ? ((target - entry) / entry) * 100
    : ((entry - target) / entry) * 100;
  const riskPercentage = isLong
    ? ((entry - stop) / entry) * 100
    : ((stop - entry) / entry) * 100;

  return (
    <div className={`glass p-4 rounded-lg mb-4 animate-slide-up ${isLong ? 'signal-long' : 'signal-short'}`}>
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-xl font-bold">{coin}</h3>
          <div className="flex items-center mt-1">
            <span className={`text-sm font-medium px-2 py-0.5 rounded ${
              isLong ? 'bg-long/20 text-long' : 'bg-short/20 text-short'
            }`}>
              {timeframe}
            </span>
            <span className="text-gray-400 text-xs ml-2">
              {timestamp.toLocaleString()}
            </span>
          </div>
        </div>
        <div className={`text-lg font-bold px-3 py-1 rounded ${
          isLong 
            ? 'bg-long text-white shadow-neon-long' 
            : 'bg-short text-white shadow-neon-short'
        }`}>
          {direction}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="text-center">
          <p className="text-gray-400 text-xs">Entrada</p>
          <p className="font-medium">${entry.toFixed(2)}</p>
        </div>
        <div className="text-center">
          <p className="text-gray-400 text-xs">Alvo</p>
          <p className={`font-medium ${isLong ? 'text-long' : 'text-short'}`}>
            ${target.toFixed(2)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-gray-400 text-xs">Stop</p>
          <p className="font-medium text-short">${stop.toFixed(2)}</p>
        </div>
      </div>

      <div className="mb-3">
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>Confiança</span>
          <span>{confidence}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div
            className={`h-2 rounded-full ${isLong ? 'bg-long' : 'bg-short'}`}
            style={{ width: `${confidence}%` }}
          ></div>
        </div>
      </div>

      <div className="flex justify-between text-sm mb-2">
        <div>
          <span className="text-gray-400">Potencial:</span>{' '}
          <span className={isLong ? 'text-long' : 'text-short'}>+{profitPercentage.toFixed(2)}%</span>
        </div>
        <div>
          <span className="text-gray-400">Risco:</span>{' '}
          <span className="text-short">-{riskPercentage.toFixed(2)}%</span>
        </div>
      </div>

      <div className="mt-3 text-sm">
        <p className="text-gray-400">Motivo:</p>
        <p className="text-gray-300">{reason}</p>
      </div>
    </div>
  );
};

export default SignalCard;
