<script lang="ts">
  /**
   * FirmaPad — Canvas para captura de firma manuscrita.
   * Soporta mouse y touch. Devuelve un dataURL PNG.
   */
  type Props = {
    value?: string | null
    onChange: (dataUrl: string | null) => void
  }

  let { value = null, onChange }: Props = $props()

  let canvas = $state<HTMLCanvasElement | undefined>(undefined)
  let isDrawing = $state(false)
  let hasSignature = $state(false)
  let lastX = 0
  let lastY = 0
  let ctx: CanvasRenderingContext2D | null = null

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

  function clear() {
    if (!ctx || !canvas) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    hasSignature = false
    onChange(null)
  }

  $effect(() => {
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
  })
</script>

<div class="firma-pad">
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
      <span>Espacio para firma — Dibuja con mouse o touch</span>
    </div>
  {/if}
  <button
    type="button"
    class="firma-clear"
    onclick={clear}
    disabled={!hasSignature}
  >
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
      <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
    Limpiar
  </button>
</div>

<style>
  .firma-pad {
    position: relative;
    width: 100%;
    height: 160px;
    background: #FAF7F2;
    border: 2px dashed rgba(0, 0, 0, 0.18);
    border-radius: 12px;
    overflow: hidden;
    transition: border-color 0.2s;
  }
  .firma-pad:focus-within {
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
  .firma-placeholder svg {
    width: 28px;
    height: 28px;
  }
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
  .firma-clear svg {
    width: 12px;
    height: 12px;
  }
  .firma-clear:hover:not(:disabled) {
    background: #FEE2E2;
    color: #B91C1C;
    border-color: #FCA5A5;
  }
  .firma-clear:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
</style>
