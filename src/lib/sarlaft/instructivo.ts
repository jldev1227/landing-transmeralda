// Instructivo de diligenciamiento SARLAFT + PTEE
// Espejo del archivo "INSTRUCTIVO" del Excel para mostrar al usuario
// cómo diligenciar correctamente cada sección.

export interface InstructivoSeccion {
  seccion: string
  responsable: 'Cliente' | 'Oficial de Cumplimiento' | 'Ambos'
  indicaciones: string[]
}

export const INSTRUCTIVO: InstructivoSeccion[] = [
  {
    seccion: 'INFORMACIÓN GENERAL',
    responsable: 'Cliente',
    indicaciones: [
      'Tipo de cliente: Persona Natural o Persona Jurídica según corresponda.',
      'Fecha de vinculación: fecha en la que se inicia la relación con TRANSMERALDA S.A.S.',
      'Tipo de vinculación: Nuevo, Actualización u Ocasional según el caso.'
    ]
  },
  {
    seccion: 'DATOS DEL CLIENTE',
    responsable: 'Cliente',
    indicaciones: [
      'Persona natural: completar todos los campos personales (nombre, cédula, nacionalidad, fecha de nacimiento, actividad económica, ocupación, dirección, teléfono y correo).',
      'Persona jurídica: diligenciar los datos básicos solicitados (razón social, NIT, fecha de constitución, actividad económica principal y secundaria).'
    ]
  },
  {
    seccion: 'INFORMACIÓN FINANCIERA',
    responsable: 'Cliente',
    indicaciones: [
      'Los valores deben reflejar coherencia con la actividad económica declarada.',
      'Complete los tres campos: Ingresos, Egresos y Patrimonio (expresados en pesos colombianos COP).'
    ]
  },
  {
    seccion: 'ORIGEN DE FONDOS',
    responsable: 'Cliente',
    indicaciones: [
      'Describir claramente la procedencia de los recursos (actividad comercial, laboral, ahorros, inversiones, etc.).',
      'Esta información es clave para el análisis de riesgo LA/FT/FP.'
    ]
  },
  {
    seccion: 'PERFIL TRANSACCIONAL',
    responsable: 'Cliente',
    indicaciones: [
      'Indicar el tipo de servicio que se contratará con TRANSMERALDA S.A.S.',
      'Frecuencia esperada de las operaciones (mensual, trimestral, anual, etc.).',
      'Valor estimado de las operaciones.',
      'Ubicación geográfica (municipio de origen de los servicios).',
      'Forma de pago: puede ser transferencia bancaria, cheque o efectivo.'
    ]
  },
  {
    seccion: 'DECLARACIONES',
    responsable: 'Cliente',
    indicaciones: [
      'Autorizar el tratamiento de datos personales conforme a la Ley 1581 de 2012 y Decreto 1377 de 2013.',
      'Declarar el origen lícito de los recursos (no relacionados con lavado de activos, financiación del terrorismo o proliferación).',
      'Declarar el cumplimiento de normas anticorrupción (no ofrecer, prometer ni recibir sobornos).',
      'Si realiza operaciones en moneda extranjera o con activos virtuales (criptomonedas), debe responder las 4 preguntas adicionales.'
    ]
  },
  {
    seccion: 'BENEFICIARIO FINAL',
    responsable: 'Cliente',
    indicaciones: [
      'Declarar todas las personas naturales que posean o controlen directa o indirectamente la entidad.',
      'Debe ser declarado por el cliente y validado por el Oficial de Cumplimiento.'
    ]
  },
  {
    seccion: 'VALIDACIONES SARLAFT',
    responsable: 'Oficial de Cumplimiento',
    indicaciones: [
      'Consulta en listasrestrictivas vinculantes y no vinculantes.',
      'Verificación documental de la información suministrada.',
      'Análisis de coherencia entre los datos financieros y la actividad económica.',
      'Identificación de señales de alerta.'
    ]
  },
  {
    seccion: 'VALIDACIONES PTEE',
    responsable: 'Oficial de Cumplimiento',
    indicaciones: [
      'Verificar la condición de Persona Expuesta Políticamente (PEP).',
      'Verificar relación con funcionarios públicos.',
      'Evaluar riesgos de corrupción y soborno.'
    ]
  },
  {
    seccion: 'CLASIFICACIÓN DE RIESGO',
    responsable: 'Oficial de Cumplimiento',
    indicaciones: [
      'Se asigna según el análisis integral: Bajo, Medio o Alto.',
      'Determina el tipo de Debida Diligencia (Simplificada, Estándar o Intensificada).'
    ]
  },
  {
    seccion: 'CONCEPTO TÉCNICO',
    responsable: 'Oficial de Cumplimiento',
    indicaciones: [
      'El Oficial de Cumplimiento define: Aprobado, Rechazado o Escalado.',
      'Esta decisión se documenta con la firma del Oficial de Cumplimiento y del Representante Legal.'
    ]
  }
]

