import React, { useState } from 'react';
import { useI18n } from '../lib/i18n';
import { resetPassword } from '../lib/firebase';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { ToastContainer, type ToastItem } from './Toast';

type Props = {
  open: boolean;
  onClose: () => void;
};

type AuthView = 'login' | 'register' | 'forgot-password';

export default function AuthModal({ open, onClose }: Props) {
  const { t } = useI18n();
  const [currentView, setCurrentView] = useState<AuthView>('login');
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);

  if (!open) return null;

  const pushToast = (message: string) => {
    const id = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    setToasts((prev) => [...prev, { id, message }]);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleAuthSuccess = () => {
    onClose();
    pushToast(t('loginSuccess'));
  };

  const handleAuthError = (error: string) => {
    pushToast(error);
  };

  const handleForgotPassword = async () => {
    if (!forgotPasswordEmail) {
      pushToast(t('pleaseEnterEmail'));
      return;
    }

    setForgotPasswordLoading(true);
    try {
      await resetPassword(forgotPasswordEmail);
      pushToast(t('passwordResetEmailSent'));
      setCurrentView('login');
    } catch (error: any) {
      let errorMessage = t('passwordResetFailed');
      if (error.code === 'auth/user-not-found') {
        errorMessage = t('userNotFound');
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = t('invalidEmail');
      }
      pushToast(errorMessage);
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  const renderForgotPasswordForm = () => (
    <div className="w-full max-w-md">
      <h2 className="text-2xl font-bold text-center mb-6">{t('forgotPassword')}</h2>
      
      <div className="mb-4">
        <p className="text-gray-600 text-center mb-4">
          {t('forgotPasswordDescription')}
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="reset-email" className="block text-sm font-medium text-gray-700 mb-1">
            {t('email')}
          </label>
          <input
            id="reset-email"
            type="email"
            value={forgotPasswordEmail}
            onChange={(e) => setForgotPasswordEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <button
          onClick={handleForgotPassword}
          disabled={forgotPasswordLoading}
          className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {forgotPasswordLoading ? 'Sending...' : t('sendResetEmail')}
        </button>

        <button
          onClick={() => setCurrentView('login')}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors"
        >
          {t('backToLogin')}
        </button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl p-6 text-[#222222] relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {currentView === 'login' && (
          <LoginForm
            onSuccess={handleAuthSuccess}
            onError={handleAuthError}
            onSwitchToRegister={() => setCurrentView('register')}
            onForgotPassword={() => setCurrentView('forgot-password')}
          />
        )}

        {currentView === 'register' && (
          <RegisterForm
            onSuccess={handleAuthSuccess}
            onError={handleAuthError}
            onSwitchToLogin={() => setCurrentView('login')}
          />
        )}

        {currentView === 'forgot-password' && renderForgotPasswordForm()}

        <ToastContainer items={toasts} onDismiss={dismissToast} />
      </div>
    </div>
  );
}