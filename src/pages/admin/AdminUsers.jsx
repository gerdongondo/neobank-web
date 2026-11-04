// src/pages/admin/AdminUsers.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../api/admin';
import ConfirmModal from '../../components/ConfirmModal';
import { showSuccess, showError } from '../../components/Toast';
import { CardSkeleton } from '../../components/Skeleton';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal de confirmation
  const [modal, setModal] = useState({
    isOpen: false,
    user: null,
    action: null,
  });
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredUsers(users);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredUsers(
        users.filter(
          (user) =>
            user.firstName.toLowerCase().includes(query) ||
            user.lastName.toLowerCase().includes(query) ||
            user.email.toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, users]);

  const loadUsers = async () => {
    try {
      const response = await adminApi.getUsers();
      setUsers(response.content || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  const openConfirmModal = (user, action) => {
    setModal({ isOpen: true, user, action });
  };

  const closeConfirmModal = () => {
    if (!actionLoading) {
      setModal({ isOpen: false, user: null, action: null });
    }
  };

  const handleConfirm = async () => {
    const { user, action } = modal;
    if (!user || !action) return;

    setActionLoading(true);
    try {
      if (action === 'block') {
        await adminApi.blockUser(user.id);
        showSuccess(`${user.firstName} a été bloqué avec succès`);
      } else {
        await adminApi.unblockUser(user.id);
        showSuccess(`${user.firstName} a été débloqué avec succès`);
      }
      await loadUsers();
      setModal({ isOpen: false, user: null, action: null });
    } catch (err) {
      showError(err.response?.data?.message || 'Erreur');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
            <Link to="/admin" className="p-2 text-gray-500 hover:text-blue-600 transition rounded-xl hover:bg-blue-50">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Utilisateurs</h1>
              <p className="text-xs text-gray-500">Chargement...</p>
            </div>
          </div>
        </header>
        <main className="max-w-4xl mx-auto px-6 py-8 space-y-3">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link
            to="/admin"
            className="p-2 text-gray-500 hover:text-blue-600 transition rounded-xl hover:bg-blue-50"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Utilisateurs</h1>
            <p className="text-xs text-gray-500">{users.length} utilisateurs</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Recherche */}
        <div className="bg-white rounded-2xl shadow-sm mb-6 p-2">
          <div className="flex items-center gap-3 px-4 py-2">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un utilisateur..."
              className="flex-1 bg-transparent border-none outline-none text-gray-900 placeholder-gray-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Liste */}
        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
            <p className="text-red-600">{error}</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
            <p className="text-gray-500">Aucun utilisateur trouvé</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredUsers.map((user, index) => (
              <UserCard
                key={user.id}
                user={user}
                index={index}
                onBlock={() => openConfirmModal(user, 'block')}
                onUnblock={() => openConfirmModal(user, 'unblock')}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modal de confirmation */}
      <ConfirmModal
        isOpen={modal.isOpen}
        onClose={closeConfirmModal}
        onConfirm={handleConfirm}
        loading={actionLoading}
        title={modal.action === 'block' ? 'Bloquer cet utilisateur ?' : 'Débloquer cet utilisateur ?'}
        message={
          modal.action === 'block'
            ? `Êtes-vous sûr de vouloir bloquer ${modal.user?.firstName} ${modal.user?.lastName} ? Cette action empêchera l'utilisateur d'effectuer des transactions.`
            : `Voulez-vous débloquer ${modal.user?.firstName} ${modal.user?.lastName} ? L'utilisateur pourra à nouveau effectuer des transactions.`
        }
        confirmText={modal.action === 'block' ? 'Bloquer' : 'Débloquer'}
        variant={modal.action === 'block' ? 'danger' : 'success'}
      />
    </div>
  );
}

// UserCard reste identique
function UserCard({ user, index, onBlock, onUnblock }) {
  // ... même code que précédemment
  const isAdmin = user.role === 'ADMIN';
  const isBlocked = user.status === 'BLOCKED';
  const isActive = user.status === 'ACTIVE';

  const statusColor = isActive
    ? 'text-green-600 bg-green-50'
    : isBlocked
      ? 'text-red-600 bg-red-50'
      : 'text-gray-600 bg-gray-50';

  return (
    <div
      className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow p-5 animate-fade-in"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex items-center gap-4 mb-4">
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ${
            isAdmin
              ? 'bg-gradient-to-br from-purple-500 to-blue-500'
              : 'bg-gradient-to-br from-blue-500 to-purple-600'
          }`}
        >
          {user.firstName[0]}
          {user.lastName[0]}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-bold text-gray-900 truncate">
              {user.firstName} {user.lastName}
            </p>
            {isAdmin && (
              <span className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                ADMIN
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 truncate">{user.email}</p>
        </div>

        <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${statusColor}`}>
          {user.status}
        </span>
      </div>

      <div className="bg-gray-50 rounded-xl p-3 flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
          <span className="text-sm font-semibold text-gray-900">
            {user.accountNumber || 'Aucun compte'}
          </span>
        </div>
        <span className="font-bold text-green-600 text-sm">
          {user.balance?.toFixed(0) || 0} FCFA
        </span>
      </div>

      {!isAdmin && (
        <button
          onClick={isBlocked ? onUnblock : onBlock}
          className={`w-full py-2.5 rounded-xl font-semibold text-sm transition flex items-center justify-center gap-2 ${
            isBlocked
              ? 'bg-green-50 text-green-600 hover:bg-green-100 border-2 border-green-200'
              : 'bg-red-50 text-red-600 hover:bg-red-100 border-2 border-red-200'
          }`}
        >
          {isBlocked ? (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
              </svg>
              Débloquer
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
              Bloquer
            </>
          )}
        </button>
      )}
    </div>
  );
}