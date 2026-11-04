// src/components/Toast.jsx
import toast from 'react-hot-toast';

export const showSuccess = (message) => {
  toast.success(message, {
    duration: 3000,
    style: {
      background: '#10B981',
      color: 'white',
      fontWeight: '600',
      borderRadius: '16px',
      padding: '12px 20px',
    },
    iconTheme: {
      primary: 'white',
      secondary: '#10B981',
    },
  });
};

export const showError = (message) => {
  toast.error(message, {
    duration: 4000,
    style: {
      background: '#EF4444',
      color: 'white',
      fontWeight: '600',
      borderRadius: '16px',
      padding: '12px 20px',
    },
    iconTheme: {
      primary: 'white',
      secondary: '#EF4444',
    },
  });
};

export const showInfo = (message) => {
  toast(message, {
    duration: 3000,
    icon: 'ℹ️',
    style: {
      background: '#3B82F6',
      color: 'white',
      fontWeight: '600',
      borderRadius: '16px',
      padding: '12px 20px',
    },
  });
};

export const showLoading = (message) => {
  return toast.loading(message, {
    style: {
      background: '#1F2937',
      color: 'white',
      fontWeight: '600',
      borderRadius: '16px',
      padding: '12px 20px',
    },
  });
};

export const dismissToast = (id) => {
  toast.dismiss(id);
};