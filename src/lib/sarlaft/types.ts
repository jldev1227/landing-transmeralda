// Tipos compartidos para los formularios SARLAFT + PTEE
// (Espejo de los tipos del backend para mantener sincronía)

export type TipoRespuesta =
  | 'texto_corto'
  | 'texto_largo'
  | 'numerico'
  | 'fecha'
  | 'seleccion_unica'
  | 'firma'
  | 'declaracion_informativa'

export type TipoFormulario = 'cliente_proveedor' | 'accionistas' | 'personal'

export interface Pregunta {
  id: string
  pregunta: string
  tipo_respuesta: TipoRespuesta
  modo_respuesta: string
  opciones: string[] | null
  obligatorio: boolean
  nota?: string
}

export type TipoBloque = 'seccion_normal' | 'tabla_repetible' | 'tabla_repetible_multiple'

export interface Seccion {
  seccion: string
  tipo_bloque?: TipoBloque
  condicional?: string
  /** Key estable para agrupar filas de tabla repetible en el payload */
  key_tabla?: string
  nota?: string
  preguntas: Pregunta[]
}

export interface Formulario {
  codigo: 'GC-FR-04' | 'GC-FR-05' | 'GC-FR-06'
  nombre_formato: string
  titulo: string
  version: string
  fecha_documento: string
  archivo_origen: string
  tipo: TipoFormulario
  secciones: Seccion[]
  total_secciones?: number
  total_preguntas?: number
}

export interface FormularioResumen {
  codigo: Formulario['codigo']
  tipo: TipoFormulario
  titulo: string
  version: string
  fecha_documento: string
  total_secciones: number
  total_preguntas: number
}

export interface SubmitResult {
  success: boolean
  radicado: string
  fecha_envio: string
  tipo_formulario: TipoFormulario
  codigo_formulario: string
  nombre_completo: string | null
  mensaje: string
}
