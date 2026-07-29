<script lang="ts">
  import { untrack } from 'svelte'

  /**
   * FirmaPad — Componente de captura de firma.
   *
   * Dos modos (mutuamente excluyentes):
   *  - 'upload':  subir una imagen de firma desde el dispositivo (default)
   *  - 'draw':    canvas para dibujar con mouse / touch
   *
   * Reglas de oro (anti-loop):
   *  - El contexto 2D se inicializa con $effect cuando el canvas se monta.
   *    `value` se lee con untrack() para NO re-inicializar el canvas
   *    en cada cambio de value (eso borraría el trazo en curso).
   *  - El `value` persistido se respeta SIEMPRE: cambiar de modo o
   *    navegar a otro step no lo borra. Solo el botón "Quitar firma"
   *    del preview lo limpia explícitamente.
   *  - `switchModo` no llama `onChange(null)`. Solo resetea estado local.
   */
  type Modo = 'draw' | 'upload'

  type Props = {
    value?: string | null
    onChange: (dataUrl: string | null) => void
  }

  let { value = null, onChange }: Props = $props()

  let modo = $state<Modo>('upload')
  let canvasEl = $state<HTMLCanvasElement | undefined>(undefined)
  let isDrawing = $state(false)
  let hasSignature = $state(false)
  let lastX = 0
  let lastY = 0
  let ctx: CanvasRenderingContext2D | null = null
  let fileInput = $state<HTMLInputElement | undefined>(undefined)
  let uploadError = $state<string | null>(null)

  const MAX_BYTES = 2 * 1024 * 1024
  const ACCEPTED = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']

  // ─────────────────────────────────────────────────────
  //  DRAW MODE
  // ─────────────────────────────────────────────────────
  function initCanvas() {
    if (!canvasEl) return false
    const rect = canvasEl.getBoundingClientRect()
    if (rect.width === 0 || rect.height === 0) return false
    canvasEl.width = rect.width * 2
    canvasEl.height = rect.height * 2
    ctx = canvasEl.getContext('2d')
    if (!ctx) return false
    ctx.scale(2, 2)
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.strokeStyle = '#0F1F1A'
    ctx.lineWidth = 2.2
    return true
  }

  function drawValueInCanvas(dataUrl: string) {
    if (!canvasEl || !ctx) return
    const c = canvasEl
    const cctx = ctx
    const img = new Image()
    img.onload = () => {
      if (canvasEl !== c || !cctx) return
      cctx.fillStyle = '#FFFFFF'
      cctx.fillRect(0, 0, c.width / 2, c.height / 2)
      const ratio = Math.min(c.width / img.width, c.height / img.height) * 0.95
      const w = img.width * ratio
      const h = img.height * ratio
      cctx.drawImage(img, (c.width / 2 - w) / 2, (c.height / 2 - h) / 2, w, h)
      hasSignature = true
    }
    img.src = dataUrl
  }

  /**
   * Inicializa el canvas cuando se monta (canvasEl pasa de undefined → node).
   * Usa untrack para leer `value` SIN suscribirse a él: si el usuario está
   * dibujando, cada onChange actualiza value y NO queremos re-inicializar
   * el context (eso borraría el trazo en curso).
   *
   * El doble requestAnimationFrame es defensivo: en el primer frame el
   * navegador aún no completó el layout del canvas (getBoundingClientRect
   * puede devolver 0x0). En el segundo frame el layout ya está estable.
   */
  $effect(() => {
    if (!canvasEl) return
    const initialValue = untrack(() => value)
    const tryInit = () => {
      if (!canvasEl) return
      if (initCanvas()) {
        if (initialValue) drawValueInCanvas(initialValue)
        return
      }
      requestAnimationFrame(tryInit)
    }
    requestAnimationFrame(tryInit)
  })

  function getPos(e: MouseEvent | TouchEvent): { x: number; y: number } {
    if (!canvasEl) return { x: 0, y: 0 }
    const rect = canvasEl.getBoundingClientRect()
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
    if (!isDrawing || !canvasEl) return
    isDrawing = false
    const dataUrl = canvasEl.toDataURL('image/png')
    hasSignature = true
    onChange(dataUrl)
  }

  function clearDraw() {
    if (!ctx || !canvasEl) return
    ctx.clearRect(0, 0, canvasEl.width, canvasEl.height)
    hasSignature = false
    onChange(null)
  }

  // ─────────────────────────────────────────────────────
  //  SWITCH MODO — solo cambia estado local, NO toca el value
  // ─────────────────────────────────────────────────────
  function switchModo(nuevo: Modo) {
    if (modo === nuevo) return
    modo = nuevo
    hasSignature = false
    uploadError = null
  }

  // ─────────────────────────────────────────────────────
  //  UPLOAD MODE
  // ─────────────────────────────────────────────────────
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
      const img = new Image()
      img.onload = () => {
        const c = document.createElement('canvas')
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
</script>

<div class="firma-pad">
  <!-- Preview persistente de la firma actual -->
  {#if value}
    <div class="firma-preview">
      <div class="firma-preview-label">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Firma actual</span>
      </div>
      <div class="firma-preview-frame">
        <img src={value} alt="Firma registrada" />
      </div>
      <button type="button" class="firma-preview-clear" onclick={() => onChange(null)}>
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022 2.09 2.201v.916m7.5 0a48.667 0 00-7.5 0" />
        </svg>
        Quitar firma
      </button>
    </div>
  {/if}

  <!-- Tabs de modo — "Dibujar" solo se muestra si no hay firma persistida -->
  <div class="firma-tabs" role="tablist">
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
    {#if !value}
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
    {/if}
  </div>

  {#if modo === 'upload'}
    <div class="upload-wrap">
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
            <strong>Subir o reemplazar imagen</strong>
          </p>
          <p class="drop-secondary">PNG, JPG o WEBP · Máx. 2 MB</p>
        </div>
      </label>
      {#if uploadError}
        <p class="error-msg">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          {uploadError}
        </p>
      {/if}
    </div>
  {:else if modo === 'draw'}
    <div class="canvas-wrap">
      <canvas
        bind:this={canvasEl}
        onmousedown={start}
        onmousemove={move}
        onmouseup={end}
        onmouseleave={end}
        ontouchstart={start}
        ontouchmove={move}
        ontouchend={end}
      ></canvas>
      {#if !hasSignature && !value}
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
        disabled={!hasSignature && !value}
      >
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
        Limpiar
      </button>
    </div>
  {/if}
</div>

<style>
  .firma-pad {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
  }

  /* Preview persistente */
  .firma-preview {
    display: flex;
    align-items: center;
    gap: 0.85rem;
    padding: 0.65rem 0.85rem;
    background: rgba(16, 185, 129, 0.05);
    border: 1px solid rgba(16, 185, 129, 0.2);
    border-radius: 12px;
  }
  .firma-preview-label {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.72rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #065f46;
    font-family: 'JetBrains Mono', monospace;
    white-space: nowrap;
  }
  .firma-preview-label svg {
    width: 14px;
    height: 14px;
    color: #10b981;
  }
  .firma-preview-frame {
    flex: 1;
    min-width: 0;
    background: white;
    border: 1px solid rgba(0, 0, 0, 0.08);
    border-bottom: 2px solid #1a1a1a;
    border-radius: 8px;
    padding: 0.4rem 0.6rem;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }
  .firma-preview-frame img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
  .firma-preview-clear {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    padding: 0.4rem 0.65rem;
    border: 1px solid rgba(239, 68, 68, 0.25);
    border-radius: 8px;
    background: white;
    color: #b91c1c;
    font-size: 0.72rem;
    font-weight: 600;
    cursor: pointer;
    font-family: 'Inter Tight', system-ui, sans-serif;
    transition: all 0.2s;
    white-space: nowrap;
  }
  .firma-preview-clear:hover {
    background: #fee2e2;
    border-color: #fca5a5;
  }
  .firma-preview-clear svg {
    width: 12px;
    height: 12px;
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
