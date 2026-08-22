// Instructivos de diligenciamiento de los formularios públicos.
//
// Cada formato tiene su propio instructivo (secciones + glosario + anexos +
// marco normativo). Los tres formularios de conocimiento SARLAFT comparten
// uno; los formatos individuales, como SLFT-PTEE-FR-12, traen el suyo.
// `getInstructivo(codigo)` resuelve cuál corresponde.

export interface InstructivoSeccion {
  seccion: string
  responsable: 'Cliente' | 'Propietario' | 'Oficial de Cumplimiento' | 'Ambos'
  indicaciones: string[]
}

export interface GrupoDocumentos {
  /** Etiqueta corta que se pinta como badge (PJ, PN, OBL, OPC…). */
  badge: string
  titulo: string
  items: string[]
}

export interface InstructivoFormulario {
  secciones: InstructivoSeccion[]
  glosario: Record<string, string>
  documentos: { grupos: GrupoDocumentos[]; nota: string }
  marcoNormativo: Array<{ norma: string; descripcion: string }>
  /** Mapea el nombre de sección del formulario → secciones del instructivo. */
  mapaSecciones: Record<string, string[]>
  /** Ejemplo de radicado que se muestra en la guía de diligenciamiento. */
  ejemploRadicado: string
  /** Documentos que se citan de ejemplo en el paso "checklist". */
  ejemploDocumentos: string
}

const MARCO_SARLAFT = [
  { norma: 'Resolución 2328 de 2025', descripcion: 'Superintendencia de Sociedades' },
  { norma: 'Resolución 14673 de 2025', descripcion: 'Superintendencia de Sociedades' },
  { norma: 'Ley 1581 de 2012', descripcion: 'Protección de datos personales' },
  { norma: 'Decreto 1377 de 2013', descripcion: 'Reglamentación parcial sobre protección de datos' }
]

