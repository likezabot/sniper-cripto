import React, { useState } from 'react';
import { useSignals } from '../contexts/SignalContext';
import StatCard from '../components/StatCard';

const StatsPage: React.FC = () => {
  const { historicalSignals } = useSignals();
  const [timeRange, setTimeRange] = useState<string>('all');

  // Filtrar sinais pelo período selecionado
  const getFilteredSignals = () => {
    if (timeRange === 'all') return historicalSignals;
    
    const now = new Date();
    let cutoffDate = new Date();
    
    switch (timeRange) {
      case 'day':
        cutoffDate.setDate(now.getDate() - 1);
        break;
      case 'week':
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        cutoffDate.setMonth(now.getMonth() - 1);
        break;
      default:
        return historicalSignals;
    }
    
    return historicalSignals.filter(signal => signal.timestamp >= cutoffDate);
  };

  const filteredSignals = getFilteredSignals();
  
  // Calcular estatísticas
  const calculateStats = () => {
    if (filteredSignals.length === 0) {
      return {
        totalSignals: 0,
        successRate: 0,
        avgProfit: 0,
        longSignals: 0,
        shortSignals: 0,
        longSuccessRate: 0,
        shortSuccessRate: 0,
        bestCoin: 'N/A',
        bestCoinRate: 0,
        worstCoin: 'N/A',
        worstCoinRate: 0,
        bestTimeframe: 'N/A',
        bestTimeframeRate: 0
      };
    }
    
    // Contadores
    let successCount = 0;
    let totalProfit = 0;
    let longCount = 0;
    let longSuccess = 0;
    let shortCount = 0;
    let shortSuccess = 0;
    
    // Mapas para estatísticas por moeda e timeframe
    const coinStats: {[key: string]: {count: number, success: number}} = {};
    const timeframeStats: {[key: string]: {count: number, success: number}} = {};
    
    // Processar cada sinal
    filteredSignals.forEach(signal => {
      // Verificar se o sinal foi bem-sucedido (simplificado)
      const isSuccess = Math.random() > 0.4; // Simulação para demonstração
      
      if (isSuccess) {
        successCount++;
        totalProfit += signal.direction === 'LONG' ? 
          ((signal.target - signal.entry) / signal.entry) * 100 :
          ((signal.entry - signal.target) / signal.entry) * 100;
      } else {
        totalProfit -= signal.direction === 'LONG' ?
          ((signal.entry - signal.stop) / signal.entry) * 100 :
          ((signal.stop - signal.entry) / signal.entry) * 100;
      }
      
      // Contagem por direção
      if (signal.direction === 'LONG') {
        longCount++;
        if (isSuccess) longSuccess++;
      } else {
        shortCount++;
        if (isSuccess) shortSuccess++;
      }
      
      // Estatísticas por moeda
      if (!coinStats[signal.coin]) {
        coinStats[signal.coin] = { count: 0, success: 0 };
      }
      coinStats[signal.coin].count++;
      if (isSuccess) coinStats[signal.coin].success++;
      
      // Estatísticas por timeframe
      if (!timeframeStats[signal.timeframe]) {
        timeframeStats[signal.timeframe] = { count: 0, success: 0 };
      }
      timeframeStats[signal.timeframe].count++;
      if (isSuccess) timeframeStats[signal.timeframe].success++;
    });
    
    // Encontrar melhor e pior moeda
    let bestCoin = 'N/A';
    let bestCoinRate = 0;
    let worstCoin = 'N/A';
    let worstCoinRate = 100;
    
    Object.entries(coinStats).forEach(([coin, stats]) => {
      const successRate = (stats.success / stats.count) * 100;
      if (successRate > bestCoinRate && stats.count >= 3) {
        bestCoinRate = successRate;
        bestCoin = coin;
      }
      if (successRate < worstCoinRate && stats.count >= 3) {
        worstCoinRate = successRate;
        worstCoin = coin;
      }
    });
    
    // Encontrar melhor timeframe
    let bestTimeframe = 'N/A';
    let bestTimeframeRate = 0;
    
    Object.entries(timeframeStats).forEach(([timeframe, stats]) => {
      const successRate = (stats.success / stats.count) * 100;
      if (successRate > bestTimeframeRate && stats.count >= 3) {
        bestTimeframeRate = successRate;
        bestTimeframe = timeframe;
      }
    });
    
    return {
      totalSignals: filteredSignals.length,
      successRate: (successCount / filteredSignals.length) * 100,
      avgProfit: totalProfit / filteredSignals.length,
      longSignals: longCount,
      shortSignals: shortCount,
      longSuccessRate: longCount > 0 ? (longSuccess / longCount) * 100 : 0,
      shortSuccessRate: shortCount > 0 ? (shortSuccess / shortCount) * 100 : 0,
      bestCoin,
      bestCoinRate,
      worstCoin,
      worstCoinRate,
      bestTimeframe,
      bestTimeframeRate
    };
  };
  
  const stats = calculateStats();

  return (
    <div className="container mx-auto px-4 pb-8">
      <h2 className="text-2xl font-bold mb-6 text-gradient">Estatísticas</h2>
      
      {/* Seletor de período */}
      <div className="glass p-4 rounded-lg mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setTimeRange('all')}
            className={`px-4 py-2 rounded-lg transition-all ${
              timeRange === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
            }`}
          >
            Todo período
          </button>
          <button
            onClick={() => setTimeRange('day')}
            className={`px-4 py-2 rounded-lg transition-all ${
              timeRange === 'day' ? 'bg-indigo-600 text-white' : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
            }`}
          >
            Últimas 24h
          </button>
          <button
            onClick={() => setTimeRange('week')}
            className={`px-4 py-2 rounded-lg transition-all ${
              timeRange === 'week' ? 'bg-indigo-600 text-white' : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
            }`}
          >
            Última semana
          </button>
          <button
            onClick={() => setTimeRange('month')}
            className={`px-4 py-2 rounded-lg transition-all ${
              timeRange === 'month' ? 'bg-indigo-600 text-white' : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
            }`}
          >
            Último mês
          </button>
        </div>
      </div>
      
      {filteredSignals.length === 0 ? (
        <div className="glass p-8 rounded-lg text-center">
          <p className="text-lg">Nenhum sinal no período selecionado.</p>
        </div>
      ) : (
        <>
          {/* Cards de estatísticas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard
              title="Total de Sinais"
              value={stats.totalSignals}
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              }
            />
            <StatCard
              title="Taxa de Acerto"
              value={`${stats.successRate.toFixed(1)}%`}
              change={stats.successRate - 50}
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
            <StatCard
              title="Lucro/Prejuízo Médio"
              value={`${stats.avgProfit >= 0 ? '+' : ''}${stats.avgProfit.toFixed(2)}%`}
              change={stats.avgProfit}
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
            <StatCard
              title="Melhor Timeframe"
              value={`${stats.bestTimeframe} (${stats.bestTimeframeRate.toFixed(1)}%)`}
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
          </div>
          
          {/* Estatísticas detalhadas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Estatísticas por direção */}
            <div className="glass p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-4">Performance por Direção</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-long">LONG ({stats.longSignals})</span>
                    <span>{stats.longSuccessRate.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-long"
                      style={{ width: `${stats.longSuccessRate}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-short">SHORT ({stats.shortSignals})</span>
                    <span>{stats.shortSuccessRate.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-short"
                      style={{ width: `${stats.shortSuccessRate}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Estatísticas por moeda */}
            <div className="glass p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-4">Performance por Moeda</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-long">Melhor: {stats.bestCoin}</span>
                    <span>{stats.bestCoinRate.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-long"
                      style={{ width: `${stats.bestCoinRate}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-short">Pior: {stats.worstCoin}</span>
                    <span>{stats.worstCoinRate.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-short"
                      style={{ width: `${stats.worstCoinRate}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default StatsPage;
