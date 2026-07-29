<script lang="ts">
  /**
   * FirmaPad — Componente unificado de captura de firma.
   *
   * Soporta tres modos (alternativos entre sí):
   *  - 'draw':    canvas para dibujar con mouse / touch
   *  - 'upload':  subir una imagen de firma desde el dispositivo
   *  - 'typed':   escribir el nombre y se renderiza como firma tipográfica
   *
   * Devuelve un dataURL PNG con la firma final, listo para guardarse como
   * respuesta del formulario y embebirse en el PDF que genera el backend.
   */
  type Modo = 'draw' | 'upload' | 'typed'

  type Props = {
    value?: string | null
    onChange: (dataUrl: string | null) => void
  }

  let { value = null, onChange }: Props = $props()

  let modo = $state<Modo>('upload')
  let canvas = $state<HTMLCanvasElement | undefined>(undefined)
  let isDrawing = $state(false)
  let hasSignature = $state(false)
  let lastX = 0
  let lastY = 0
  let ctx: CanvasRenderingContext2D | null = null
  let fileInput = $state<HTMLInputElement | undefined>(undefined)
  let uploadError = $state<string | null>(null)
  let typedError = $state<string | null>(null)
  let typedNombre = $state('')

  const MAX_BYTES = 2 * 1024 * 1024 // 2 MB
  const ACCEPTED = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']

  function init() {
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    // Tamaño 2x para retina
    canvas.width = rect.width * 2
    canvas.height = rect.height * 2
    ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.scale(2, 2)
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.strokeStyle = '#0F1F1A'
    ctx.lineWidth = 2.2
  }

  function getPos(e: MouseEvent | TouchEvent): { x: number; y: number } {
    if (!canvas) return { x: 0, y: 0 }
    const rect = canvas.getBoundingClientRect()
    if ('touches' in e) {
      const t = e.touches[0] || e.changedTouches[0]
      return { x: t.clientX - rect.left, y: t.clientY - rect.top }
    }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  function start(e: MouseEvent | TouchEvent) {
    if (!ctx) return
    e.preventDefault()
    isDrawing = true
    const { x, y } = getPos(e)
    lastX = x
    lastY = y
  }

  function move(e: MouseEvent | TouchEvent) {
    if (!isDrawing || !ctx) return
    e.preventDefault()
    const { x, y } = getPos(e)
    ctx.beginPath()
    ctx.moveTo(lastX, lastY)
    ctx.lineTo(x, y)
    ctx.stroke()
    lastX = x
    lastY = y
    if (!hasSignature) hasSignature = true
  }

  function end() {
    if (!isDrawing || !canvas) return
    isDrawing = false
    const dataUrl = canvas.toDataURL('image/png')
    onChange(dataUrl)
  }

  function clearDraw() {
    if (!ctx || !canvas) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    hasSignature = false
    onChange(null)
  }

  function switchModo(nuevo: Modo) {
    modo = nuevo
    hasSignature = false
    uploadError = null
    typedError = null
    typedNombre = ''
    if (nuevo === 'draw') {
      onChange(null)
      setTimeout(init, 30)
    } else {
      onChange(null)
    }
  }

  function handleFile(e: Event) {
    const input = e.target as HTMLInputElement
    const file = input.files?.[0]
    if (!file) return
    uploadError = null
    if (file.size > MAX_BYTES) {
      uploadError = `La imagen pesa ${(file.size / 1024 / 1024).toFixed(2)} MB; máximo 2 MB.`
      input.value = ''
      return
    }
    if (!ACCEPTED.includes(file.type) && !/\.(png|jpe?g|webp)$/i.test(file.name)) {
      uploadError = 'Formato no permitido. Usa PNG, JPG o WEBP.'
      input.value = ''
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = reader.result as string
      // Re-renderizar a un canvas 2x (alta densidad) para conservar calidad y
      // unificar formato (siempre PNG) que es lo que el backend espera.
      const img = new Image()
      img.onload = () => {
        const c = document.createElement('canvas')
        // Apaisado con proporción 3:1, como una firma real
        c.width = 600
        c.height = 200
        const cctx = c.getContext('2d')
        if (!cctx) {
          onChange(dataUrl)
          hasSignature = true
          return
        }
        cctx.fillStyle = '#FFFFFF'
        cctx.fillRect(0, 0, c.width, c.height)
        // Ajustar al canvas manteniendo proporción
        const ratio = Math.min(c.width / img.width, c.height / img.height)
        const w = img.width * ratio
        const h = img.height * ratio
        cctx.drawImage(img, (c.width - w) / 2, (c.height - h) / 2, w, h)
        const finalDataUrl = c.toDataURL('image/png')
        hasSignature = true
        onChange(finalDataUrl)
      }
      img.onerror = () => {
        uploadError = 'No se pudo leer la imagen. Intenta con otra.'
      }
      img.src = dataUrl
    }
    reader.onerror = () => {
      uploadError = 'Error al cargar el archivo.'
    }
    reader.readAsDataURL(file)
  }

  function removeUploaded() {
    hasSignature = false
    onChange(null)
    if (fileInput) fileInput.value = ''
  }

  // Genera una imagen PNG de la firma tipográfica a partir del nombre
  function renderTypedSignature(nombre: string) {
    typedError = null
    if (!nombre.trim()) {
      onChange(null)
      hasSignature = false
      return
    }
    const c = document.createElement('canvas')
    c.width = 600
    c.height = 180
    const cctx = c.getContext('2d')
    if (!cctx) return
    cctx.fillStyle = '#FFFFFF'
    cctx.fillRect(0, 0, c.width, c.height)
    // Fuente cursiva - usar 'cursive' para emular una firma
    cctx.fillStyle = '#0F1F1A'
    cctx.textBaseline = 'middle'
    cctx.textAlign = 'center'
    // Tamaño dinámico según longitud
    const baseSize = 64
    const adjusted = Math.max(28, baseSize - Math.max(0, (nombre.length - 12) * 3))
    cctx.font = `italic 600 ${adjusted}px "Brush Script MT", "Lucida Handwriting", "Comic Sans MS", cursive`
    cctx.fillText(nombre.trim(), c.width / 2, c.height / 2)
    // Línea inferior sutil
    cctx.strokeStyle = 'rgba(15, 31, 26, 0.45)'
    cctx.lineWidth = 1.5
    cctx.beginPath()
    cctx.moveTo(60, 150)
    cctx.lineTo(540, 150)
    cctx.stroke()
    hasSignature = true
    onChange(c.toDataURL('image/png'))
  }

  // Re-renderizar la firma tipográfica cuando cambia el nombre
  $effect(() => {
    if (modo === 'typed') {
      const trimmed = typedNombre.trim()
      if (trimmed) {
        renderTypedSignature(trimmed)
      } else {
        hasSignature = false
        onChange(null)
      }
    }
  })

  $effect(() => {
    if (modo === 'draw') {
      init()
      const onResize = () => {
        const wasEmpty = !hasSignature
        const dataUrl = wasEmpty ? null : canvas?.toDataURL('image/png') || null
        init()
        if (dataUrl && canvas) {
          const img = new Image()
          img.onload = () => ctx?.drawImage(img, 0, 0, canvas!.clientWidth, canvas!.clientHeight)
          img.src = dataUrl
        }
      }
      window.addEventListener('resize', onResize)
      return () => window.removeEventListener('resize', onResize)
    }
  })
</script>

<div class="firma-pad">
  <!-- Tabs de modo -->
  <div class="firma-tabs" role="tablist">
    <button
      type="button"
      role="tab"
      class="firma-tab"
      class:active={modo === 'draw'}
      aria-selected={modo === 'draw'}
      onclick={() => switchModo('draw')}
    >
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8">
        <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
      </svg>
      Dibujar
    </button>
    <button
      type="button"
      role="tab"
      class="firma-tab"
      class:active={modo === 'upload'}
      aria-selected={modo === 'upload'}
      onclick={() => switchModo('upload')}
    >
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8">
        <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
      </svg>
      Subir imagen
    </button>
    <button
      type="button"
      role="tab"
      class="firma-tab"
      class:active={modo === 'typed'}
      aria-selected={modo === 'typed'}
      onclick={() => switchModo('typed')}
    >
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8">
        <path stroke-linecap="round" stroke-linejoin="round" d="M3 8.25h18M3 12h10.5M3 15.75h7.5M16.5 19.5l1.5-1.5-3.75-3.75 1.5-1.5L21 18l-3.75 3.75-1.5-1.5L15 21" />
      </svg>
      Escribir nombre
    </button>
  </div>

  {#if modo === 'draw'}
    <div class="canvas-wrap">
      <canvas
        bind:this={canvas}
        onmousedown={start}
        onmousemove={move}
        onmouseup={end}
        onmouseleave={end}
        ontouchstart={start}
        ontouchmove={move}
        ontouchend={end}
      ></canvas>
      {#if !hasSignature}
        <div class="firma-placeholder">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
          </svg>
          <span>Dibuja tu firma con mouse o touch</span>
        </div>
      {/if}
      <button
        type="button"
        class="firma-clear"
        onclick={clearDraw}
        disabled={!hasSignature}
      >
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
        Limpiar
      </button>
    </div>
  {:else if modo === 'upload'}
    <div class="upload-wrap">
      {#if hasSignature && value}
        <div class="upload-preview">
          <img src={value} alt="Vista previa de la firma" />
        </div>
        <div class="upload-actions">
          <button
            type="button"
            class="firma-secondary-btn"
            onclick={() => fileInput?.click()}
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            Reemplazar imagen
          </button>
          <button
            type="button"
            class="firma-secondary-btn firma-secondary-btn--danger"
            onclick={removeUploaded}
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
            Quitar
          </button>
        </div>
      {:else}
        <label class="drop-zone">
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            bind:this={fileInput}
            onchange={handleFile}
            hidden
          />
          <div class="drop-content">
            <div class="upload-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
            </div>
            <p class="drop-primary">
              <strong>Suelta la imagen aquí</strong> o haz clic para seleccionar
            </p>
            <p class="drop-secondary">PNG, JPG o WEBP · Máx. 2 MB</p>
          </div>
        </label>
      {/if}
      {#if uploadError}
        <p class="error-msg">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          {uploadError}
        </p>
      {/if}
    </div>
  {:else if modo === 'typed'}
    <div class="typed-wrap">
      <label class="typed-field">
        <span class="typed-label">Escribe tu nombre completo</span>
        <input
          type="text"
          class="typed-input"
          placeholder="Ej. María Fernanda Pérez"
          bind:value={typedNombre}
          autocomplete="name"
        />
      </label>
      <div class="typed-preview">
        {#if hasSignature && value}
          <img src={value} alt="Vista previa de la firma tipográfica" />
        {:else}
          <span class="typed-placeholder">Tu firma aparecerá aquí…</span>
        {/if}
      </div>
      {#if typedError}
        <p class="error-msg">{typedError}</p>
      {/if}
    </div>
  {/if}
</div>

<style>
  .firma-pad {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
  }

  /* Tabs */
  .firma-tabs {
    display: inline-flex;
    background: #FAF7F2;
    border: 1px solid rgba(0, 0, 0, 0.08);
    border-radius: 10px;
    padding: 3px;
    gap: 2px;
    align-self: flex-start;
  }
  .firma-tab {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.45rem 0.85rem;
    border: none;
    border-radius: 8px;
    background: transparent;
    color: #6B6B6B;
    font-size: 0.78rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    font-family: 'Inter Tight', system-ui, sans-serif;
  }
  .firma-tab svg { width: 14px; height: 14px; }
  .firma-tab:hover { color: #065F46; }
  .firma-tab.active {
    background: white;
    color: #065F46;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  }

  /* Draw mode */
  .canvas-wrap {
    position: relative;
    width: 100%;
    height: 160px;
    background: #FAF7F2;
    border: 2px dashed rgba(0, 0, 0, 0.18);
    border-radius: 12px;
    overflow: hidden;
    transition: border-color 0.2s;
  }
  .canvas-wrap:focus-within {
    border-color: #10B981;
    border-style: solid;
  }
  canvas {
    display: block;
    width: 100%;
    height: 100%;
    touch-action: none;
    cursor: crosshair;
  }
  .firma-placeholder {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    color: rgba(0, 0, 0, 0.35);
    pointer-events: none;
    font-size: 0.85rem;
    font-family: 'Inter Tight', system-ui, sans-serif;
  }
  .firma-placeholder svg { width: 28px; height: 28px; }

  .firma-clear {
    position: absolute;
    top: 8px;
    right: 8px;
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 4px 10px;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.9);
    border: 1px solid rgba(0, 0, 0, 0.08);
    color: #6B6B6B;
    font-size: 0.7rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    font-family: 'Inter Tight', system-ui, sans-serif;
  }
  .firma-clear svg { width: 12px; height: 12px; }
  .firma-clear:hover:not(:disabled) {
    background: #FEE2E2;
    color: #B91C1C;
    border-color: #FCA5A5;
  }
  .firma-clear:disabled { opacity: 0.4; cursor: not-allowed; }

  /* Upload mode */
  .upload-wrap { display: flex; flex-direction: column; gap: 0.6rem; }
  .upload-preview {
    background: #FAF7F2;
    border: 1px solid rgba(0, 0, 0, 0.08);
    border-bottom: 2px solid #1A1A1A;
    border-radius: 12px;
    padding: 0.85rem 1rem;
    min-height: 110px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .upload-preview img {
    max-width: 100%;
    max-height: 110px;
    object-fit: contain;
  }
  .upload-actions {
    display: flex;
    gap: 0.4rem;
    flex-wrap: wrap;
  }
  .firma-secondary-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.45rem 0.85rem;
    border-radius: 8px;
    background: white;
    border: 1px solid rgba(16, 185, 129, 0.3);
    color: #065F46;
    font-size: 0.75rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    font-family: 'Inter Tight', system-ui, sans-serif;
  }
  .firma-secondary-btn:hover {
    background: rgba(16, 185, 129, 0.08);
    border-color: #10B981;
  }
  .firma-secondary-btn--danger {
    background: white;
    color: #B91C1C;
    border-color: rgba(239, 68, 68, 0.25);
  }
  .firma-secondary-btn--danger:hover {
    background: #FEE2E2;
    border-color: #FCA5A5;
  }
  .firma-secondary-btn svg { width: 13px; height: 13px; }

  .drop-zone {
    display: block;
    border: 2px dashed rgba(16, 185, 129, 0.3);
    border-radius: 12px;
    background: #FAF7F2;
    padding: 1.5rem 1rem;
    cursor: pointer;
    transition: all 0.2s;
  }
  .drop-zone:hover {
    border-color: rgba(16, 185, 129, 0.5);
    background: rgba(16, 185, 129, 0.03);
  }
  .drop-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    text-align: center;
  }
  .upload-icon {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    background: rgba(16, 185, 129, 0.1);
    color: #10B981;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .upload-icon svg { width: 22px; height: 22px; }
  .drop-primary { font-size: 0.85rem; color: #1A1A1A; margin: 0; }
  .drop-primary strong { color: #065F46; }
  .drop-secondary { font-size: 0.72rem; color: #6B6B6B; margin: 0; }

  /* Typed mode */
  .typed-wrap { display: flex; flex-direction: column; gap: 0.6rem; }
  .typed-field { display: flex; flex-direction: column; gap: 0.3rem; }
  .typed-label {
    font-size: 0.78rem;
    font-weight: 600;
    color: #1A1A1A;
    font-family: 'Inter Tight', system-ui, sans-serif;
  }
  .typed-input {
    padding: 0.6rem 0.85rem;
    border: 1px solid rgba(0, 0, 0, 0.12);
    border-radius: 10px;
    background: white;
    font-size: 0.9rem;
    color: #1A1A1A;
    font-family: 'Inter Tight', system-ui, sans-serif;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .typed-input:focus {
    outline: none;
    border-color: #10B981;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  }
  .typed-preview {
    background: #FAF7F2;
    border: 1px solid rgba(0, 0, 0, 0.08);
    border-bottom: 2px solid #1A1A1A;
    border-radius: 12px;
    padding: 0.85rem 1rem;
    min-height: 110px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .typed-preview img { max-width: 100%; max-height: 110px; object-fit: contain; }
  .typed-placeholder { font-size: 0.85rem; color: rgba(0, 0, 0, 0.35); font-style: italic; }

  /* Error */
  .error-msg {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.78rem;
    color: #991B1B;
    background: rgba(239, 68, 68, 0.08);
    padding: 0.5rem 0.75rem;
    border-radius: 8px;
    margin: 0;
  }
  .error-msg svg { width: 14px; height: 14px; flex-shrink: 0; }
</style>