// ──────────────────────────────────────────────────────────
// GC-FR-04 / GC-FR-05 / GC-FR-06 — Conocimiento SARLAFT + PTEE
// ──────────────────────────────────────────────────────────

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
      'Consulta en listas restrictivas vinculantes y no vinculantes.',
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
  grupos: [
    {
      badge: 'PJ',
      titulo: 'Personas Jurídicas',
      items: [
        'Certificado de existencia y representación legal con fecha de expedición no mayor a un mes.',
        'Composición accionaria y socios mayoritarios.',
        'RUT actualizado.',
        'Cédula por ambas caras del representante legal.'
      ]
    },
    {
      badge: 'PN',
      titulo: 'Personas Naturales',
      items: [
        'Certificado de existencia y representación legal con fecha de expedición no mayor a un mes.',
        'RUT actualizado.',
        'Cédula por ambas caras.'
      ]
    }
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

const INSTRUCTIVO_SARLAFT: InstructivoFormulario = {
  secciones: INSTRUCTIVO,
  glosario: GLOSARIO,
  documentos: DOCUMENTOS_ANEXAR,
  marcoNormativo: MARCO_SARLAFT,
  mapaSecciones: MAPA_SECCIONES,
  ejemploRadicado: 'SARLAFT-2026-CLI-00001',
  ejemploDocumentos: 'cédula, RUT, certificado de existencia, etc.'
}

// ──────────────────────────────────────────────────────────
// SLFT-PTEE-FR-12 — Autorización del Propietario
// ──────────────────────────────────────────────────────────

const SECCIONES_AUTORIZACION: InstructivoSeccion[] = [
  {
    seccion: 'DATOS DEL DOCUMENTO',
    responsable: 'Propietario',
    indicaciones: [
      'Ciudad y fecha en que se firma la autorización.',
      'La carta va dirigida a la empresa que va a recibir la factura y efectuar el pago; indica su nombre o razón social, su NIT y su ciudad.',
      'Si la autorización es para TRANSMERALDA S.A.S., escribe ese nombre y el NIT 900.123.456-7.'
    ]
  },
  {
    seccion: 'IDENTIFICACIÓN DEL PROPIETARIO',
    responsable: 'Propietario',
    indicaciones: [
      'Debe diligenciarla el propietario registrado del vehículo en la tarjeta de propiedad; no un intermediario.',
      'Si el propietario es una persona jurídica, quien firma es su representante legal: marca "Representante legal" e indica la razón social que representa.',
      'El número de documento y el lugar de expedición deben coincidir exactamente con la cédula o el RUT que vas a anexar.'
    ]
  },
  {
    seccion: 'IDENTIFICACIÓN DEL VEHÍCULO',
    responsable: 'Propietario',
    indicaciones: [
      'Copia los datos tal como aparecen en la licencia de tránsito (tarjeta de propiedad): placa, clase y servicio, marca, línea y modelo.',
      'Números de motor y de chasis/VIN completos, sin espacios ni guiones adicionales.',
      'Cualquier diferencia entre lo declarado y la tarjeta de propiedad frena la validación.'
    ]
  },
  {
    seccion: 'TERCERO AUTORIZADO',
    responsable: 'Propietario',
    indicaciones: [
      'Es la persona o empresa que va a facturar y/o recibir el pago en lugar del propietario.',
      'Si el tercero es una persona jurídica, diligencia también el nombre de su representante legal.',
      'El correo y el teléfono deben ser de contacto real: por ahí se solicitan aclaraciones y soportes.'
    ]
  },
  {
    seccion: 'ALCANCE DE LA AUTORIZACIÓN',
    responsable: 'Propietario',
    indicaciones: [
      'Marca todas las facultades que realmente le estás otorgando al tercero. Es selección múltiple.',
      'Autoriza únicamente lo que corresponde a la operación real: no marques facultades "por si acaso".',
      'Si marcas "Otro", describe con precisión de qué se trata en el campo que aparece.'
    ]
  },
  {
    seccion: 'RELACIÓN JURÍDICA',
    responsable: 'Propietario',
    indicaciones: [
      'Selecciona el contrato o negocio que da origen a la autorización (arrendamiento, administración, mandato, cesión de derechos económicos, usufructo o leasing).',
      'La vigencia declarada aquí debe coincidir con la del contrato que vas a anexar.',
      'En el objeto contractual describe en pocas líneas qué hace el tercero con el vehículo.',
      'La empresa puede pedirte el contrato firmado como soporte; ténlo a la mano.'
    ]
  },
  {
    seccion: 'INFORMACIÓN PARA EL PAGO',
    responsable: 'Propietario',
    indicaciones: [
      'La cuenta bancaria debe estar a nombre del tercero autorizado, no de un familiar ni de un tercero distinto.',
      'El nombre del titular y su cédula/NIT deben coincidir con la certificación bancaria que anexas.',
      'No se aceptan pagos en efectivo ni a cuentas distintas de la indicada aquí.',
      'Verifica dígito por dígito el número de cuenta: un error aquí retrasa todo el pago.'
    ]
  },
  {
    seccion: 'DECLARACIONES DEL PROPIETARIO',
    responsable: 'Propietario',
    indicaciones: [
      'Las ocho declaraciones se aceptan al firmar el formulario; léelas antes de continuar.',
      'Declara la relación real que tienes con el tercero (familiar, socio, arrendatario, administrador…). Es selección múltiple.',
      'Si existe parentesco marca "Familiar" e indica el grado; si hay otra relación usa "Otro" y explícala.',
      'Si no hay ningún vínculo, marca "No existe relación familiar, societaria o laboral".',
      'Ocultar un conflicto de interés es causal de rechazo de la autorización.'
    ]
  },
  {
    seccion: 'AUTORIZACIÓN DE CONSULTAS',
    responsable: 'Propietario',
    indicaciones: [
      'Autorizas a la empresa a verificar tus datos y los del tercero en listas restrictivas, PEP y fuentes públicas.',
      'También a validar la titularidad del vehículo, la cuenta bancaria y la relación contractual.',
      'Sin estas autorizaciones no es posible adelantar la debida diligencia y la solicitud no puede aprobarse.'
    ]
  },
  {
    seccion: 'VIGENCIA Y REVOCATORIA',
    responsable: 'Propietario',
    indicaciones: [
      'Define desde y hasta cuándo rige la autorización. No debe exceder la vigencia del contrato.',
      'Puedes revocarla en cualquier momento mediante comunicación escrita radicada ante la empresa.',
      'La revocatoria surte efecto después de recibida y registrada, sin afectar pagos ya causados.'
    ]
  },
  {
    seccion: 'FIRMAS',
    responsable: 'Ambos',
    indicaciones: [
      'Este formato requiere DOS firmas: la del propietario del vehículo y la del tercero autorizado en señal de aceptación.',
      'Puedes firmar con el mouse, con el dedo en el celular, o subir una imagen de tu firma.',
      'Si estás diligenciando en un solo dispositivo, firma tú primero y luego pásaselo al tercero.',
      'Sin ambas firmas el formulario no se puede enviar.'
    ]
  },
  {
    seccion: 'VALIDACIÓN INTERNA',
    responsable: 'Oficial de Cumplimiento',
    indicaciones: [
      'La solicitud pasa por revisión documental, operativa, contable/tributaria, jurídica y de cumplimiento.',
      'Se valida la titularidad bancaria y el beneficiario final antes de habilitar cualquier pago.',
      'Ante señales de alerta el caso se escala al Oficial de Cumplimiento antes de efectuar desembolsos.',
      'Esta carta no obliga a la empresa a aceptar la facturación ni a efectuar el pago.'
    ]
  }
]

const GLOSARIO_AUTORIZACION: Record<string, string> = {
  'Tercero autorizado':
    'Persona natural o jurídica, distinta del propietario del vehículo, a quien se le autoriza facturar y/o recibir los pagos derivados de la operación del vehículo.',
  'Propietario registrado':
    'Persona que figura como titular del vehículo en la licencia de tránsito (tarjeta de propiedad) y en el certificado de tradición.',
  'Cesión de derechos económicos':
    'Negocio por el cual el propietario transfiere a un tercero el derecho a recibir los ingresos que genera el vehículo, conservando la propiedad.',
  'Contrato de mandato':
    'Acuerdo por el cual una persona (mandatario) gestiona negocios por cuenta de otra (mandante). Aquí, el tercero gestiona la facturación o el cobro por cuenta del propietario.',
  Usufructo:
    'Derecho a usar y explotar económicamente un bien ajeno, con la obligación de conservarlo. El propietario mantiene la titularidad.',
  'Certificación bancaria':
    'Documento expedido por el banco que acredita la existencia y titularidad de una cuenta. Debe estar vigente y a nombre del tercero autorizado.',
  'Certificado de tradición':
    'Documento del RUNT que muestra el historial de propietarios del vehículo y los gravámenes o limitaciones que recaen sobre él.',
  'Beneficiario Final':
    'Persona natural que finalmente recibe o controla los recursos de una operación, aunque no aparezca formalmente en el contrato.',
  'Conflicto de interés':
    'Situación en la que la relación personal, familiar, societaria o laboral entre las partes puede afectar la objetividad de la operación. Debe declararse siempre.',
  PEP:
    'Persona Expuesta Políticamente. Individuos que cumplen funciones públicas relevantes. Incluye sus familiares y asociados cercanos.',
  'Debida Diligencia Intensificada':
    'Revisión reforzada que se aplica cuando la operación presenta señales de alerta o un nivel de riesgo alto.',
  'LA/FT/FP':
    'Lavado de Activos, Financiación del Terrorismo y Financiación de la Proliferación de Armas de Destrucción Masiva.',
  'SARLAFT / PTEE':
    'Sistemas de administración de riesgo de lavado de activos y de transparencia y ética empresarial que aplica la empresa.'
}

const DOCUMENTOS_AUTORIZACION = {
  grupos: [
    {
      badge: 'OBL',
      titulo: 'Obligatorios para enviar',
      items: [
        'Documento de identidad del propietario (ambas caras).',
        'Documento de identidad del tercero autorizado o de su representante legal.',
        'RUT actualizado del propietario.',
        'RUT actualizado del tercero autorizado.',
        'Tarjeta de propiedad del vehículo (ambas caras).',
        'Certificación bancaria vigente del tercero autorizado.'
      ]
    },
    {
      badge: 'OPC',
      titulo: 'Cuando aplique',
      items: [
        'Certificado de existencia y representación legal, si alguna de las partes es persona jurídica.',
        'Certificado de tradición del vehículo.',
        'Contrato que acredita la relación jurídica declarada en la sección 3.',
        'Formulario de conocimiento del tercero, si ya lo tiene diligenciado.',
        'Otros soportes que quieras aportar.'
      ]
    }
  ],
  nota:
    'Los seis documentos obligatorios se adjuntan dentro del mismo formulario, en el paso final, antes de enviar. Las declaraciones de origen de fondos, beneficiario final, conflictos de interés y tratamiento de datos NO se anexan como archivo: ya quedan cubiertas por las secciones 5 y 6 que diligencias aquí. Formatos aceptados: PDF, JPG, PNG, WebP o HEIC, máximo 10 MB por archivo.'
}

const INSTRUCTIVO_AUTORIZACION: InstructivoFormulario = {
  secciones: SECCIONES_AUTORIZACION,
  glosario: GLOSARIO_AUTORIZACION,
  documentos: DOCUMENTOS_AUTORIZACION,
  marcoNormativo: [
    { norma: 'Resolución 2328 de 2025', descripcion: 'Superintendencia de Sociedades' },
    { norma: 'Resolución 14673 de 2025', descripcion: 'Superintendencia de Sociedades' },
    { norma: 'Estatuto Tributario', descripcion: 'Obligación de facturar por quien presta el servicio' },
    { norma: 'Ley 1581 de 2012', descripcion: 'Protección de datos personales' },
    { norma: 'Decreto 1377 de 2013', descripcion: 'Reglamentación parcial sobre protección de datos' }
  ],
  mapaSecciones: {
    'Datos del documento': ['DATOS DEL DOCUMENTO'],
    'Identificación del propietario que autoriza': ['IDENTIFICACIÓN DEL PROPIETARIO'],
    '1. Identificación del vehículo': ['IDENTIFICACIÓN DEL VEHÍCULO'],
    '2. Identificación del tercero autorizado': ['TERCERO AUTORIZADO'],
    'Alcance de la autorización': ['ALCANCE DE LA AUTORIZACIÓN'],
    '3. Relación jurídica con el tercero autorizado': ['RELACIÓN JURÍDICA'],
    '4. Información para el pago': ['INFORMACIÓN PARA EL PAGO'],
    '5. Declaraciones del propietario': ['DECLARACIONES DEL PROPIETARIO'],
    '6. Autorización para consultas y tratamiento de información': ['AUTORIZACIÓN DE CONSULTAS'],
    '7. Condiciones de la autorización': ['VALIDACIÓN INTERNA'],
    '8. Vigencia y revocatoria': ['VIGENCIA Y REVOCATORIA'],
    '9. Firmas': ['FIRMAS']
  },
  ejemploRadicado: 'AUTPROP-2026-00001',
  ejemploDocumentos: 'tarjeta de propiedad, RUT, certificación bancaria, etc.'
}

// ──────────────────────────────────────────────────────────
// SLFT-PTEE-FR-13 — Declaración SARLAFT y PTEE para empresa de transporte
// ──────────────────────────────────────────────────────────

const SECCIONES_DECLARACION_TRANSPORTE: InstructivoSeccion[] = [
  {
    seccion: 'DATOS DEL DOCUMENTO',
    responsable: 'Cliente',
    indicaciones: [
      'Fecha en la que diligencias y firmas la declaración.',
      'Es la fecha que queda impresa en el formato SLFT-PTEE-FR-13 que recibirás por correo.'
    ]
  },
  {
    seccion: 'IDENTIFICACIÓN DEL PROVEEDOR',
    responsable: 'Cliente',
    indicaciones: [
      'Razón social tal como aparece en el certificado de existencia y representación legal.',
      'El formato tiene una celda de ancho fijo: si la razón social supera los 55 caracteres no cabe de forma legible y el envío se rechaza.',
      'El NIT debe incluir el dígito de verificación.'
    ]
  },
  {
    seccion: 'DATOS DE QUIEN DECLARA',
    responsable: 'Cliente',
    indicaciones: [
      'Debe diligenciarla el representante legal de la empresa de transporte, no un intermediario.',
      'El nombre y la cédula se imprimen dos veces en el formato: en la sección 1 y en la tabla de firma. Se capturan una sola vez.',
      'El correo se pide dos veces y no se puede pegar: queda impreso en la declaración y es por donde la empresa te contacta si hay que aclarar algo.'
    ]
  },
  {
    seccion: 'DECLARACIÓN Y COMPROMISO',
    responsable: 'Cliente',
    indicaciones: [
      'El texto completo de la declaración y de los ocho compromisos está impreso en el formato controlado que se genera al enviar.',
      'Aceptar aquí equivale a suscribir ese texto: léelo antes de continuar.',
      'Entre otras cosas, te comprometes a verificar propietario, proveedor y conductor antes de asignar cada vehículo, y a informar de inmediato cualquier alerta.'
    ]
  },
  {
    seccion: 'CONFIRMACIÓN RÁPIDA',
    responsable: 'Cliente',
    indicaciones: [
      'Son tres confirmaciones y todas son obligatorias.',
      'El estado de alertas admite una sola opción: o no existen alertas pendientes, o existen y van en documento anexo. No se pueden marcar las dos.',
      'Si respondes que los vehículos no fueron revisados, o que los soportes no están vigentes, tendrás que explicarlo en las observaciones.'
    ]
  },
  {
    seccion: 'ALERTAS U OBSERVACIONES',
    responsable: 'Cliente',
    indicaciones: [
      'Obligatorio si declaraste alertas, si los vehículos no fueron revisados o si los soportes no están vigentes.',
      'El formato tiene dos renglones (máximo 260 caracteres). Para el detalle extenso usa el documento anexo.',
      'Si declaraste que existen alertas, el documento anexo es obligatorio para poder enviar.'
    ]
  },
  {
    seccion: 'FIRMA Y VALIDACIÓN',
    responsable: 'Cliente',
    indicaciones: [
      'Firma el representante legal identificado en la sección 1.',
      'Puedes firmar con el mouse, con el dedo en el celular, o subir una imagen de tu firma.',
      'La firma se incrusta dentro de la celda del formato, sin deformarse.',
      'Al enviar podrás descargar tu copia del documento firmado desde la pantalla de confirmación. Guárdala: la declaración no se envía por correo.'
    ]
  },
  {
    seccion: 'RESULTADO',
    responsable: 'Oficial de Cumplimiento',
    indicaciones: [
      'El campo Resultado NO lo diligencias tú: es la decisión interna de TRANSMERALDA S.A.S..',
      'La copia que recibes al enviar sale con el Resultado en blanco, porque en ese momento la evaluación todavía no ha ocurrido.',
      'Cuando se emita la decisión (Aprobado, Condicionado o No aprobado) se genera una versión nueva del documento; la que recibiste no se modifica.'
    ]
  }
]

const GLOSARIO_DECLARACION_TRANSPORTE: Record<string, string> = {
  'Empresa tercerizada':
    'Empresa de transporte que presta el servicio con sus propios vehículos, propietarios y conductores, incorporándolos a la operación contratada.',
  'Señal de alerta':
    'Hecho o comportamiento inusual que puede indicar un riesgo de LA/FT/FP, corrupción o soborno y que obliga a un análisis adicional.',
  'Beneficiario Final':
    'Persona natural que finalmente recibe o controla los recursos de una operación, aunque no aparezca formalmente en el contrato.',
  PEP:
    'Persona Expuesta Políticamente. Individuos que cumplen funciones públicas relevantes. Incluye sus familiares y asociados cercanos.',
  'Tarjeta de operación':
    'Documento que autoriza a un vehículo a prestar el servicio público de transporte dentro de una empresa habilitada.',
  'LA/FT/FP':
    'Lavado de Activos, Financiación del Terrorismo y Financiación de la Proliferación de Armas de Destrucción Masiva.',
  'SARLAFT / PTEE':
    'Sistemas de administración de riesgo de lavado de activos y de transparencia y ética empresarial que aplica la empresa.',
  'Huella SHA-256':
    'Identificador único calculado a partir del contenido del PDF. Si el archivo cambia, aunque sea un carácter, la huella cambia. Sirve para verificar que el documento que recibiste es el que quedó archivado.'
}

const DOCUMENTOS_DECLARACION_TRANSPORTE = {
  grupos: [
    {
      badge: 'COND',
      titulo: 'Obligatorio si declaraste alertas',
      items: [
        'Documento anexo con el detalle de las alertas informadas y sus soportes.'
      ]
    },
    {
      badge: 'OPC',
      titulo: 'Opcional',
      items: [
        'Relación de vehículos cubiertos por la declaración (placas, propietarios y conductores).'
      ]
    }
  ],
  nota:
    'Si no anexas la relación de vehículos, la declaración cubre los vehículos relacionados en el proceso contractual. ' +
    'El anexo de alertas solo es obligatorio cuando marcas que existen alertas informadas en documento anexo. ' +
    'Formatos aceptados: PDF, JPG, PNG, WebP o HEIC, máximo 10 MB por archivo.'
}

const INSTRUCTIVO_DECLARACION_TRANSPORTE: InstructivoFormulario = {
  secciones: SECCIONES_DECLARACION_TRANSPORTE,
  glosario: GLOSARIO_DECLARACION_TRANSPORTE,
  documentos: DOCUMENTOS_DECLARACION_TRANSPORTE,
  marcoNormativo: MARCO_SARLAFT,
  mapaSecciones: {
    'Datos del documento': ['DATOS DEL DOCUMENTO'],
    'Identificación del proveedor': ['IDENTIFICACIÓN DEL PROVEEDOR'],
    '1. Datos de quien declara': ['DATOS DE QUIEN DECLARA'],
    '2. Declaración y compromiso': ['DECLARACIÓN Y COMPROMISO'],
    '3. Confirmación rápida': ['CONFIRMACIÓN RÁPIDA'],
    '4. Alertas u observaciones': ['ALERTAS U OBSERVACIONES'],
    '5. Firma y validación': ['FIRMA Y VALIDACIÓN', 'RESULTADO']
  },
  ejemploRadicado: 'DECL-TRA-2026-00001',
  ejemploDocumentos: 'documento anexo de alertas y relación de vehículos, cuando apliquen.'
}

// ──────────────────────────────────────────────────────────
// Registry
// ──────────────────────────────────────────────────────────

const POR_CODIGO: Record<string, InstructivoFormulario> = {
  'SLFT-PTEE-FR-12': INSTRUCTIVO_AUTORIZACION,
  'SLFT-PTEE-FR-13': INSTRUCTIVO_DECLARACION_TRANSPORTE
}

/** Instructivo correspondiente al formulario. Por defecto, el de SARLAFT. */
export function getInstructivo(codigo?: string | null): InstructivoFormulario {
  return (codigo && POR_CODIGO[codigo]) || INSTRUCTIVO_SARLAFT
}

/** Devuelve las secciones del instructivo relevantes para una sección del formulario */
export function getInstructivoParaSeccion(
  nombreSeccion: string,
  codigo?: string | null
): InstructivoSeccion[] {
  const ins = getInstructivo(codigo)
  const keys = ins.mapaSecciones[nombreSeccion] ?? []
  return keys
    .map((k) => ins.secciones.find((i) => i.seccion === k))
    .filter(Boolean) as InstructivoSeccion[]
}
