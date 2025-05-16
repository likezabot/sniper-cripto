import React from 'react';

// Tipos para os indicadores técnicos
export interface Indicator {
  name: string;
  value: number;
  isPositive: boolean;
}

// Tipos para os sinais
export interface Signal {
  coin: string;
  direction: 'LONG' | 'SHORT';
  entry: number;
  target: number;
  stop: number;
  confidence: number;
  timeframe: string;
  reason: string;
  timestamp: Date;
  indicators: Indicator[];
}

// Função para calcular RSI
export const calculateRSI = (prices: number[], period: number = 14): number => {
  if (prices.length < period + 1) {
    return 50; // Valor neutro se não houver dados suficientes
  }

  let gains = 0;
  let losses = 0;

  // Calcular ganhos e perdas iniciais
  for (let i = 1; i <= period; i++) {
    const change = prices[i] - prices[i - 1];
    if (change >= 0) {
      gains += change;
    } else {
      losses -= change;
    }
  }

  // Calcular médias iniciais
  let avgGain = gains / period;
  let avgLoss = losses / period;

  // Calcular RSI para o período atual
  for (let i = period + 1; i < prices.length; i++) {
    const change = prices[i] - prices[i - 1];
    
    if (change >= 0) {
      avgGain = (avgGain * (period - 1) + change) / period;
      avgLoss = (avgLoss * (period - 1)) / period;
    } else {
      avgGain = (avgGain * (period - 1)) / period;
      avgLoss = (avgLoss * (period - 1) - change) / period;
    }
  }

  // Evitar divisão por zero
  if (avgLoss === 0) {
    return 100;
  }

  const rs = avgGain / avgLoss;
  return 100 - (100 / (1 + rs));
};

// Função para calcular EMA
export const calculateEMA = (prices: number[], period: number): number => {
  if (prices.length < period) {
    return prices[prices.length - 1]; // Retorna o último preço se não houver dados suficientes
  }

  const k = 2 / (period + 1);
  let ema = prices.slice(0, period).reduce((sum, price) => sum + price, 0) / period;

  for (let i = period; i < prices.length; i++) {
    ema = prices[i] * k + ema * (1 - k);
  }

  return ema;
};

// Função para calcular MACD
export const calculateMACD = (prices: number[]): { macd: number; signal: number; histogram: number } => {
  const ema12 = calculateEMA(prices, 12);
  const ema26 = calculateEMA(prices, 26);
  const macd = ema12 - ema26;
  
  // Calcular o sinal usando EMA de 9 períodos do MACD
  // Criar um array de valores MACD para calcular o EMA
  const macdValues = [];
  for (let i = Math.max(0, prices.length - 9); i < prices.length; i++) {
    const ema12Temp = calculateEMA(prices.slice(0, i + 1), 12);
    const ema26Temp = calculateEMA(prices.slice(0, i + 1), 26);
    macdValues.push(ema12Temp - ema26Temp);
  }
  
  const signal = calculateEMA(macdValues, 9);
  const histogram = macd - signal;

  return { macd, signal, histogram };
};

// Função para calcular Bandas de Bollinger
export const calculateBollingerBands = (
  prices: number[],
  period: number = 20,
  multiplier: number = 2
): { upper: number; middle: number; lower: number } => {
  if (prices.length < period) {
    const lastPrice = prices[prices.length - 1];
    return { upper: lastPrice * 1.02, middle: lastPrice, lower: lastPrice * 0.98 };
  }

  const sma = prices.slice(-period).reduce((sum, price) => sum + price, 0) / period;
  
  // Calcular desvio padrão
  const squaredDifferences = prices.slice(-period).map(price => Math.pow(price - sma, 2));
  const variance = squaredDifferences.reduce((sum, val) => sum + val, 0) / period;
  const stdDev = Math.sqrt(variance);

  return {
    upper: sma + (multiplier * stdDev),
    middle: sma,
    lower: sma - (multiplier * stdDev)
  };
};

