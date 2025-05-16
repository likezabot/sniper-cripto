import React, { useState } from 'react';
import { useSignals } from '../contexts/SignalContext';
import SignalCard from '../components/SignalCard';
import FilterBar from '../components/FilterBar';
import IndicatorBar from '../components/IndicatorBar';
import ChartCard from '../components/ChartCard';

const SignalsPage: React.FC = () => {
  const { signals, spotPrices, loading, error, selectedTimeframe, setSelectedTimeframe } = useSignals();
  const [selectedCoin, setSelectedCoin] = useState<string>('Todos');
  const [selectedDirection, setSelectedDirection] = useState<string>('Todos');

  // Proteção extra: sempre converte signals em array
  const safeSignals = Array.isArray(signals) ? signals : (signals ? [signals] : []);

  // Log para debug: veja no console o que está vindo
  console.log('DEBUG - signals:', signals, 'safeSignals:', safeSignals);

  // Lista de moedas disponíveis para o filtro
  const availableCoins = safeSignals.map(signal => signal && signal.coin).filter(Boolean);
  const uniqueCoins = Array.from(new Set(availableCoins));

  // Filtrar sinais com verificação de segurança
  const filteredSignals = safeSignals.filter(signal => {
    if (!signal) return false;
    const coinMatch = selectedCoin === 'Todos' || signal.coin === selectedCoin;
    const directionMatch = selectedDirection === 'Todos' || signal.direction === selectedDirection;
    const timeframeMatch = selectedTimeframe === 'Todos' || signal.timeframe === selectedTimeframe;
    return coinMatch && directionMatch && timeframeMatch;
  });

  // Verificação segura para preços spot
  const safeSpotPrices = spotPrices && typeof spotPrices === 'object' ? spotPrices : {};

  return (
    <div className="container mx-auto px-4 pb-8">
      <h2 className="text-2xl font-bold mb-6 text-gradient">Sinais Automáticos</h2>

      {/* Filtros */}
      <FilterBar
        selectedCoin={selectedCoin}
        setSelectedCoin={setSelectedCoin}
        selectedTimeframe={selectedTimeframe}
        setSelectedTimeframe={setSelectedTimeframe}
        selectedDirection={selectedDirection}
        setSelectedDirection={setSelectedDirection}
        coins={uniqueCoins.length > 0 ? uniqueCoins : ['Todos']}
      />

      {loading && (
        <div className="glass p-8 rounded-lg text-center animate-pulse">
          <p className="text-lg">Carregando sinais...</p>
        </div>
      )}

      {error && (
        <div className="glass p-4 rounded-lg bg-red-900/20 border border-red-800 mb-4">
          <p className="text-red-400">Erro ao carregar sinais: {error}</p>
        </div>
      )}

      {!loading && !error && (!safeSignals.length || filteredSignals.length === 0) && (
        <div className="glass p-8 rounded-lg text-center">
          <p className="text-lg">Nenhum sinal encontrado para os filtros selecionados.</p>
          <p className="text-gray-400 mt-2">Tente mudar os filtros ou aguarde novos sinais.</p>
        </div>
      )}

      {!loading && !error && Array.isArray(filteredSignals) && filteredSignals.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredSignals.map((signal, index) => (
            signal ? (
              <div key={`${signal.coin}-${signal.timeframe}-${index}`} className="space-y-4">
                <SignalCard
                  coin={signal.coin}
                  direction={signal.direction}
                  entry={signal.entry}
                  target={signal.target}
                  stop={signal.stop}
                  confidence={signal.confidence}
                  timeframe={signal.timeframe}
                  reason={signal.reason}
                  timestamp={signal.timestamp}
                />

                {Array.isArray(signal.indicators) && (
                  <IndicatorBar indicators={signal.indicators} />
                )}

                <ChartCard
                  coin={signal.coin}
                  timeframe={signal.timeframe}
                  entry={signal.entry}
                  target={signal.target}
                  stop={signal.stop}
                  direction={signal.direction}
                />
              </div>
            ) : null
          ))}
        </div>
      )}

      {/* Preços spot com verificação de segurança */}
      {Object.keys(safeSpotPrices).length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4 text-gradient">Preços Spot (CoinGecko)</h3>
          <div className="glass p-4 rounded-lg overflow-x-auto">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {Object.entries(safeSpotPrices).map(([coin, prices]: [string, any]) => (
                prices && typeof prices === 'object' ? (
                  <div key={coin} className="p-3 bg-gray-800/50 rounded-lg">
                    <p className="font-medium">{coin.toUpperCase()}</p>
                    <div className="flex justify-between mt-1">
                      <span className="text-gray-400">USD:</span>
                      <span>${(prices.usd || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">BRL:</span>
                      <span>R${(prices.brl || 0).toFixed(2)}</span>
                    </div>
                  </div>
                ) : null
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignalsPage;
