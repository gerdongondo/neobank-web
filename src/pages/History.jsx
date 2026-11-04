// src/pages/History.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { transferApi } from '../api/transfer';

export default function History() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const response = await transferApi.getHistory();
      setTransactions(response.content || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
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
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link
            to="/dashboard"
            className="p-2 text-gray-500 hover:text-blue-600 transition rounded-xl hover:bg-blue-50"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </Link>
          <h1 className="text-xl font-bold text-gray-900">Historique</h1>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
            <p className="text-red-600">{error}</p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-xl p-12 text-center animate-fade-in">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Aucune transaction
            </h2>
            <p className="text-gray-500">
              Vos transactions apparaîtront ici
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((tx, index) => {
              const isDebit = tx.type === 'TRANSFER_OUT';
              const color = isDebit ? 'red' : 'green';
              const sign = isDebit ? '-' : '+';

              return (
                <div
                  key={tx.id}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow p-5 animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center gap-4">
                    {/* Icône */}
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        isDebit ? 'bg-red-100' : 'bg-green-100'
                      }`}
                    >
                      <svg
                        className={`w-6 h-6 ${
                          isDebit ? 'text-red-600' : 'text-green-600'
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d={
                            isDebit
                              ? 'M5 10l7-7m0 0l7 7m-7-7v18'
                              : 'M19 14l-7 7m0 0l-7-7m7 7V3'
                          }
                        />
                      </svg>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">
                        {tx.description || 'Transaction'}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500">
                          {formatDate(tx.transactionDate)}
                        </span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-md font-semibold ${
                            isDebit
                              ? 'bg-red-50 text-red-600'
                              : 'bg-green-50 text-green-600'
                          }`}
                        >
                          {isDebit ? 'DÉBIT' : 'CRÉDIT'}
                        </span>
                      </div>
                    </div>

                    {/* Montant */}
                    <div className="text-right">
                      <p
                        className={`font-bold text-lg ${
                          isDebit ? 'text-red-600' : 'text-green-600'
                        }`}
                      >
                        {sign}
                        {tx.amount.toFixed(0)}
                      </p>
                      <p className="text-xs text-gray-400">FCFA</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}