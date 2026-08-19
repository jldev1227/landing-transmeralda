import { sarlaftApi } from './api'
import type { Formulario, FormularioResumen, TipoFormulario } from './types'

/** Marco normativo que se muestra si el backend no responde. */
const MARCO_NORMATIVO_FALLBACK = [
  'Resolución 2328 de 2025',
  'Resolución 14673 de 2025',
  'Ley 1581 de 2012',
  'Decreto 1377 de 2013'
]

export interface DatosFormularios {
  formularios: FormularioResumen[]
  marco_normativo: string[]
  empresa: string
  formulario: Formulario | null
  tipoSeleccionado: TipoFormulario | null
  loadError?: string
}

export interface OpcionesCarga {
  /** Restringe las tarjetas del selector a estos tipos. Si se omite, se
   *  muestran todos los formularios que devuelva el backend. */
  tiposPermitidos?: TipoFormulario[]
  /** Fuerza un único tipo: se carga su formulario de una vez y la pantalla
   *  selectora nunca se muestra. Tiene prioridad sobre `?tipo=` de la URL. */
  tipoUnico?: TipoFormulario
}

/**
 * Carga común de las rutas de formularios: lista los formularios públicos y,
 * si hay un tipo resuelto (por `tipoUnico` o por `?tipo=` en la URL), trae
 * también su estructura completa.
 *
 * Nunca lanza: ante un fallo del backend devuelve `loadError` y la lista
 * vacía para que la página pueda mostrar el aviso de conexión.
 */
export async function cargarFormularios(
  fetchFn: typeof globalThis.fetch,
  url: URL,
  opts: OpcionesCarga = {}
): Promise<DatosFormularios> {
  try {
    const { formularios, marco_normativo, empresa } = await sarlaftApi.listarFormularios(fetchFn)

    const visibles = opts.tiposPermitidos
      ? formularios.filter((f) => opts.tiposPermitidos!.includes(f.tipo))
      : formularios

    const tipoUrl = url.searchParams.get('tipo') as TipoFormulario | null
    const tipo =
      opts.tipoUnico ?? (tipoUrl && visibles.some((f) => f.tipo === tipoUrl) ? tipoUrl : null)

    let formulario: Formulario | null = null
    if (tipo) {
      const codigo = formularios.find((f) => f.tipo === tipo)?.codigo
      if (codigo) formulario = await sarlaftApi.obtenerFormulario(codigo, fetchFn)
    }

    return {
      formularios: visibles,
      marco_normativo,
      empresa,
      formulario,
      tipoSeleccionado: formulario ? tipo : null
    }
  } catch (err) {
    return {
      formularios: [],
      marco_normativo: MARCO_NORMATIVO_FALLBACK,
      empresa: 'TRANSMERALDA S.A.S.',
      formulario: null,
      tipoSeleccionado: null,
      loadError: (err as Error).message
    }
  }
}

/**
 * Carga de un formato individual (no aparece en el listado público, se pide
 * directamente por su código). Ej: SLFT-PTEE-FR-12.
 */
export async function cargarFormularioIndividual(
  fetchFn: typeof globalThis.fetch,
  codigo: string,
  tipo: TipoFormulario
): Promise<DatosFormularios> {
  try {
    const formulario = await sarlaftApi.obtenerFormulario(codigo, fetchFn)
    return {
      formularios: [],
      marco_normativo: MARCO_NORMATIVO_FALLBACK,
      empresa: 'TRANSMERALDA S.A.S.',
      formulario,
      tipoSeleccionado: tipo
    }
  } catch (err) {
    return {
      formularios: [],
      marco_normativo: MARCO_NORMATIVO_FALLBACK,
      empresa: 'TRANSMERALDA S.A.S.',
      formulario: null,
      tipoSeleccionado: null,
      loadError: (err as Error).message
    }
  }
}
