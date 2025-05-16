import React, { useState, useEffect, createContext, useContext } from 'react';
import { useSpotPrices, useMultipleFuturesCandles } from '../hooks/useApiData';
import { generateSignals, Signal } from '../utils/signalCalculator';

interface SignalContextType {
  spotPrices: any;
  futuresData: any;
  signals: Signal[];
  historicalSignals: Signal[];
  loading: boolean;
  error: string | null;
  addToHistory: (signal: Signal) => void;
  clearHistory: () => void;
  selectedTimeframe: string;
  setSelectedTimeframe: (timeframe: string) => void;
}

const SignalContext = createContext<SignalContextType | undefined>(undefined);

export const SignalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [historicalSignals, setHistoricalSignals] = useState<Signal[]>([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('15m');
  
  // Buscar preços spot
  const { loading: spotLoading, error: spotError, data: spotPrices } = useSpotPrices();
  
  // Buscar dados de futuros para os 5 pares principais
  const futuresPairs = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'TRXUSDT'];
  const futuresData = useMultipleFuturesCandles(futuresPairs, selectedTimeframe);
  
  // Verificar se todos os dados de futuros foram carregados
  const futuresLoading = Object.values(futuresData).some(data => data.loading);
  const futuresError = Object.values(futuresData)
    .map(data => data.error)
    .filter(Boolean)
    .join(', ');
  
  // Adicionar sinal ao histórico
  const addToHistory = (signal: Signal) => {
    setHistoricalSignals(prev => [signal, ...prev]);
    
    // Salvar no localStorage
    try {
      const savedSignals = JSON.parse(localStorage.getItem('sniper-cripto-signals') || '[]');
      localStorage.setItem('sniper-cripto-signals', JSON.stringify([signal, ...savedSignals]));
    } catch (err) {
      console.error('Erro ao salvar sinal no histórico:', err);
    }
  };
  
  // Limpar histórico
  const clearHistory = () => {
    setHistoricalSignals([]);
    localStorage.removeItem('sniper-cripto-signals');
  };
  
  // Carregar histórico do localStorage
  useEffect(() => {
    try {
      const savedSignals = JSON.parse(localStorage.getItem('sniper-cripto-signals') || '[]');
      if (Array.isArray(savedSignals) && savedSignals.length > 0) {
        // Converter strings de data para objetos Date
        const parsedSignals = savedSignals.map((signal: any) => ({
          ...signal,
          timestamp: new Date(signal.timestamp)
        }));
        setHistoricalSignals(parsedSignals);
      }
    } catch (err) {
      console.error('Erro ao carregar histórico de sinais:', err);
    }
  }, []);
  
  // Gerar sinais baseados nos dados de futuros
  useEffect(() => {
    if (futuresLoading || !Object.keys(futuresData).length) return;
    
    const newSignals: Signal[] = [];
    
    // Processar cada par de futuros
    Object.entries(futuresData).forEach(([symbol, data]) => {
      if (!data.loading && !data.error && data.data) {
        const signal = generateSignals(symbol, data.data, selectedTimeframe);
        if (signal) {
          newSignals.push(signal);
          
          // Verificar se é um novo sinal para notificar
          const existingSignal = signals.find(s => 
            s.coin === signal.coin && 
            s.timeframe === signal.timeframe && 
            s.direction === signal.direction &&
            Math.abs(s.entry - signal.entry) < 0.01
          );
          
          if (!existingSignal) {
            // Novo sinal - adicionar ao histórico
            addToHistory(signal);
            
            // Notificar (em uma implementação real, aqui seria integrado com notificações push)
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification(`Novo sinal: ${signal.direction} ${signal.coin}`, {
                body: `Entrada: $${signal.entry.toFixed(2)} | Alvo: $${signal.target.toFixed(2)} | Stop: $${signal.stop.toFixed(2)}`,
                icon: '/logo192.png'
              });
            }
          }
        }
      }
    });
    
    setSignals(newSignals);
  }, [futuresData, selectedTimeframe]);
  
  return (
    <SignalContext.Provider
      value={{
        spotPrices,
        futuresData,
        signals,
        historicalSignals,
        loading: spotLoading || futuresLoading,
        error: spotError || futuresError || null,
        addToHistory,
        clearHistory,
        selectedTimeframe,
        setSelectedTimeframe
      }}
    >
      {children}
    </SignalContext.Provider>
  );
};

export const useSignals = () => {
  const context = useContext(SignalContext);
  if (context === undefined) {
    throw new Error('useSignals deve ser usado dentro de um SignalProvider');
  }
  return context;
};
