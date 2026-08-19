import type { PageLoad } from './$types'
import { cargarFormularios } from '$lib/sarlaft/load'

/** Link interno: Vinculación de Personal (GC-FR-06) y Accionistas (GC-FR-05).
 *  Conserva la pantalla selectora, pero solo con esas dos tarjetas. */
export const load: PageLoad = ({ url, fetch }) =>
  cargarFormularios(fetch, url, { tiposPermitidos: ['personal', 'accionistas'] })
