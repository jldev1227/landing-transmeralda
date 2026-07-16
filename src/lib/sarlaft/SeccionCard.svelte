<script lang="ts">
  import type { Snippet } from 'svelte'

  type Props = {
    index: number
    titulo: string
    condicional?: string | null
    children: Snippet
  }

  let { index, titulo, condicional = null, children }: Props = $props()
</script>

<section class="seccion">
  <header class="seccion-header">
    <div class="seccion-num">{String(index + 1).padStart(2, '0')}</div>
    <div class="seccion-titles">
      <h3>{titulo}</h3>
      {#if condicional}
        <p class="condicional">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
          </svg>
          {condicional}
        </p>
      {/if}
    </div>
  </header>

  <div class="seccion-body">
    {@render children()}
  </div>
</section>

<style>
  .seccion {
    background: white;
    border: 1px solid rgba(0, 0, 0, 0.08);
    border-radius: 20px;
    padding: 1.5rem;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.04);
  }
  .seccion-header {
    display: flex;
    align-items: flex-start;
    gap: 0.85rem;
    margin-bottom: 1.25rem;
    padding-bottom: 1.25rem;
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  }
  .seccion-num {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 10px;
    background: linear-gradient(135deg, #10B981, #059669);
    color: white;
    font-size: 0.85rem;
    font-weight: 700;
    font-family: 'JetBrains Mono', monospace;
    flex-shrink: 0;
    box-shadow: 0 2px 8px rgba(16, 185, 129, 0.25);
  }
  .seccion-titles {
    flex: 1;
    min-width: 0;
  }
  h3 {
    font-size: 1.1rem;
    font-weight: 700;
    color: #1A1A1A;
    margin: 0;
    font-family: 'Inter Tight', system-ui, sans-serif;
    line-height: 1.3;
  }
  .condicional {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    margin: 0.4rem 0 0;
    font-size: 0.75rem;
    color: #B45309;
    background: rgba(245, 158, 11, 0.08);
    padding: 0.25rem 0.6rem;
    border-radius: 6px;
    font-family: 'Inter Tight', system-ui, sans-serif;
  }
  .condicional svg {
    width: 12px;
    height: 12px;
  }
  .seccion-body {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.1rem;
  }
  @media (min-width: 768px) {
    .seccion-body { grid-template-columns: repeat(2, 1fr); }
    .seccion-body > :global(.full) { grid-column: 1 / -1; }
  }
</style>
