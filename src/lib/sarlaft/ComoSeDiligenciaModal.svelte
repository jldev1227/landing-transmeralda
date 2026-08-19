<script lang="ts">
  import { fade, fly } from 'svelte/transition'
  import { quintOut } from 'svelte/easing'
  import type { Formulario } from './types'
  import { getInstructivo, type InstructivoFormulario } from './instructivo'

  type Props = {
    open: boolean
    onClose: () => void
    formulario: Formulario | null
    /** Instructivo del formulario; aporta el ejemplo de radicado y de anexos. */
    instructivo?: InstructivoFormulario
  }

  let { open, onClose, formulario, instructivo }: Props = $props()

  const ins = $derived(instructivo ?? getInstructivo(formulario?.codigo))
  /** Preguntas de tipo firma: define si el paso 2 habla de una o de dos firmas. */
  const totalFirmas = $derived(
    formulario
      ? formulario.secciones.reduce(
          (acc, s) => acc + s.preguntas.filter((p) => p.tipo_respuesta === 'firma').length,
          0
        )
      : 1
  )
</script>

{#if open}
  <div
    class="modal-backdrop"
    onclick={onClose}
    onkeydown={(e) => e.key === 'Escape' && onClose()}
    role="button"
    tabindex="-1"
    transition:fade={{ duration: 200 }}
  >
    <div
      class="modal"
      onclick={(e) => e.stopPropagation()}
      onkeydown={(e) => e.stopPropagation()}
      role="dialog"
      aria-modal="true"
      tabindex="-1"
      aria-labelledby="como-title"
      transition:fly={{ y: 30, duration: 300, easing: quintOut }}
    >
      <header class="modal-header">
        <div>
          <span class="eyebrow">Guía de diligenciamiento</span>
          <h2 id="como-title">Cómo se diligencia este formulario</h2>
        </div>
        <button class="close-btn" onclick={onClose} aria-label="Cerrar">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </header>

      <div class="modal-body">
        <p class="lead">
          El proceso completo toma entre <strong>10 y 15 minutos</strong>.
          Puedes pausar y volver más tarde usando tu correo de radicado.
        </p>

        <!-- Flujo visual -->
        <section class="flow">
          <h3>El flujo es así</h3>
          <ol class="steps">
            <li>
              <div class="step-num">1</div>
              <div class="step-body">
                <h4>Diligenciar las secciones</h4>
                <p>
                  {#if formulario}
                    {formulario.total_secciones ?? formulario.secciones.length} secciones con {formulario.secciones.reduce((acc, s) => acc + s.preguntas.length, 0)} preguntas en total.
                  {:else}
                    Las secciones del formulario con sus preguntas.
                  {/if}
                  Cada sección se guarda al pasar a la siguiente.
                </p>
              </div>
            </li>
            <li>
              <div class="step-num">2</div>
              <div class="step-body">
                <h4>{totalFirmas > 1 ? 'Firmas digitales' : 'Firma digital'}</h4>
                <p>
                  {#if totalFirmas > 1}
                    En la última sección hay <strong>{totalFirmas} firmas</strong>: la del propietario
                    del vehículo y la del tercero autorizado, en señal de aceptación. Puedes firmar
                    con el mouse, con el dedo en el celular, o subir una imagen de tu firma. Si
                    diligencian desde un solo dispositivo, firma tú primero y luego pásaselo al
                    tercero. Sin ambas firmas no se puede enviar.
                  {:else}
                    Al final encontrarás un espacio para firmar digitalmente con el mouse o el touch
                    de tu celular. La firma tiene la misma validez que una firma manuscrita.
                  {/if}
                </p>
              </div>
            </li>
            <li>
              <div class="step-num">3</div>
              <div class="step-body">
                <h4>Checklist de documentos</h4>
                <p>
                  Antes de enviar, verás una pantalla con la lista de documentos que debes
                  anexar ({ins.ejemploDocumentos}). Adjunta los obligatorios y envía el formulario.
                </p>
              </div>
            </li>
            <li>
              <div class="step-num">4</div>
              <div class="step-body">
                <h4>Recibirás un radicado</h4>
                <p>
                  Al enviar te mostraremos un número de radicado único (ej. {ins.ejemploRadicado}).
                  Guárdalo: lo necesitarás para cualquier seguimiento.
                </p>
              </div>
            </li>
            <li>
              <div class="step-num">5</div>
              <div class="step-body">
                <h4>Validación interna</h4>
                <p>
                  El Oficial de Cumplimiento revisará la información. Si requiere aclaraciones,
                  te contactaremos al correo que registraste.
                </p>
              </div>
            </li>
          </ol>
        </section>

        <!-- Tips -->
        <section class="tips">
          <h3>Consejos prácticos</h3>
          <ul>
            <li>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <strong>Dedica 10-15 minutos</strong> sin interrupciones para completarlo de una sola vez.
              </div>
            </li>
            <li>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <div>
                <strong>Ten a la mano los documentos</strong> que vas a anexar
                ({ins.ejemploDocumentos}) antes de empezar.
              </div>
            </li>
            <li>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <strong>Los campos marcados con <span class="req-inline">*</span> son obligatorios</strong>;
                no podrás enviar el formulario si falta alguno.
              </div>
            </li>
            <li>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
              </svg>
              <div>
                <strong>Si no entiendes un término</strong> como PEP o Beneficiario Final,
                pasa el mouse sobre él (o toca en móvil) para ver su definición.
              </div>
            </li>
          </ul>
        </section>
      </div>

      <footer class="modal-footer">
        <button class="btn-primary" onclick={onClose}>
          Entendido, comenzar
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </button>
      </footer>
    </div>
  </div>
{/if}

<style>
  .modal-backdrop {
    position: fixed;
    inset: 0;
    z-index: 100;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding: 2rem 1rem;
    background: rgba(0, 0, 0, 0.55);
    backdrop-filter: blur(8px);
    overflow-y: auto;
  }
  .modal {
    background: #FAF7F2;
    border-radius: 24px;
    width: 100%;
    max-width: 720px;
    max-height: calc(100vh - 4rem);
    display: flex;
    flex-direction: column;
    box-shadow: 0 24px 64px rgba(0, 0, 0, 0.3);
    overflow: hidden;
  }
  .modal-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
    padding: 1.5rem 2rem;
    background: white;
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  }
  .eyebrow {
    display: inline-block;
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: #10B981;
    background: rgba(16, 185, 129, 0.08);
    padding: 0.25rem 0.6rem;
    border-radius: 5px;
    margin-bottom: 0.5rem;
    font-family: 'JetBrains Mono', monospace;
  }
  .modal-header h2 {
    font-family: 'Fraunces', Georgia, serif;
    font-size: 1.5rem;
    font-weight: 500;
    color: #0F1F1A;
    margin: 0;
  }
  .close-btn {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    background: transparent;
    border: 1px solid rgba(0, 0, 0, 0.08);
    color: #6B6B6B;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
  }
  .close-btn:hover {
    background: #FEE2E2;
    color: #B91C1C;
    border-color: #FCA5A5;
  }
  .close-btn svg { width: 18px; height: 18px; }
  .modal-body {
    flex: 1;
    overflow-y: auto;
    padding: 1.5rem 2rem 2rem;
  }
  .lead {
    font-size: 0.9rem;
    line-height: 1.6;
    color: #4A4A4A;
    background: rgba(16, 185, 129, 0.06);
    border: 1px solid rgba(16, 185, 129, 0.15);
    border-radius: 12px;
    padding: 0.85rem 1rem;
    margin: 0 0 1.75rem;
  }
  .lead strong { color: #065F46; }
  .modal-body h3 {
    font-family: 'Fraunces', Georgia, serif;
    font-size: 1.15rem;
    font-weight: 500;
    color: #0F1F1A;
    margin: 0 0 1rem;
  }
  .flow { margin-bottom: 2rem; }
  .steps {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.85rem;
  }
  .steps li {
    display: flex;
    align-items: flex-start;
    gap: 0.85rem;
    background: white;
    border: 1px solid rgba(0, 0, 0, 0.06);
    border-radius: 12px;
    padding: 1rem;
  }
  .step-num {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: linear-gradient(135deg, #10B981, #059669);
    color: white;
    font-size: 0.85rem;
    font-weight: 700;
    font-family: 'JetBrains Mono', monospace;
    flex-shrink: 0;
    box-shadow: 0 2px 8px rgba(16, 185, 129, 0.25);
  }
  .step-body h4 {
    font-size: 0.9rem;
    font-weight: 700;
    color: #0F1F1A;
    margin: 0 0 0.3rem;
  }
  .step-body p {
    font-size: 0.82rem;
    line-height: 1.55;
    color: #4A4A4A;
    margin: 0;
  }
  .tips ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
  }
  .tips li {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    background: white;
    border: 1px solid rgba(0, 0, 0, 0.06);
    border-radius: 10px;
    padding: 0.85rem 1rem;
    font-size: 0.82rem;
    line-height: 1.55;
    color: #4A4A4A;
  }
  .tips li svg {
    width: 18px;
    height: 18px;
    color: #10B981;
    flex-shrink: 0;
    margin-top: 2px;
  }
  .tips li strong { color: #0F1F1A; }
  .req-inline { color: #B91C1C; font-weight: 700; }
  .modal-footer {
    padding: 1rem 2rem;
    background: white;
    border-top: 1px solid rgba(0, 0, 0, 0.06);
    display: flex;
    justify-content: flex-end;
  }
  .btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.7rem 1.4rem;
    border-radius: 10px;
    background: linear-gradient(135deg, #10B981, #059669);
    color: white;
    font-size: 0.85rem;
    font-weight: 600;
    border: none;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
    transition: all 0.2s;
    font-family: 'Inter Tight', system-ui, sans-serif;
  }
  .btn-primary:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(16, 185, 129, 0.4);
  }
  .btn-primary svg { width: 14px; height: 14px; }
</style>
