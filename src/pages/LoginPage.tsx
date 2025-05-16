import React, { useState } from 'react';
import logo from '../assets/logo.png';

interface LoginPageProps {
  onLoginSuccess?: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Simulação de login/registro
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Aqui seria a integração real com Supabase
      // Para integrar com Supabase, descomente e adapte o código abaixo:
      
      /*
      // Importar o cliente Supabase no topo do arquivo:
      // import { supabase } from '../utils/supabaseClient';
      
      if (isLogin) {
        // Login com Supabase
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) throw error;
        
        // Redirecionar ou atualizar estado global
        // navigate('/');
      } else {
        // Registro com Supabase
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        
        if (error) throw error;
        
        // Mostrar mensagem de confirmação
        alert('Verifique seu email para confirmar o cadastro!');
      }
      */
      
      // Simulação para demonstração
      console.log(`${isLogin ? 'Login' : 'Cadastro'} simulado para: ${email}`);
      alert(`${isLogin ? 'Login' : 'Cadastro'} realizado com sucesso! (Simulação)`);
      
      // Chamar callback de sucesso se fornecido
      if (onLoginSuccess) {
        onLoginSuccess();
      }
      
      // Redirecionar para a página principal (em uma implementação real)
      // window.location.href = '/';
    } catch (err: any) {
      console.error('Erro de autenticação:', err);
      setError(err.message || 'Ocorreu um erro durante a autenticação');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="glass p-8 rounded-lg w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <img src={logo} alt="SniperCripto Logo" className="h-16 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gradient">
            {isLogin ? 'Entrar no SniperCripto' : 'Criar Conta'}
          </h2>
          <p className="text-gray-400 mt-2">
            {isLogin 
              ? 'Acesse sua conta para ver sinais em tempo real' 
              : 'Crie sua conta para começar a receber sinais'}
          </p>
        </div>
        
        {error && (
          <div className="bg-red-900/20 border border-red-800 text-red-400 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-gray-800/50 border border-gray-700 text-white rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="seu@email.com"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-1">
              Senha
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-gray-800/50 border border-gray-700 text-white rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="••••••••"
            />
          </div>
          
          {isLogin && (
            <div className="flex justify-end">
              <a href="#" className="text-sm text-indigo-400 hover:text-indigo-300">
                Esqueceu a senha?
              </a>
            </div>
          )}
          
          <button
            type="submit"
            disabled={loading}
            className={`w-full btn btn-primary py-2.5 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processando...
              </span>
            ) : (
              isLogin ? 'Entrar' : 'Criar Conta'
            )}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-indigo-400 hover:text-indigo-300 text-sm"
          >
            {isLogin 
              ? 'Não tem uma conta? Cadastre-se' 
              : 'Já tem uma conta? Faça login'}
          </button>
        </div>
        
        {/* Área para login social (para expansão futura) */}
        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-900 text-gray-400">Ou continue com</span>
            </div>
          </div>
          
          <div className="mt-4 grid grid-cols-3 gap-3">
            {/* Botões de login social (desativados, para expansão futura) */}
            <button
              type="button"
              disabled
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-700 rounded-lg bg-gray-800/30 text-gray-500 cursor-not-allowed"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84"></path>
              </svg>
            </button>
            <button
              type="button"
              disabled
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-700 rounded-lg bg-gray-800/30 text-gray-500 cursor-not-allowed"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd"></path>
              </svg>
            </button>
            <button
              type="button"
              disabled
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-700 rounded-lg bg-gray-800/30 text-gray-500 cursor-not-allowed"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd"></path>
              </svg>
            </button>
          </div>
          
          <p className="mt-4 text-center text-xs text-gray-500">
            * Integração com login social disponível em breve
          </p>
        </div>
        
        {/* Comentário para desenvolvedores sobre integração Supabase */}
        {/* 
          INSTRUÇÕES PARA INTEGRAÇÃO COM SUPABASE:
          
          1. Crie um arquivo src/utils/supabaseClient.ts com o seguinte conteúdo:
          
          import { createClient } from '@supabase/supabase-js';
          
          const supabaseUrl = 'SUA_URL_SUPABASE';
          const supabaseAnonKey = 'SUA_CHAVE_ANON_SUPABASE';
          
          export const supabase = createClient(supabaseUrl, supabaseAnonKey);
          
          2. Instale as dependências necessárias:
          npm install @supabase/supabase-js
          
          3. Descomente o código de integração neste componente
          
          4. Adicione lógica de redirecionamento após login bem-sucedido
          
          5. Implemente proteção de rotas para páginas que exigem autenticação
        */}
      </div>
    </div>
  );
};

export default LoginPage;
