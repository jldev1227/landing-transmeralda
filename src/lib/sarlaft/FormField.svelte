<script lang="ts">
  import { inputModeDe, sanearFormato, type Pregunta } from './types'
  import FirmaPad from './FirmaPad.svelte'

  type Props = {
    pregunta: Pregunta
    value: any
    onChange: (value: any) => void
    error?: string
  }

  let { pregunta, value, onChange, error }: Props = $props()

  const id = $derived(`field-${pregunta.id}`)

  /** Las respuestas de `seleccion_multiple` viajan como arreglo de strings. */
  const seleccionadas = $derived(Array.isArray(value) ? (value as string[]) : [])

  function alternarOpcion(opcion: string) {
    onChange(
      seleccionadas.includes(opcion)
        ? seleccionadas.filter((o) => o !== opcion)
        : [...seleccionadas, opcion]
    )
  }

  /**
   * En los campos con `formato` (cédula, NIT, teléfono, número de cuenta) se
   * descartan los caracteres no admitidos mientras se escribe. Se reescribe el
   * valor del input para que el usuario vea de inmediato que no se aceptó.
   */
  function onInputTexto(e: Event) {
    const el = e.currentTarget as HTMLInputElement
    const limpio = sanearFormato(el.value, pregunta.formato)
    if (limpio !== el.value) {
      const pos = (el.selectionStart ?? limpio.length) - (el.value.length - limpio.length)
      el.value = limpio
      el.setSelectionRange(pos, pos)
    }
    onChange(limpio)
  }
</script>

