import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../context/AppContext';
import { showToast } from '../components/Toast';

export function Login() {
  const { t } = useTranslation();
  const { login } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await login({ email, password });
      showToast(t('auth.loggedIn'), 'success');
      window.location.hash = 'home';
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
        <div className="mb-2 text-left">
          <button
            type="button"
            onClick={() => { if (window.history.length > 1) { window.history.back(); } else { window.location.hash = 'home'; } }}
            className="inline-flex items-center text-sm text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            ← Back
          </button>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">{t('auth.loginTitle')}</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="text-sm text-red-600 dark:text-red-400">{error}</div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('auth.email')}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="name@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('auth.password')}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 text-white font-medium py-2.5 rounded-lg transition-colors"
          >
            {isSubmitting ? t('auth.loggingIn') : t('auth.login')}
          </button>
        </form>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-4 text-center">
          {t('auth.noAccount')}{' '}
          <a href="#register" className="text-indigo-600 dark:text-indigo-400 hover:underline">{t('auth.register')}</a>
        </p>
        <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">Or</span>
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
            Admin?{' '}
            <a href="#admin-login" className="text-red-600 dark:text-red-400 hover:underline font-medium">Admin Login</a>
          </p>
      </div>
    </div>
  );
}


