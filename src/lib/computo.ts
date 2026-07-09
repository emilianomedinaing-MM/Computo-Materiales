// src/lib/computo.ts
// ─────────────────────────────────────────────────────────────────────────────
// Motor de cómputo de materiales — todos los coeficientes vienen de ParamGlobal
// ─────────────────────────────────────────────────────────────────────────────

import type { ParamGlobal } from '@/types/parametros';

function bol25(kg: number): number { return Math.ceil(kg / 25); }
function r2(n: number): number { return parseFloat(n.toFixed(2)); }

export interface ItemComputo {
  mat: string;
  qty: number;
  unit: string;
  nota?: string;
}

export interface ResultadoComputo {
  [seccion: string]: ItemComputo[];
}

export interface InputsComputo {
  // Planta general
  sup_total: number;
  alt_muros: number;
  // Platea
  plat_largo: number;
  plat_ancho: number;
  plat_espesor: number; // en cm
  // Cimientos
  cim_long: number;
  cim_ancho: number;
  cim_prof: number;
  // Mampostería
  muro_long: number;
  tipo_ladrillo: 'comun' | 'ceramico' | 'ceramico12' | 'bloque';
  sup_aberturas: number;
  cant_col: number;
  // Revoques
  rev_ext: number;
  rev_int: number;
  tipo_rev: 'stuko' | 'yeso' | 'cemento';
  // Pisos
  sup_piso: number;
  tipo_piso: 'ceramica' | 'porcelanato' | 'microcemento';
  // Cubierta
  sup_techo: number;
  tipo_techo: 'chapa' | 'teja' | 'losa' | 'fibrocemento';
  // Sanitaria
  cant_ban: number;
  cant_coc: number;
  long_col: number;
  // Eléctrica
  cant_amb: number;
  bocas_amb: number;
  // Rubros activos
  activos: {
    platea: boolean;
    cim: boolean;
    mamp: boolean;
    rev: boolean;
    piso: boolean;
    cub: boolean;
    san: boolean;
    elec: boolean;
  };
}