<div class="form-field" class:has-error={!!error}>
  {#if pregunta.tipo_respuesta === 'declaracion_informativa'}
    <div class="declaracion">
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
      </svg>
      <div>
        <p class="decl-text">{pregunta.pregunta}</p>
        {#if pregunta.nota}
          <p class="decl-nota">{pregunta.nota}</p>
        {/if}
      </div>
    </div>
  {:else}
    <label for={id} class="label">
      <span class="label-text">
        {pregunta.pregunta}
        {#if pregunta.obligatorio}<span class="req">*</span>{/if}
      </span>
      {#if pregunta.modo_respuesta}
        <span class="modo">{pregunta.modo_respuesta}</span>
      {/if}
    </label>

    {#if pregunta.tipo_respuesta === 'firma'}
      <FirmaPad {value} onChange={onChange} />
    {:else if pregunta.tipo_respuesta === 'seleccion_unica' && pregunta.opciones}
      <div class="opciones">
        {#each pregunta.opciones as opcion}
          <button
            type="button"
            class="opcion"
            class:selected={value === opcion}
            onclick={() => onChange(opcion)}
          >
            <span class="radio" class:on={value === opcion}></span>
            <span>{opcion}</span>
          </button>
        {/each}
      </div>
    {:else if pregunta.tipo_respuesta === 'seleccion_multiple' && pregunta.opciones}
      <div class="opciones opciones--multiple">
        {#each pregunta.opciones as opcion}
          <button
            type="button"
            class="opcion"
            class:selected={seleccionadas.includes(opcion)}
            aria-pressed={seleccionadas.includes(opcion)}
            onclick={() => alternarOpcion(opcion)}
          >
            <span class="check" class:on={seleccionadas.includes(opcion)}>
              {#if seleccionadas.includes(opcion)}
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              {/if}
            </span>
            <span>{opcion}</span>
          </button>
        {/each}
      </div>
    {:else if pregunta.tipo_respuesta === 'texto_largo'}
      <textarea
        {id}
        rows="3"
        value={value ?? ''}
        oninput={(e) => onChange((e.currentTarget as HTMLTextAreaElement).value)}
      ></textarea>
    {:else if pregunta.tipo_respuesta === 'numerico'}
      <input
        {id}
        type="number"
        inputmode="decimal"
        step="any"
        value={value ?? ''}
        oninput={(e) => onChange((e.currentTarget as HTMLInputElement).value)}
      />
    {:else if pregunta.tipo_respuesta === 'fecha'}
      <input
        {id}
        type="date"
        value={value ?? ''}
        oninput={(e) => onChange((e.currentTarget as HTMLInputElement).value)}
      />
    {:else}
      <input
        {id}
        type="text"
        inputmode={inputModeDe(pregunta.formato)}
        value={value ?? ''}
        oninput={onInputTexto}
      />
    {/if}

    {#if pregunta.nota}
      <p class="nota">{pregunta.nota}</p>
    {/if}
  {/if}

  {#if error}
    <p class="error">{error}</p>
  {/if}
</div>

<style>
  .form-field {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }
  .form-field.has-error :is(input, textarea, select) {
    border-color: #FCA5A5;
  }
  .label {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
  }
  .label-text {
    font-size: 0.85rem;
    font-weight: 600;
    color: #1A1A1A;
    font-family: 'Inter Tight', system-ui, sans-serif;
  }
  .req {
    color: #B91C1C;
    margin-left: 3px;
  }
  .modo {
    font-size: 0.7rem;
    color: #9A9A9A;
    font-weight: 400;
    font-family: 'JetBrains Mono', monospace;
  }
  .nota {
    font-size: 0.72rem;
    color: #6B6B6B;
    margin: 0;
    font-family: 'Inter Tight', system-ui, sans-serif;
  }
  input[type='text'],
  input[type='number'],
  input[type='date'],
  textarea {
    padding: 0.65rem 0.85rem;
    border: 1px solid rgba(0, 0, 0, 0.12);
    border-radius: 10px;
    background: white;
    font-size: 0.9rem;
    color: #1A1A1A;
    font-family: 'Inter Tight', system-ui, sans-serif;
    transition: border-color 0.2s, box-shadow 0.2s;
    width: 100%;
    box-sizing: border-box;
  }
  textarea {
    resize: vertical;
    min-height: 80px;
  }
  input:focus,
  textarea:focus {
    outline: none;
    border-color: #10B981;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  }
  .opciones {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  .opcion {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.55rem 1rem;
    border: 1px solid rgba(0, 0, 0, 0.12);
    border-radius: 10px;
    background: white;
    color: #1A1A1A;
    font-size: 0.85rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    font-family: 'Inter Tight', system-ui, sans-serif;
  }
  .opcion:hover {
    border-color: rgba(16, 185, 129, 0.4);
  }
  .opcion.selected {
    border-color: #10B981;
    background: rgba(16, 185, 129, 0.06);
    color: #065F46;
  }
  .radio {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border: 2px solid rgba(0, 0, 0, 0.2);
    transition: all 0.2s;
    position: relative;
  }
  .radio.on {
    border-color: #10B981;
    background: #10B981;
  }
  .radio.on::after {
    content: '';
    position: absolute;
    inset: 3px;
    border-radius: 50%;
    background: white;
  }
  /* Selección múltiple: las opciones suelen ser frases largas, así que se
     apilan en columna y ocupan todo el ancho. */
  .opciones--multiple {
    flex-direction: column;
    align-items: stretch;
    gap: 0.4rem;
  }
  .opciones--multiple .opcion {
    justify-content: flex-start;
    text-align: left;
    align-items: flex-start;
    line-height: 1.45;
  }
  .check {
    width: 18px;
    height: 18px;
    border-radius: 5px;
    border: 2px solid rgba(0, 0, 0, 0.2);
    transition: all 0.2s;
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-top: 1px;
  }
  .check.on {
    border-color: #10B981;
    background: #10B981;
    color: white;
  }
  .check svg {
    width: 11px;
    height: 11px;
  }
  .declaracion {
    display: flex;
    align-items: flex-start;
    gap: 0.85rem;
    padding: 1rem 1.1rem;
    background: rgba(16, 185, 129, 0.05);
    border: 1px solid rgba(16, 185, 129, 0.18);
    border-radius: 12px;
  }
  .declaracion svg {
    width: 24px;
    height: 24px;
    color: #10B981;
    flex-shrink: 0;
    margin-top: 2px;
  }
  .decl-text {
    font-size: 0.85rem;
    color: #1A1A1A;
    margin: 0;
    line-height: 1.5;
    font-family: 'Inter Tight', system-ui, sans-serif;
  }
  .decl-nota {
    font-size: 0.72rem;
    color: #6B6B6B;
    margin: 0.4rem 0 0;
    font-style: italic;
    font-family: 'Inter Tight', system-ui, sans-serif;
  }
  .error {
    font-size: 0.75rem;
    color: #B91C1C;
    margin: 0;
    font-family: 'Inter Tight', system-ui, sans-serif;
  }
</style>
