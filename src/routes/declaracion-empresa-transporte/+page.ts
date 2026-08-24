import { redirect } from '@sveltejs/kit'
import type { PageLoad } from './$types'

/** Ruta anterior de SLFT-PTEE-FR-13. El formato pasó a colgar de
 *  `/formularios-sarlaft`, pero el link viejo ya se socializó: se conserva
 *  como redirección permanente para no romperlo. La query se preserva porque
 *  el enlace puede traer parámetros de seguimiento. */
export const load: PageLoad = ({ url }) => {
  redirect(308, `/formularios-sarlaft/declaracion-empresa-transporte${url.search}`)
}
