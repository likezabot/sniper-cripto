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
      // Usando allorigins como proxy alternativo para evitar problemas de CORS
      const proxyUrl = 'https://api.allorigins.win/raw?url=';
      const apiUrl = `https://api.coingecko.com/api/v3/simple/price?ids=${cryptoIds.join(',')}&vs_currencies=brl,usd`;
      
      const response = await fetch(`${proxyUrl}${encodeURIComponent(apiUrl)}`);
      
      if (!response.ok) {
        throw new Error(`Erro na API CoinGecko: ${response.status}`);
      }
      
      const result = await response.json();
      setData(result);
      setError(null);
    } catch (err: any) {
      console.error('Erro ao buscar preços spot:', err);
      setError(err.message || 'Erro ao buscar preços spot');
      
      // Tentar proxy alternativo em caso de falha
      try {
        const corsAnywhereProxy = 'https://cors-anywhere.herokuapp.com/';
        const apiUrl = `https://api.coingecko.com/api/v3/simple/price?ids=${cryptoIds.join(',')}&vs_currencies=brl,usd`;
        
        const response = await fetch(`${corsAnywhereProxy}${apiUrl}`);
        
        if (!response.ok) {
          throw new Error(`Erro na API CoinGecko (proxy alternativo): ${response.status}`);
        }
        
        const result = await response.json();
        setData(result);
        setError(null);
      } catch (backupErr: any) {
        console.error('Erro ao buscar preços spot (proxy alternativo):', backupErr);
        // Manter o erro original se o backup também falhar
      }
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

// Hook para buscar lista de símbolos disponíveis na Binance Futures
export const useBinanceFuturesSymbols = (): CryptoApiHookResult => {
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);
  const [data, setData] = React.useState<string[]>(['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'TRXUSDT']);

  const fetchSymbols = async () => {
    setLoading(true);
    try {
      // Lista de proxies para tentar em sequência
      const proxies = [
        'https://api.allorigins.win/raw?url=',
        'https://corsproxy.io/?',
        'https://cors-anywhere.herokuapp.com/'
      ];
      
      const apiUrl = 'https://fapi.binance.com/fapi/v1/exchangeInfo';
      
      let success = false;
      let result;
      
      // Tentar cada proxy até um funcionar
      for (const proxy of proxies) {
        try {
          const response = await fetch(`${proxy}${encodeURIComponent(apiUrl)}`);
          
          if (!response.ok) {
            console.warn(`Proxy ${proxy} falhou com status ${response.status}`);
            continue;
          }
          
          result = await response.json();
          success = true;
          break;
        } catch (proxyErr) {
          console.warn(`Proxy ${proxy} falhou:`, proxyErr);
          continue;
        }
      }
      
      if (!success || !result) {
        throw new Error('Todos os proxies falharam ao buscar símbolos');
      }
      
      // Filtrar apenas símbolos USDT ativos
      const symbols = result.symbols
        .filter((s: any) => s.status === 'TRADING' && s.quoteAsset === 'USDT')
        .map((s: any) => s.symbol);
      
      // Garantir que os 5 principais pares estejam sempre incluídos
      const mainPairs = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'TRXUSDT'];
      const finalSymbols = [...new Set([...mainPairs, ...symbols])];
      
      setData(finalSymbols);
      setError(null);
    } catch (err: any) {
      console.error('Erro ao buscar símbolos de futuros:', err);
      setError(err.message || 'Erro ao buscar símbolos de futuros');
      // Manter a lista padrão em caso de erro
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchSymbols();
    
    // Atualizar a cada 30 minutos
    const interval = setInterval(fetchSymbols, 1800000);
    
    return () => clearInterval(interval);
  }, []);

  return { loading, error, data };
};

// Hook para buscar candles de futuros via Binance (com múltiplos proxies)
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
      // Lista de proxies para tentar em sequência
      const proxies = [
        'https://api.allorigins.win/raw?url=',
        'https://corsproxy.io/?',
        'https://cors-anywhere.herokuapp.com/'
      ];
      
      const apiUrl = `https://fapi.binance.com/fapi/v1/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`;
      
      let success = false;
      let result;
      
      // Tentar cada proxy até um funcionar
      for (const proxy of proxies) {
        try {
          const response = await fetch(`${proxy}${encodeURIComponent(apiUrl)}`);
          
          if (!response.ok) {
            console.warn(`Proxy ${proxy} falhou com status ${response.status} para ${symbol}`);
            continue;
          }
          
          result = await response.json();
          success = true;
          break;
        } catch (proxyErr) {
          console.warn(`Proxy ${proxy} falhou para ${symbol}:`, proxyErr);
          continue;
        }
      }
      
      if (!success || !result) {
        throw new Error(`Todos os proxies falharam ao buscar candles para ${symbol}`);
      }
      
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

// Hook para monitorar múltiplos pares de futuros (com múltiplos proxies)
export const useMultipleFuturesCandles = (
  symbols: string[] = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'TRXUSDT'],
  interval: string = '15m'
): { [key: string]: CryptoApiHookResult } => {
  const [results, setResults] = React.useState<{ [key: string]: CryptoApiHookResult }>({});
  const { data: availableSymbols } = useBinanceFuturesSymbols();
  
  // Garantir que estamos usando símbolos válidos
  const validSymbols = React.useMemo(() => {
    if (!availableSymbols || !Array.isArray(availableSymbols)) {
      return symbols;
    }
    
    // Filtrar para garantir que só usamos símbolos válidos
    return symbols.filter(symbol => availableSymbols.includes(symbol));
  }, [symbols, availableSymbols]);

  React.useEffect(() => {
    const newResults: { [key: string]: CryptoApiHookResult } = {};
    
    validSymbols.forEach(symbol => {
      newResults[symbol] = {
        loading: true,
        error: null,
        data: null
      };
      
      const fetchData = async () => {
        try {
          // Lista de proxies para tentar em sequência
          const proxies = [
            'https://api.allorigins.win/raw?url=',
            'https://corsproxy.io/?',
            'https://cors-anywhere.herokuapp.com/'
          ];
          
          const apiUrl = `https://fapi.binance.com/fapi/v1/klines?symbol=${symbol}&interval=${interval}&limit=100`;
          
          let success = false;
          let result;
          
          // Tentar cada proxy até um funcionar
          for (const proxy of proxies) {
            try {
              const response = await fetch(`${proxy}${encodeURIComponent(apiUrl)}`);
              
              if (!response.ok) {
                console.warn(`Proxy ${proxy} falhou com status ${response.status} para ${symbol}`);
                continue;
              }
              
              result = await response.json();
              success = true;
              break;
            } catch (proxyErr) {
              console.warn(`Proxy ${proxy} falhou para ${symbol}:`, proxyErr);
              continue;
            }
          }
          
          if (!success || !result) {
            throw new Error(`Todos os proxies falharam ao buscar candles para ${symbol}`);
          }
          
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
      validSymbols.forEach(symbol => {
        const fetchData = async () => {
          try {
            // Lista de proxies para tentar em sequência
            const proxies = [
              'https://api.allorigins.win/raw?url=',
              'https://corsproxy.io/?',
              'https://cors-anywhere.herokuapp.com/'
            ];
            
            const apiUrl = `https://fapi.binance.com/fapi/v1/klines?symbol=${symbol}&interval=${interval}&limit=100`;
            
            let success = false;
            let result;
            
            // Tentar cada proxy até um funcionar
            for (const proxy of proxies) {
              try {
                const response = await fetch(`${proxy}${encodeURIComponent(apiUrl)}`);
                
                if (!response.ok) {
                  console.warn(`Proxy ${proxy} falhou com status ${response.status} para ${symbol}`);
                  continue;
                }
                
                result = await response.json();
                success = true;
                break;
              } catch (proxyErr) {
                console.warn(`Proxy ${proxy} falhou para ${symbol}:`, proxyErr);
                continue;
              }
            }
            
            if (!success || !result) {
              throw new Error(`Todos os proxies falharam ao buscar candles para ${symbol}`);
            }
            
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
  }, [validSymbols.join(','), interval]);

  return results;
};

// Objeto com todos os hooks exportados
const apiHooks = {
  useSpotPrices,
  useFuturesCandles,
  useMultipleFuturesCandles,
  useBinanceFuturesSymbols
};

export default apiHooks;
