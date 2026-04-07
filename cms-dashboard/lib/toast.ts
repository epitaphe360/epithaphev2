// ========================================
// CMS Dashboard — Global Toast Singleton
// Permet d'appeler toast.success/error/warning/info sans hook context
// ========================================

type ToastFn = (title: string, message?: string) => void;

interface GlobalToast {
  success: ToastFn;
  error: ToastFn;
  warning: ToastFn;
  info: ToastFn;
}

// Singleton — initialisé par ToastProvider au montage
let _toast: GlobalToast = {
  success: (t) => console.info('[toast:success]', t),
  error: (t) => console.error('[toast:error]', t),
  warning: (t) => console.warn('[toast:warning]', t),
  info: (t) => console.info('[toast:info]', t),
};

export const registerToast = (instance: GlobalToast) => {
  _toast = instance;
};

export const toast = {
  success: (title: string, message?: string) => _toast.success(title, message),
  error: (title: string, message?: string) => _toast.error(title, message),
  warning: (title: string, message?: string) => _toast.warning(title, message),
  info: (title: string, message?: string) => _toast.info(title, message),
};
