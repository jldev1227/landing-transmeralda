import { env } from '$env/dynamic/public'
import type { Formulario, FormularioResumen, SubmitResult, TipoFormulario } from './types'

const BASE = env.PUBLIC_API_URL || 'http://localhost:4000/api'

export interface DocumentoRequeridoAPI {
  id: string
  nombre: string
  descripcion: string
  aplicaA: 'pn' | 'pj' | 'ambos'
  /** true = el usuario DEBE adjuntar este archivo para poder enviar;
   *  false = es opcional y el usuario puede omitirlo. */
  obligatorio: boolean
}

export interface ConfigUploadAPI {
  max_bytes: number
  mimes_permitidos: string[]
  extensiones_permitidas: string[]
}

export interface ContactoPublicoAPI {
  tipo: TipoFormulario
  area_responsable: string
  telefono_principal: string
  telefono_wa: string
  telefono_tel: string
  correo_publico: string
  correo_mailto: string
}

/** Los `load` de SvelteKit deben usar su propio `fetch` (SSR, cookies,
 *  deduplicación). Por eso cada método acepta uno opcional y cae al global
 *  cuando se llama desde el navegador. */
type FetchFn = typeof globalThis.fetch

export const sarlaftApi = {
  async listarFormularios(fetchFn: FetchFn = fetch): Promise<{
    formularios: FormularioResumen[]
    marco_normativo: string[]
    empresa: string
  }> {
    const r = await fetchFn(`${BASE}/public/formularios-sarlaft`)
    if (!r.ok) throw new Error('No se pudo obtener la lista de formularios')
    return r.json()
  },

  async obtenerFormulario(codigo: string, fetchFn: FetchFn = fetch): Promise<Formulario> {
    const r = await fetchFn(`${BASE}/public/formularios-sarlaft/${codigo}`)
    if (!r.ok) throw new Error(`No se pudo obtener el formulario ${codigo}`)
    const data = await r.json()
    return data.formulario as Formulario
  },

  /**
   * Lista de anexos del formato.
   *
   * `alertas` solo aplica a la declaración de empresa de transporte: en ese
   * formato la obligatoriedad del anexo depende de una respuesta condicional
   * y no del tipo de cliente, así que el backend necesita conocerla para
   * devolver la lista ya resuelta.
   */
  async obtenerDocumentosRequeridos(
    codigo: string,
    tipoCliente?: string | null,
    alertas?: string | null
  ): Promise<{
    documentos: DocumentoRequeridoAPI[]
    config: ConfigUploadAPI
  }> {
    const params = new URLSearchParams()
    if (tipoCliente) params.set('tipo_cliente', tipoCliente)
    if (alertas) params.set('alertas', alertas)
    const qs = params.toString()
    const r = await fetch(`${BASE}/public/formularios-sarlaft/${codigo}/documentos${qs ? '?' + qs : ''}`)
    if (!r.ok) throw new Error('No se pudo obtener la lista de documentos')
    return r.json()
  },

  async obtenerContacto(tipo: TipoFormulario, fetchFn: FetchFn = fetch): Promise<ContactoPublicoAPI> {
    const r = await fetchFn(`${BASE}/public/formularios-sarlaft/contacto?tipo=${encodeURIComponent(tipo)}`)
    if (!r.ok) throw new Error('No se pudo obtener la configuración de contacto')
    const data = await r.json()
    return data.contacto as ContactoPublicoAPI
  },

  async submit(payload: {
    codigo_formulario: string
    fecha_diligenciamiento?: string
    respuestas: Record<string, unknown>
    /** Doble digitación del correo de entrega. Viaja FUERA de `respuestas`
     *  porque es un control de captura, no una respuesta del formato: el
     *  backend la compara y la descarta antes de archivar el snapshot. */
    correo_confirmacion?: string
    archivos: Record<string, File> // { docId: File }
  }): Promise<SubmitResult> {
    const fd = new FormData()
    fd.append(
      'payload',
      JSON.stringify({
        ...payload,
        contexto: {
          user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
          referer: typeof document !== 'undefined' ? document.referrer : undefined
        }
      })
    )
    for (const [docId, file] of Object.entries(payload.archivos)) {
      if (file) fd.append(`doc_${docId}`, file, file.name)
    }

    const r = await fetch(`${BASE}/public/formularios-sarlaft`, {
      method: 'POST',
      body: fd
    })

    const data = await r.json()
    if (!r.ok) {
      const error: any = new Error(data?.error || 'Error al enviar el formulario')
      error.status = r.status
      error.details = data?.details
      throw error
    }
    return data
  }
}
