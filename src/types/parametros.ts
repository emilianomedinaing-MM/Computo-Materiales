// ─────────────────────────────────────────────────────────────────────────────
// TIPOS — Parámetros técnicos de cómputo
// ─────────────────────────────────────────────────────────────────────────────

export interface ParamMamposteria {
  ladrillo_comun_unidadesPorM2: number;       // 37
  ladrillo_ceramico8_unidadesPorM2: number;   // 16
  ladrillo_ceramico12_unidadesPorM2: number;  // 14
  bloque20_unidadesPorM2: number;             // 12.5
  mortero_cementAlb_kgPorM2: number;          // 4
  mortero_arena_m3PorM2: number;              // 0.02
  encadenado_cem_kgPorM3: number;             // 150
  encadenado_seccion_m2: number;              // 0.03 (15×20 cm)
}

export interface ParamPlatea {
  desperdicio: number;                        // 1.00 (sin desperdicio bomba)
  malla_area_m2: number;                      // 6 (panel 3×2 m)
  malla_solape: number;                       // 1.10 (10% solape)
  separadores_porM2: number;                  // 2
  alambre_kgPorM2: number;                    // 0.15
}

export interface ParamCimientos {
  cementAlb_kgPorM3: number;                 // 180
  portland_kgPorM3: number;                  // 25
  arena_m3PorM3: number;                     // 0.45
  granza_m3PorM3: number;                    // 0.65
  agua_m3PorM3: number;                      // 0.18
}

export interface ParamRevoques {
  jaharro_cementAlb_kgPorM2: number;         // 3.5
  jaharro_arena_m3PorM2: number;             // 0.015
  stuko_m2PorBolsa: number;                  // 9
  yeso_m2PorBolsa: number;                   // 2.5
  revCemento_kgPorM2: number;               // 4
  revCemento_arena_m3PorM2: number;         // 0.008
  jaharroInt_cementAlb_kgPorM2: number;     // 3.5
  jaharroInt_arena_m3PorM2: number;         // 0.012
  malla_m2PorRollo: number;                  // 40
}

export interface ParamPisos {
  contrapiso_cementAlb_kgPorM2: number;     // 20
  contrapiso_tosca_m3PorM2: number;         // 0.09
  carpeta_portland_kgPorM2: number;         // 5.4
  carpeta_arena_m3PorM2: number;            // 0.0165
  ceramica_m2PorBolsaPegamento: number;     // 4
  ceramica_pastina_m2PorKg: number;         // 8
  porcelanato_m2PorBolsaPegamento: number;  // 3.5
  porcelanato_pastina_m2PorKg: number;      // 10
  microcemento_m2PorKit: number;            // 5
}

export interface ParamCubierta {
  teja_unidadesPorM2: number;               // 16
  teja_latas_m2PorUnidad: number;           // 1.5
  teja_cabios_m2PorUnidad: number;          // 6
  teja_clavos_kgPorM2: number;             // 0.075
  teja_mortero_kgPorM2: number;            // 1.5
  chapa_solape: number;                     // 1.12
  losa_espesor_m: number;                  // 0.12
  losa_portland_kgPorM3: number;           // 250
  losa_hierro8_mPorM2: number;             // 3.5
  membrana_solape: number;                  // 1.1
  membrana_m2PorRollo: number;             // 10
}

export interface ParamSanitaria {
  pvc110_mPorBaño: number;                  // basado en long_colectora
  pvc75_mPorBoca: number;                   // 2.5
  pvc50_mPorBaño: number;                   // 2
  pvc40_mPorAmbiente: number;              // 4
  pvcPresion_mPorAmbiente: number;         // 8
  cpvc_mPorAmbiente: number;               // 6
  cementoContacto_porBoca: number;         // 1.5
  teflon_porAmbiente: number;              // 4
}

export interface ParamElectrica {
  cano_mPorBoca: number;                   // 3
  cableF_mPorBoca: number;                 // 5
  cableN_mPorBoca: number;                 // 5
  cableT_mPorBoca: number;                 // 4
  cableAD_mPorAmbiente: number;           // 10
  cajaRect_porBoca: number;               // 0.7
  cajaCuad_porAmbiente: number;           // 2
  tablero_bocasPorModulo: number;         // 3 (1 tablero cada 3 ambientes)
  disyuntor_bocasPorDisyuntor: number;    // 8
  toma_porBoca: number;                   // 0.5
  llave_porBoca: number;                  // 0.3
  canoSP_porAmbiente: number;            // 3
}

export interface ParamGlobal {
  desperdicio_general: number;            // 1.10
  mamposteria: ParamMamposteria;
  platea: ParamPlatea;
  cimientos: ParamCimientos;
  revoques: ParamRevoques;
  pisos: ParamPisos;
  cubierta: ParamCubierta;
  sanitaria: ParamSanitaria;
  electrica: ParamElectrica;
}

// ─── Metadatos para la UI editable ──────────────────────────────────────────

export interface ParamMeta {
  key: string;
  label: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  descripcion?: string;
}

export interface ParamCategoria {
  id: string;
  label: string;
  icon: string;
  params: ParamMeta[];
}
