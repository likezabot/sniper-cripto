import React from 'react';

interface CryptoApiHookResult {
  loading: boolean;
  error: string | null;
  data: any;
}

// Hook para buscar preços spot via CoinGecko
export const useSpotPrices = (): CryptoApiHookResult => {
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);
  const [data, setData] = React.useState<any>(null);

  const cryptoIds = [
    'bitcoin', 'ethereum', 'binancecoin', 'solana', 'tron', 
    'cardano', 'xrp', 'polkadot', 'toncoin', 'dogecoin', 
    'chainlink', 'polygon', 'shiba-inu', 'bitcoin-cash', 'litecoin', 
    'uniswap', 'avax', 'stellar', 'pepe', 'wrapped-bitcoin', 
    'bittorrent', 'injective', 'arbitrum', 'aptos', 'hedera', 
    'vechain', 'immutable', 'kaspa', 'render', 'quant'
  ];

  const fetchPrices = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${cryptoIds.join(',')}&vs_currencies=brl,usd`
      );
      
      if (!response.ok) {
        throw new Error(`Erro na API CoinGecko: ${response.status}`);
      }
      
      const result = await response.json();
      setData(result);
      setError(null);
    } catch (err: any) {
      console.error('Erro ao buscar preços spot:', err);
      setError(err.message || 'Erro ao buscar preços spot');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchPrices();
    
    // Atualizar a cada 60 segundos
    const interval = setInterval(fetchPrices, 60000);
    
    return () => clearInterval(interval);
  }, []);

  return { loading, error, data };
};

// Hook para buscar candles de futuros via Binance (com proxy)
export const useFuturesCandles = (
  symbol: string = 'BTCUSDT',
  interval: string = '15m',
  limit: number = 100
): CryptoApiHookResult => {
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);
  const [data, setData] = React.useState<any>(null);

  const fetchCandles = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://corsproxy.io/?https://fapi.binance.com/fapi/v1/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`
      );
      
      if (!response.ok) {
        throw new Error(`Erro na API Binance: ${response.status}`);
      }
      
      const result = await response.json();
      
      // Transformar os dados para um formato mais fácil de usar
      const formattedData = result.map((candle: any) => ({
        openTime: candle[0],
        open: parseFloat(candle[1]),
        high: parseFloat(candle[2]),
        low: parseFloat(candle[3]),
        close: parseFloat(candle[4]),
        volume: parseFloat(candle[5]),
        closeTime: candle[6],
        quoteAssetVolume: parseFloat(candle[7]),
        numberOfTrades: candle[8],
        takerBuyBaseAssetVolume: parseFloat(candle[9]),
        takerBuyQuoteAssetVolume: parseFloat(candle[10]),
      }));
      
      setData(formattedData);
      setError(null);
    } catch (err: any) {
      console.error('Erro ao buscar candles de futuros:', err);
      setError(err.message || 'Erro ao buscar candles de futuros');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchCandles();
    
    // Atualizar baseado no intervalo
    let updateInterval = 60000; // Default 1 minuto
    
    if (interval === '15m') updateInterval = 60000; // Atualizar a cada minuto para 15m
    else if (interval === '30m') updateInterval = 120000; // Atualizar a cada 2 minutos para 30m
    else if (interval === '1h') updateInterval = 300000; // Atualizar a cada 5 minutos para 1h
    else if (interval === '4h') updateInterval = 900000; // Atualizar a cada 15 minutos para 4h
    
    const timer = setInterval(fetchCandles, updateInterval);
    
    return () => clearInterval(timer);
  }, [symbol, interval, limit]);

  return { loading, error, data };
};

