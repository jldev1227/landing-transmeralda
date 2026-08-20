import { redirect } from '@sveltejs/kit'
import type { PageLoad } from './$types'
import { cargarFormularios } from '$lib/sarlaft/load'

/** Índice histórico: el link ya está socializado, así que la ruta se mantiene,
 *  pero Cliente/Proveedor (GC-FR-04) salió de aquí — vive solo en su acceso
 *  propio de Operaciones (`clientes-proveedores`). Quedan las dos tarjetas
 *  internas, las mismas de `personal-accionistas`. */
export const load: PageLoad = ({ url, fetch }) => {
  // Los links viejos con `?tipo=cliente_proveedor` van al acceso dedicado en
  // vez de caer en un selector donde ese formulario ya no existe.
  if (url.searchParams.get('tipo') === 'cliente_proveedor') {
    redirect(307, '/formularios-sarlaft/clientes-proveedores')
  }

  return cargarFormularios(fetch, url, { tiposPermitidos: ['personal', 'accionistas'] })
}
