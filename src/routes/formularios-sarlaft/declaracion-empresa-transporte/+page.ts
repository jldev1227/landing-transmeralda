import type { PageLoad } from './$types'
import { cargarFormularioIndividual } from '$lib/sarlaft/load'

/** SLFT-PTEE-FR-13 — Declaración SARLAFT y PTEE para empresa de transporte.
 *  Es un formato individual: no aparece en el listado público del selector, se
 *  pide directamente por su código igual que SLFT-PTEE-FR-12. */
export const load: PageLoad = ({ fetch }) =>
  cargarFormularioIndividual(fetch, 'SLFT-PTEE-FR-13', 'declaracion_empresa_transporte')
