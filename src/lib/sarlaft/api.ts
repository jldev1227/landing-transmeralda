import { env } from '$env/dynamic/public'
import type { Formulario, FormularioResumen, SubmitResult } from './types'

const BASE = env.PUBLIC_API_URL || 'http://localhost:4000/api'

export interface DocumentoRequeridoAPI {
  id: string
  nombre: string
  descripcion: string
  aplicaA: 'pn' | 'pj' | 'ambos'
}

export interface ConfigUploadAPI {
  max_bytes: number
  mimes_permitidos: string[]
  extensiones_permitidas: string[]
}

export const sarlaftApi = {
  async listarFormularios(): Promise<{
    formularios: FormularioResumen[]
    marco_normativo: string[]
    empresa: string
  }> {
    const r = await fetch(`${BASE}/public/formularios-sarlaft`)
    if (!r.ok) throw new Error('No se pudo obtener la lista de formularios')
    return r.json()
  },

  async obtenerFormulario(codigo: string): Promise<Formulario> {
    const r = await fetch(`${BASE}/public/formularios-sarlaft/${codigo}`)
    if (!r.ok) throw new Error(`No se pudo obtener el formulario ${codigo}`)
    const data = await r.json()
    return data.formulario as Formulario
  },

  async obtenerDocumentosRequeridos(codigo: string, tipoCliente?: string | null): Promise<{
    documentos: DocumentoRequeridoAPI[]
    config: ConfigUploadAPI
  }> {
    const params = new URLSearchParams()
    if (tipoCliente) params.set('tipo_cliente', tipoCliente)
    const qs = params.toString()
    const r = await fetch(`${BASE}/public/formularios-sarlaft/${codigo}/documentos${qs ? '?' + qs : ''}`)
    if (!r.ok) throw new Error('No se pudo obtener la lista de documentos')
    return r.json()
  },

  async submit(payload: {
    codigo_formulario: string
    fecha_diligenciamiento?: string
    respuestas: Record<string, unknown>
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
