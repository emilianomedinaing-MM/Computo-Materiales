import type { ParamGlobal, ParamCategoria } from '@/types/parametros';

// ─────────────────────────────────────────────────────────────────────────────
// VALORES POR DEFECTO
// ─────────────────────────────────────────────────────────────────────────────

export const DEFAULT_PARAMS: ParamGlobal = {
  desperdicio_general: 1.10,

  mamposteria: {
    ladrillo_comun_unidadesPorM2: 37,
    ladrillo_ceramico8_unidadesPorM2: 16,
    ladrillo_ceramico12_unidadesPorM2: 14,
    bloque20_unidadesPorM2: 12.5,
    mortero_cementAlb_kgPorM2: 4,
    mortero_arena_m3PorM2: 0.02,
    encadenado_cem_kgPorM3: 150,
    encadenado_seccion_m2: 0.03,
  },

  platea: {
    desperdicio: 1.00,
    malla_area_m2: 6,
    malla_solape: 1.10,
    separadores_porM2: 2,
    alambre_kgPorM2: 0.15,
  },

  cimientos: {
    cementAlb_kgPorM3: 180,
    portland_kgPorM3: 25,
    arena_m3PorM3: 0.45,
    granza_m3PorM3: 0.65,
    agua_m3PorM3: 0.18,
  },

  revoques: {
    jaharro_cementAlb_kgPorM2: 3.5,
    jaharro_arena_m3PorM2: 0.015,
    stuko_m2PorBolsa: 9,
    yeso_m2PorBolsa: 2.5,
    revCemento_kgPorM2: 4,
    revCemento_arena_m3PorM2: 0.008,
    jaharroInt_cementAlb_kgPorM2: 3.5,
    jaharroInt_arena_m3PorM2: 0.012,
    malla_m2PorRollo: 40,
  },

  pisos: {
    contrapiso_cementAlb_kgPorM2: 20,
    contrapiso_tosca_m3PorM2: 0.09,
    carpeta_portland_kgPorM2: 5.4,
    carpeta_arena_m3PorM2: 0.0165,
    ceramica_m2PorBolsaPegamento: 4,
    ceramica_pastina_m2PorKg: 8,
    porcelanato_m2PorBolsaPegamento: 3.5,
    porcelanato_pastina_m2PorKg: 10,
    microcemento_m2PorKit: 5,
  },

  cubierta: {
    teja_unidadesPorM2: 16,
    teja_latas_m2PorUnidad: 1.5,
    teja_cabios_m2PorUnidad: 6,
    teja_clavos_kgPorM2: 0.075,
    teja_mortero_kgPorM2: 1.5,
    chapa_solape: 1.12,
    losa_espesor_m: 0.12,
    losa_portland_kgPorM3: 250,
    losa_hierro8_mPorM2: 3.5,
    membrana_solape: 1.1,
    membrana_m2PorRollo: 10,
  },

  sanitaria: {
    pvc110_mPorBaño: 1,
    pvc75_mPorBoca: 2.5,
    pvc50_mPorBaño: 2,
    pvc40_mPorAmbiente: 4,
    pvcPresion_mPorAmbiente: 8,
    cpvc_mPorAmbiente: 6,
    cementoContacto_porBoca: 1.5,
    teflon_porAmbiente: 4,
  },

  electrica: {
    cano_mPorBoca: 3,
    cableF_mPorBoca: 5,
    cableN_mPorBoca: 5,
    cableT_mPorBoca: 4,
    cableAD_mPorAmbiente: 10,
    cajaRect_porBoca: 0.7,
    cajaCuad_porAmbiente: 2,
    tablero_bocasPorModulo: 3,
    disyuntor_bocasPorDisyuntor: 8,
    toma_porBoca: 0.5,
    llave_porBoca: 0.3,
    canoSP_porAmbiente: 3,
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// METADATOS PARA LA UI
// ─────────────────────────────────────────────────────────────────────────────

export const PARAM_CATEGORIAS: ParamCategoria[] = [
  {
    id: 'general',
    label: 'General',
    icon: '⚙️',
    params: [
      { key: 'desperdicio_general', label: 'Desperdicio general', unit: 'factor', min: 1, max: 1.5, step: 0.01, descripcion: 'Ej: 1.10 = 10% de desperdicio' },
    ],
  },
  {
    id: 'platea',
    label: 'Platea de fundación',
    icon: '🟫',
    params: [
      { key: 'platea.desperdicio',        label: 'Factor desperdicio hormigón', unit: 'factor', min: 1, max: 1.3, step: 0.01 },
      { key: 'platea.malla_area_m2',      label: 'Área panel de malla',         unit: 'm²',    min: 1, max: 20,  step: 0.5  },
      { key: 'platea.malla_solape',       label: 'Factor solape malla',         unit: 'factor', min: 1, max: 1.3, step: 0.01 },
      { key: 'platea.separadores_porM2',  label: 'Separadores por m²',          unit: 'un/m²', min: 1, max: 10,  step: 1    },
      { key: 'platea.alambre_kgPorM2',    label: 'Alambre recocido',            unit: 'kg/m²', min: 0.05, max: 0.5, step: 0.01 },
    ],
  },
  {
    id: 'cimientos',
    label: 'Cimientos',
    icon: '🏗️',
    params: [
      { key: 'cimientos.cementAlb_kgPorM3', label: 'Cemento albañilería',  unit: 'kg/m³', min: 50,  max: 300, step: 5   },
      { key: 'cimientos.portland_kgPorM3',  label: 'Cemento Portland',     unit: 'kg/m³', min: 0,   max: 100, step: 5   },
      { key: 'cimientos.arena_m3PorM3',     label: 'Arena gruesa',         unit: 'm³/m³', min: 0.2, max: 0.8, step: 0.01 },
      { key: 'cimientos.granza_m3PorM3',    label: 'Granza 10/20',         unit: 'm³/m³', min: 0.3, max: 0.9, step: 0.01 },
      { key: 'cimientos.agua_m3PorM3',      label: 'Agua (referencia)',    unit: 'm³/m³', min: 0.1, max: 0.3, step: 0.01 },
    ],
  },
  {
    id: 'mamposteria',
    label: 'Mampostería',
    icon: '🧱',
    params: [
      { key: 'mamposteria.ladrillo_comun_unidadesPorM2',      label: 'Ladrillo común 18×9×6',     unit: 'un/m²', min: 30, max: 45, step: 0.5 },
      { key: 'mamposteria.ladrillo_ceramico8_unidadesPorM2',  label: 'Cerámico hueco 8 cm',        unit: 'un/m²', min: 12, max: 22, step: 0.5 },
      { key: 'mamposteria.ladrillo_ceramico12_unidadesPorM2', label: 'Cerámico hueco 12 cm',       unit: 'un/m²', min: 10, max: 18, step: 0.5 },
      { key: 'mamposteria.bloque20_unidadesPorM2',            label: 'Bloque hormigón 20 cm',      unit: 'un/m²', min: 8,  max: 18, step: 0.5 },
      { key: 'mamposteria.mortero_cementAlb_kgPorM2',         label: 'Cem. alb. mortero asiento',  unit: 'kg/m²', min: 2,  max: 8,  step: 0.1 },
      { key: 'mamposteria.mortero_arena_m3PorM2',             label: 'Arena mortero asiento',      unit: 'm³/m²', min: 0.01, max: 0.05, step: 0.001 },
      { key: 'mamposteria.encadenado_cem_kgPorM3',            label: 'Cem. Portland viga enc.',    unit: 'kg/m³', min: 100, max: 250, step: 5 },
      { key: 'mamposteria.encadenado_seccion_m2',             label: 'Sección viga encadenada',    unit: 'm²',    min: 0.01, max: 0.1, step: 0.005 },
    ],
  },
  {
    id: 'revoques',
    label: 'Revoques',
    icon: '🪣',
    params: [
      { key: 'revoques.jaharro_cementAlb_kgPorM2',    label: 'Cem. alb. jaharro ext.',  unit: 'kg/m²',    min: 2,    max: 6,    step: 0.1  },
      { key: 'revoques.jaharro_arena_m3PorM2',         label: 'Arena jaharro ext.',      unit: 'm³/m²',    min: 0.005,max: 0.04, step: 0.001 },
      { key: 'revoques.stuko_m2PorBolsa',              label: 'Rendimiento stuko',       unit: 'm²/bolsa', min: 5,    max: 15,   step: 0.5  },
      { key: 'revoques.yeso_m2PorBolsa',               label: 'Rendimiento yeso proy.',  unit: 'm²/bolsa', min: 1.5,  max: 5,    step: 0.1  },
      { key: 'revoques.revCemento_kgPorM2',            label: 'Cem. Portland rev. fino', unit: 'kg/m²',    min: 2,    max: 8,    step: 0.1  },
      { key: 'revoques.jaharroInt_cementAlb_kgPorM2',  label: 'Cem. alb. jaharro int.',  unit: 'kg/m²',    min: 2,    max: 6,    step: 0.1  },
      { key: 'revoques.jaharroInt_arena_m3PorM2',      label: 'Arena jaharro int.',      unit: 'm³/m²',    min: 0.005,max: 0.03, step: 0.001 },
      { key: 'revoques.malla_m2PorRollo',              label: 'Rendimiento malla FV',    unit: 'm²/rollo', min: 20,   max: 100,  step: 5    },
    ],
  },
  {
    id: 'pisos',
    label: 'Contrapisos y pisos',
    icon: '⬛',
    params: [
      { key: 'pisos.contrapiso_cementAlb_kgPorM2',      label: 'Cem. alb. contrapiso',     unit: 'kg/m²',    min: 10, max: 30,  step: 0.5 },
      { key: 'pisos.contrapiso_tosca_m3PorM2',           label: 'Tosca/cascote contrapiso',  unit: 'm³/m²',    min: 0.05, max: 0.15, step: 0.005 },
      { key: 'pisos.carpeta_portland_kgPorM2',           label: 'Portland carpeta',          unit: 'kg/m²',    min: 3,  max: 9,   step: 0.1 },
      { key: 'pisos.ceramica_m2PorBolsaPegamento',       label: 'Rend. pegamento cerám.',    unit: 'm²/bolsa', min: 2,  max: 8,   step: 0.5 },
      { key: 'pisos.ceramica_pastina_m2PorKg',           label: 'Rend. pastina cerámica',    unit: 'm²/kg',    min: 4,  max: 15,  step: 0.5 },
      { key: 'pisos.porcelanato_m2PorBolsaPegamento',    label: 'Rend. pegamento porcel.',   unit: 'm²/bolsa', min: 2,  max: 6,   step: 0.5 },
      { key: 'pisos.porcelanato_pastina_m2PorKg',        label: 'Rend. pastina porcelanato', unit: 'm²/kg',    min: 5,  max: 20,  step: 0.5 },
      { key: 'pisos.microcemento_m2PorKit',              label: 'Rend. microcemento',        unit: 'm²/kit',   min: 3,  max: 10,  step: 0.5 },
    ],
  },
  {
    id: 'cubierta',
    label: 'Cubierta',
    icon: '🏠',
    params: [
      { key: 'cubierta.teja_unidadesPorM2',      label: 'Tejas por m²',           unit: 'un/m²',  min: 12, max: 22,  step: 0.5 },
      { key: 'cubierta.teja_latas_m2PorUnidad',  label: 'Espaciado latas (m²)',    unit: 'm²/ud',  min: 1,  max: 2.5, step: 0.1 },
      { key: 'cubierta.teja_cabios_m2PorUnidad', label: 'Espaciado cabios (m²)',   unit: 'm²/ud',  min: 4,  max: 10,  step: 0.5 },
      { key: 'cubierta.teja_clavos_kgPorM2',     label: 'Clavos teja',             unit: 'kg/m²',  min: 0.02, max: 0.2, step: 0.005 },
      { key: 'cubierta.teja_mortero_kgPorM2',    label: 'Mortero canaleta',        unit: 'kg/m²',  min: 0.5, max: 3,   step: 0.1 },
      { key: 'cubierta.chapa_solape',            label: 'Factor solape chapa',     unit: 'factor', min: 1.05, max: 1.25, step: 0.01 },
      { key: 'cubierta.losa_espesor_m',          label: 'Espesor losa',            unit: 'm',      min: 0.08, max: 0.20, step: 0.01 },
      { key: 'cubierta.losa_portland_kgPorM3',   label: 'Portland losa H-17',      unit: 'kg/m³',  min: 180, max: 320, step: 5 },
      { key: 'cubierta.losa_hierro8_mPorM2',     label: 'Hierro Ø8 por m²',        unit: 'm/m²',   min: 2,   max: 6,   step: 0.1 },
      { key: 'cubierta.membrana_solape',         label: 'Factor solape membrana',  unit: 'factor', min: 1,   max: 1.2, step: 0.01 },
    ],
  },
  {
    id: 'electrica',
    label: 'Instalación eléctrica',
    icon: '⚡',
    params: [
      { key: 'electrica.cano_mPorBoca',              label: 'Caño corrugado por boca',  unit: 'm/boca',  min: 1,   max: 6,   step: 0.5 },
      { key: 'electrica.cableF_mPorBoca',             label: 'Cable fase por boca',      unit: 'm/boca',  min: 3,   max: 10,  step: 0.5 },
      { key: 'electrica.cableN_mPorBoca',             label: 'Cable neutro por boca',    unit: 'm/boca',  min: 3,   max: 10,  step: 0.5 },
      { key: 'electrica.cableT_mPorBoca',             label: 'Cable tierra por boca',    unit: 'm/boca',  min: 3,   max: 10,  step: 0.5 },
      { key: 'electrica.cableAD_mPorAmbiente',        label: 'Cable AD por ambiente',    unit: 'm/amb',   min: 5,   max: 20,  step: 1   },
      { key: 'electrica.cajaRect_porBoca',            label: 'Cajas rect. por boca',     unit: 'un/boca', min: 0.3, max: 1,   step: 0.1 },
      { key: 'electrica.cajaCuad_porAmbiente',        label: 'Cajas cuad. por ambiente', unit: 'un/amb',  min: 1,   max: 4,   step: 1   },
      { key: 'electrica.tablero_bocasPorModulo',      label: 'Ambientes por tablero',    unit: 'amb/ud',  min: 1,   max: 8,   step: 1   },
      { key: 'electrica.disyuntor_bocasPorDisyuntor', label: 'Bocas por disyuntor',      unit: 'bocas',   min: 4,   max: 16,  step: 1   },
      { key: 'electrica.toma_porBoca',               label: 'Tomas por boca',           unit: 'factor',  min: 0.2, max: 0.8, step: 0.1 },
      { key: 'electrica.llave_porBoca',              label: 'Llaves por boca',          unit: 'factor',  min: 0.1, max: 0.6, step: 0.1 },
      { key: 'electrica.canoSP_porAmbiente',         label: 'Caño SP por ambiente',     unit: 'un/amb',  min: 1,   max: 6,   step: 1   },
    ],
  },
];
