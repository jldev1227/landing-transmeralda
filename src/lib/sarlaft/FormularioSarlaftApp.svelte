<script lang="ts">
  import { fly, fade } from 'svelte/transition'
  import { quintOut } from 'svelte/easing'
  import { goto } from '$app/navigation'
  import { onMount } from 'svelte'
  import { sarlaftApi, type ContactoPublicoAPI } from '$lib/sarlaft/api'
  import type { Formulario, Pregunta, Seccion, SubmitResult, TipoFormulario } from '$lib/sarlaft/types'
  import FormField from '$lib/sarlaft/FormField.svelte'
  import TablaRepetible from '$lib/sarlaft/TablaRepetible.svelte'
  import SeccionCard from '$lib/sarlaft/SeccionCard.svelte'
  import InstructivoModal from '$lib/sarlaft/InstructivoModal.svelte'
  import DocumentosUpload, { type DocumentoRequeridoFE, type ArchivoSubido } from '$lib/sarlaft/DocumentosUpload.svelte'
  import ComoSeDiligenciaModal from '$lib/sarlaft/ComoSeDiligenciaModal.svelte'
  import DerechosModal from '$lib/sarlaft/DerechosModal.svelte'
  import { getInstructivo, getInstructivoParaSeccion } from '$lib/sarlaft/instructivo'
  import type { DatosFormularios } from '$lib/sarlaft/load'

  interface Props {
    data: DatosFormularios
    /** Ruta base de esta instancia. Los goto() de seleccionar/cambiar tipo se
     *  quedan dentro de ella, de modo que cada link vive aislado. */
    basePath?: string
    /** Oculta todo enlace de vuelta al landing (logo, "Volver al sitio" y
     *  "Volver al inicio"). El documento termina en la confirmación. */
    standalone?: boolean
    /** Si viene, la pantalla selectora nunca se muestra: el formulario es
     *  siempre el de ese tipo. */
    tipoUnico?: TipoFormulario | null
    tituloSelector?: string
    introSelector?: string | null
  }

  let {
    data,
    basePath = '/formularios-sarlaft',
    standalone = false,
    tipoUnico = null,
    tituloSelector = 'Formularios de Conocimiento',
    introSelector = null
  }: Props = $props()

  // `data` solo siembra el valor inicial (hace falta para que el SSR pinte ya
  // el formulario); a partir de ahí manda el estado local, y el $effect de más
  // abajo lo re-sincroniza cuando cambia la URL.
  let formulario = $state<Formulario | null>(data.formulario)
  let tipoActual = $state<TipoFormulario | null>(data.tipoSeleccionado as TipoFormulario | null)
  let contacto = $state<ContactoPublicoAPI | null>(null)

  // Fases del flujo
  type Fase = 'intro' | 'wizard' | 'checklist' | 'done'
  let fase = $state<Fase>('intro')

  // Estado del formulario
  let respuestas = $state<Record<string, any>>({})
  let tablasRepetibles = $state<Record<string, Array<Record<string, any>>>>({})
  let archivos = $state<Record<string, ArchivoSubido | null>>({})
  let archivosErrors = $state<Record<string, string | null>>({})
  let documentosRequeridos = $state<DocumentoRequeridoFE[]>([])
  /** Indica si ya terminó la llamada al backend para cargar
   *  documentosRequeridos. Permite distinguir el estado "cargando"
   *  de "este formulario no requiere documentos" (caso Personal). */
  let documentosCargados = $state(false)
  let fieldErrors = $state<Record<string, string>>({})
  /** Set reactivo de nombres de secciones que tienen al menos un error.
   *  Se usa para pintar en rojo el dot correspondiente en el wizard. */
  let seccionesConErrorSet = $state<Set<string>>(new Set())
  const seccionesConError = new Set<string>()
  let submitting = $state(false)
  let submitResult = $state<SubmitResult | null>(null)
  let submitError = $state<string | null>(null)
  let submitErrorDetails = $state<string[] | null>(null)
  let currentStep = $state(0)

  // Modales
  let instructivoOpen = $state(false)
  let instructivoSeccionActiva = $state<string | null>(null)
  let comoSeDiligenciaOpen = $state(false)
  let derechosOpen = $state(false)

  /** Catálogo estático de contactos por tipo — usado en el selector para
   * que el usuario vea el canal de atención antes de elegir formulario. */
  const CONTACTOS: Record<TipoFormulario, { area: string; telefono: string; correo: string }> = {
    cliente_proveedor: { area: 'Operaciones', telefono: '+57 323 2340117', correo: 'compraproveedorestransmeralda@gmail.com' },
    accionistas: { area: 'Cumplimiento', telefono: '311 508 7120', correo: 'transmeraldasarlaft@gmail.com' },
    personal: { area: 'Talento Humano', telefono: '+57 323 2340117', correo: 'transmeraldasarlaft@gmail.com' },
    autorizacion_propietario: { area: 'Cumplimiento', telefono: '311 508 7120', correo: 'transmeraldasarlaft@gmail.com' }
  }

  /** Con `tipoUnico` no hay pantalla selectora: esta instancia sirve un solo
   *  formulario y "Diligenciar otro" reinicia ese mismo formulario. */
  const selectorHabilitado = $derived(!tipoUnico)

  $effect(() => {
    // Sincronizar con data cuando cambia la URL.
    // Importante: NO leer `formulario` aquí adentro para no crear
    // un ciclo de dependencia (escribimos y leemos el mismo state).
    const newFormulario = data.formulario
    formulario = newFormulario
    tipoActual = data.tipoSeleccionado as TipoFormulario | null
    if (newFormulario) {
      fase = 'intro'
    }
  })

  onMount(() => {
    inicializarTablas(formulario)
    // Con un tipo fijo el contacto no pasa por seleccionarTipo(), así que se
    // pide aquí para que la pantalla de confirmación tenga los datos del área.
    if (tipoUnico) cargarContacto(tipoUnico)
  })

  function inicializarTablas(f: Formulario | null) {
    if (!f) return
    for (const seccion of f.secciones) {
      if (seccion.tipo_bloque === 'tabla_repetible_multiple') {
        tablasRepetibles[seccion.seccion] = []
      }
    }
  }

  function cargarContacto(tipo: TipoFormulario) {
    sarlaftApi
      .obtenerContacto(tipo)
      .then((c) => (contacto = c))
      .catch(() => (contacto = null))
  }

  /** Deja el formulario en blanco, listo para diligenciarse de nuevo. */
  function resetEstado() {
    respuestas = {}
    tablasRepetibles = {}
    archivos = {}
    archivosErrors = {}
    fieldErrors = {}
    seccionesConError.clear()
    seccionesConErrorSet = new Set()
    submitResult = null
    submitError = null
    submitErrorDetails = null
    currentStep = 0
  }

  function seleccionarTipo(tipo: string) {
    tipoActual = tipo as TipoFormulario
    goto(`${basePath}?tipo=${tipo}`, { keepFocus: true, noScroll: true })
    // Cargar contacto en paralelo con el formulario
    cargarContacto(tipo as TipoFormulario)
    sarlaftApi.obtenerFormulario(
      data.formularios.find((f) => f.tipo === tipo)?.codigo ?? 'GC-FR-04'
    ).then((f) => {
      formulario = f
      resetEstado()
      inicializarTablas(f)
    })
  }

  function cambiarTipo() {
    // En una ruta de un solo formulario no hay a dónde volver: se reinicia
    // el mismo formulario desde el principio.
    if (tipoUnico) {
      resetEstado()
      inicializarTablas(formulario)
      fase = 'intro'
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    tipoActual = null
    formulario = null
    contacto = null
    goto(basePath, { keepFocus: true, noScroll: true })
  }

  function comenzarFormulario() {
    fase = 'wizard'
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function irAchecklist() {
    // Reset estado de carga de documentos antes de entrar a la fase
    documentosCargados = false
    // Cargar documentos requeridos al entrar a la fase de upload
    if (formulario) {
      const tipoCliente = respuestas['CLI-IG-01'] || null
      sarlaftApi
        .obtenerDocumentosRequeridos(formulario.codigo, tipoCliente)
        .then((data) => {
          documentosRequeridos = data.documentos.map((d) => ({
            id: d.id,
            nombre: d.nombre,
            descripcion: d.descripcion,
            obligatorio: d.obligatorio
          }))
        })
        .catch((err) => {
          submitError = `Error cargando documentos: ${err.message}`
        })
        .finally(() => {
          documentosCargados = true
        })
    } else {
      documentosCargados = true
    }
    fase = 'checklist'
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function volverAWizard() {
    fase = 'wizard'
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function abrirInstructivo(seccion?: string) {
    instructivoSeccionActiva = seccion ?? null
    instructivoOpen = true
  }

  // Determina si una sección es visible según la lógica condicional
  function esSeccionVisible(seccion: Seccion): boolean {
    if (!seccion.condicional) return true
    if (seccion.condicional.includes('Persona Natural')) {
      return respuestas['CLI-IG-01'] === 'Persona Natural'
    }
    if (seccion.condicional.includes('Persona Jurídica')) {
      return respuestas['CLI-IG-01'] === 'Persona Jurídica'
    }
    return true
  }

  function esPreguntaVisible(pregunta: Pregunta): boolean {
    // Regla declarativa que viene del backend (formularios nuevos).
    const cond = pregunta.condicional_pregunta
    if (cond) {
      const origen = respuestas[cond.id]
      if (cond.incluye != null) {
        return Array.isArray(origen) && origen.includes(cond.incluye)
      }
      if (cond.igual_a != null) {
        return origen === cond.igual_a
      }
    }

    const preguntaId = pregunta.id
    if (preguntaId.endsWith('-DEC-04-1') || preguntaId.endsWith('-DEC-04-2') ||
        preguntaId.endsWith('-DEC-04-3') || preguntaId.endsWith('-DEC-04-4') ||
        preguntaId === 'CLI-DEC-05') {
      const tipo = tipoActual
      let dec04Key = ''
      if (tipo === 'personal') dec04Key = 'PER-DEC-04'
      else if (tipo === 'accionistas') dec04Key = 'ACC-DEC-04'
      else if (tipo === 'cliente_proveedor') dec04Key = 'CLI-DEC-04'
      return respuestas[dec04Key] === 'Sí'
    }
    return true
  }

  /** Una respuesta cuenta como vacía si es null, string en blanco o arreglo
   *  sin elementos (caso `seleccion_multiple`). */
  function estaVacio(valor: unknown): boolean {
    if (valor == null) return true
    if (Array.isArray(valor)) return valor.length === 0
    if (typeof valor === 'string') return valor.trim() === ''
    return false
  }

  /**
   * Valida una sección específica y devuelve la lista de campos con error
   * (sin tocar el state global). Usado por la validación inline al cambiar
   * de paso y por la validación final antes de enviar.
   */
  function validarSeccion(seccion: Seccion): string[] {
    const errores: string[] = []

    if (seccion.tipo_bloque === 'tabla_repetible_multiple') {
      const filas = tablasRepetibles[seccion.seccion] ?? []
      const tieneObligatorios = seccion.preguntas.some((p) => p.obligatorio)
      if (filas.length === 0 && tieneObligatorios) {
        errores.push(`tabla-${seccion.seccion}`)
      }
      for (let i = 0; i < filas.length; i++) {
        for (const p of seccion.preguntas) {
          if (p.obligatorio && estaVacio(filas[i][p.id])) {
            errores.push(`${seccion.seccion}-${i}-${p.id}`)
          }
        }
      }
    } else {
      for (const p of seccion.preguntas) {
        if (!p.obligatorio) continue
        if (p.tipo_respuesta === 'declaracion_informativa') continue
        if (!esPreguntaVisible(p)) continue
        if (estaVacio(respuestas[p.id])) {
          errores.push(p.id)
        }
      }
    }

    return errores
  }

  /**
   * Valida TODAS las secciones y devuelve el set de IDs de sección con error.
   * Actualiza el state global fieldErrors para que los inputs muestren sus errores.
   */
  function validateAll(): { ok: boolean; seccionesConError: Set<string> } {
    const newErrors: Record<string, string> = {}
    const seccionesConError = new Set<string>()
    if (!formulario) return { ok: false, seccionesConError }

    for (const seccion of formulario.secciones) {
      if (!esSeccionVisible(seccion)) continue
      const errores = validarSeccion(seccion)
      for (const id of errores) newErrors[id] = 'Este campo es obligatorio.'
      if (errores.length > 0) seccionesConError.add(seccion.seccion)
    }

    fieldErrors = newErrors
    return { ok: Object.keys(newErrors).length === 0, seccionesConError }
  }

  /**
   * Wrapper para mantener compatibilidad con el código que llamaba a validate().
   * Devuelve solo el booleano.
   */
  function validate(): boolean {
    return validateAll().ok
  }

  /**
   * Valida SOLO la sección actualmente visible y, si tiene errores,
   * los muestra en el state, hace scroll al primer campo y bloquea el avance.
   */
  function validarSeccionActual(): boolean {
    if (!formulario || !seccionActual) return true
    const errores = validarSeccion(seccionActual)
    if (errores.length === 0) {
      // Limpia solo los errores de esta sección
      const cleaned = { ...fieldErrors }
      for (const id of Object.keys(cleaned)) {
        if (erroresActualesSeccion.has(id)) delete cleaned[id]
      }
      fieldErrors = cleaned
      // Quita la marca de error de esta sección
      seccionesConError.delete(seccionActual.seccion)
      seccionesConErrorSet = new Set(seccionesConError)
      submitError = null
      return true
    }
    // Mostrar errores solo de esta sección
    const newErrors: Record<string, string> = { ...fieldErrors }
    for (const id of errores) newErrors[id] = 'Este campo es obligatorio.'
    fieldErrors = newErrors
    seccionesConError.add(seccionActual.seccion)
    seccionesConErrorSet = new Set(seccionesConError)
    submitError = `Completa los ${errores.length} campo${errores.length === 1 ? '' : 's'} obligatorio${errores.length === 1 ? '' : 's'} de esta sección para continuar.`
    // Scroll al primer error después de que el DOM se actualice
    setTimeout(() => {
      const firstError = document.querySelector('.has-error, .tabla-repetible .fila')
      firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 60)
    return false
  }

  // Set de IDs que tienen error en la sección actual (para resaltarlos)
  const erroresActualesSeccion = $derived.by(() => {
    if (!seccionActual) return new Set<string>()
    return new Set(Object.keys(fieldErrors).filter((id) => {
      if (seccionActual.tipo_bloque === 'tabla_repetible_multiple') {
        return id.startsWith(`tabla-${seccionActual.seccion}`) || id.startsWith(`${seccionActual.seccion}-`)
      }
      return seccionActual.preguntas.some((p) => p.id === id)
    }))
  })

  function irAchecklistConValidacion() {
    const { ok, seccionesConError: set } = validateAll()
    seccionesConErrorSet = new Set(set)
    if (!ok) {
      submitError = 'Por favor completa todos los campos obligatorios antes de enviar.'
      // Saltar a la primera sección con error
      if (formulario) {
        const firstErrSection = formulario.secciones.find(
          (s) => esSeccionVisible(s) && set.has(s.seccion)
        )
        if (firstErrSection) {
          const idx = formulario.secciones.filter(esSeccionVisible).findIndex(
            (s) => s.seccion === firstErrSection.seccion
          )
          if (idx >= 0) {
            currentStep = idx
          }
        }
      }
      setTimeout(() => {
        const firstError = document.querySelector('.has-error, .tabla-repetible .fila')
        firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 80)
      return
    }
    submitError = null
    irAchecklist()
  }

  function validarDocumentos(): boolean {
    // Si el tipo de formulario no requiere documentos adjuntos,
    // no hay nada que validar — el usuario puede enviar con solo
    // sus respuestas.
    if (documentosRequeridos.length === 0) return true
    // Solo se bloquea el envío por documentos marcados como obligatorios.
    // Los opcionales pueden omitirse sin problema.
    const docsObligatorios = documentosRequeridos.filter(
      (d) => d.obligatorio !== false
    )
    if (docsObligatorios.length === 0) return true
    const faltantes: string[] = []
    for (const doc of docsObligatorios) {
      if (!archivos[doc.id]) {
        faltantes.push(doc.nombre)
        continue
      }
      if (archivosErrors[doc.id]) {
        return false
      }
    }
    return faltantes.length === 0
  }

  /**
   * Fecha de diligenciamiento a enviar al backend (formato YYYY-MM-DD).
   * No se puede asumir que sea la primera pregunta del formulario: en
   * SLFT-PTEE-FR-12 el primer campo es la ciudad. Se busca la primera
   * pregunta de tipo `fecha` cuyo valor tenga el formato esperado.
   */
  function obtenerFechaDiligenciamiento(): string | undefined {
    if (!formulario) return undefined
    for (const seccion of formulario.secciones) {
      for (const p of seccion.preguntas) {
        if (p.tipo_respuesta !== 'fecha') continue
        const v = respuestas[p.id]
        if (typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v)) return v
      }
    }
    return undefined
  }

  async function handleSubmit() {
    if (!formulario) return
    submitError = null
    submitErrorDetails = null

    // Validar documentos subidos
    if (!validarDocumentos()) {
      submitError = 'Faltan documentos obligatorios o algún archivo tiene un formato no permitido.'
      setTimeout(() => {
        const firstError = document.querySelector('.doc-slot.has-error, .doc-slot:not(.has-file)')
        firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 50)
      return
    }

    submitting = true

    // Construir payload
    const payload: Record<string, any> = { ...respuestas }
    for (const seccion of formulario.secciones) {
      if (seccion.tipo_bloque === 'tabla_repetible_multiple') {
        const filas = tablasRepetibles[seccion.seccion] ?? []
        const key = seccion.key_tabla ?? `${seccion.preguntas[0]?.id.split('-').slice(0, -1).join('-')}__rows`
        payload[key] = filas
      }
    }

    // Construir mapa de archivos para el API
    const archivosMap: Record<string, File> = {}
    for (const doc of documentosRequeridos) {
      const a = archivos[doc.id]
      if (a?.file) archivosMap[doc.id] = a.file
    }

    try {
      const result = await sarlaftApi.submit({
        codigo_formulario: formulario.codigo,
        fecha_diligenciamiento: obtenerFechaDiligenciamiento(),
        respuestas: payload,
        archivos: archivosMap
      })
      submitResult = result
      fase = 'done'
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err: any) {
      submitError = err.message || 'Error al enviar el formulario'
      submitErrorDetails = err.details || null
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } finally {
      submitting = false
    }
  }

  // Progreso del wizard
  const totalSteps = $derived(formulario?.secciones.filter(esSeccionVisible).length ?? 0)
  const progress = $derived(totalSteps > 0 ? Math.min(((currentStep + 1) / totalSteps) * 100, 100) : 0)
  const seccionActual = $derived(formulario?.secciones.filter(esSeccionVisible)[currentStep] ?? null)
  const esUltima = $derived(currentStep === totalSteps - 1)
  /** Instructivo del formato que se está diligenciando. */
  const instructivo = $derived(getInstructivo(formulario?.codigo))
  const instructivoSecciones = $derived(
    seccionActual ? getInstructivoParaSeccion(seccionActual.seccion, formulario?.codigo) : []
  )

  function next() {
    // Validar la sección actual antes de avanzar.
    if (!validarSeccionActual()) return
    if (currentStep < totalSteps - 1) currentStep++
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function prev() {
    if (currentStep > 0) currentStep--
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function getFieldValue(seccionKey: string, preguntaId: string, rowIndex?: number) {
    if (rowIndex !== undefined) {
      return tablasRepetibles[seccionKey]?.[rowIndex]?.[preguntaId]
    }
    return respuestas[preguntaId]
  }

  function setFieldValue(seccionKey: string, preguntaId: string, value: any, rowIndex?: number) {
    if (rowIndex !== undefined) {
      const filas = tablasRepetibles[seccionKey] ?? []
      const copia = [...filas]
      copia[rowIndex] = { ...copia[rowIndex], [preguntaId]: value }
      tablasRepetibles[seccionKey] = copia
    } else {
      respuestas = { ...respuestas, [preguntaId]: value }
    }
  }
</script>

<svelte:head>
  <title>
    {formulario ? `${formulario.titulo} | TRANSMERALDA S.A.S.` : `${tituloSelector} | TRANSMERALDA S.A.S.`}
  </title>
  <meta
    name="description"
    content="Formularios de conocimiento SARLAFT + PTEE de TRANSMERALDA S.A.S. Cumplimiento Resolución 2328 de 2025 y Resolución 14673 de 2025."
  />
  <meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="sarlaft-page" in:fade={{ duration: 300 }}>
  <!-- Header -->
  <header class="page-header">
    <div class="header-inner">
      {#snippet logo()}
        <img
          src="/assets/logo_transmeralda-264.avif"
          srcset="/assets/logo_transmeralda-132.avif 132w, /assets/logo_transmeralda-264.avif 264w, /assets/logo_transmeralda-528.avif 528w"
          sizes="40px"
          alt="Transmeralda S.A.S."
          width="132"
          height="40"
          class="brand-logo"
        />
      {/snippet}

      <!-- En modo standalone el documento no ofrece salida al sitio: el
           formulario es el único contenido de la página. -->
      {#if standalone}
        <div class="brand">{@render logo()}</div>
      {:else}
        <a href="/" class="brand">{@render logo()}</a>
        <a href="/" class="back-link">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Volver al sitio
        </a>
      {/if}
    </div>
  </header>

  {#if selectorHabilitado && (!tipoActual || !formulario)}
    <!-- ═══ PANTALLA 1: Selector de tipo ═══ -->
    <main class="selector" in:fly={{ y: 20, duration: 500, easing: quintOut }}>
      <div class="selector-intro">
        <span class="eyebrow">Sistema SARLAFT + PTEE</span>
        <h1>{tituloSelector}</h1>
        <p>
          {#if introSelector}
            {introSelector}
          {:else}
            En cumplimiento de la <strong>Resolución 2328 de 2025</strong> y la
            <strong>Resolución 14673 de 2025</strong>, TRANSMERALDA S.A.S. requiere
            que completes el formulario correspondiente a tu rol.
          {/if}
        </p>
      </div>

      {#if data.loadError}
        <div class="alert alert-error">
          <strong>Error de conexión.</strong> No pudimos cargar los formularios.
        </div>
      {/if}

      <div class="cards-grid">
        {#each data.formularios as f}
          <button
            class="tipo-card"
            onclick={() => seleccionarTipo(f.tipo)}
            in:fly={{ y: 20, duration: 400, delay: 100 }}
          >
            <div class="card-icon">
              {#if f.tipo === 'cliente_proveedor'}
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36c-.263 0-.41-.296-.247-.482l8.246-9.5a.75.75 0 01.494-.268h6.294a.75.75 0 01.494.268l8.246 9.5c.163.186.016.482-.247.482H17.25M6 12h.008v.008H6V12zm2.25-3.75h.008v.008H8.25V8.25zm0 3.75h.008v.008H8.25V12zm0 3.75h.008v.008H8.25V15.75zM12 6.75h.008v.008H12V6.75zm0 3.75h.008v.008H12V10.5zm0 3.75h.008v.008H12V14.25zm3-6.75h.008v.008H15V8.25zm0 3.75h.008v.008H15V12zm0 3.75h.008v.008H15V15.75z" />
                </svg>
              {:else if f.tipo === 'accionistas'}
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
              {:else}
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              {/if}
            </div>
            <div class="card-content">
              <div class="card-tag">{f.codigo} · v{f.version}</div>
              <h3>{f.titulo.replace(/^Formulario /i, '').replace(' SARLAFT + PTEE', '')}</h3>
              <p>
                {#if f.tipo === 'cliente_proveedor'}
                  Personas naturales o jurídicas que contratan servicios de transporte.
                {:else if f.tipo === 'accionistas'}
                  Socios o accionistas. Incluye composición accionaria y beneficiario final.
                {:else}
                  Candidatos a vincularse como empleados de la empresa.
                {/if}
              </p>
              <div class="card-meta">
                <span><strong>{f.total_secciones}</strong> secciones</span>
                <span class="dot">·</span>
                <span><strong>{f.total_preguntas}</strong> preguntas</span>
              </div>
              <div class="card-contacto">
                <span class="contacto-eyebrow">Notificación a</span>
                <span class="contacto-line"><strong>{CONTACTOS[f.tipo as TipoFormulario].area}</strong></span>
                <span class="contacto-line">{CONTACTOS[f.tipo as TipoFormulario].correo}</span>
              </div>
            </div>
            <div class="card-cta">
              <span>Comenzar</span>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </div>
          </button>
        {/each}
      </div>

      <aside class="marco">
        <h4>Marco normativo</h4>
        <ul>
          {#each data.marco_normativo as norma}
            <li>{norma}</li>
          {/each}
        </ul>
        <p class="marco-nota">
          Tus datos personales serán tratados conforme a la <strong>Ley 1581 de 2012</strong> y el
          <strong>Decreto 1377 de 2013</strong>. Solo el Oficial de Cumplimiento de TRANSMERALDA
          S.A.S. tendrá acceso a la información.
        </p>
      </aside>
    </main>
  {:else if submitResult && fase === 'done'}
    <!-- ═══ PANTALLA: Confirmación de envío ═══ -->
    <main class="confirm" in:fly={{ y: 20, duration: 500, easing: quintOut }}>
      <div class="confirm-card">
        <div class="confirm-icon">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1>Formulario recibido</h1>
        <p class="confirm-msg">{submitResult.mensaje}</p>

        <dl class="confirm-data">
          <div>
            <dt>Radicado</dt>
            <dd class="radicado">{submitResult.radicado}</dd>
          </div>
          <div>
            <dt>Tipo de formulario</dt>
            <dd>{submitResult.codigo_formulario}</dd>
          </div>
          <div>
            <dt>Fecha de envío</dt>
            <dd>{new Date(submitResult.fecha_envio).toLocaleString('es-CO', { timeZone: 'America/Bogota', dateStyle: 'long', timeStyle: 'short' })}</dd>
          </div>
          {#if submitResult.nombre_completo}
            <div>
              <dt>Titular</dt>
              <dd>{submitResult.nombre_completo}</dd>
            </div>
          {/if}
        </dl>

        <div class="confirm-next">
          <p>
            <strong>Notificación enviada a:</strong> el área de {contacto?.area_responsable ?? 'Cumplimiento'} recibió un correo con tu formulario, el PDF de respuestas y los archivos adjuntos. El número de radicado
            <span class="radicado-inline">{submitResult.radicado}</span> te permite consultar el estado en cualquier momento.
          </p>
        </div>

        {#if contacto}
          <aside class="confirm-contacto">
            <header>
              <span class="eyebrow">¿Dudas o necesitas más información?</span>
            </header>
            <div class="contacto-grid">
              <a class="contacto-chip" href={contacto.telefono_tel} aria-label="Llamar al área de {contacto.area_responsable}">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
                <div>
                  <span class="chip-label">Teléfono</span>
                  <span class="chip-value">{contacto.telefono_principal}</span>
                </div>
              </a>
              <a class="contacto-chip" href={contacto.telefono_wa} target="_blank" rel="noopener noreferrer" aria-label="Contactar por WhatsApp">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M20.52 3.48A11.93 11.93 0 0012 0C5.37 0 0 5.37 0 12a11.94 11.94 0 001.64 6L0 24l6.18-1.62A11.93 11.93 0 0012 24c6.63 0 12-5.37 12-12 0-3.19-1.24-6.19-3.48-8.52zM12 22a9.94 9.94 0 01-5.07-1.39l-.36-.21-3.67.96.98-3.58-.23-.37A9.94 9.94 0 0112 22zm5.51-7.46c-.3-.15-1.78-.88-2.05-.98s-.47-.15-.67.15-.77.98-.95 1.18-.35.22-.65.07a8.18 8.18 0 01-2.41-1.49 9.06 9.06 0 01-1.67-2.08c-.17-.3 0-.46.13-.61s.3-.35.45-.52.2-.3.3-.5.05-.37-.02-.52-.67-1.62-.92-2.22-.49-.51-.67-.52H7.43a1.16 1.16 0 00-.85.4 3.55 3.55 0 00-1.1 2.64c0 1.55 1.13 3.05 1.29 3.27s2.22 3.4 5.4 4.77a18.5 18.5 0 001.8.67 4.34 4.34 0 002 .13 3.27 3.27 0 002.15-1.52 2.66 2.66 0 00.19-1.52c-.08-.13-.28-.21-.58-.36z" />
                </svg>
                <div>
                  <span class="chip-label">WhatsApp</span>
                  <span class="chip-value">{contacto.telefono_principal}</span>
                </div>
              </a>
              <a class="contacto-chip" href={contacto.correo_mailto} aria-label="Enviar correo al área">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
                <div>
                  <span class="chip-label">Correo</span>
                  <span class="chip-value">{contacto.correo_publico}</span>
                </div>
              </a>
            </div>
          </aside>
        {/if}

        <div class="confirm-actions">
          <button class="btn-secondary" onclick={cambiarTipo}>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            {tipoUnico ? 'Diligenciar otro registro' : 'Diligenciar otro formulario'}
          </button>
          <!-- En modo standalone la confirmación es el fin del documento:
               no se ofrece salida al landing. -->
          {#if !standalone}
            <a href="/" class="btn-primary">
              Volver al inicio
            </a>
          {/if}
        </div>

        {#if standalone}
          <p class="confirm-fin">
            Fin del documento. Puedes cerrar esta ventana; conserva el número de
            radicado para cualquier consulta.
          </p>
        {/if}
      </div>
    </main>
  {:else if fase === 'intro' && formulario}
    <!-- ═══ PANTALLA 2: Intro del instructivo antes del wizard ═══ -->
    <main class="intro" in:fly={{ y: 20, duration: 500, easing: quintOut }}>
      {#if selectorHabilitado}
        <button class="back-btn" onclick={cambiarTipo}>
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Cambiar tipo de formulario
        </button>
      {/if}

      <header class="intro-head">
        <span class="intro-code">{formulario.codigo} · v{formulario.version}</span>
        <h1>{formulario.titulo}</h1>
        <p>
          Antes de comenzar, revisa el instructivo de diligenciamiento y el glosario de términos.
          Te llevará <strong>unos 10-15 minutos</strong> completar el formulario.
        </p>
      </header>

      <!-- Cada formato trae su propio instructivo y glosario; ver
           `getInstructivo` en $lib/sarlaft/instructivo. -->
      <div class="intro-grid">
        <button class="intro-card" onclick={() => abrirInstructivo()}>
          <div class="card-num">01</div>
          <div class="card-body">
            <h3>Ver instructivo completo</h3>
            <p>Secciones, responsables, indicaciones paso a paso, glosario y documentos a anexar.</p>
            <span class="card-link">Abrir instructivo
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </span>
          </div>
        </button>

        <button class="intro-card" onclick={() => (comoSeDiligenciaOpen = true)}>
          <div class="card-num">02</div>
          <div class="card-body">
            <h3>Cómo se diligencia</h3>
            <p>{formulario.total_secciones} secciones · {formulario.total_preguntas} preguntas. Firma digital al final, y un checklist de documentos a anexar antes de enviar.</p>
            <span class="card-link">Ver el paso a paso
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </span>
          </div>
        </button>

        <button class="intro-card" onclick={() => (derechosOpen = true)}>
          <div class="card-num">03</div>
          <div class="card-body">
            <h3>Tus derechos</h3>
            <p>Conforme a la Ley 1581 de 2012: conocer, actualizar, rectificar y revocar la autorización sobre tus datos personales.</p>
            <span class="card-link">Ver derechos ARCO
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </span>
          </div>
        </button>
      </div>

      <div class="intro-cta">
        <button class="btn-secondary" onclick={() => (comoSeDiligenciaOpen = true)}>
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
          </svg>
          ¿Cómo se diligencia?
        </button>
        <button class="btn-primary" onclick={comenzarFormulario}>
          Comenzar a diligenciar
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </button>
      </div>
    </main>
  {:else if fase === 'wizard' && formulario}
    <!-- ═══ PANTALLA 3: Wizard del formulario ═══ -->
    <main class="wizard" in:fly={{ y: 20, duration: 500, easing: quintOut }}>
      <div class="wizard-header">
        <button class="back-btn" onclick={() => (fase = 'intro')}>
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Volver al instructivo
        </button>
        <div class="wizard-title">
          <span class="wizard-code">{formulario.codigo} · v{formulario.version}</span>
          <h1>{formulario.titulo}</h1>
        </div>
        <div class="wizard-progress">
          <div class="progress-info">
            <span>Sección {currentStep + 1} de {totalSteps}</span>
            <span class="progress-pct">{Math.round(progress)}%</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" style="width: {progress}%"></div>
          </div>
        </div>
      </div>

      {#if submitError}
        <div class="alert alert-error" in:fly={{ y: -10, duration: 300 }}>
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          <div>
            <strong>{submitError}</strong>
            {#if submitErrorDetails && Array.isArray(submitErrorDetails) && submitErrorDetails.length > 0}
              <ul class="error-list">
                {#each submitErrorDetails.slice(0, 5) as detail}
                  <li>{detail}</li>
                {/each}
                {#if submitErrorDetails.length > 5}
                  <li>... y {submitErrorDetails.length - 5} más.</li>
                {/if}
              </ul>
            {/if}
          </div>
        </div>
      {/if}

      {#if seccionActual}
        {#key currentStep}
        <div class="section-wrapper" in:fly={{ y: 20, duration: 350, easing: quintOut }}>
          {#if erroresActualesSeccion.size > 0}
            <div class="section-error-banner" in:fly={{ y: -8, duration: 250 }}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
              <div>
                <strong>
                  Tienes {erroresActualesSeccion.size} campo{erroresActualesSeccion.size === 1 ? '' : 's'} obligatorio{erroresActualesSeccion.size === 1 ? '' : 's'} pendiente{erroresActualesSeccion.size === 1 ? '' : 's'} en esta sección.
                </strong>
                <p>Complétalos para pasar a la siguiente sección.</p>
              </div>
            </div>
          {/if}
          {#if seccionActual.tipo_bloque === 'tabla_repetible_multiple'}
            <div class="full">
              <div class="seccion-help-header">
                <button class="help-btn" onclick={() => abrirInstructivo(seccionActual.seccion)}>
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                  </svg>
                  Cómo diligenciar esta sección
                </button>
              </div>
              <TablaRepetible
                seccion={seccionActual}
                rows={tablasRepetibles[seccionActual.seccion] ?? []}
                onChange={(rows) => (tablasRepetibles[seccionActual.seccion] = rows)}
                errors={fieldErrors}
              />
            </div>
          {:else}
            <div class="full">
              <div class="seccion-help-header">
                <h2 class="seccion-title">{seccionActual.seccion}</h2>
                {#if instructivoSecciones.length > 0}
                  <button class="help-btn" onclick={() => abrirInstructivo(instructivoSecciones[0].seccion)}>
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                    </svg>
                    Ver indicaciones
                  </button>
                {/if}
              </div>

              {#if seccionActual.nota}
                <p class="seccion-nota">{seccionActual.nota}</p>
              {/if}

              {#if instructivoSecciones.length > 0}
                <aside class="instructivo-hint">
                  <span class="hint-label">Instructivo</span>
                  <ul>
                    {#each instructivoSecciones as ins}
                      {#each ins.indicaciones as indicacion}
                        <li>{indicacion}</li>
                      {/each}
                    {/each}
                  </ul>
                  <button class="hint-more" onclick={() => abrirInstructivo(instructivoSecciones[0].seccion)}>
                    Ver instructivo completo
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </button>
                </aside>
              {/if}

              <div class="section-fields">
                {#each seccionActual.preguntas as pregunta (pregunta.id)}
                  {#if esPreguntaVisible(pregunta)}
                    <div class:full={pregunta.tipo_respuesta === 'declaracion_informativa' || pregunta.tipo_respuesta === 'firma' || pregunta.tipo_respuesta === 'texto_largo'}>
                      <FormField
                        {pregunta}
                        value={getFieldValue(seccionActual.seccion, pregunta.id)}
                        onChange={(v) => setFieldValue(seccionActual.seccion, pregunta.id, v)}
                        error={fieldErrors[pregunta.id]}
                      />
                    </div>
                  {/if}
                {/each}
              </div>
            </div>
          {/if}
        </div>
        {/key}
      {/if}

      <!-- Wizard footer -->
      <div class="wizard-footer">
        <button class="btn-secondary" onclick={prev} disabled={currentStep === 0}>
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Anterior
        </button>
        <div class="step-dots">
          {#each formulario.secciones.filter(esSeccionVisible) as seccion, i}
            <button
              class="dot"
              class:active={i === currentStep}
              class:done={i < currentStep}
              class:has-error={seccionesConErrorSet.has(seccion.seccion)}
              onclick={() => (currentStep = i)}
              aria-label="Ir a sección {i + 1}"
            ></button>
          {/each}
        </div>
        {#if esUltima}
          <button class="btn-primary" onclick={irAchecklistConValidacion}>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Revisar y enviar
          </button>
        {:else}
          <button class="btn-primary" onclick={next}>
            Siguiente
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        {/if}
      </div>
    </main>
  {:else if fase === 'checklist' && formulario && tipoActual}
    <!-- ═══ PANTALLA 4: Subida de documentos ═══ -->
    <main class="wizard" in:fly={{ y: 20, duration: 500, easing: quintOut }}>
      <div class="wizard-header">
        <button class="back-btn" onclick={volverAWizard}>
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Volver al formulario
        </button>
        <div class="wizard-title">
          <span class="wizard-code">Paso final</span>
          <h1>Adjuntar documentos</h1>
        </div>
        <div class="wizard-progress">
          <div class="progress-info">
            <span>Listo para enviar</span>
            <span class="progress-pct">100%</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" style="width: 100%"></div>
          </div>
        </div>
      </div>

      {#if submitError}
        <div class="alert alert-error" in:fly={{ y: -10, duration: 300 }}>
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          <div>
            <strong>{submitError}</strong>
          </div>
        </div>
      {/if}

      {#if !documentosCargados}
        <div class="loading-state">
          <div class="loading-spinner"></div>
          <p>Cargando documentos requeridos...</p>
        </div>
      {:else if formulario.tipo === 'personal'}
        <!-- Formulario de Vinculación de Personal: solo RUT y Cédula son
             obligatorios; los demás se muestran como opcionales. -->
        <aside class="no-docs-hint-panel">
          <span class="no-docs-eyebrow">Vinculación de Personal</span>
          <p>
            Para este formulario solo es obligatorio adjuntar la
            <strong>Cédula de ciudadanía</strong> y el <strong>RUT actualizado</strong>.
            Los demás documentos (Certificado de existencia y Composición accionaria)
            son opcionales — el Oficial de Cumplimiento podrá solicitarlos
            después si los requiere.
          </p>
        </aside>

        <DocumentosUpload
          documentos={documentosRequeridos}
          archivos={archivos}
          errors={archivosErrors}
          onChange={(a) => (archivos = a)}
          onError={(e) => (archivosErrors = e)}
        />

        <div class="wizard-footer">
          <button class="btn-secondary" onclick={volverAWizard}>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Volver
          </button>
          <button class="btn-primary" onclick={handleSubmit} disabled={submitting}>
            {#if submitting}
              <svg class="spin" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" opacity="0.25" />
                <path d="M4 12a8 8 0 018-8v0" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
              </svg>
              Enviando...
            {:else}
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
              Enviar formulario
            {/if}
          </button>
        </div>
      {:else}
        <DocumentosUpload
          documentos={documentosRequeridos}
          archivos={archivos}
          errors={archivosErrors}
          onChange={(a) => (archivos = a)}
          onError={(e) => (archivosErrors = e)}
        />

        <div class="wizard-footer">
          <button class="btn-secondary" onclick={volverAWizard}>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Volver
          </button>
          <button class="btn-primary" onclick={handleSubmit} disabled={submitting}>
            {#if submitting}
              <svg class="spin" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" opacity="0.25" />
                <path d="M4 12a8 8 0 018-8v0" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
              </svg>
              Enviando...
            {:else}
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
              Enviar formulario
            {/if}
          </button>
        </div>
      {/if}
    </main>
  {:else}
    <!-- Sin selector y sin formulario: el backend no respondió. -->
    <main class="selector" in:fly={{ y: 20, duration: 500, easing: quintOut }}>
      <div class="selector-intro">
        <span class="eyebrow">Sistema SARLAFT + PTEE</span>
        <h1>{tituloSelector}</h1>
      </div>
      <div class="alert alert-error">
        <strong>Error de conexión.</strong> No pudimos cargar el formulario en este
        momento. Recarga la página en unos minutos o comunícate con nosotros al
        <strong>{CONTACTOS[(tipoUnico ?? 'cliente_proveedor') as TipoFormulario].correo}</strong>.
      </div>
    </main>
  {/if}
</div>

<InstructivoModal
  open={instructivoOpen}
  onClose={() => (instructivoOpen = false)}
  seccionActiva={instructivoSeccionActiva}
  {instructivo}
/>

<ComoSeDiligenciaModal
  open={comoSeDiligenciaOpen}
  onClose={() => (comoSeDiligenciaOpen = false)}
  formulario={formulario}
  {instructivo}
/>

<DerechosModal
  open={derechosOpen}
  onClose={() => (derechosOpen = false)}
/>

<style>
  .sarlaft-page {
    min-height: 100vh;
    background: #FAF7F2;
    font-family: 'Inter Tight', system-ui, sans-serif;
    color: #1A1A1A;
  }

  /* HEADER */
  .page-header {
    background: white;
    border-bottom: 1px solid rgba(0, 0, 0, 0.08);
    position: sticky;
    top: 0;
    z-index: 10;
  }
  .header-inner {
    max-width: 1100px;
    margin: 0 auto;
    padding: 0.85rem 1.25rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .brand {
    display: inline-flex;
    align-items: center;
    text-decoration: none;
    line-height: 0;
  }
  .brand-logo {
    height: 36px;
    width: auto;
    display: block;
  }
  .back-link {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    color: #6B6B6B;
    text-decoration: none;
    font-size: 0.8rem;
    font-weight: 500;
    transition: color 0.2s;
  }
  .back-link:hover {
    color: #10B981;
  }
  .back-link svg {
    width: 14px;
    height: 14px;
  }

  /* SELECTOR */
  .selector {
    max-width: 1100px;
    margin: 0 auto;
    padding: 3rem 1.25rem 4rem;
  }
  .selector-intro {
    text-align: center;
    margin-bottom: 2.5rem;
  }
  .eyebrow {
    display: inline-block;
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: #10B981;
    background: rgba(16, 185, 129, 0.08);
    padding: 0.3rem 0.75rem;
    border-radius: 6px;
    margin-bottom: 1rem;
    font-family: 'JetBrains Mono', monospace;
  }
  .selector-intro h1 {
    font-family: 'Fraunces', Georgia, serif;
    font-size: clamp(2rem, 5vw, 2.85rem);
    font-weight: 400;
    line-height: 1.15;
    color: #0F1F1A;
    margin: 0 0 1rem;
  }
  .selector-intro p {
    font-size: 1rem;
    line-height: 1.6;
    color: #4A4A4A;
    max-width: 640px;
    margin: 0 auto;
  }
  .cards-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.25rem;
    margin-bottom: 3rem;
  }
  @media (min-width: 768px) {
    .cards-grid { grid-template-columns: repeat(3, 1fr); }
  }
  .tipo-card {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
    background: white;
    border: 1px solid rgba(0, 0, 0, 0.08);
    border-radius: 20px;
    padding: 1.5rem;
    cursor: pointer;
    text-align: left;
    transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    font-family: inherit;
    color: inherit;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.04);
  }
  .tipo-card:hover {
    transform: translateY(-4px);
    border-color: rgba(16, 185, 129, 0.3);
    box-shadow: 0 12px 32px rgba(16, 185, 129, 0.12);
  }
  .card-icon {
    width: 48px;
    height: 48px;
    border-radius: 14px;
    background: linear-gradient(135deg, #10B981, #059669);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    box-shadow: 0 4px 16px rgba(16, 185, 129, 0.3);
  }
  .card-icon svg {
    width: 24px;
    height: 24px;
  }
  .card-content {
    flex: 1;
    width: 100%;
  }
  .card-tag {
    font-size: 0.7rem;
    font-weight: 700;
    color: #10B981;
    font-family: 'JetBrains Mono', monospace;
    letter-spacing: 0.05em;
    margin-bottom: 0.4rem;
  }
  .card-content h3 {
    font-size: 1.15rem;
    font-weight: 700;
    color: #0F1F1A;
    margin: 0 0 0.5rem;
    line-height: 1.3;
  }
  .card-content p {
    font-size: 0.85rem;
    line-height: 1.55;
    color: #4A4A4A;
    margin: 0 0 0.85rem;
  }
  .card-meta {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.75rem;
    color: #6B6B6B;
  }
  .card-meta strong {
    color: #0F1F1A;
    font-weight: 700;
  }
  .card-contacto {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    padding: 0.7rem 0.85rem;
    background: rgba(16, 185, 129, 0.06);
    border: 1px solid rgba(16, 185, 129, 0.18);
    border-radius: 10px;
    margin-top: 0.5rem;
    width: 100%;
  }
  .contacto-eyebrow {
    font-size: 0.65rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #10B981;
    font-family: 'JetBrains Mono', monospace;
  }
  .contacto-line {
    font-size: 0.78rem;
    color: #065F46;
    line-height: 1.4;
    word-break: break-all;
  }
  .contacto-line strong { color: #064E3B; }
  .dot {
    color: #9A9A9A;
  }
  .card-cta {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    color: #10B981;
    font-size: 0.85rem;
    font-weight: 600;
    margin-top: 0.4rem;
    transition: gap 0.2s;
  }
  .tipo-card:hover .card-cta {
    gap: 0.7rem;
  }
  .card-cta svg {
    width: 16px;
    height: 16px;
  }

  .marco {
    background: white;
    border-radius: 16px;
    padding: 1.5rem;
    border: 1px solid rgba(0, 0, 0, 0.06);
  }
  .marco h4 {
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #6B6B6B;
    margin: 0 0 0.85rem;
    font-family: 'JetBrains Mono', monospace;
  }
  .marco ul {
    list-style: none;
    padding: 0;
    margin: 0 0 1rem;
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  .marco li {
    background: rgba(16, 185, 129, 0.06);
    color: #065F46;
    padding: 0.3rem 0.7rem;
    border-radius: 6px;
    font-size: 0.78rem;
    font-weight: 600;
  }
  .marco-nota {
    font-size: 0.78rem;
    line-height: 1.55;
    color: #4A4A4A;
    margin: 0;
  }

  /* INTRO (PANTALLA 2) */
  .intro {
    max-width: 1000px;
    margin: 0 auto;
    padding: 2rem 1.25rem 3rem;
  }
  .intro-head {
    text-align: center;
    margin: 1.5rem 0 2rem;
  }
  .intro-code {
    display: inline-block;
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #10B981;
    background: rgba(16, 185, 129, 0.08);
    padding: 0.25rem 0.6rem;
    border-radius: 5px;
    margin-bottom: 0.6rem;
    font-family: 'JetBrains Mono', monospace;
  }
  .intro-head h1 {
    font-family: 'Fraunces', Georgia, serif;
    font-size: clamp(1.65rem, 4vw, 2.25rem);
    font-weight: 400;
    color: #0F1F1A;
    margin: 0 0 0.75rem;
    line-height: 1.2;
  }
  .intro-head p {
    font-size: 0.95rem;
    line-height: 1.6;
    color: #4A4A4A;
    max-width: 580px;
    margin: 0 auto;
  }
  .intro-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
    margin-bottom: 2rem;
  }
  @media (min-width: 768px) {
    .intro-grid { grid-template-columns: repeat(3, 1fr); }
  }
  .intro-card {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
    background: white;
    border: 1px solid rgba(0, 0, 0, 0.08);
    border-radius: 20px;
    padding: 1.5rem;
    cursor: pointer;
    text-align: left;
    transition: all 0.3s;
    font-family: inherit;
    color: inherit;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.04);
  }
  .intro-card:hover {
    transform: translateY(-3px);
    border-color: rgba(16, 185, 129, 0.3);
    box-shadow: 0 8px 24px rgba(16, 185, 129, 0.12);
  }
  .card-num {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: rgba(16, 185, 129, 0.08);
    color: #065F46;
    font-size: 0.75rem;
    font-weight: 700;
    font-family: 'JetBrains Mono', monospace;
  }
  .card-body {
    flex: 1;
  }
  .card-body h3 {
    font-size: 1rem;
    font-weight: 700;
    color: #0F1F1A;
    margin: 0 0 0.4rem;
  }
  .card-body p {
    font-size: 0.82rem;
    line-height: 1.55;
    color: #4A4A4A;
    margin: 0 0 1rem;
  }
  .card-link {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    color: #10B981;
    font-size: 0.82rem;
    font-weight: 600;
    transition: gap 0.2s;
  }
  .intro-card:hover .card-link {
    gap: 0.5rem;
  }
  .card-link svg {
    width: 14px;
    height: 14px;
  }
  .intro-cta {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
  }

  /* CONFIRM */
  .confirm {
    max-width: 640px;
    margin: 0 auto;
    padding: 3rem 1.25rem 4rem;
  }
  .confirm-card {
    background: white;
    border-radius: 24px;
    padding: 2.5rem 2rem;
    text-align: center;
    border: 1px solid rgba(0, 0, 0, 0.06);
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.04);
  }
  .confirm-icon {
    width: 72px;
    height: 72px;
    border-radius: 50%;
    background: linear-gradient(135deg, #10B981, #059669);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1.5rem;
    box-shadow: 0 8px 24px rgba(16, 185, 129, 0.3);
  }
  .confirm-icon svg {
    width: 36px;
    height: 36px;
  }
  .confirm-card h1 {
    font-family: 'Fraunces', Georgia, serif;
    font-size: 2rem;
    font-weight: 500;
    color: #0F1F1A;
    margin: 0 0 0.75rem;
  }
  .confirm-msg {
    font-size: 0.95rem;
    line-height: 1.6;
    color: #4A4A4A;
    margin: 0 0 2rem;
  }
  .confirm-data {
    background: #FAF7F2;
    border-radius: 12px;
    padding: 1.25rem;
    text-align: left;
    margin-bottom: 1.5rem;
  }
  .confirm-data > div {
    display: flex;
    flex-direction: column;
    padding: 0.5rem 0;
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  }
  .confirm-data > div:last-child { border-bottom: none; }
  .confirm-data dt {
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #6B6B6B;
    font-family: 'JetBrains Mono', monospace;
  }
  .confirm-data dd {
    margin: 0.25rem 0 0;
    font-size: 0.95rem;
    color: #0F1F1A;
    font-weight: 500;
  }
  .radicado {
    font-family: 'JetBrains Mono', monospace !important;
    color: #10B981 !important;
    font-weight: 700 !important;
  }
  .radicado-inline {
    font-family: 'JetBrains Mono', monospace;
    background: rgba(16, 185, 129, 0.08);
    color: #065F46;
    padding: 0.1rem 0.4rem;
    border-radius: 4px;
    font-size: 0.9em;
    font-weight: 700;
  }
  .confirm-next {
    background: rgba(245, 158, 11, 0.06);
    border: 1px solid rgba(245, 158, 11, 0.2);
    border-radius: 12px;
    padding: 1rem 1.25rem;
    text-align: left;
    margin-bottom: 1.5rem;
  }
  .confirm-next p {
    font-size: 0.85rem;
    line-height: 1.55;
    color: #92400E;
    margin: 0;
  }
  .confirm-next strong {
    color: #B45309;
  }
  .confirm-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    justify-content: center;
  }

  /* Cierre del documento en las rutas standalone (sin salida al landing) */
  .confirm-fin {
    margin: 1.25rem 0 0;
    padding-top: 1rem;
    border-top: 1px solid rgba(0, 0, 0, 0.07);
    font-size: 0.85rem;
    line-height: 1.5;
    color: #6B7280;
    text-align: center;
  }

  /* Confirm · canal de contacto */
  .confirm-contacto {
    background: #FAF7F2;
    border: 1px solid rgba(0, 0, 0, 0.06);
    border-radius: 14px;
    padding: 1.1rem 1.25rem;
    margin-bottom: 1.5rem;
    text-align: left;
  }
  .confirm-contacto > header {
    margin-bottom: 0.75rem;
  }
  .confirm-contacto .eyebrow {
    display: inline-block;
    font-size: 0.65rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #10B981;
    background: rgba(16, 185, 129, 0.08);
    padding: 0.2rem 0.55rem;
    border-radius: 5px;
    font-family: 'JetBrains Mono', monospace;
  }
  .contacto-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
  @media (min-width: 480px) {
    .contacto-grid { grid-template-columns: repeat(3, 1fr); }
  }
  .contacto-chip {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    padding: 0.6rem 0.85rem;
    background: white;
    border: 1px solid rgba(0, 0, 0, 0.06);
    border-radius: 10px;
    text-decoration: none;
    color: inherit;
    transition: all 0.2s;
  }
  .contacto-chip:hover {
    border-color: rgba(16, 185, 129, 0.3);
    background: rgba(16, 185, 129, 0.04);
    transform: translateY(-1px);
  }
  .contacto-chip svg {
    width: 22px;
    height: 22px;
    color: #10B981;
    flex-shrink: 0;
  }
  .contacto-chip > div {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }
  .chip-label {
    font-size: 0.65rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #6B6B6B;
    font-family: 'JetBrains Mono', monospace;
  }
  .chip-value {
    font-size: 0.82rem;
    font-weight: 600;
    color: #0F1F1A;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* WIZARD */
  .wizard {
    max-width: 900px;
    margin: 0 auto;
    padding: 2rem 1.25rem 3rem;
  }
  .wizard-header {
    margin-bottom: 1.5rem;
  }
  .back-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    background: none;
    border: none;
    color: #6B6B6B;
    font-size: 0.8rem;
    font-weight: 500;
    cursor: pointer;
    padding: 0.3rem 0;
    margin-bottom: 1rem;
    transition: color 0.2s;
    font-family: inherit;
  }
  .back-btn:hover {
    color: #10B981;
  }
  .back-btn svg {
    width: 14px;
    height: 14px;
  }
  .wizard-title {
    margin-bottom: 1.25rem;
  }
  .wizard-code {
    display: inline-block;
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #10B981;
    background: rgba(16, 185, 129, 0.08);
    padding: 0.25rem 0.6rem;
    border-radius: 5px;
    margin-bottom: 0.6rem;
    font-family: 'JetBrains Mono', monospace;
  }
  .wizard-title h1 {
    font-family: 'Fraunces', Georgia, serif;
    font-size: clamp(1.5rem, 4vw, 2rem);
    font-weight: 400;
    color: #0F1F1A;
    margin: 0;
    line-height: 1.2;
  }
  .wizard-progress {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }
  .progress-info {
    display: flex;
    justify-content: space-between;
    font-size: 0.75rem;
    color: #6B6B6B;
    font-family: 'JetBrains Mono', monospace;
  }
  .progress-pct {
    font-weight: 700;
    color: #10B981;
  }
  .progress-bar {
    height: 6px;
    background: rgba(0, 0, 0, 0.06);
    border-radius: 3px;
    overflow: hidden;
  }
  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #10B981, #059669);
    border-radius: 3px;
    transition: width 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }

  /* Sección con ayuda contextual */
  .seccion-help-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    margin-bottom: 1rem;
  }
  .seccion-title {
    font-family: 'Fraunces', Georgia, serif;
    font-size: 1.4rem;
    font-weight: 500;
    color: #0F1F1A;
    margin: 0;
  }
  /* Nota descriptiva declarada en la sección del formulario */
  .seccion-nota {
    margin: 0 0 1rem;
    font-size: 0.9rem;
    line-height: 1.55;
    color: #4B5563;
  }
  .help-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.5rem 0.85rem;
    border-radius: 10px;
    background: rgba(16, 185, 129, 0.06);
    border: 1px solid rgba(16, 185, 129, 0.18);
    color: #065F46;
    font-size: 0.78rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    font-family: 'Inter Tight', system-ui, sans-serif;
  }
  .help-btn:hover {
    background: rgba(16, 185, 129, 0.12);
    border-color: rgba(16, 185, 129, 0.3);
  }
  .help-btn svg {
    width: 14px;
    height: 14px;
  }

  .instructivo-hint {
    background: linear-gradient(135deg, rgba(16, 185, 129, 0.04), rgba(16, 185, 129, 0.08));
    border: 1px solid rgba(16, 185, 129, 0.15);
    border-radius: 12px;
    padding: 0.85rem 1rem;
    margin-bottom: 1.25rem;
  }
  .hint-label {
    display: inline-block;
    font-size: 0.65rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #10B981;
    background: white;
    padding: 0.15rem 0.5rem;
    border-radius: 4px;
    margin-bottom: 0.4rem;
    font-family: 'JetBrains Mono', monospace;
  }
  .instructivo-hint ul {
    list-style: disc;
    padding-left: 1.1rem;
    margin: 0.4rem 0 0.75rem;
  }
  .instructivo-hint li {
    font-size: 0.8rem;
    line-height: 1.55;
    color: #1A1A1A;
    margin-bottom: 0.25rem;
  }
  .hint-more {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    background: none;
    border: none;
    color: #10B981;
    font-size: 0.75rem;
    font-weight: 600;
    cursor: pointer;
    padding: 0;
    font-family: 'Inter Tight', system-ui, sans-serif;
  }
  .hint-more:hover {
    color: #059669;
  }
  .hint-more svg {
    width: 12px;
    height: 12px;
  }

  .section-wrapper {
    margin-bottom: 1.5rem;
  }
  .full {
    grid-column: 1 / -1;
  }
  .section-fields {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.1rem;
  }
  @media (min-width: 768px) {
    .section-fields { grid-template-columns: repeat(2, 1fr); }
  }

  .wizard-footer {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 1.25rem 0;
    margin-top: 1.5rem;
  }
  .step-dots {
    display: flex;
    gap: 0.4rem;
    flex-wrap: wrap;
    justify-content: center;
    flex: 1;
  }
  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.15);
    border: none;
    cursor: pointer;
    padding: 0;
    transition: all 0.2s;
  }
  .dot.done {
    background: rgba(16, 185, 129, 0.5);
  }
  .dot.has-error {
    background: #DC2626;
  }
  .dot.has-error.active {
    background: #DC2626;
    width: 24px;
    border-radius: 4px;
    box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.18);
  }
  .dot.active {
    background: #10B981;
    width: 24px;
    border-radius: 4px;
  }

  /* Banner de error de la sección */
  .section-error-banner {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    padding: 0.85rem 1rem;
    margin-bottom: 1rem;
    background: rgba(220, 38, 38, 0.06);
    border: 1px solid rgba(220, 38, 38, 0.25);
    border-radius: 12px;
    color: #991B1B;
  }
  .section-error-banner svg {
    width: 22px;
    height: 22px;
    flex-shrink: 0;
    color: #DC2626;
  }
  .section-error-banner strong {
    font-size: 0.88rem;
    font-weight: 700;
    display: block;
    margin-bottom: 0.15rem;
  }
  .section-error-banner p {
    font-size: 0.78rem;
    line-height: 1.4;
    color: #B91C1C;
    margin: 0;
  }

  .btn-primary, .btn-secondary {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.75rem 1.5rem;
    border-radius: 12px;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    border: none;
    font-family: inherit;
    transition: all 0.2s;
    text-decoration: none;
  }
  .btn-primary {
    background: linear-gradient(135deg, #10B981, #059669);
    color: white;
    box-shadow: 0 4px 16px rgba(16, 185, 129, 0.3);
  }
  .btn-primary:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
  }
  .btn-primary:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  .btn-primary svg {
    width: 16px;
    height: 16px;
  }
  .btn-secondary {
    background: white;
    color: #1A1A1A;
    border: 1px solid rgba(0, 0, 0, 0.12);
  }
  .btn-secondary:hover:not(:disabled) {
    background: #FAF7F2;
    border-color: rgba(0, 0, 0, 0.2);
  }
  .btn-secondary:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
  .btn-secondary svg {
    width: 16px;
    height: 16px;
  }
  .spin {
    width: 16px;
    height: 16px;
    animation: spin 1s linear infinite;
  }

  .alert {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    padding: 1rem 1.25rem;
    border-radius: 12px;
    margin-bottom: 1.5rem;
    font-size: 0.9rem;
  }

  /* ═══ HINT PANEL: aclaración sobre obligatorios (formulario Personal) ═══ */
  .no-docs-hint-panel {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 1.1rem 1.25rem;
    background: linear-gradient(180deg, rgba(16, 185, 129, 0.05) 0%, rgba(16, 185, 129, 0.02) 100%);
    border: 1px solid rgba(16, 185, 129, 0.2);
    border-radius: 14px;
    margin: 1rem 0 1rem;
  }
  .no-docs-eyebrow {
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #047857;
    font-family: 'JetBrains Mono', monospace;
  }
  .no-docs-hint-panel p {
    font-size: 0.85rem;
    line-height: 1.55;
    color: #4A4A4A;
    margin: 0;
  }
  .no-docs-hint-panel strong { color: #064E3B; }

  /* ═══ LOADING STATE (spinner genérico) ═══ */
  .loading-state {
    display: flex; flex-direction: column; align-items: center;
    gap: 0.75rem;
    padding: 2.5rem 1.5rem;
    color: #6B6B6B;
    font-size: 0.9rem;
  }
  .loading-spinner {
    width: 28px; height: 28px;
    border: 3px solid rgba(0, 0, 0, 0.08);
    border-top-color: #10B981;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  .alert-error {
    background: rgba(239, 68, 68, 0.06);
    border: 1px solid rgba(239, 68, 68, 0.2);
    color: #991B1B;
  }
  .alert-error svg {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
    color: #DC2626;
  }
  .error-list {
    margin: 0.5rem 0 0;
    padding-left: 1.25rem;
    font-size: 0.82rem;
  }
  .error-list li {
    margin-bottom: 0.2rem;
  }
</style>