export function calcularComputo(inputs: InputsComputo, p: ParamGlobal): ResultadoComputo {
  const res: ResultadoComputo = {};
  const D = p.desperdicio_general;

  function add(sec: string, mat: string, qty: number, unit: string, nota?: string) {
    if (!res[sec]) res[sec] = [];
    const ex = res[sec].find(r => r.mat === mat && r.unit === unit);
    if (ex) ex.qty += qty;
    else res[sec].push({ mat, qty: Math.ceil(qty), unit, nota: nota ?? '' });
  }

  // ── PLATEA DE FUNDACIÓN ────────────────────────────────────────────────────
  if (inputs.activos.platea) {
    const sup = inputs.plat_largo * inputs.plat_ancho;
    const vol = sup * (inputs.plat_espesor / 100);

    add('Platea de fundación',
      'Hormigón elaborado H-21',
      r2(vol * p.platea.desperdicio),
      'm³',
      'Volumen neto — pedir según plano');

    add('Platea de fundación',
      `Malla de acero electrosoldada Ø6 c/15 cm (panel ${Math.sqrt(p.platea.malla_area_m2 / (2/3)).toFixed(0)}×${(p.platea.malla_area_m2 / Math.sqrt(p.platea.malla_area_m2 / (2/3))).toFixed(0)} m)`,
      Math.ceil(sup / p.platea.malla_area_m2 * p.platea.malla_solape),
      'panel',
      `Una capa — ${Math.round((p.platea.malla_solape - 1) * 100)}% solapes inc.`);

    add('Platea de fundación',
      'Separador plástico malla inferior',
      Math.ceil(sup * p.platea.separadores_porM2),
      'unidad',
      `${p.platea.separadores_porM2} cada m²`);

    add('Platea de fundación',
      'Alambre recocido',
      Math.ceil(sup * p.platea.alambre_kgPorM2),
      'kg',
      'Atado de mallas');
  }

  // ── CIMIENTOS (hormigón pobre) ─────────────────────────────────────────────
  if (inputs.activos.cim) {
    const vol = inputs.cim_long * inputs.cim_ancho * inputs.cim_prof;
    const pm = p.cimientos;

    add('Cimientos',
      'Cemento de albañilería (bolsa 25 kg)',
      bol25(vol * pm.cementAlb_kgPorM3 * D),
      'bolsa',
      `~${pm.cementAlb_kgPorM3} kg/m³ hormigón pobre`);

    add('Cimientos',
      'Cemento Portland (bolsa 25 kg)',
      bol25(vol * pm.portland_kgPorM3 * D),
      'bolsa',
      `~${pm.portland_kgPorM3} kg/m³ refuerzo Portland`);

    add('Cimientos',
      'Arena gruesa',
      r2(vol * pm.arena_m3PorM3 * D),
      'm³',
      'Hormigón pobre');

    add('Cimientos',
      'Granza / piedra partida 10/20',
      r2(vol * pm.granza_m3PorM3 * D),
      'm³',
      'Hormigón pobre');

    add('Cimientos',
      'Agua (referencia)',
      r2(vol * pm.agua_m3PorM3),
      'm³',
      `~${pm.agua_m3PorM3 * 1000} lt/m³`);
  }

  // ── MAMPOSTERÍA ────────────────────────────────────────────────────────────
  if (inputs.activos.mamp) {
    const supM = inputs.muro_long * inputs.alt_muros - inputs.sup_aberturas;
    const pm = p.mamposteria;

    const rTab = {
      comun: pm.ladrillo_comun_unidadesPorM2,
      ceramico: pm.ladrillo_ceramico8_unidadesPorM2,
      ceramico12: pm.ladrillo_ceramico12_unidadesPorM2,
      bloque: pm.bloque20_unidadesPorM2,
    };
    const nTab = {
      comun: 'Ladrillo común 18×9×6',
      ceramico: 'Ladrillo cerámico hueco 8 cm',
      ceramico12: 'Ladrillo cerámico hueco 12 cm',
      bloque: 'Bloque de hormigón 20 cm',
    };
    const rend = rTab[inputs.tipo_ladrillo];

    add('Mampostería', nTab[inputs.tipo_ladrillo], Math.ceil(supM * rend * D), 'unidad', `${rend} un./m²`);
    add('Mampostería', 'Cemento de albañilería (bolsa 25 kg)', bol25(supM * pm.mortero_cementAlb_kgPorM2 * D), 'bolsa', 'Mortero de asiento');
    add('Mampostería', 'Arena gruesa', r2(supM * pm.mortero_arena_m3PorM2 * D), 'm³', 'Mortero de asiento');

    // Viga encadenada superior
    const lE = inputs.muro_long;
    const secEnc = pm.encadenado_seccion_m2;
    add('Mampostería', 'Cemento Portland (bolsa 25 kg)', bol25(lE * secEnc * pm.encadenado_cem_kgPorM3 * D), 'bolsa', 'Hormigón viga encadenada sup.');
    add('Mampostería', 'Arena gruesa', r2(lE * secEnc * 0.55), 'm³', 'Viga encadenada');
    add('Mampostería', 'Piedra partida 6/20', r2(lE * secEnc * 0.75), 'm³', 'Viga encadenada');
    add('Mampostería', 'Hierro Ø10 mm (varilla 12 m)', Math.ceil(lE * 2 / 12 * D), 'unidad', '2Ø10 longitudinales');
    add('Mampostería', 'Hierro Ø6 mm (varilla 12 m)', Math.ceil(lE / 0.2 * 0.6 / 12 * D), 'unidad', 'Estribos c/20 cm');

    // Columnas de encadenado
    if (inputs.cant_col > 0) {
      add('Mampostería', 'Hierro Ø12 mm (varilla 12 m)', Math.ceil(inputs.cant_col * 4 * inputs.alt_muros / 12 * D), 'unidad', 'Columnas 4Ø12');
      add('Mampostería', 'Hierro Ø6 mm (varilla 12 m)', Math.ceil(inputs.cant_col * inputs.alt_muros / 0.2 * 0.8 / 12 * D), 'unidad', 'Estribos col. c/20 cm');
    }
  }

  // ── REVOQUES ───────────────────────────────────────────────────────────────
  if (inputs.activos.rev) {
    const ext = inputs.rev_ext;
    const intr = inputs.rev_int;
    const pr = p.revoques;

    // Exterior
    add('Revoques', 'Cemento de albañilería (bolsa 25 kg)', bol25(ext * pr.jaharro_cementAlb_kgPorM2 * D), 'bolsa', 'Jaharro exterior');
    add('Revoques', 'Arena gruesa', r2(ext * pr.jaharro_arena_m3PorM2 * D), 'm³', 'Jaharro exterior');
    add('Revoques', 'Revoque fino a la cal — stuko (bolsa 25 kg)', Math.ceil(ext / pr.stuko_m2PorBolsa * D), 'bolsa', `Terminación exterior ~${pr.stuko_m2PorBolsa} m²/bol`);
    add('Revoques', 'Malla fibra de vidrio (rollo 50 m)', Math.ceil(ext / pr.malla_m2PorRollo), 'rollo', 'Antifisuración exterior');

    // Interior — base jaharro
    add('Revoques', 'Cemento de albañilería (bolsa 25 kg)', bol25(intr * pr.jaharroInt_cementAlb_kgPorM2 * D), 'bolsa', 'Jaharro interior');
    add('Revoques', 'Arena fina', r2(intr * pr.jaharroInt_arena_m3PorM2 * D), 'm³', 'Jaharro interior');

    // Interior — terminación
    if (inputs.tipo_rev === 'stuko') {
      add('Revoques', 'Revoque fino a la cal — stuko (bolsa 25 kg)', Math.ceil(intr / pr.stuko_m2PorBolsa * D), 'bolsa', `~${pr.stuko_m2PorBolsa} m²/bol`);
    } else if (inputs.tipo_rev === 'yeso') {
      add('Revoques', 'Yeso proyectable (bolsa 25 kg)', Math.ceil(intr / pr.yeso_m2PorBolsa * D), 'bolsa', `~${pr.yeso_m2PorBolsa} m²/bol`);
    } else {
      add('Revoques', 'Cemento Portland (bolsa 25 kg)', bol25(intr * pr.revCemento_kgPorM2 * D), 'bolsa', 'Revoque fino cemento');
      add('Revoques', 'Arena fina', r2(intr * pr.revCemento_arena_m3PorM2 * D), 'm³', 'Revoque fino cemento');
    }
  }

  // ── PISOS ──────────────────────────────────────────────────────────────────
  if (inputs.activos.piso) {
    const sup = inputs.sup_piso;
    const pp = p.pisos;

    add('Pisos', 'Cemento de albañilería (bolsa 25 kg)', bol25(sup * pp.contrapiso_cementAlb_kgPorM2 * D), 'bolsa', 'Contrapiso e=10 cm');
    add('Pisos', 'Tosca / cascote', r2(sup * pp.contrapiso_tosca_m3PorM2), 'm³', 'Relleno contrapiso');
    add('Pisos', 'Cemento Portland (bolsa 25 kg)', bol25(sup * pp.carpeta_portland_kgPorM2 * D), 'bolsa', 'Carpeta nivelante e=3 cm');
    add('Pisos', 'Arena fina', r2(sup * pp.carpeta_arena_m3PorM2 * D), 'm³', 'Carpeta');

    if (inputs.tipo_piso === 'ceramica') {
      add('Pisos', 'Cerámica 35×35', Math.ceil(sup * D), 'm²', '10% desperdicio inc.');
      add('Pisos', 'Pegamento cerámico (bolsa 25 kg)', Math.ceil(sup / pp.ceramica_m2PorBolsaPegamento * D), 'bolsa', `~${pp.ceramica_m2PorBolsaPegamento} m²/bolsa`);
      add('Pisos', 'Pastina (bolsa 1 kg)', Math.ceil(sup / pp.ceramica_pastina_m2PorKg), 'bolsa', `~${pp.ceramica_pastina_m2PorKg} m²/bolsa`);
    } else if (inputs.tipo_piso === 'porcelanato') {
      add('Pisos', 'Porcelanato 60×60', Math.ceil(sup * D), 'm²', '10% desperdicio inc.');
      add('Pisos', 'Pegamento porcelanato flex. (bolsa 25 kg)', Math.ceil(sup / pp.porcelanato_m2PorBolsaPegamento * D), 'bolsa', `~${pp.porcelanato_m2PorBolsaPegamento} m²/bolsa`);
      add('Pisos', 'Pastina porcelanato (bolsa 1 kg)', Math.ceil(sup / pp.porcelanato_pastina_m2PorKg), 'bolsa', `~${pp.porcelanato_pastina_m2PorKg} m²/bolsa`);
    } else {
      add('Pisos', 'Kit microcemento (base+color+sellador)', Math.ceil(sup / pp.microcemento_m2PorKit), 'kit', `1 kit cada ${pp.microcemento_m2PorKit} m²`);
      add('Pisos', 'Lija 120 y 220', 2, 'pliego');
    }
  }

  // ── CUBIERTA ───────────────────────────────────────────────────────────────
  if (inputs.activos.cub) {
    const sup = inputs.sup_techo;
    const pc = p.cubierta;

    if (inputs.tipo_techo === 'chapa') {
      add('Cubierta', 'Chapa galvanizada sinusoidal C25', Math.ceil(sup * pc.chapa_solape), 'm²', `${Math.round((pc.chapa_solape - 1) * 100)}% solape inc.`);
      add('Cubierta', 'Madera pino cepillado 2"×4" (6 m)', Math.ceil(sup / 2.5), 'unidad', 'Correas c/60 cm');
      add('Cubierta', 'Madera pino 3"×4" (6 m)', Math.ceil(sup / 8), 'unidad', 'Cabios y soleras');
      add('Cubierta', 'Tornillo autoperforante 1"', Math.ceil(sup * 5), 'unidad', '~5/m²');
      add('Cubierta', 'Caballete chapa galv.', Math.ceil(Math.sqrt(sup) * 0.15), 'metro');
    } else if (inputs.tipo_techo === 'teja') {
      add('Cubierta', 'Teja cerámica española', Math.ceil(sup * pc.teja_unidadesPorM2 * D), 'unidad', `${pc.teja_unidadesPorM2} tejas/m²`);
      add('Cubierta', 'Madera pino 2"×4" (6 m) — latas', Math.ceil(sup / pc.teja_latas_m2PorUnidad), 'unidad', `c/${Math.round(pc.teja_latas_m2PorUnidad * 100)} cm`);
      add('Cubierta', 'Madera pino 3"×5" (6 m) — cabios', Math.ceil(sup / pc.teja_cabios_m2PorUnidad), 'unidad');
      add('Cubierta', 'Clavo 2.5"', Math.ceil(sup * pc.teja_clavos_kgPorM2), 'kg', '~3 clavos/m²');
      add('Cubierta', 'Cemento de albañilería (bolsa 25 kg)', bol25(sup * pc.teja_mortero_kgPorM2 * D), 'bolsa', 'Mortero asiento canaleta');
      add('Cubierta', 'Arena fina', r2(sup * 0.003 * D), 'm³');
    } else if (inputs.tipo_techo === 'losa') {
      const vol = sup * pc.losa_espesor_m;
      add('Cubierta', 'Cemento Portland (bolsa 25 kg)', bol25(vol * pc.losa_portland_kgPorM3 * D), 'bolsa', `Losa H-17 e=${pc.losa_espesor_m * 100} cm`);
      add('Cubierta', 'Arena gruesa', r2(vol * 0.55), 'm³');
      add('Cubierta', 'Piedra partida 6/20', r2(vol * 0.75), 'm³');
      add('Cubierta', 'Hierro Ø8 mm (varilla 12 m)', Math.ceil(sup * pc.losa_hierro8_mPorM2 / 12 * D), 'unidad', 'Malla Ø8 c/20 cm doble sentido');
      add('Cubierta', 'Membrana asfáltica 4 mm (rollo 10 m²)', Math.ceil(sup * pc.membrana_solape / pc.membrana_m2PorRollo), 'rollo', `${Math.round((pc.membrana_solape - 1) * 100)}% solape`);
      add('Cubierta', 'Adhesivo asfáltico en frío', Math.ceil(sup / 5), 'lt');
      add('Cubierta', 'Encofrado fenólico 18 mm', Math.ceil(sup * 0.5), 'm²', 'Fondo de losa');
    } else {
      add('Cubierta', 'Placa fibrocemento 6 mm', Math.ceil(sup * 1.05), 'm²', '5% corte');
      add('Cubierta', 'Madera pino 2"×4" (6 m)', Math.ceil(sup / 2.5), 'unidad', 'Estructura soporte');
      add('Cubierta', 'Tornillo autoperforante 1"', Math.ceil(sup * 6), 'unidad');
    }
  }

  // ── SANITARIA ──────────────────────────────────────────────────────────────
  if (inputs.activos.san) {
    const ban = inputs.cant_ban;
    const coc = inputs.cant_coc;
    const col = inputs.long_col;
    const ps = p.sanitaria;
    const bocasDesc = ban * 3 + coc * 2;
    const lAlim = (ban + coc) * ps.pvcPresion_mPorAmbiente;

    add('Sanitaria', 'Caño PVC cloacal 110 mm', Math.ceil(col * D), 'metro', 'Colectora principal');
    add('Sanitaria', 'Caño PVC cloacal 75 mm', Math.ceil(bocasDesc * ps.pvc75_mPorBoca * D), 'metro', 'Ramales de descarga');
    add('Sanitaria', 'Caño PVC cloacal 50 mm', Math.ceil((ban * ps.pvc50_mPorBaño + coc) * 3), 'metro', 'Ventilaciones y bajadas');
    add('Sanitaria', 'Caño PVC cloacal 40 mm', Math.ceil((ban + coc) * ps.pvc40_mPorAmbiente), 'metro', 'Desagüe piletas');
    add('Sanitaria', 'Caño PVC presión 3/4"', Math.ceil(lAlim * D), 'metro', 'Alimentación fría');
    add('Sanitaria', 'Caño CPVC 1/2"', Math.ceil((ban + coc) * ps.cpvc_mPorAmbiente * D), 'metro', 'Agua caliente');
    add('Sanitaria', 'Cemento de contacto PVC 200 cc', Math.ceil(bocasDesc * ps.cementoContacto_porBoca), 'unidad');
    add('Sanitaria', 'Cinta teflón', Math.ceil((ban + coc) * ps.teflon_porAmbiente), 'rollo');

    if (ban > 0) {
      add('Sanitaria', 'Inodoro + mochila', ban, 'juego');
      add('Sanitaria', 'Bidet', ban, 'unidad');
      add('Sanitaria', 'Lavatorio', ban, 'unidad');
      add('Sanitaria', 'Canilla monocomando lavatorio', ban, 'unidad');
      add('Sanitaria', 'Ducha lluvia + mezcladora', ban, 'juego');
      add('Sanitaria', 'Sifón botella universal', Math.ceil(ban * 2), 'unidad');
    }
    if (coc > 0) {
      add('Sanitaria', 'Pileta de cocina', coc, 'unidad');
      add('Sanitaria', 'Canilla monocomando mesada', coc, 'unidad');
    }
  }

  // ── ELÉCTRICA ──────────────────────────────────────────────────────────────
  if (inputs.activos.elec) {
    const amb = inputs.cant_amb;
    const bocas = inputs.bocas_amb;
    const total = amb * bocas;
    const pe = p.electrica;

    add('Eléctrica', 'Caño corrugado 3/4" (rollo 50 m)', Math.ceil(total * pe.cano_mPorBoca / 50 * D), 'rollo', `~${pe.cano_mPorBoca} m/boca`);
    add('Eléctrica', 'Cable unipolar 2.5 mm² negro (rollo 100 m)', Math.ceil(total * pe.cableF_mPorBoca / 100 * D), 'rollo', 'Fase');
    add('Eléctrica', 'Cable unipolar 2.5 mm² celeste (rollo 100 m)', Math.ceil(total * pe.cableN_mPorBoca / 100 * D), 'rollo', 'Neutro');
    add('Eléctrica', 'Cable unipolar 2.5 mm² verde-amarillo (rollo 100 m)', Math.ceil(total * pe.cableT_mPorBoca / 100 * D), 'rollo', 'Tierra');
    add('Eléctrica', 'Cable bipolar 4 mm² (rollo 100 m)', Math.ceil(amb * pe.cableAD_mPorAmbiente / 100 * D), 'rollo', 'Alta demanda');
    add('Eléctrica', 'Caja rectangular chica', Math.ceil(total * pe.cajaRect_porBoca), 'unidad');
    add('Eléctrica', 'Caja cuadrada 100×100', Math.ceil(amb * pe.cajaCuad_porAmbiente), 'unidad', 'Cajas de paso');
    add('Eléctrica', 'Tablero modular 12 módulos', Math.ceil(amb / pe.tablero_bocasPorModulo), 'unidad');
    add('Eléctrica', 'Disyuntor 16 A', Math.ceil(total / pe.disyuntor_bocasPorDisyuntor), 'unidad');
    add('Eléctrica', 'Llave termomagnética 32 A', 1, 'unidad', 'General');
    add('Eléctrica', 'Toma 2P+T schuko', Math.ceil(total * pe.toma_porBoca), 'unidad');
    add('Eléctrica', 'Llave simple / bipolar', Math.ceil(total * pe.llave_porBoca), 'unidad');
    add('Eléctrica', 'Caño semipesado 3/4" (6 m)', Math.ceil(amb * pe.canoSP_porAmbiente), 'unidad', 'Bajada y acometida');
  }

  return res;
}
