// src/pages/Dashboard.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { accountApi } from '../api/account';
import Card from '../components/Card';
import UserMenu from '../components/UserMenu';
import { showError } from '../components/Toast';

export default function Dashboard() {
  const { user, isAdmin } = useAuth();  // ← AJOUT isAdmin
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAccount();
  }, []);

  const loadAccount = async () => {
    try {
      const data = await accountApi.getAccount();
      setAccount(data);
    } catch (error) {
      showError(error.response?.data?.message || 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-gray-900">NeoBank</span>
          </div>

          <div className="flex items-center gap-3">
            {/* 🔥 ICÔNE ADMIN UNIQUEMENT POUR LES ADMINS */}
            {isAdmin && (
              <Link
                to="/admin"
                className="p-2 text-gray-500 hover:text-blue-600 transition rounded-xl hover:bg-blue-50"
                title="Admin"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </Link>
            )}
            <UserMenu />
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-gray-900">
            Bonjour {user?.firstName} 👋
          </h1>
          <p className="text-gray-500 mt-1">Voici un aperçu de votre compte</p>
        </div>

        {/* Carte de solde */}
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl p-8 text-white shadow-2xl shadow-blue-500/30 mb-8 animate-fade-in">
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-white/80 text-sm mb-1">Solde disponible</p>
              <p className="text-5xl font-bold">
                {account?.balance?.toFixed(0) || 0}{' '}
                <span className="text-2xl">FCFA</span>
              </p>
            </div>
            <div className="bg-white/20 px-4 py-2 rounded-xl backdrop-blur-sm">
              <p className="text-xs text-white/80">Devise</p>
              <p className="font-bold">{account?.currency || 'XOF'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white/15 rounded-2xl p-4 backdrop-blur-sm">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            <span className="font-mono tracking-wider">
              {account?.accountNumber || '---'}
            </span>
          </div>
        </div>

        {/* Actions rapides */}
        <h2 className="text-xl font-bold text-gray-900 mb-4">Actions rapides</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/transfer">
            <Card className="hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-1">Transfert</h3>
              <p className="text-sm text-gray-500">Envoyer de l'argent</p>
            </Card>
          </Link>

          <Link to="/history">
            <Card className="hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-1">Historique</h3>
              <p className="text-sm text-gray-500">Voir les transactions</p>
            </Card>
          </Link>

          <Link to="/profile">
            <Card className="hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-1">Profil</h3>
              <p className="text-sm text-gray-500">Gérer votre compte</p>
            </Card>
          </Link>
        </div>
      </main>
    </div>
  );
}