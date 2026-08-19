import type { PageLoad } from './$types'
import { cargarFormularios } from '$lib/sarlaft/load'

/** Link exclusivo para Operaciones: solo el formulario de Cliente/Proveedor
 *  (GC-FR-04). Se carga directo, sin pantalla selectora. */
export const load: PageLoad = ({ url, fetch }) =>
  cargarFormularios(fetch, url, { tipoUnico: 'cliente_proveedor' })
