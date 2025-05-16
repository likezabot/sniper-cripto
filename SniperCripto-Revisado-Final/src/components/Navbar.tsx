import React, { useState } from 'react';
import logo from '../assets/logo.png';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const tabs = [
    { id: 'sinais', label: 'Sinais' },
    { id: 'historico', label: 'Histórico' },
    { id: 'estatisticas', label: 'Estatísticas' },
    { id: 'configuracoes', label: 'Configurações' },
    { id: 'indicadores', label: 'Indicadores' },
  ];

  return (
    <nav className="glass sticky top-0 z-50 px-4 py-3 mb-6">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <img src={logo} alt="SniperCripto Logo" className="h-10 mr-3" />
          <h1 className="text-xl font-bold text-gradient hidden sm:block">SniperCripto</h1>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-2 rounded-lg transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-300 hover:bg-indigo-600/20'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-300 focus:outline-none"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {mobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        {/* Premium Badge */}
        <div className="hidden sm:block">
          <span className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs px-3 py-1 rounded-full">
            Em breve: Premium
          </span>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-3 glass rounded-lg animate-fade-in">
          <div className="flex flex-col space-y-2 p-3">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setMobileMenuOpen(false);
                }}
                className={`px-3 py-2 rounded-lg transition-all duration-300 text-left ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-300 hover:bg-indigo-600/20'
                }`}
              >
                {tab.label}
              </button>
            ))}
            <div className="sm:hidden mt-2">
              <span className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs px-3 py-1 rounded-full">
                Em breve: Premium
              </span>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
