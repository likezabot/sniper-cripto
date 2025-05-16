import React, { useState } from 'react';
import { useSignals } from '../contexts/SignalContext';

const IndicatorsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('rsi');
  
  const indicators = [
    {
      id: 'rsi',
      name: 'RSI',
      description: 'Índice de Força Relativa (Relative Strength Index)',
      details: 'O RSI é um oscilador que mede a velocidade e a mudança dos movimentos de preço. Valores abaixo de 30 indicam condição de sobrevendido (possível LONG), enquanto valores acima de 70 indicam sobrecomprado (possível SHORT).',
      usage: 'Usado para identificar reversões de tendência e condições de sobrecompra/sobrevenda.',
      weight: 'Alto'
    },
    {
      id: 'macd',
      name: 'MACD',
      description: 'Convergência e Divergência de Médias Móveis (Moving Average Convergence Divergence)',
      details: 'O MACD consiste em duas linhas: a linha MACD (diferença entre duas médias móveis exponenciais) e a linha de sinal. Quando a linha MACD cruza acima da linha de sinal, é um sinal de LONG. Quando cruza abaixo, é um sinal de SHORT.',
      usage: 'Utilizado para identificar mudanças na força, direção, momentum e duração de uma tendência.',
      weight: 'Alto'
    },
    {
      id: 'ema',
      name: 'EMA',
      description: 'Média Móvel Exponencial (Exponential Moving Average)',
      details: 'As EMAs de 9, 21 e 200 períodos são utilizadas para identificar tendências de curto, médio e longo prazo. Quando o preço está acima das EMAs, a tendência é de alta. Quando está abaixo, a tendência é de baixa.',
      usage: 'Usado para identificar a direção da tendência e possíveis níveis de suporte/resistência.',
      weight: 'Médio'
    },
    {
      id: 'vwap',
      name: 'VWAP',
      description: 'Preço Médio Ponderado por Volume (Volume-Weighted Average Price)',
      details: 'O VWAP calcula o preço médio ponderado pelo volume ao longo de um período específico. Preços acima do VWAP indicam pressão compradora, enquanto preços abaixo indicam pressão vendedora.',
      usage: 'Utilizado como referência para determinar se um ativo está sendo negociado a um preço justo.',
      weight: 'Médio'
    },
    {
      id: 'sr',
      name: 'Suporte/Resistência',
      description: 'Níveis de Suporte e Resistência',
      details: 'Suportes são níveis de preço onde a demanda é forte o suficiente para impedir que o preço caia mais. Resistências são níveis onde a oferta é forte o suficiente para impedir que o preço suba mais.',
      usage: 'Usado para identificar pontos de entrada, saída e alvos de preço.',
      weight: 'Alto'
    },
    {
      id: 'engolfo',
      name: 'Engolfo',
      description: 'Padrão de Candles de Engolfo (Engulfing Pattern)',
      details: 'Um padrão de dois candles onde o segundo candle "engole" completamente o corpo do primeiro. Um engolfo de alta ocorre em tendência de baixa e indica possível reversão para cima. Um engolfo de baixa ocorre em tendência de alta e indica possível reversão para baixo.',
      usage: 'Utilizado para identificar possíveis reversões de tendência.',
      weight: 'Médio'
    },
    {
      id: 'volume',
      name: 'Volume',
      description: 'Volume de Negociação',
      details: 'O volume representa a quantidade de contratos ou ativos negociados em um determinado período. Um aumento no volume durante um movimento de preço confirma a força desse movimento.',
      usage: 'Usado para confirmar tendências e identificar possíveis reversões.',
      weight: 'Médio'
    },
    {
      id: 'bollinger',
      name: 'Bandas de Bollinger',
      description: 'Bandas de Bollinger',
      details: 'As Bandas de Bollinger consistem em uma média móvel central e duas bandas de desvio padrão. Quando o preço toca ou ultrapassa a banda superior, pode indicar sobrecompra. Quando toca ou ultrapassa a banda inferior, pode indicar sobrevenda.',
      usage: 'Utilizado para identificar volatilidade e possíveis reversões de preço.',
      weight: 'Médio'
    },
    {
      id: 'adx',
      name: 'ADX',
      description: 'Índice de Movimento Direcional Médio (Average Directional Index)',
      details: 'O ADX mede a força de uma tendência, independentemente da sua direção. Valores acima de 25 indicam uma tendência forte, enquanto valores abaixo de 20 indicam uma tendência fraca ou ausência de tendência.',
      usage: 'Usado para determinar se existe uma tendência e qual a sua força.',
      weight: 'Baixo'
    },
    {
      id: 'momentum',
      name: 'Momentum',
      description: 'Momentum',
      details: 'O Momentum mede a velocidade da mudança de preço. Um valor positivo indica que o preço está subindo com força, enquanto um valor negativo indica que o preço está caindo com força.',
      usage: 'Utilizado para identificar a força de um movimento de preço e possíveis reversões.',
      weight: 'Baixo'
    }
  ];

  const activeIndicator = indicators.find(ind => ind.id === activeTab) || indicators[0];

  return (
    <div className="container mx-auto px-4 pb-8">
      <h2 className="text-2xl font-bold mb-6 text-gradient">Indicadores Técnicos</h2>
      
      <div className="glass p-4 rounded-lg mb-6">
        <p className="text-gray-300 mb-4">
          O SniperCripto utiliza 10 indicadores técnicos para gerar sinais automáticos de LONG e SHORT.
          Cada indicador tem um peso diferente no cálculo final da confiança do sinal.
        </p>
        
        <div className="overflow-x-auto">
          <div className="flex space-x-2 pb-2">
            {indicators.map(indicator => (
              <button
                key={indicator.id}
                onClick={() => setActiveTab(indicator.id)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                  activeTab === indicator.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                }`}
              >
                {indicator.name}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="glass p-6 rounded-lg animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gradient">{activeIndicator.name}</h3>
          <span className={`mt-2 md:mt-0 px-3 py-1 rounded-full text-sm ${
            activeIndicator.weight === 'Alto' 
              ? 'bg-long/20 text-long' 
              : activeIndicator.weight === 'Médio'
                ? 'bg-indigo-600/20 text-indigo-400'
                : 'bg-gray-700/50 text-gray-400'
          }`}>
            Peso: {activeIndicator.weight}
          </span>
        </div>
        
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-400">Descrição</h4>
            <p className="mt-1">{activeIndicator.description}</p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-400">Como Funciona</h4>
            <p className="mt-1">{activeIndicator.details}</p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-400">Uso no Trading</h4>
            <p className="mt-1">{activeIndicator.usage}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndicatorsPage;