// Função para calcular ADX
export const calculateADX = (highs: number[], lows: number[], closes: number[], period: number = 14): number => {
  if (highs.length < period + 1 || lows.length < period + 1 || closes.length < period + 1) {
    return 25; // Valor neutro
  }

  // Calcular +DI e -DI
  const plusDM = [];
  const minusDM = [];
  const tr = [];

  for (let i = 1; i < highs.length; i++) {
    const highDiff = highs[i] - highs[i - 1];
    const lowDiff = lows[i - 1] - lows[i];

    // True Range
    const tr1 = highs[i] - lows[i];
    const tr2 = Math.abs(highs[i] - closes[i - 1]);
    const tr3 = Math.abs(lows[i] - closes[i - 1]);
    tr.push(Math.max(tr1, tr2, tr3));

    // Directional Movement
    if (highDiff > lowDiff && highDiff > 0) {
      plusDM.push(highDiff);
      minusDM.push(0);
    } else if (lowDiff > highDiff && lowDiff > 0) {
      plusDM.push(0);
      minusDM.push(lowDiff);
    } else {
      plusDM.push(0);
      minusDM.push(0);
    }
  }

  // Calcular médias móveis suavizadas
  const trPeriod = tr.slice(-period);
  const plusDMPeriod = plusDM.slice(-period);
  const minusDMPeriod = minusDM.slice(-period);

  const trSum = trPeriod.reduce((sum, val) => sum + val, 0);
  const plusDMSum = plusDMPeriod.reduce((sum, val) => sum + val, 0);
  const minusDMSum = minusDMPeriod.reduce((sum, val) => sum + val, 0);

  const plusDI = (plusDMSum / trSum) * 100;
  const minusDI = (minusDMSum / trSum) * 100;

  // Calcular DX e ADX
  const dx = Math.abs((plusDI - minusDI) / (plusDI + minusDI)) * 100;
  
  // Simplificação: usar DX como ADX para demonstração
  // Em uma implementação completa, ADX seria uma média móvel de DX
  return dx;
};

// Função para calcular Momentum
export const calculateMomentum = (prices: number[], period: number = 10): number => {
  if (prices.length < period) {
    return 0;
  }
  
  return (prices[prices.length - 1] / prices[prices.length - period]) * 100 - 100;
};

// Função para detectar padrão de Engolfo
export const detectEngulfing = (
  opens: number[],
  closes: number[],
  lookback: number = 5
): boolean => {
  if (opens.length < 2 || closes.length < 2) {
    return false;
  }

  const currentOpen = opens[opens.length - 1];
  const currentClose = closes[closes.length - 1];
  const prevOpen = opens[opens.length - 2];
  const prevClose = closes[closes.length - 2];

  // Padrão de engolfo de alta
  const bullishEngulfing = prevClose < prevOpen && currentClose > prevOpen && currentOpen < prevClose;
  
  // Padrão de engolfo de baixa
  const bearishEngulfing = prevClose > prevOpen && currentClose < prevOpen && currentOpen > prevClose;

  return bullishEngulfing || bearishEngulfing;
};

// Função para calcular VWAP
export const calculateVWAP = (
  highs: number[],
  lows: number[],
  closes: number[],
  volumes: number[],
  period: number = 14
): number => {
  if (highs.length < period || lows.length < period || closes.length < period || volumes.length < period) {
    return closes[closes.length - 1]; // Retorna o último preço se não houver dados suficientes
  }

  let cumulativeTPV = 0;
  let cumulativeVolume = 0;

  for (let i = closes.length - period; i < closes.length; i++) {
    const typicalPrice = (highs[i] + lows[i] + closes[i]) / 3;
    cumulativeTPV += typicalPrice * volumes[i];
    cumulativeVolume += volumes[i];
  }

  return cumulativeVolume === 0 ? closes[closes.length - 1] : cumulativeTPV / cumulativeVolume;
};

