'use client';
// src/components/Parametros.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Interfaz visual editable de parámetros técnicos
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useCallback } from 'react';
import { useParametros } from '@/hooks/useParametros';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { PasswordGate } from '@/components/PasswordGate';
import { PARAM_CATEGORIAS, DEFAULT_PARAMS } from '@/lib/defaultParams';
import type { ParamGlobal } from '@/types/parametros';
import type { ParamCategoria, ParamMeta } from '@/types/parametros';

// ─── Helper: get/set nested value por dot-path ────────────────────────────────
function getPath(obj: Record<string, unknown>, path: string): number {
  return path.split('.').reduce<unknown>((acc, k) => {
    if (acc && typeof acc === 'object') return (acc as Record<string, unknown>)[k];
    return undefined;
  }, obj) as number;
}

function setPath(obj: Record<string, unknown>, path: string, value: number): Record<string, unknown> {
  const keys = path.split('.');
  const result = JSON.parse(JSON.stringify(obj)) as Record<string, unknown>;
  let cur: Record<string, unknown> = result;
  for (let i = 0; i < keys.length - 1; i++) {
    cur = cur[keys[i]] as Record<string, unknown>;
  }
  cur[keys[keys.length - 1]] = value;
  return result;
}

// ─── Indicador de estado guardado ────────────────────────────────────────────
function SaveIndicator({ state }: { state: string }) {
  if (state === 'idle') return null;
  const map: Record<string, { bg: string; text: string; icon: string; label: string }> = {
    saving: { bg: 'bg-blue-50 border-blue-200', text: 'text-blue-700', icon: '⏳', label: 'Guardando...' },
    saved:  { bg: 'bg-green-50 border-green-200', text: 'text-green-700', icon: '✅', label: 'Guardado correctamente' },
    error:  { bg: 'bg-red-50 border-red-200', text: 'text-red-700', icon: '❌', label: 'Error al guardar en servidor. Guardado local aplicado.' },
  };
  const s = map[state];
  if (!s) return null;
  return (
    <div className={`flex items-center gap-2 border rounded-lg px-4 py-2.5 text-sm ${s.bg} ${s.text}`}>
      <span>{s.icon}</span><span>{s.label}</span>
    </div>
  );
}

