import type { PageLoad } from './$types'
import { cargarFormularioIndividual } from '$lib/sarlaft/load'

/** SLFT-PTEE-FR-12 — Autorización del Propietario para facturación y/o pago a
 *  un tercero. Es un formato individual: no aparece en el listado público, se
 *  pide directamente por su código. */
export const load: PageLoad = ({ fetch }) =>
  cargarFormularioIndividual(fetch, 'SLFT-PTEE-FR-12', 'autorizacion_propietario')