// Função para identificar suporte e resistência
export const findSupportResistance = (
  highs: number[],
  lows: number[],
  closes: number[],
  lookback: number = 20
): { support: number; resistance: number } => {
  if (highs.length < lookback || lows.length < lookback) {
    return { 
      support: Math.min(...lows.slice(-5)) * 0.99, 
      resistance: Math.max(...highs.slice(-5)) * 1.01 
    };
  }

  const recentHighs = highs.slice(-lookback);
  const recentLows = lows.slice(-lookback);
  
  // Encontrar níveis de suporte e resistência
  const sortedHighs = [...recentHighs].sort((a, b) => a - b);
  const sortedLows = [...recentLows].sort((a, b) => a - b);
  
  const resistance = sortedHighs[Math.floor(sortedHighs.length * 0.8)];
  const support = sortedLows[Math.floor(sortedLows.length * 0.2)];
  
  return { support, resistance };
};

// Função principal para gerar sinais baseados em indicadores técnicos
export const generateSignals = (
  symbol: string,
  candles: any[],
  timeframe: string
): Signal | null => {
  if (!candles || candles.length < 30) {
    console.warn(`Dados insuficientes para ${symbol} no timeframe ${timeframe}`);
    return null;
  }

  try {
    // Extrair dados dos candles
    const closes = candles.map(c => c.close);
    const highs = candles.map(c => c.high);
    const lows = candles.map(c => c.low);
    const opens = candles.map(c => c.open);
    const volumes = candles.map(c => c.volume);

    // Calcular indicadores
    const rsi = calculateRSI(closes);
    const { macd, signal, histogram } = calculateMACD(closes);
    const ema9 = calculateEMA(closes, 9);
    const ema21 = calculateEMA(closes, 21);
    const ema200 = calculateEMA(closes, Math.min(200, closes.length - 1));
    const bollingerBands = calculateBollingerBands(closes);
    const adx = calculateADX(highs, lows, closes);
    const momentum = calculateMomentum(closes);
    const engulfing = detectEngulfing(opens, closes);
    const vwap = calculateVWAP(highs, lows, closes, volumes);
    const { support, resistance } = findSupportResistance(highs, lows, closes);

    // Pontuação para cada indicador (0-100)
    const rsiScore = rsi < 30 ? 100 : rsi > 70 ? 0 : 50 - (rsi - 50);
    const macdScore = histogram > 0 ? 70 + Math.min(histogram * 30, 30) : 30 + Math.max(histogram * 30, -30);
    const emaScore = closes[closes.length - 1] > ema200 ? 
      (closes[closes.length - 1] > ema21 ? 
        (closes[closes.length - 1] > ema9 ? 100 : 75) : 50) : 
      (closes[closes.length - 1] < ema21 ? 
        (closes[closes.length - 1] < ema9 ? 0 : 25) : 50);
    const bollingerScore = closes[closes.length - 1] < bollingerBands.lower ? 90 : 
      closes[closes.length - 1] > bollingerBands.upper ? 10 : 50;
    const adxScore = adx > 25 ? (adx > 50 ? 100 : 75) : 50;
    const momentumScore = momentum > 0 ? Math.min(50 + (momentum * 2), 100) : Math.max(50 + (momentum * 2), 0);
    const engulfingScore = engulfing ? (closes[closes.length - 1] > opens[opens.length - 1] ? 90 : 10) : 50;
    const vwapScore = closes[closes.length - 1] > vwap ? 70 : 30;
    const supportResistanceScore = closes[closes.length - 1] < support * 1.02 ? 80 : 
      closes[closes.length - 1] > resistance * 0.98 ? 20 : 50;
    const volumeScore = volumes[volumes.length - 1] > volumes[volumes.length - 2] * 1.5 ? 
      (closes[closes.length - 1] > opens[opens.length - 1] ? 80 : 20) : 50;

    // Calcular pontuação total (ponderada)
    const weights = {
      rsi: 1.5,
      macd: 1.5,
      ema: 1.2,
      bollinger: 1.0,
      adx: 0.8,
      momentum: 1.0,
      engulfing: 1.2,
      vwap: 0.8,
      supportResistance: 1.2,
      volume: 0.8
    };

    const totalWeight = Object.values(weights).reduce((sum, w) => sum + w, 0);
    
    const weightedScore = (
      rsiScore * weights.rsi +
      macdScore * weights.macd +
      emaScore * weights.ema +
      bollingerScore * weights.bollinger +
      adxScore * weights.adx +
      momentumScore * weights.momentum +
      engulfingScore * weights.engulfing +
      vwapScore * weights.vwap +
      supportResistanceScore * weights.supportResistance +
      volumeScore * weights.volume
    ) / totalWeight;

    // Determinar direção do sinal
    const direction = weightedScore > 60 ? 'LONG' : weightedScore < 40 ? 'SHORT' : null;
    
    // Se não houver direção clara, não gerar sinal
    if (!direction) {
      return null;
    }

    // Calcular níveis de entrada, alvo e stop
    const lastClose = closes[closes.length - 1];
    const atr = (Math.max(...highs.slice(-14)) - Math.min(...lows.slice(-14))) / 14;
    
    let entry, target, stop;
    
    if (direction === 'LONG') {
      entry = lastClose;
      target = entry + (atr * 2);
      stop = entry - (atr * 1);
    } else {
      entry = lastClose;
      target = entry - (atr * 2);
      stop = entry + (atr * 1);
    }

    // Criar lista de indicadores para exibição
    const indicators: Indicator[] = [
      { name: 'RSI', value: Math.round(Math.abs(rsiScore)), isPositive: rsiScore > 50 },
      { name: 'MACD', value: Math.round(Math.abs(macdScore)), isPositive: macdScore > 50 },
      { name: 'EMA', value: Math.round(Math.abs(emaScore)), isPositive: emaScore > 50 },
      { name: 'VWAP', value: Math.round(Math.abs(vwapScore)), isPositive: vwapScore > 50 },
      { name: 'S/R', value: Math.round(Math.abs(supportResistanceScore)), isPositive: supportResistanceScore > 50 },
      { name: 'Engolfo', value: Math.round(Math.abs(engulfingScore)), isPositive: engulfingScore > 50 },
      { name: 'Volume', value: Math.round(Math.abs(volumeScore)), isPositive: volumeScore > 50 },
      { name: 'Bollinger', value: Math.round(Math.abs(bollingerScore)), isPositive: bollingerScore > 50 },
      { name: 'ADX', value: Math.round(Math.abs(adxScore)), isPositive: adxScore > 50 },
      { name: 'Momentum', value: Math.round(Math.abs(momentumScore)), isPositive: momentumScore > 50 }
    ];

    // Gerar motivo do sinal
    let reason = '';
    if (direction === 'LONG') {
      if (rsiScore > 70) reason += 'RSI sobrevendido. ';
      if (macdScore > 70) reason += 'MACD cruzando para cima. ';
      if (emaScore > 70) reason += 'Preço acima das EMAs. ';
      if (bollingerScore > 70) reason += 'Preço tocando banda inferior de Bollinger. ';
      if (engulfingScore > 70) reason += 'Padrão de engolfo de alta. ';
      if (supportResistanceScore > 70) reason += 'Preço próximo ao suporte. ';
    } else {
      if (rsiScore < 30) reason += 'RSI sobrecomprado. ';
      if (macdScore < 30) reason += 'MACD cruzando para baixo. ';
      if (emaScore < 30) reason += 'Preço abaixo das EMAs. ';
      if (bollingerScore < 30) reason += 'Preço tocando banda superior de Bollinger. ';
      if (engulfingScore < 30) reason += 'Padrão de engolfo de baixa. ';
      if (supportResistanceScore < 30) reason += 'Preço próximo à resistência. ';
    }

    if (reason === '') {
      reason = `Sinal baseado em análise técnica combinada (${Math.round(weightedScore)}% de confiança)`;
    }

    // Criar objeto de sinal
    return {
      coin: symbol,
      direction,
      entry,
      target,
      stop,
      confidence: Math.round(weightedScore),
      timeframe,
      reason,
      timestamp: new Date(),
      indicators
    };
  } catch (error) {
    console.error(`Erro ao gerar sinal para ${symbol}:`, error);
    return null;
  }
};

// Objeto com todas as funções exportadas
const signalCalculator = {
  calculateRSI,
  calculateEMA,
  calculateMACD,
  calculateBollingerBands,
  calculateADX,
  calculateMomentum,
  detectEngulfing,
  calculateVWAP,
  findSupportResistance,
  generateSignals
};

export default signalCalculator;