// Glosario de términos técnicos
export const GLOSARIO: Record<string, string> = {
  'Beneficiario Final':
    'Persona natural que posee o controla directa o indirectamente una entidad jurídica. Incluye quienes tienen al menos el 5% de participación o capacidad de decisión.',
  'Debida Diligencia':
    'Proceso de identificación, verificación y análisis del cliente para conocerlo adecuadamente y evaluar su riesgo LA/FT/FP.',
  PEP:
    'Persona Expuesta Políticamente. Individuos que cumplen funciones públicas relevantes (presidente, ministros, congresistas, gobernadores, alcaldes, etc.). Incluye sus familiares y asociados cercanos.',
  'Señales de Alerta':
    'Indicadores de comportamiento inusual que podrían sugerir actividades de lavado de activos, financiación del terrorismo o corrupción.',
  'Perfil Transaccional':
    'Comportamiento esperado del cliente en cuanto a volumen, frecuencia y naturaleza de las operaciones que realiza.',
  'Clasificación de Riesgo':
    'Nivel de exposición del cliente a riesgos LA/FT/FP: Bajo, Medio o Alto. Define la profundidad del análisis requerido.',
  'SARLAFT':
    'Sistema de Administración del Riesgo de Lavado de Activos y Financiación del Terrorismo.',
  'PTEE':
    'Programa de Transparencia y Ética Empresarial — enfocado en riesgos de corrupción y soborno nacional y transnacional.',
  'LA/FT/FP':
    'Lavado de Activos, Financiación del Terrorismo y Financiación de la Proliferación de Armas de Destrucción Masiva.'
}

// Documentos a anexar
export const DOCUMENTOS_ANEXAR = {
  personas_juridicas: [
    '1. Certificado de existencia y representación legal con fecha de expedición no mayor a un mes.',
    '2. Composición accionaria y socios mayoritarios.',
    '3. RUT actualizado.',
    '4. Cédula por ambas caras del representante legal.'
  ],
  personas_naturales: [
    '1. Certificado de existencia y representación legal con fecha de expedición no mayor a un mes.',
    '2. RUT actualizado.',
    '3. Cédula por ambas caras.'
  ],
  nota:
    'El certificado de existencia y representación legal aparece listado también para "personas naturales" en el archivo original. Se recomienda validar con el área de cumplimiento si aplica solo a personas jurídicas. Los documentos deben entregarse al correo operaciones.transmeraldasas@gmail.com o en las instalaciones de TRANSMERALDA S.A.S.'
}

// Mapeo de secciones del formulario → secciones del instructivo
// Permite mostrar al usuario las indicaciones relevantes según dónde esté
export const MAPA_SECCIONES: Record<string, string[]> = {
  // Generales
  'Datos del documento': ['INFORMACIÓN GENERAL'],
  'Aviso de privacidad y autorización tratamiento de datos': ['DECLARACIONES'],

  // Cliente / Proveedor
  'Información general': ['INFORMACIÓN GENERAL'],
  'Persona natural': ['DATOS DEL CLIENTE'],
  'Persona jurídica': ['DATOS DEL CLIENTE'],
  'Jurisdicción': ['DATOS DEL CLIENTE'],
  'Domicilio principal': ['DATOS DEL CLIENTE'],

  // Accionistas
  'Información general de la empresa': ['INFORMACIÓN GENERAL', 'DATOS DEL CLIENTE'],
  'Composición accionaria': ['BENEFICIARIO FINAL'],
  'Beneficiario final': ['BENEFICIARIO FINAL'],

  // Personal
  'Información general (Personal)': ['INFORMACIÓN GENERAL', 'DATOS DEL CLIENTE'],
  'Información personal': ['DATOS DEL CLIENTE'],

  // Compartidas
  'Información financiera': ['INFORMACIÓN FINANCIERA'],
  'Información sobre cuentas que posee en entidades financieras': ['INFORMACIÓN FINANCIERA'],
  'Origen de fondos': ['ORIGEN DE FONDOS'],
  'Perfil transaccional': ['PERFIL TRANSACCIONAL'],
  'Relación conflicto de intereses': ['DECLARACIONES'],
  'Revisor fiscal (principal/suplente)': ['BENEFICIARIO FINAL'],
  'Declaraciones SARLAFT y PTEE (Anticorrupción)': ['DECLARACIONES']
}

/** Devuelve las secciones del instructivo relevantes para una sección del formulario */
export function getInstructivoParaSeccion(nombreSeccion: string): InstructivoSeccion[] {
  const keys = MAPA_SECCIONES[nombreSeccion] ?? []
  return keys.map((k) => INSTRUCTIVO.find((i) => i.seccion === k)).filter(Boolean) as InstructivoSeccion[]
}
