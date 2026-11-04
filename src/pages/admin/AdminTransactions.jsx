// src/pages/admin/AdminTransactions.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../api/admin';

export default function AdminTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      const response = await adminApi.getTransactions();
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
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link
            to="/admin"
            className="p-2 text-gray-500 hover:text-blue-600 transition rounded-xl hover:bg-blue-50"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Toutes les transactions</h1>
            <p className="text-xs text-gray-500">{transactions.length} transactions</p>
          </div>
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
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Aucune transaction</h2>
            <p className="text-gray-500">Les transactions apparaîtront ici</p>
          </div>
        ) : (
          <>
            {/* En-tête total */}
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl p-6 text-white shadow-2xl shadow-blue-500/30 mb-6 animate-fade-in">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                </div>
                <div>
                  <p className="text-white/80 text-sm">Total des transactions</p>
                  <p className="text-3xl font-bold">{transactions.length}</p>
                </div>
              </div>
            </div>

            {/* Liste */}
            <div className="space-y-3">
              {transactions.map((tx, index) => (
                <TransactionCard key={tx.id} tx={tx} index={index} formatDate={formatDate} />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

function TransactionCard({ tx, index, formatDate }) {
  return (
    <div
      className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow p-5 animate-fade-in"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center flex-shrink-0">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-gray-500">{formatDate(tx.transactionDate)}</span>
          </div>
          <p className="text-xs text-gray-400 font-mono mt-1 truncate">
            Réf: {tx.reference?.substring(0, 16)}...
          </p>
        </div>
        <div className="text-right">
          <p className="font-bold text-lg text-red-600">
            -{tx.amount.toFixed(0)} F
          </p>
        </div>
      </div>

      {/* Source → Destination */}
      <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3">
        {/* Source */}
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">
            De
          </p>
          <p className="text-sm font-semibold text-gray-900 truncate">
            {tx.sourceUserName}
          </p>
          <p className="text-xs text-gray-500 truncate">
            {tx.sourceAccountNumber}
          </p>
        </div>

        {/* Flèche */}
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </div>

        {/* Destination */}
        <div className="flex-1 min-w-0 text-right">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">
            Vers
          </p>
          <p className="text-sm font-semibold text-gray-900 truncate">
            {tx.destinationUserName}
          </p>
          <p className="text-xs text-gray-500 truncate">
            {tx.destinationAccountNumber}
          </p>
        </div>
      </div>

      {/* Description + Statut */}
      <div className="flex items-center justify-between mt-3">
        {tx.description && (
          <p className="text-xs text-gray-500 italic truncate flex-1 mr-3">
            {tx.description}
          </p>
        )}
        <span className="bg-green-50 text-green-600 text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1 flex-shrink-0">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          {tx.status}
        </span>
      </div>
    </div>
  );
}