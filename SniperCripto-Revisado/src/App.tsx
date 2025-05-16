import React, { useState } from 'react';
import { SignalProvider } from './contexts/SignalContext';
import Navbar from './components/Navbar';
import SignalsPage from './pages/SignalsPage';
import HistoryPage from './pages/HistoryPage';
import StatsPage from './pages/StatsPage';
import SettingsPage from './pages/SettingsPage';
import IndicatorsPage from './pages/IndicatorsPage';
import LoginPage from './pages/LoginPage';
import logo from './assets/logo.png';

function App() {
  const [activeTab, setActiveTab] = useState('sinais');
  const [showLogin, setShowLogin] = useState(false);

  // Verificar se o usuário quer ver a tela de login
  const handleLoginClick = () => {
    setShowLogin(true);
  };

  // Simular login bem-sucedido
  const handleLoginSuccess = () => {
    setShowLogin(false);
  };

  // Renderizar a página de login ou a aplicação principal
  if (showLogin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
        <LoginPage onLoginSuccess={handleLoginSuccess} />
      </div>
    );
  }

  // Renderizar a página correspondente ao tab ativo
  const renderActivePage = () => {
    switch (activeTab) {
      case 'sinais':
        return <SignalsPage />;
      case 'historico':
        return <HistoryPage />;
      case 'estatisticas':
        return <StatsPage />;
      case 'configuracoes':
        return <SettingsPage />;
      case 'indicadores':
        return <IndicatorsPage />;
      default:
        return <SignalsPage />;
    }
  };

  return (
    <SignalProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
        <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <main className="pt-6">
          {renderActivePage()}
        </main>
        
        <footer className="container mx-auto px-4 py-6 mt-12 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <img src={logo} alt="SniperCripto Logo" className="h-8 mr-2" />
              <span className="text-gray-400">© 2025 SniperCripto</span>
            </div>
            
            <div className="flex space-x-4">
              <button 
                onClick={handleLoginClick}
                className="text-gray-400 hover:text-white transition-colors"
              >
                Login
              </button>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Termos</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacidade</a>
            </div>
          </div>
        </footer>
      </div>
    </SignalProvider>
  );
}

export default App;