// Hook para monitorar múltiplos pares de futuros (com proxy)
export const useMultipleFuturesCandles = (
  symbols: string[] = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'TRXUSDT'],
  interval: string = '15m'
): { [key: string]: CryptoApiHookResult } => {
  const [results, setResults] = React.useState<{ [key: string]: CryptoApiHookResult }>({});

  React.useEffect(() => {
    const newResults: { [key: string]: CryptoApiHookResult } = {};
    
    symbols.forEach(symbol => {
      newResults[symbol] = {
        loading: true,
        error: null,
        data: null
      };
      
      const fetchData = async () => {
        try {
          const response = await fetch(
            `https://corsproxy.io/?https://fapi.binance.com/fapi/v1/klines?symbol=${symbol}&interval=${interval}&limit=100`
          );
          
          if (!response.ok) {
            throw new Error(`Erro na API Binance para ${symbol}: ${response.status}`);
          }
          
          const result = await response.json();
          
          // Transformar os dados
          const formattedData = result.map((candle: any) => ({
            openTime: candle[0],
            open: parseFloat(candle[1]),
            high: parseFloat(candle[2]),
            low: parseFloat(candle[3]),
            close: parseFloat(candle[4]),
            volume: parseFloat(candle[5]),
            closeTime: candle[6],
            quoteAssetVolume: parseFloat(candle[7]),
            numberOfTrades: candle[8],
            takerBuyBaseAssetVolume: parseFloat(candle[9]),
            takerBuyQuoteAssetVolume: parseFloat(candle[10]),
          }));
          
          setResults(prev => ({
            ...prev,
            [symbol]: {
              loading: false,
              error: null,
              data: formattedData
            }
          }));
        } catch (err: any) {
          console.error(`Erro ao buscar candles para ${symbol}:`, err);
          setResults(prev => ({
            ...prev,
            [symbol]: {
              loading: false,
              error: err.message || `Erro ao buscar dados para ${symbol}`,
              data: null
            }
          }));
        }
      };
      
      fetchData();
    });
    
    // Configurar atualizações periódicas
    let updateInterval = 60000; // Default 1 minuto
    
    if (interval === '15m') updateInterval = 60000;
    else if (interval === '30m') updateInterval = 120000;
    else if (interval === '1h') updateInterval = 300000;
    else if (interval === '4h') updateInterval = 900000;
    
    const timer = setInterval(() => {
      symbols.forEach(symbol => {
        const fetchData = async () => {
          try {
            const response = await fetch(
              `https://corsproxy.io/?https://fapi.binance.com/fapi/v1/klines?symbol=${symbol}&interval=${interval}&limit=100`
            );
            
            if (!response.ok) {
              throw new Error(`Erro na API Binance para ${symbol}: ${response.status}`);
            }
            
            const result = await response.json();
            
            // Transformar os dados
            const formattedData = result.map((candle: any) => ({
              openTime: candle[0],
              open: parseFloat(candle[1]),
              high: parseFloat(candle[2]),
              low: parseFloat(candle[3]),
              close: parseFloat(candle[4]),
              volume: parseFloat(candle[5]),
              closeTime: candle[6],
              quoteAssetVolume: parseFloat(candle[7]),
              numberOfTrades: candle[8],
              takerBuyBaseAssetVolume: parseFloat(candle[9]),
              takerBuyQuoteAssetVolume: parseFloat(candle[10]),
            }));
            
            setResults(prev => ({
              ...prev,
              [symbol]: {
                loading: false,
                error: null,
                data: formattedData
              }
            }));
          } catch (err: any) {
            console.error(`Erro ao atualizar candles para ${symbol}:`, err);
            if (results[symbol]?.data) {
              return;
            }
            
            setResults(prev => ({
              ...prev,
              [symbol]: {
                loading: false,
                error: err.message || `Erro ao buscar dados para ${symbol}`,
                data: prev[symbol]?.data || null
              }
            }));
          }
        };
        
        fetchData();
      });
    }, updateInterval);
    
    return () => clearInterval(timer);
  }, [symbols.join(','), interval]);

  return results;
};

export default {
  useSpotPrices,
  useFuturesCandles,
  useMultipleFuturesCandles
};
