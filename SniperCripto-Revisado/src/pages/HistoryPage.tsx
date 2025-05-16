import React, { useState, useEffect } from 'react';
import { useSignals } from '../contexts/SignalContext';
import FilterBar from '../components/FilterBar';
import SignalCard from '../components/SignalCard';

const HistoryPage: React.FC = () => {
  const { historicalSignals, spotPrices, futuresData } = useSignals();
  const [selectedCoin, setSelectedCoin] = useState<string>('Todos');
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('Todos');
  const [selectedDirection, setSelectedDirection] = useState<string>('Todos');
  const [results, setResults] = useState<{[key: string]: {hit: boolean, profit: number}}>({});

  // Lista de moedas disponíveis para o filtro
  const availableCoins = historicalSignals.map(signal => signal.coin);
  // Usar Array.from em vez de spread para compatibilidade
  const uniqueCoins = Array.from(new Set(availableCoins));

  // Filtrar sinais históricos
  const filteredSignals = historicalSignals.filter(signal => {
    const coinMatch = selectedCoin === 'Todos' || signal.coin === selectedCoin;
    const directionMatch = selectedDirection === 'Todos' || signal.direction === selectedDirection;
    const timeframeMatch = selectedTimeframe === 'Todos' || signal.timeframe === selectedTimeframe;
    return coinMatch && directionMatch && timeframeMatch;
  });

  // Verificar resultados dos sinais
  useEffect(() => {
    const checkResults = () => {
      const newResults: {[key: string]: {hit: boolean, profit: number}} = {};
      
      historicalSignals.forEach(signal => {
        const signalId = `${signal.coin}-${signal.timeframe}-${signal.timestamp.getTime()}`;
        
        // Obter preço atual
        let currentPrice = 0;
        
        // Tentar obter do futuresData primeiro
        if (futuresData[signal.coin] && futuresData[signal.coin].data) {
          const candles = futuresData[signal.coin].data;
          currentPrice = candles[candles.length - 1].close;
        } 
        // Tentar obter do spotPrices se não encontrar em futuresData
        else if (spotPrices && spotPrices[signal.coin.toLowerCase().replace('usdt', '')]) {
          currentPrice = spotPrices[signal.coin.toLowerCase().replace('usdt', '')].usd;
        }
        
        if (currentPrice > 0) {
          // Verificar se alvo ou stop foram atingidos
          if (signal.direction === 'LONG') {
            if (currentPrice >= signal.target) {
              // Alvo atingido
              newResults[signalId] = { hit: true, profit: ((signal.target - signal.entry) / signal.entry) * 100 };
            } else if (currentPrice <= signal.stop) {
              // Stop atingido
              newResults[signalId] = { hit: false, profit: ((signal.stop - signal.entry) / signal.entry) * 100 };
            } else {
              // Em andamento
              newResults[signalId] = { hit: false, profit: ((currentPrice - signal.entry) / signal.entry) * 100 };
            }
          } else { // SHORT
            if (currentPrice <= signal.target) {
              // Alvo atingido
              newResults[signalId] = { hit: true, profit: ((signal.entry - signal.target) / signal.entry) * 100 };
            } else if (currentPrice >= signal.stop) {
              // Stop atingido
              newResults[signalId] = { hit: false, profit: ((signal.entry - signal.stop) / signal.entry) * 100 };
            } else {
              // Em andamento
              newResults[signalId] = { hit: false, profit: ((signal.entry - currentPrice) / signal.entry) * 100 };
            }
          }
        }
      });
      
      setResults(newResults);
    };
    
    checkResults();
    
    // Verificar resultados a cada minuto
    const interval = setInterval(checkResults, 60000);
    return () => clearInterval(interval);
  }, [historicalSignals, futuresData, spotPrices]);

  // Exportar para CSV
  const exportToCSV = () => {
    // Cabeçalho do CSV
    let csvContent = "Moeda,Direção,Timeframe,Entrada,Alvo,Stop,Confiança,Data,Resultado,Lucro/Prejuízo\n";
    
    // Adicionar cada sinal
    filteredSignals.forEach(signal => {
      const signalId = `${signal.coin}-${signal.timeframe}-${signal.timestamp.getTime()}`;
      const result = results[signalId];
      
      const row = [
        signal.coin,
        signal.direction,
        signal.timeframe,
        signal.entry.toFixed(2),
        signal.target.toFixed(2),
        signal.stop.toFixed(2),
        `${signal.confidence}%`,
        signal.timestamp.toLocaleString(),
        result ? (result.hit ? "Alvo atingido" : result.profit >= 0 ? "Em andamento" : "Stop atingido") : "Desconhecido",
        result ? `${result.profit.toFixed(2)}%` : "N/A"
      ];
      
      csvContent += row.join(",") + "\n";
    });
    
    // Criar blob e link para download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `sniper-cripto-historico-${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container mx-auto px-4 pb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gradient">Histórico de Sinais</h2>
        <button 
          onClick={exportToCSV}
          className="btn btn-primary flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          Exportar CSV
        </button>
      </div>
      
      {/* Filtros */}
      <FilterBar
        selectedCoin={selectedCoin}
        setSelectedCoin={setSelectedCoin}
        selectedTimeframe={selectedTimeframe}
        setSelectedTimeframe={setSelectedTimeframe}
        selectedDirection={selectedDirection}
        setSelectedDirection={setSelectedDirection}
        coins={uniqueCoins}
      />
      
      {filteredSignals.length === 0 ? (
        <div className="glass p-8 rounded-lg text-center">
          <p className="text-lg">Nenhum sinal no histórico para os filtros selecionados.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredSignals.map((signal, index) => {
            const signalId = `${signal.coin}-${signal.timeframe}-${signal.timestamp.getTime()}`;
            const result = results[signalId];
            
            return (
              <div key={signalId} className="glass p-4 rounded-lg">
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
                
                {result && (
                  <div className={`mt-3 p-2 rounded-lg ${
                    result.hit ? 'bg-long/20' : result.profit < 0 ? 'bg-short/20' : 'bg-indigo-600/20'
                  }`}>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">
                        {result.hit 
                          ? 'Alvo atingido' 
                          : result.profit < 0 
                            ? 'Stop atingido' 
                            : 'Em andamento'}
                      </span>
                      <span className={`font-bold ${result.profit >= 0 ? 'text-long' : 'text-short'}`}>
                        {result.profit >= 0 ? '+' : ''}{result.profit.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
