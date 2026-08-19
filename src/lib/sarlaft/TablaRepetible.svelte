<script lang="ts">
  import { inputModeDe, sanearFormato, type Pregunta, type Seccion } from './types'
  import FirmaPad from './FirmaPad.svelte'

  type Props = {
    seccion: Seccion
    rows: Array<Record<string, any>>
    onChange: (rows: Array<Record<string, any>>) => void
    errors?: Record<string, string>
  }

  let { seccion, rows, onChange, errors = {} }: Props = $props()

  const preguntas = $derived(seccion.preguntas)

  function addRow() {
    const nuevaFila: Record<string, any> = {}
    for (const p of preguntas) {
      nuevaFila[p.id] = p.tipo_respuesta === 'numerico' ? '' : ''
    }
    onChange([...rows, nuevaFila])
  }

  function removeRow(index: number) {
    const copia = [...rows]
    copia.splice(index, 1)
    onChange(copia)
  }

  function updateCell(rowIndex: number, pregunta: Pregunta, value: any) {
    const copia = rows.map((r, i) => (i === rowIndex ? { ...r, [pregunta.id]: value } : r))
    onChange(copia)
  }

  /**
   * En las celdas con `formato` (cédula/NIT, teléfono) se descartan los
   * caracteres no admitidos mientras se escribe, igual que en FormField.
   */
  function onInputTexto(e: Event, rowIndex: number, pregunta: Pregunta) {
    const el = e.currentTarget as HTMLInputElement
    const limpio = sanearFormato(el.value, pregunta.formato)
    if (limpio !== el.value) {
      const pos = (el.selectionStart ?? limpio.length) - (el.value.length - limpio.length)
      el.value = limpio
      el.setSelectionRange(pos, pos)
    }
    updateCell(rowIndex, pregunta, limpio)
  }
</script>

<div class="tabla-repetible">
  <div class="tabla-header">
    <div class="tabla-title">
      <h4>{seccion.seccion}</h4>
      {#if seccion.nota}
        <p class="nota">{seccion.nota}</p>
      {/if}
    </div>
    <button type="button" class="btn-add" onclick={addRow}>
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
      </svg>
      Agregar fila
    </button>
  </div>

  {#if rows.length === 0}
    <div class="empty">
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
      <p>Aún no hay registros. Haz clic en "Agregar fila" para comenzar.</p>
    </div>
  {:else}
    <div class="filas">
      {#each rows as fila, i (i)}
        <div class="fila">
          <div class="fila-header">
            <span class="fila-num">#{i + 1}</span>
            <button type="button" class="btn-remove" onclick={() => removeRow(i)} aria-label="Eliminar fila">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
            </button>
          </div>
          <div class="fila-grid">
            {#each preguntas as pregunta (pregunta.id)}
              <div class="campo">
                <label for="{seccion.seccion}-{i}-{pregunta.id}">
                  {pregunta.pregunta}
                  {#if pregunta.obligatorio}<span class="req">*</span>{/if}
                </label>

                {#if pregunta.tipo_respuesta === 'seleccion_unica' && pregunta.opciones}
                  <select
                    id="{seccion.seccion}-{i}-{pregunta.id}"
                    value={fila[pregunta.id] ?? ''}
                    onchange={(e) => updateCell(i, pregunta, (e.currentTarget as HTMLSelectElement).value)}
                  >
                    <option value="">— Selecciona —</option>
                    {#each pregunta.opciones as opcion}
                      <option value={opcion}>{opcion}</option>
                    {/each}
                  </select>
                {:else if pregunta.tipo_respuesta === 'numerico'}
                  <input
                    id="{seccion.seccion}-{i}-{pregunta.id}"
                    type="number"
                    inputmode="decimal"
                    step="any"
                    value={fila[pregunta.id] ?? ''}
                    oninput={(e) => updateCell(i, pregunta, (e.currentTarget as HTMLInputElement).value)}
                  />
                {:else}
                  <input
                    id="{seccion.seccion}-{i}-{pregunta.id}"
                    type="text"
                    inputmode={inputModeDe(pregunta.formato)}
                    value={fila[pregunta.id] ?? ''}
                    oninput={(e) => onInputTexto(e, i, pregunta)}
                  />
                {/if}
              </div>
            {/each}
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .tabla-repetible {
    border: 1px solid rgba(0, 0, 0, 0.08);
    border-radius: 16px;
    background: white;
    padding: 1.25rem;
  }
  .tabla-header {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    margin-bottom: 1rem;
  }
  .tabla-title h4 {
    font-size: 0.95rem;
    font-weight: 700;
    color: #1A1A1A;
    margin: 0;
    font-family: 'Inter Tight', system-ui, sans-serif;
  }
  .nota {
    font-size: 0.75rem;
    color: #6B6B6B;
    margin: 0.25rem 0 0;
    font-family: 'Inter Tight', system-ui, sans-serif;
  }
  .btn-add {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.5rem 0.9rem;
    border-radius: 10px;
    background: linear-gradient(135deg, #10B981, #059669);
    color: white;
    border: none;
    font-size: 0.8rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    font-family: 'Inter Tight', system-ui, sans-serif;
  }
  .btn-add:hover {
    transform: scale(1.03);
    box-shadow: 0 4px 16px rgba(16, 185, 129, 0.3);
  }
  .btn-add svg {
    width: 14px;
    height: 14px;
  }
  .empty {
    text-align: center;
    padding: 2rem 1rem;
    color: #6B6B6B;
    font-family: 'Inter Tight', system-ui, sans-serif;
  }
  .empty svg {
    width: 36px;
    height: 36px;
    margin: 0 auto 0.5rem;
    color: #9CA3AF;
  }
  .empty p {
    font-size: 0.85rem;
    margin: 0;
  }
  .filas {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  .fila {
    background: #FAF7F2;
    border: 1px solid rgba(0, 0, 0, 0.06);
    border-radius: 12px;
    padding: 1rem;
  }
  .fila-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.75rem;
  }
  .fila-num {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 32px;
    height: 22px;
    padding: 0 0.5rem;
    border-radius: 6px;
    background: #10B981;
    color: white;
    font-size: 0.7rem;
    font-weight: 700;
    font-family: 'JetBrains Mono', monospace;
  }
  .btn-remove {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 8px;
    background: transparent;
    border: 1px solid rgba(0, 0, 0, 0.08);
    color: #B91C1C;
    cursor: pointer;
    transition: all 0.2s;
  }
  .btn-remove:hover {
    background: #FEE2E2;
    border-color: #FCA5A5;
  }
  .btn-remove svg {
    width: 14px;
    height: 14px;
  }
  .fila-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
  @media (min-width: 640px) {
    .fila-grid { grid-template-columns: repeat(2, 1fr); }
  }
  .campo {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
  }
  .campo label {
    font-size: 0.75rem;
    color: #4A4A4A;
    font-weight: 500;
    font-family: 'Inter Tight', system-ui, sans-serif;
  }
  .req {
    color: #B91C1C;
    margin-left: 2px;
  }
  .campo input,
  .campo select {
    padding: 0.55rem 0.75rem;
    border: 1px solid rgba(0, 0, 0, 0.12);
    border-radius: 8px;
    background: white;
    font-size: 0.85rem;
    color: #1A1A1A;
    font-family: 'Inter Tight', system-ui, sans-serif;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .campo input:focus,
  .campo select:focus {
    outline: none;
    border-color: #10B981;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  }
</style>
