# Documentação do SniperCripto

## Visão Geral

O SniperCripto é uma aplicação web completa para trade de criptomoedas spot e futuros, com foco em sinais automáticos de LONG/SHORT (scalp). A plataforma utiliza dados reais das APIs CoinGecko (spot) e Binance (futuros) para monitorar os 30 principais ativos de criptomoedas e gerar sinais baseados em 10 indicadores técnicos.

## Estrutura do Projeto

```
SniperCripto/
├── public/                  # Arquivos públicos e configuração PWA
├── src/
│   ├── assets/              # Imagens e recursos estáticos
│   ├── components/          # Componentes reutilizáveis
│   │   ├── ChartCard.tsx    # Componente de gráfico simplificado
│   │   ├── FilterBar.tsx    # Barra de filtros
│   │   ├── IndicatorBar.tsx # Barra de indicadores técnicos
│   │   ├── Navbar.tsx       # Barra de navegação
│   │   ├── SignalCard.tsx   # Card de sinal de trade
│   │   └── StatCard.tsx     # Card de estatísticas
│   ├── contexts/
│   │   └── SignalContext.tsx # Contexto global para gerenciamento de sinais
│   ├── hooks/
│   │   └── useApiData.ts    # Hooks para integração com APIs
│   ├── pages/
│   │   ├── HistoryPage.tsx  # Página de histórico de sinais
│   │   ├── IndicatorsPage.tsx # Página de explicação dos indicadores
│   │   ├── LoginPage.tsx    # Página de login (pronta para Supabase)
│   │   ├── SettingsPage.tsx # Página de configurações
│   │   ├── SignalsPage.tsx  # Página principal de sinais
│   │   └── StatsPage.tsx    # Página de estatísticas
│   ├── utils/
│   │   └── signalCalculator.ts # Lógica de cálculo de sinais e indicadores
│   ├── App.tsx              # Componente principal da aplicação
│   ├── index.tsx            # Ponto de entrada da aplicação
│   └── index.css            # Estilos globais e configuração do Tailwind
├── tailwind.config.js       # Configuração do TailwindCSS
├── tsconfig.json            # Configuração do TypeScript
└── package.json             # Dependências e scripts
```

## Guia de Personalização e Expansão

### 1. Como Adicionar ou Trocar IDs de Moedas

Para modificar as criptomoedas monitoradas, você precisa alterar dois arquivos:

#### Para moedas spot (CoinGecko):

Abra o arquivo `src/hooks/useApiData.ts` e localize a variável `cryptoIds` no hook `useSpotPrices`:

```typescript
const cryptoIds = [
  'bitcoin', 'ethereum', 'binancecoin', 'solana', 'tron', 
  'cardano', 'xrp', 'polkadot', 'toncoin', 'dogecoin', 
  // ... outros IDs
];
```

Substitua ou adicione IDs conforme necessário. Os IDs devem corresponder aos identificadores usados pela API CoinGecko. Você pode consultar a lista completa de IDs em: https://api.coingecko.com/api/v3/coins/list

#### Para pares de futuros (Binance):

No mesmo arquivo `src/hooks/useApiData.ts`, localize a variável `symbols` no hook `useMultipleFuturesCandles`:

```typescript
const symbols: string[] = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'TRXUSDT']
```

Adicione ou substitua os pares conforme necessário. Os símbolos devem seguir o formato da Binance (ex: 'BTCUSDT', 'ETHUSDT').

### 2. Como Integrar o Supabase para Autenticação

O SniperCripto já está preparado para integração com Supabase. Siga estes passos:

1. Crie uma conta no [Supabase](https://supabase.com/) e inicie um novo projeto

2. Instale a dependência do Supabase:
   ```bash
   npm install @supabase/supabase-js
   ```

3. Crie um arquivo `src/utils/supabaseClient.ts` com o seguinte conteúdo:
   ```typescript
   import { createClient } from '@supabase/supabase-js';
   
   const supabaseUrl = 'SUA_URL_SUPABASE';
   const supabaseAnonKey = 'SUA_CHAVE_ANON_SUPABASE';
   
   export const supabase = createClient(supabaseUrl, supabaseAnonKey);
   ```

4. Substitua `'SUA_URL_SUPABASE'` e `'SUA_CHAVE_ANON_SUPABASE'` pelos valores do seu projeto Supabase

5. Abra o arquivo `src/pages/LoginPage.tsx` e descomente o código de integração com Supabase (procure por comentários com instruções)

6. Crie um contexto de autenticação em `src/contexts/AuthContext.tsx` para gerenciar o estado de autenticação globalmente

7. Implemente proteção de rotas para páginas que exigem autenticação

### 3. Como Adicionar Novos Indicadores Técnicos

Para adicionar novos indicadores técnicos ao sistema:

1. Abra o arquivo `src/utils/signalCalculator.ts`

2. Adicione uma nova função para calcular o indicador desejado

3. Atualize a função `generateSignals` para incluir o novo indicador no cálculo da pontuação total

4. Atualize o array `indicators` na página `src/pages/IndicatorsPage.tsx` para incluir a descrição do novo indicador

### 4. Como Implementar Integrações Externas

#### Integração com Telegram:

1. Crie um bot no Telegram usando o BotFather
2. Obtenha o token do bot
3. Implemente um servidor backend (pode ser uma função serverless) que receba os sinais e envie mensagens via API do Telegram
4. Atualize o contexto `SignalContext.tsx` para enviar sinais para seu backend

#### Integração com Discord:

1. Crie um webhook no Discord
2. Implemente a lógica para enviar mensagens para o webhook quando novos sinais forem gerados
3. Atualize o contexto `SignalContext.tsx` para enviar sinais para o webhook

### 5. Como Expandir para Mais Timeframes

Para adicionar mais timeframes além dos atuais (15m, 30m, 1h, 4h):

1. Atualize os componentes de filtro em `src/components/FilterBar.tsx`
2. Modifique a lógica de atualização no hook `useFuturesCandles` em `src/hooks/useApiData.ts`
3. Ajuste os intervalos de atualização conforme necessário

## Configuração para Build e Deploy no Netlify

O SniperCripto está pronto para ser buildado e deployado no Netlify. Siga estes passos:

1. Crie um arquivo `netlify.toml` na raiz do projeto com o seguinte conteúdo:
   ```toml
   [build]
     command = "npm run build"
     publish = "build"
   
   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

2. Execute o comando de build:
   ```bash
   npm run build
   ```

3. O diretório `build` gerado está pronto para ser deployado no Netlify

4. Você pode fazer o deploy manualmente fazendo upload do diretório `build` ou conectando seu repositório Git ao Netlify para deploy automático

## Considerações de Performance

- A aplicação utiliza React com TypeScript para garantir tipagem segura
- O TailwindCSS é utilizado para estilos, com configuração otimizada para produção
- As chamadas de API são gerenciadas com hooks personalizados e atualizações periódicas
- O contexto React é utilizado para gerenciamento de estado global
- Componentes são modularizados para facilitar manutenção e expansão

## Limitações e Considerações Futuras

- A aplicação atual utiliza apenas APIs públicas, o que pode resultar em limites de taxa
- Para uso em produção com alto volume, considere implementar um backend para cache e gerenciamento de limites de API
- A autenticação está preparada para Supabase, mas não está completamente implementada
- Para funcionalidades premium, será necessário implementar um sistema de pagamento

## Suporte e Contato

Para suporte ou dúvidas sobre a implementação, entre em contato com o desenvolvedor.

---

Documentação criada em: Maio de 2025