// ─── Fila de parámetro editable ───────────────────────────────────────────────
function ParamRow({
  meta, value, defaultValue, onChange,
}: {
  meta: ParamMeta;
  value: number;
  defaultValue: number;
  onChange: (key: string, value: number) => void;
}) {
  const [localVal, setLocalVal] = useState(String(value));
  const [hasError, setHasError] = useState(false);
  const isModified = value !== defaultValue;

  function handleChange(raw: string) {
    setLocalVal(raw);
    const num = parseFloat(raw);
    if (!isNaN(num) && num >= meta.min && num <= meta.max) {
      setHasError(false);
      onChange(meta.key, num);
    } else {
      setHasError(true);
    }
  }

  return (
    <tr className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${isModified ? 'bg-amber-50/40' : ''}`}>
      <td className="py-2.5 px-3 text-sm text-gray-700">
        <div className="flex items-center gap-1.5">
          {isModified && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" title="Valor modificado" />}
          {meta.label}
        </div>
        {meta.descripcion && <div className="text-xs text-gray-400 mt-0.5">{meta.descripcion}</div>}
      </td>
      <td className="py-2 px-3 w-28">
        <input
          type="number"
          value={localVal}
          min={meta.min}
          max={meta.max}
          step={meta.step}
          onChange={e => handleChange(e.target.value)}
          className={`w-full text-right text-sm px-2 py-1.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${
            hasError
              ? 'border-red-400 bg-red-50 text-red-700'
              : 'border-gray-200 bg-white text-gray-800'
          }`}
        />
        {hasError && (
          <div className="text-xs text-red-500 mt-0.5 text-right">
            [{meta.min} – {meta.max}]
          </div>
        )}
      </td>
      <td className="py-2 px-3 text-xs text-gray-400 whitespace-nowrap">{meta.unit}</td>
      <td className="py-2 px-3 text-xs text-gray-400 whitespace-nowrap">
        {isModified && (
          <button
            onClick={() => { setLocalVal(String(defaultValue)); onChange(meta.key, defaultValue); }}
            className="text-blue-500 hover:text-blue-700 underline underline-offset-2"
            title={`Restaurar a ${defaultValue}`}
          >
            ↺ {defaultValue}
          </button>
        )}
      </td>
    </tr>
  );
}

// ─── Categoría colapsable ─────────────────────────────────────────────────────
function CategoriaSection({
  cat, params, defaults, onChange,
}: {
  cat: ParamCategoria;
  params: Record<string, unknown>;
  defaults: Record<string, unknown>;
  onChange: (key: string, value: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const modifiedCount = cat.params.filter(m => getPath(params, m.key) !== getPath(defaults, m.key)).length;

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden mb-3">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 bg-white hover:bg-gray-50 transition-colors text-left"
      >
        <div className="flex items-center gap-2.5">
          <span className="text-lg">{cat.icon}</span>
          <span className="font-medium text-gray-800 text-sm">{cat.label}</span>
          {modifiedCount > 0 && (
            <span className="text-xs bg-amber-100 text-amber-700 rounded-full px-2 py-0.5 font-medium">
              {modifiedCount} modificado{modifiedCount > 1 ? 's' : ''}
            </span>
          )}
        </div>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
        >
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {open && (
        <div className="border-t border-gray-100">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-xs font-medium text-gray-400 text-left py-2 px-3">Parámetro</th>
                <th className="text-xs font-medium text-gray-400 text-right py-2 px-3 w-28">Valor</th>
                <th className="text-xs font-medium text-gray-400 py-2 px-3">Unidad</th>
                <th className="text-xs font-medium text-gray-400 py-2 px-3">Default</th>
              </tr>
            </thead>
            <tbody>
              {cat.params.map(meta => (
                <ParamRow
                  key={meta.key}
                  meta={meta}
                  value={getPath(params, meta.key)}
                  defaultValue={getPath(defaults, meta.key)}
                  onChange={onChange}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────
function ParametrosInner({ onClose }: { onClose: () => void }) {
  const { params, saveState, saveParams, resetParams, setParams, loading } = useParametros();
  const { logout } = useAdminAuth();
  const [confirmReset, setConfirmReset] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleChange = useCallback((key: string, value: number) => {
    const next = setPath(params as unknown as Record<string, unknown>, key, value) as unknown as ParamGlobal;
    setParams(next);
  }, [params, setParams]);

  async function handleSave() {
    setSaveError(null);
    try {
      await saveParams(params);
    } catch (err) {
      setSaveError((err as Error).message ?? 'Error desconocido');
    }
  }

  async function handleReset() {
    if (!confirmReset) { setConfirmReset(true); return; }
    await resetParams();
    setConfirmReset(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <svg className="animate-spin w-8 h-8 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <circle className="opacity-25" cx="12" cy="12" r="10" strokeWidth="4"/>
          <path className="opacity-75" d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4z" fill="currentColor"/>
        </svg>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Parámetros técnicos</h1>
          <p className="text-sm text-gray-500 mt-0.5">Coeficientes y rendimientos usados en el cómputo</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => { logout(); onClose(); }}
            className="text-xs text-gray-400 hover:text-gray-600 px-3 py-1.5 border border-gray-200 rounded-lg transition"
          >
            Cerrar sesión
          </button>
          <button
            onClick={onClose}
            className="text-xs text-gray-600 hover:text-gray-800 px-3 py-1.5 border border-gray-200 rounded-lg transition"
          >
            ← Volver
          </button>
        </div>
      </div>

      {/* Nota informativa */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 mb-5 text-sm text-blue-700 flex gap-2">
        <span className="flex-shrink-0">ℹ️</span>
        <span>
          Los puntos <span className="font-semibold text-amber-600">amarillos</span> indican valores modificados respecto al default.
          Hacé clic en <strong>↺</strong> en la columna Default para restaurar un valor individual.
        </span>
      </div>

      {/* Categorías */}
      {PARAM_CATEGORIAS.map(cat => (
        <CategoriaSection
          key={cat.id}
          cat={cat}
          params={params as unknown as Record<string, unknown>}
          defaults={DEFAULT_PARAMS as unknown as Record<string, unknown>}
          onChange={handleChange}
        />
      ))}

      {/* Errores de validación */}
      {saveError && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4 text-sm text-red-700 flex gap-2">
          <span>❌</span><span>{saveError}</span>
        </div>
      )}

      {/* Barra de acciones */}
      <div className="sticky bottom-0 bg-white/95 backdrop-blur border-t border-gray-100 -mx-4 px-4 py-4 mt-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <SaveIndicator state={saveState} />
        </div>
        <div className="flex gap-2 ml-auto">
          <button
            onClick={handleReset}
            disabled={saveState === 'saving'}
            className={`px-4 py-2 text-sm rounded-lg border transition focus:outline-none focus:ring-2 focus:ring-offset-1 ${
              confirmReset
                ? 'bg-red-600 hover:bg-red-700 text-white border-red-600 focus:ring-red-400'
                : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-300 focus:ring-gray-300'
            }`}
          >
            {confirmReset ? '⚠️ Confirmar restaurar defaults' : '↺ Restaurar defaults'}
          </button>
          {confirmReset && (
            <button
              onClick={() => setConfirmReset(false)}
              className="px-3 py-2 text-sm rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition"
            >
              Cancelar
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={saveState === 'saving'}
            className="px-5 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-lg transition focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1"
          >
            {saveState === 'saving' ? (
              <span className="flex items-center gap-1.5">
                <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <circle className="opacity-25" cx="12" cy="12" r="10" strokeWidth="4"/>
                  <path className="opacity-75" d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4z" fill="currentColor"/>
                </svg>
                Guardando
              </span>
            ) : '💾 Guardar parámetros'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Export con PasswordGate ──────────────────────────────────────────────────
export function Parametros({ onClose }: { onClose: () => void }) {
  return (
    <PasswordGate>
      <ParametrosInner onClose={onClose} />
    </PasswordGate>
  );
}
