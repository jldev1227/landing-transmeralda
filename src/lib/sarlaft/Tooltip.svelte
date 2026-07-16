<script lang="ts">
  /**
   * Tooltip — Muestra una definición al pasar el cursor o hacer tap.
   * Usado para términos del glosario (PEP, Beneficiario Final, etc.)
   * y para las indicaciones contextuales de cada sección.
   */
  import { fly, fade } from 'svelte/transition'

  type Props = {
    termino: string
    definicion: string
    placement?: 'top' | 'bottom'
  }

  let { termino, definicion, placement = 'top' }: Props = $props()

  let visible = $state(false)
  let touchTimeout: ReturnType<typeof setTimeout> | null = null
</script>

<span
  class="tooltip-trigger"
  onmouseenter={() => (visible = true)}
  onmouseleave={() => (visible = false)}
  onclick={() => (visible = !visible)}
  onkeydown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      visible = !visible
    }
  }}
  role="button"
  tabindex="0"
  aria-describedby="tooltip-{termino.replace(/\s/g, '')}"
>
  <span class="term">{termino}</span>
  <span class="help-icon" aria-hidden="true">?</span>

  {#if visible}
    <span
      class="tooltip-content {placement}"
      role="tooltip"
      id="tooltip-{termino.replace(/\s/g, '')}"
      in:fade={{ duration: 150 }}
      out:fade={{ duration: 100 }}
    >
      <strong>{termino}</strong>
      <span>{definicion}</span>
    </span>
  {/if}
</span>

<style>
  .tooltip-trigger {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    cursor: help;
    color: #065F46;
    font-weight: 600;
    border-bottom: 1.5px dotted #10B981;
    transition: color 0.15s;
  }
  .tooltip-trigger:hover {
    color: #047857;
  }
  .term {
    line-height: 1.3;
  }
  .help-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #10B981;
    color: white;
    font-size: 0.65rem;
    font-weight: 700;
    font-family: 'JetBrains Mono', monospace;
    flex-shrink: 0;
  }
  .tooltip-content {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    z-index: 50;
    width: max-content;
    max-width: 320px;
    padding: 0.75rem 0.9rem;
    background: #0F1F1A;
    color: #F0EDE6;
    border-radius: 10px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
    font-size: 0.8rem;
    line-height: 1.5;
    text-align: left;
    font-weight: 400;
    pointer-events: none;
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
  }
  .tooltip-content.top {
    bottom: calc(100% + 10px);
  }
  .tooltip-content.bottom {
    top: calc(100% + 10px);
  }
  .tooltip-content::after {
    content: '';
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    border: 6px solid transparent;
  }
  .tooltip-content.top::after {
    top: 100%;
    border-top-color: #0F1F1A;
  }
  .tooltip-content.bottom::after {
    bottom: 100%;
    border-bottom-color: #0F1F1A;
  }
  .tooltip-content strong {
    color: #10B981;
    font-size: 0.78rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .tooltip-content span {
    display: block;
  }
</style>
