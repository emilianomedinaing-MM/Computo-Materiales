'use client';
// src/components/PasswordGate.tsx

import { useState } from 'react';
import type { FormEvent } from 'react';
import { useAdminAuth } from '@/hooks/useAdminAuth';

export function PasswordGate({ children }: { children: React.ReactNode }) {
  const { isAuth, login, error, setError } = useAdminAuth();
  const [pwd, setPwd] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuth) return <>{children}</>;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    // Pequeño delay para evitar timing attacks triviales
    setTimeout(() => {
      login(pwd);
      setPwd('');
      setLoading(false);
    }, 300);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <div className="text-center mb-6">
          <div className="text-3xl mb-2">🔒</div>
          <h2 className="text-xl font-semibold text-gray-800">Parámetros técnicos</h2>
          <p className="text-sm text-gray-500 mt-1">Ingresá la contraseña de administrador</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="admin-pwd" className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <input
              id="admin-pwd"
              type="password"
              value={pwd}
              onChange={e => { setPwd(e.target.value); setError(null); }}
              placeholder="••••••••"
              autoFocus
              className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-2.5">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !pwd}
            className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium text-sm rounded-lg transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <circle className="opacity-25" cx="12" cy="12" r="10" strokeWidth="4" />
                  <path className="opacity-75" d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4z" fill="currentColor" />
                </svg>
                Verificando...
              </span>
            ) : 'Ingresar'}
          </button>
        </form>

        <p className="text-xs text-gray-400 text-center mt-6">
          Configurado via <code className="bg-gray-100 px-1 rounded">NEXT_PUBLIC_ADMIN_PASSWORD</code>
        </p>
      </div>
    </div>
  );
}
