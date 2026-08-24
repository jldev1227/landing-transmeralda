import type { PageLoad } from './$types'
import { cargarFormularioIndividual } from '$lib/sarlaft/load'

/** SLFT-PTEE-FR-13 — Declaración SARLAFT y PTEE para empresa de transporte.
 *  El backend lo sigue tratando como formato individual (no viene en el listado
 *  público), así que aquí se pide por su código. Lo que cambió es dónde vive:
 *  cuelga de `/formularios-sarlaft` y el selector de esa ruta muestra su tarjeta
 *  junto a las de Personal y Accionistas, enlazando a esta página. */
export const load: PageLoad = ({ fetch }) =>
  cargarFormularioIndividual(fetch, 'SLFT-PTEE-FR-13', 'declaracion_empresa_transporte')
