// Tipos compartidos para los formularios SARLAFT + PTEE
// (Espejo de los tipos del backend para mantener sincronía)

export type TipoRespuesta =
  | 'texto_corto'
  | 'texto_largo'
  | 'numerico'
  | 'fecha'
  | 'seleccion_unica'
  | 'seleccion_multiple'
  | 'firma'
  | 'declaracion_informativa'

export type TipoFormulario =
  | 'cliente_proveedor'
  | 'accionistas'
  | 'personal'
  | 'autorizacion_propietario'

/** Regla declarativa de visibilidad de una pregunta según otra.
 *  - `igual_a`: la pregunta origen debe valer exactamente ese texto.
 *  - `incluye`: la pregunta origen es `seleccion_multiple` y su arreglo
 *    de respuestas debe contener ese valor. */
export interface CondicionalPregunta {
  id: string
  igual_a?: string
  incluye?: string
}

/**
 * Restringe qué se puede teclear en un `texto_corto`. Son identificadores, no
 * cantidades: por eso no se usan como `numerico` (input type number), que
 * pierde los ceros a la izquierda, muestra flechas y admite notación
 * científica.
 */
export type FormatoCampo = 'digitos' | 'documento' | 'telefono'

/** Caracteres admitidos por cada formato. */
const PERMITIDOS: Record<FormatoCampo, RegExp> = {
  digitos: /[^0-9]/g,
  documento: /[^0-9.\-]/g,
  telefono: /[^0-9+()\-\s]/g
}

/** Elimina del texto los caracteres que el formato no admite. */
export function sanearFormato(valor: string, formato?: FormatoCampo): string {
  if (!formato) return valor
  return valor.replace(PERMITIDOS[formato], '')
}

/** Pista de teclado en móvil para cada formato. */
export function inputModeDe(formato?: FormatoCampo): 'numeric' | 'tel' | undefined {
  if (formato === 'telefono') return 'tel'
  if (formato) return 'numeric'
  return undefined
}

export interface Pregunta {
  id: string
  pregunta: string
  tipo_respuesta: TipoRespuesta
  modo_respuesta: string
  opciones: string[] | null
  obligatorio: boolean
  nota?: string
  condicional_pregunta?: CondicionalPregunta
  formato?: FormatoCampo
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

export type CodigoFormulario = 'GC-FR-04' | 'GC-FR-05' | 'GC-FR-06' | 'SLFT-PTEE-FR-12'

export interface Formulario {
  codigo: CodigoFormulario
  nombre_formato: string
  titulo: string
  version: string
  fecha_documento: string
  archivo_origen: string
  tipo: TipoFormulario
  /** 'sarlaft' = aparece en el selector público; 'individual' = ruta propia. */
  categoria?: 'sarlaft' | 'individual'
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
