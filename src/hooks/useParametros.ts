'use client';
// src/hooks/useParametros.ts
// ─────────────────────────────────────────────────────────────────────────────
// Hook + Context global para parámetros técnicos
// ─────────────────────────────────────────────────────────────────────────────

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { DEFAULT_PARAMS } from '@/lib/defaultParams';
import type { ParamGlobal } from '@/types/parametros';

const LS_KEY = 'medina_parametros_v1';

// ─── Helpers localStorage ────────────────────────────────────────────────────
function lsGet(): ParamGlobal | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function lsSet(p: ParamGlobal) {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem(LS_KEY, JSON.stringify(p)); } catch { /* noop */ }
}

function lsDel() {
  if (typeof window === 'undefined') return;
  try { localStorage.removeItem(LS_KEY); } catch { /* noop */ }
}

// ─── Deep merge: default ← stored ───────────────────────────────────────────
function deepMerge<T extends object>(defaults: T, overrides: Partial<T>): T {
  const result = { ...defaults };
  for (const key of Object.keys(overrides) as (keyof T)[]) {
    const d = defaults[key];
    const o = overrides[key];
    if (d !== null && typeof d === 'object' && !Array.isArray(d) &&
        o !== null && typeof o === 'object' && !Array.isArray(o)) {
      result[key] = deepMerge(d as object, o as object) as T[keyof T];
    } else if (o !== undefined) {
      result[key] = o as T[keyof T];
    }
  }
  return result;
}

// ─── Contexto ────────────────────────────────────────────────────────────────
export type SaveState = 'idle' | 'saving' | 'saved' | 'error';

interface ParamContextValue {
  params: ParamGlobal;
  loading: boolean;
  saveState: SaveState;
  saveParams: (next: ParamGlobal) => Promise<void>;
  resetParams: () => Promise<void>;
  setParams: (next: ParamGlobal) => void;
}

const ParamContext = createContext<ParamContextValue | null>(null);

export function ParamProvider({ children }: { children: ReactNode }) {
  const [params, setParams] = useState<ParamGlobal>(DEFAULT_PARAMS);
  const [loading, setLoading] = useState(true);
  const [saveState, setSaveState] = useState<SaveState>('idle');

  // ── Cargar al montar ───────────────────────────────────────────────────────
  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch('/api/parametros');
        if (res.ok) {
          const data: ParamGlobal = await res.json();
          const merged = deepMerge(DEFAULT_PARAMS, data);
          setParams(merged);
          lsSet(merged); // sincronizar LS como cache
        } else {
          throw new Error('API error');
        }
      } catch {
        // Fallback: localStorage
        const ls = lsGet();
        setParams(ls ? deepMerge(DEFAULT_PARAMS, ls) : DEFAULT_PARAMS);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // ── Guardar ────────────────────────────────────────────────────────────────
  const saveParams = useCallback(async (next: ParamGlobal) => {
    setSaveState('saving');
    setParams(next);
    lsSet(next); // optimistic local

    try {
      const res = await fetch('/api/parametros', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(next),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? 'Error desconocido');
      }
      setSaveState('saved');
      setTimeout(() => setSaveState('idle'), 2500);
    } catch (err) {
      // Quedó guardado en LS de todas formas
      setSaveState('error');
      setTimeout(() => setSaveState('idle'), 4000);
      throw err;
    }
  }, []);

  // ── Restaurar defaults ─────────────────────────────────────────────────────
  const resetParams = useCallback(async () => {
    setSaveState('saving');
    try {
      await fetch('/api/parametros', { method: 'DELETE' });
    } catch { /* noop */ }
    lsDel();
    setParams(DEFAULT_PARAMS);
    setSaveState('saved');
    setTimeout(() => setSaveState('idle'), 2500);
  }, []);

  return (
    <ParamContext.Provider value={{ params, loading, saveState, saveParams, resetParams, setParams }}>
      {children}
    </ParamContext.Provider>
  );
}

export function useParametros() {
  const ctx = useContext(ParamContext);
  if (!ctx) throw new Error('useParametros debe usarse dentro de <ParamProvider>');
  return ctx;
}
