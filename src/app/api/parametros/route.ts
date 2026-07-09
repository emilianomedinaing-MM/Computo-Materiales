// src/app/api/parametros/route.ts
// ─────────────────────────────────────────────────────────────────────────────
// API Route: GET /api/parametros   → devuelve los parámetros actuales
//            PUT /api/parametros   → guarda nuevos parámetros
//            DELETE /api/parametros → restaura defaults
//
// Persistencia: Vercel KV (Redis) si está configurado, sino JSON en /tmp
// (en Vercel, /tmp persiste entre invocaciones en la misma instancia)
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse } from 'next/server';
import { DEFAULT_PARAMS } from '@/lib/defaultParams';
import type { ParamGlobal } from '@/types/parametros';

const KV_KEY = 'medina:parametros';

// ── Helpers de Vercel KV (opcional) ─────────────────────────────────────────
async function kvGet(): Promise<ParamGlobal | null> {
  try {
    // @vercel/kv se importa dinámicamente para no romper si no está instalado
    const { kv } = await import('@vercel/kv');
    const data = await kv.get<ParamGlobal>(KV_KEY);
    return data ?? null;
  } catch {
    return null; // KV no disponible → fallback
  }
}

async function kvSet(params: ParamGlobal): Promise<boolean> {
  try {
    const { kv } = await import('@vercel/kv');
    await kv.set(KV_KEY, params);
    return true;
  } catch {
    return false;
  }
}

async function kvDel(): Promise<boolean> {
  try {
    const { kv } = await import('@vercel/kv');
    await kv.del(KV_KEY);
    return true;
  } catch {
    return false;
  }
}

// ── Fallback: archivo JSON en /tmp (sobrevive entre requests en misma instancia)
import { readFileSync, writeFileSync, existsSync } from 'fs';
const TMP_PATH = '/tmp/medina-parametros.json';

function fsGet(): ParamGlobal | null {
  try {
    if (!existsSync(TMP_PATH)) return null;
    return JSON.parse(readFileSync(TMP_PATH, 'utf-8'));
  } catch {
    return null;
  }
}

function fsSet(params: ParamGlobal): void {
  writeFileSync(TMP_PATH, JSON.stringify(params), 'utf-8');
}

function fsDel(): void {
  try {
    const { unlinkSync } = require('fs');
    if (existsSync(TMP_PATH)) unlinkSync(TMP_PATH);
  } catch { /* noop */ }
}

// ── GET ──────────────────────────────────────────────────────────────────────
export async function GET() {
  try {
    let params = await kvGet();
    if (!params) params = fsGet();
    return NextResponse.json(params ?? DEFAULT_PARAMS);
  } catch (err) {
    console.error('[GET /api/parametros]', err);
    return NextResponse.json(DEFAULT_PARAMS);
  }
}

// ── PUT ──────────────────────────────────────────────────────────────────────
export async function PUT(req: Request) {
  try {
    const body: ParamGlobal = await req.json();

    // Validación básica de estructura
    const requiredSections = ['mamposteria','platea','cimientos','revoques','pisos','cubierta','electrica'];
    for (const s of requiredSections) {
      if (!(s in body)) {
        return NextResponse.json({ error: `Falta la sección: ${s}` }, { status: 400 });
      }
    }

    // Validar que todos los valores sean números dentro de rango razonable
    function validateNumbers(obj: unknown, path = ''): string | null {
      if (typeof obj === 'number') {
        if (!isFinite(obj) || obj < 0) return `Valor inválido en ${path}: ${obj}`;
        return null;
      }
      if (typeof obj === 'object' && obj !== null) {
        for (const [k, v] of Object.entries(obj)) {
          const err = validateNumbers(v, path ? `${path}.${k}` : k);
          if (err) return err;
        }
      }
      return null;
    }

    const validErr = validateNumbers(body);
    if (validErr) {
      return NextResponse.json({ error: validErr }, { status: 400 });
    }

    const kvOk = await kvSet(body);
    if (!kvOk) fsSet(body); // fallback

    return NextResponse.json({ ok: true, storage: kvOk ? 'kv' : 'fs' });
  } catch (err) {
    console.error('[PUT /api/parametros]', err);
    return NextResponse.json({ error: 'Error al guardar' }, { status: 500 });
  }
}

// ── DELETE (restaurar defaults) ───────────────────────────────────────────────
export async function DELETE() {
  try {
    await kvDel();
    fsDel();
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[DELETE /api/parametros]', err);
    return NextResponse.json({ error: 'Error al restaurar' }, { status: 500 });
  }
}
