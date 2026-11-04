// src/components/ConfirmModal.jsx
export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmer',
  cancelText = 'Annuler',
  variant = 'danger',
  loading = false,
}) {
  if (!isOpen) return null;

  const variantClasses = {
    danger: {
      icon: 'bg-red-100',
      iconColor: 'text-red-600',
      button: 'bg-gradient-to-r from-red-500 to-red-600 shadow-red-500/30',
    },
    warning: {
      icon: 'bg-orange-100',
      iconColor: 'text-orange-600',
      button: 'bg-gradient-to-r from-orange-500 to-orange-600 shadow-orange-500/30',
    },
    success: {
      icon: 'bg-green-100',
      iconColor: 'text-green-600',
      button: 'bg-gradient-to-r from-green-500 to-green-600 shadow-green-500/30',
    },
  };

  const styles = variantClasses[variant] || variantClasses.danger;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 z-50 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full animate-slide-in">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className={`w-20 h-20 ${styles.icon} rounded-full flex items-center justify-center`}>
            <svg
              className={`w-10 h-10 ${styles.iconColor}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
          {title}
        </h2>

        {/* Message */}
        <p className="text-gray-500 text-center mb-6">{message}</p>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-6 py-3.5 border-2 border-gray-200 rounded-2xl font-semibold text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 px-6 py-3.5 text-white rounded-2xl font-semibold shadow-lg transition hover:shadow-xl disabled:opacity-50 ${styles.button}`}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
}