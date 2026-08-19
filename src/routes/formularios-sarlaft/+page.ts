import type { PageLoad } from './$types'
import { cargarFormularios } from '$lib/sarlaft/load'

/** Índice histórico: muestra los tres formularios de conocimiento SARLAFT.
 *  Se mantiene tal cual porque el link ya está socializado. Los accesos
 *  segmentados viven en las subrutas `clientes-proveedores` y
 *  `personal-accionistas`. */
export const load: PageLoad = ({ url, fetch }) => cargarFormularios(fetch, url)
