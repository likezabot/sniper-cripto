import React from 'react';

interface FilterBarProps {
  selectedCoin: string;
  setSelectedCoin: (coin: string) => void;
  selectedTimeframe: string;
  setSelectedTimeframe: (timeframe: string) => void;
  selectedDirection: string;
  setSelectedDirection: (direction: string) => void;
  coins: string[];
}

const FilterBar: React.FC<FilterBarProps> = ({
  selectedCoin,
  setSelectedCoin,
  selectedTimeframe,
  setSelectedTimeframe,
  selectedDirection,
  setSelectedDirection,
  coins,
}) => {
  const timeframes = ['15m', '30m', '1h', '4h', 'Todos'];
  const directions = ['LONG', 'SHORT', 'Todos'];

  return (
    <div className="glass p-4 rounded-lg mb-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="coin-filter" className="block text-sm font-medium text-gray-400 mb-1">
            Moeda
          </label>
          <select
            id="coin-filter"
            value={selectedCoin}
            onChange={(e) => setSelectedCoin(e.target.value)}
            className="w-full bg-gray-800/50 border border-gray-700 text-white rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="Todos">Todas as moedas</option>
            {coins.map((coin) => (
              <option key={coin} value={coin}>
                {coin.toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="timeframe-filter" className="block text-sm font-medium text-gray-400 mb-1">
            Timeframe
          </label>
          <select
            id="timeframe-filter"
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="w-full bg-gray-800/50 border border-gray-700 text-white rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            {timeframes.map((timeframe) => (
              <option key={timeframe} value={timeframe}>
                {timeframe}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="direction-filter" className="block text-sm font-medium text-gray-400 mb-1">
            Direção
          </label>
          <div className="flex space-x-2">
            {directions.map((direction) => (
              <button
                key={direction}
                onClick={() => setSelectedDirection(direction)}
                className={`flex-1 py-2 px-3 rounded-lg transition-all duration-300 ${
                  selectedDirection === direction
                    ? direction === 'LONG'
                      ? 'bg-long text-white'
                      : direction === 'SHORT'
                      ? 'bg-short text-white'
                      : 'bg-indigo-600 text-white'
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                }`}
              >
                {direction}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
