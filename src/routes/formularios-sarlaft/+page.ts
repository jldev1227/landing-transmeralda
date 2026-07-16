import type { PageLoad } from './$types'
import { env as publicEnv } from '$env/dynamic/public'
import type { Formulario } from '$lib/sarlaft/types'

const BASE = publicEnv.PUBLIC_API_URL || 'http://localhost:4000/api'

async function listarFormulariosPublicos(fetch: typeof globalThis.fetch) {
  const r = await fetch(`${BASE}/public/formularios-sarlaft`)
  if (!r.ok) throw new Error('No se pudo obtener la lista de formularios')
  return r.json() as Promise<{
    formularios: Array<{ codigo: string; tipo: string; titulo: string; version: string; fecha_documento: string; total_secciones: number; total_preguntas: number }>
    marco_normativo: string[]
    empresa: string
  }>
}

async function obtenerFormularioPublico(fetch: typeof globalThis.fetch, codigo: string) {
  const r = await fetch(`${BASE}/public/formularios-sarlaft/${codigo}`)
  if (!r.ok) throw new Error(`No se pudo obtener el formulario ${codigo}`)
  const data = await r.json()
  return data.formulario as Formulario
}

export const load: PageLoad = async ({ url, fetch }) => {
  const tipo = url.searchParams.get('tipo') as 'cliente_proveedor' | 'accionistas' | 'personal' | null

  try {
    const { formularios, marco_normativo, empresa } = await listarFormulariosPublicos(fetch)

    if (tipo) {
      const resumen = formularios.find((f) => f.tipo === tipo)
      if (resumen) {
        const formulario = await obtenerFormularioPublico(fetch, resumen.codigo)
        return {
          formularios,
          marco_normativo,
          empresa,
          formulario,
          tipoSeleccionado: tipo
        }
      }
    }

    return {
      formularios,
      marco_normativo,
      empresa,
      formulario: null,
      tipoSeleccionado: null as string | null
    }
  } catch (err) {
    return {
      formularios: [],
      marco_normativo: [
        'Resolución 2328 de 2025',
        'Resolución 14673 de 2025',
        'Ley 1581 de 2012',
        'Decreto 1377 de 2013'
      ],
      empresa: 'TRANSMERALDA S.A.S.',
      formulario: null,
      tipoSeleccionado: null as string | null,
      loadError: (err as Error).message
    }
  }
}
