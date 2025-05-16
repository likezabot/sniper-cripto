import React, { useState } from 'react';
import { useSignals } from '../contexts/SignalContext';

const SettingsPage: React.FC = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(
    localStorage.getItem('sniper-cripto-notifications') === 'true'
  );
  const [soundEnabled, setSoundEnabled] = useState<boolean>(
    localStorage.getItem('sniper-cripto-sound') === 'true'
  );
  const [highConfidenceOnly, setHighConfidenceOnly] = useState<boolean>(
    localStorage.getItem('sniper-cripto-high-confidence') === 'true'
  );
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // Solicitar permissão para notificações
  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      alert('Este navegador não suporta notificações desktop');
      return;
    }

    if (Notification.permission === 'granted') {
      setNotificationsEnabled(true);
      return;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setNotificationsEnabled(true);
        // Enviar notificação de teste
        new Notification('SniperCripto', {
          body: 'Notificações ativadas com sucesso!',
          icon: '/logo192.png'
        });
      }
    }
  };

  // Salvar configurações
  const saveSettings = () => {
    localStorage.setItem('sniper-cripto-notifications', notificationsEnabled.toString());
    localStorage.setItem('sniper-cripto-sound', soundEnabled.toString());
    localStorage.setItem('sniper-cripto-high-confidence', highConfidenceOnly.toString());
    
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="container mx-auto px-4 pb-8">
      <h2 className="text-2xl font-bold mb-6 text-gradient">Configurações</h2>
      
      <div className="glass p-6 rounded-lg mb-6 animate-fade-in">
        <h3 className="text-lg font-medium mb-4">Notificações</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Notificações Push</p>
              <p className="text-sm text-gray-400">Receba alertas quando novos sinais forem gerados</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={notificationsEnabled}
                onChange={() => {
                  if (!notificationsEnabled) {
                    requestNotificationPermission();
                  } else {
                    setNotificationsEnabled(false);
                  }
                }}
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Som nas Notificações</p>
              <p className="text-sm text-gray-400">Reproduzir som ao receber novos sinais</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={soundEnabled}
                onChange={() => setSoundEnabled(!soundEnabled)}
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Apenas Sinais de Alta Confiança</p>
              <p className="text-sm text-gray-400">Receber apenas sinais com confiança acima de 80%</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={highConfidenceOnly}
                onChange={() => setHighConfidenceOnly(!highConfidenceOnly)}
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>
        </div>
        
        <div className="mt-6">
          <button
            onClick={saveSettings}
            className="btn btn-primary"
          >
            Salvar Configurações
          </button>
          
          {saveSuccess && (
            <span className="ml-3 text-green-400 animate-fade-in">
              Configurações salvas com sucesso!
            </span>
          )}
        </div>
      </div>
      
      <div className="glass p-6 rounded-lg animate-fade-in">
        <h3 className="text-lg font-medium mb-4">Área Premium <span className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs px-2 py-0.5 rounded-full ml-2">Em breve</span></h3>
        
        <p className="text-gray-300 mb-4">
          A área premium do SniperCripto oferecerá recursos avançados para traders profissionais.
        </p>
        
        <div className="space-y-2 mb-6">
          <div className="flex items-center">
            <svg className="h-5 w-5 text-indigo-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p>Sinais com maior antecedência</p>
          </div>
          <div className="flex items-center">
            <svg className="h-5 w-5 text-indigo-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p>Alertas personalizados por moeda</p>
          </div>
          <div className="flex items-center">
            <svg className="h-5 w-5 text-indigo-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p>Integração com Telegram e Discord</p>
          </div>
          <div className="flex items-center">
            <svg className="h-5 w-5 text-indigo-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p>Gráficos avançados e análises detalhadas</p>
          </div>
        </div>
        
        <button
          disabled
          className="btn bg-gray-700 text-gray-400 cursor-not-allowed"
        >
          Assinar Premium (Em breve)
        </button>
      </div>
      
      {/* Área para expansão futura - Tema claro/escuro */}
      {/* 
      <div className="glass p-6 rounded-lg mt-6 animate-fade-in">
        <h3 className="text-lg font-medium mb-4">Aparência</h3>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Tema</p>
            <p className="text-sm text-gray-400">Escolha entre tema escuro ou claro</p>
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 rounded-lg bg-gray-900 text-white border border-indigo-500">
              Escuro
            </button>
            <button className="px-3 py-1 rounded-lg bg-gray-700 text-gray-300">
              Claro
            </button>
          </div>
        </div>
      </div>
      */}
    </div>
  );
};

export default SettingsPage;
