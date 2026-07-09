'use client';
// src/hooks/useAdminAuth.ts

import { useState, useCallback } from 'react';

const SESSION_KEY = 'medina_admin_auth';
const SESSION_TTL = 1000 * 60 * 60 * 4; // 4 horas

interface AuthSession {
  ts: number;
}

function isSessionValid(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return false;
    const s: AuthSession = JSON.parse(raw);
    return Date.now() - s.ts < SESSION_TTL;
  } catch { return false; }
}

function saveSession() {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(SESSION_KEY, JSON.stringify({ ts: Date.now() }));
}

function clearSession() {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(SESSION_KEY);
}

export function useAdminAuth() {
  const [isAuth, setIsAuth] = useState<boolean>(() => isSessionValid());
  const [error, setError] = useState<string | null>(null);

  const login = useCallback((password: string): boolean => {
    const expected = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

    if (!expected) {
      // Si no hay variable de entorno configurada, bloquear siempre
      setError('Variable NEXT_PUBLIC_ADMIN_PASSWORD no configurada en Vercel.');
      return false;
    }

    if (password === expected) {
      saveSession();
      setIsAuth(true);
      setError(null);
      return true;
    }

    setError('Contraseña incorrecta. Intentá de nuevo.');
    return false;
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setIsAuth(false);
  }, []);

  return { isAuth, login, logout, error, setError };
}
