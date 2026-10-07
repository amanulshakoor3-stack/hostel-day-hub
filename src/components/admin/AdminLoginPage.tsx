import React, { useState, useEffect } from 'react';
import {
  Lock,
  LogIn,
  Loader2,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
} from 'lucide-react';
import { adminLogin, getAdminSession } from '../../lib/adminAuth';

interface AdminLoginPageProps {
  onLoginSuccess: () => void;
  onBackToHome: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({
  onLoginSuccess,
  onBackToHome,
}) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [checkingSession, setCheckingSession] = useState(true);

  // If already logged in, redirect immediately
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const isAdmin = await getAdminSession();
      if (!cancelled && isAdmin) {
        onLoginSuccess();
      }
      if (!cancelled) setCheckingSession(false);
    })();
    return () => { cancelled = true; };
  }, [onLoginSuccess]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await adminLogin(password);

    setIsLoading(false);

    if (result.success) {
      setPassword('');
      onLoginSuccess();
    } else {
      // Only show the generic message — never reveal whether account exists
      setError('Incorrect admin password.');
      setPassword('');
    }
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-festival-cream-50">
        <Loader2 className="w-8 h-8 animate-spin text-festival-purple-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-festival-cream-50 px-4 py-16 relative overflow-hidden">
      {/* Decorative background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-festival-purple-100/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-80 h-80 bg-festival-orange-100/30 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <button
            type="button"
            onClick={onBackToHome}
            className="inline-flex items-center gap-2.5 group focus:outline-none mb-6"
            aria-label="Hostel Day Hub Home"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-festival-orange-500 to-festival-purple-600 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="font-display font-extrabold text-2xl text-festival-purple-950 tracking-tight">
              Hostel Day <span className="text-festival-orange-500">Hub</span>
            </span>
          </button>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-festival-purple-100 text-festival-purple-800 text-xs font-bold uppercase tracking-wider mb-3 border border-festival-purple-200">
            <Lock className="w-3.5 h-3.5" />
            Admin Access
          </div>

          <h1 className="text-3xl font-extrabold text-festival-purple-950 font-display">
            Admin Access
          </h1>
          <p className="mt-2 text-sm text-slate-500 font-medium">
            Restricted to authorized administrator only.
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-festival-purple-100">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error Banner */}
            {error && (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 animate-pulse-once">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                <p className="text-sm font-semibold">{error}</p>
              </div>
            )}

            {/* Password Field */}
            <div>
              <label
                htmlFor="admin-password"
                className="block text-sm font-bold text-slate-800 mb-1.5"
              >
                Enter Admin Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-slate-400" />
                </div>
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="Enter admin password"
                  required
                  autoComplete="current-password"
                  className="w-full pl-11 pr-12 py-3.5 rounded-xl border border-slate-300 bg-white text-slate-800 text-sm focus:ring-2 focus:ring-festival-purple-500 focus:border-festival-purple-500 shadow-sm placeholder:text-slate-400 transition-all"
                />
                {/* Show/Hide toggle */}
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading || !password}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-festival-purple-700 to-festival-purple-900 hover:from-festival-purple-800 hover:to-festival-purple-950 text-white font-bold text-base shadow-lg shadow-festival-purple-900/20 hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5 text-festival-orange-300" />
                  <span>Login</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Back to site */}
        <div className="text-center mt-6">
          <button
            type="button"
            onClick={onBackToHome}
            className="text-sm text-festival-purple-600 hover:text-festival-purple-900 font-semibold hover:underline transition-colors"
          >
            ← Back to Hostel Day Hub
          </button>
        </div>
      </div>
    </div>
  );
};
