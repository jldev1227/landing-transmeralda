<script lang="ts">
  /**
   * InstructivoModal — Modal con el instructivo completo de diligenciamiento.
   * Muestra: secciones con responsable + indicaciones, glosario, documentos a anexar, marco normativo.
   */
  import { fade, fly } from 'svelte/transition'
  import { quintOut } from 'svelte/easing'
  import { INSTRUCTIVO, GLOSARIO, DOCUMENTOS_ANEXAR } from './instructivo'

  type Props = {
    open: boolean
    onClose: () => void
    seccionActiva?: string | null
  }

  let { open, onClose, seccionActiva = null }: Props = $props()

  const glosarioEntries = Object.entries(GLOSARIO)

  function scrollToSection(id: string) {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  $effect(() => {
    if (open && seccionActiva) {
      setTimeout(() => {
        const el = document.getElementById(`instructivo-${seccionActiva.replace(/\s/g, '-')}`)
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    }
  })
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
      aria-labelledby="instructivo-title"
      transition:fly={{ y: 30, duration: 300, easing: quintOut }}
    >
      <header class="modal-header">
        <div>
          <span class="eyebrow">Instructivo de diligenciamiento</span>
          <h2 id="instructivo-title">Cómo llenar este formulario</h2>
        </div>
        <button class="close-btn" onclick={onClose} aria-label="Cerrar">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </header>

      <div class="modal-body">
        <!-- Tabla de contenidos (navegación rápida) -->
        <nav class="toc">
          <a href="#instructivo-secciones" onclick={(e) => { e.preventDefault(); scrollToSection('instructivo-secciones') }}>
            Secciones del instructivo
          </a>
          <a href="#instructivo-glosario" onclick={(e) => { e.preventDefault(); scrollToSection('instructivo-glosario') }}>
            Glosario
          </a>
          <a href="#instructivo-documentos" onclick={(e) => { e.preventDefault(); scrollToSection('instructivo-documentos') }}>
            Documentos a anexar
          </a>
          <a href="#instructivo-marco" onclick={(e) => { e.preventDefault(); scrollToSection('instructivo-marco') }}>
            Marco normativo
          </a>
        </nav>

        <!-- Secciones del instructivo -->
        <section id="instructivo-secciones">
          <h3>Secciones del instructivo</h3>
          <p class="section-intro">
            A continuación se describen las responsabilidades y lineamientos para el correcto diligenciamiento
            de cada parte del formulario, según el rol de quien lo completa.
          </p>

          <div class="secciones-grid">
            {#each INSTRUCTIVO as item}
              <article
                class="instructivo-card"
                class:highlight={seccionActiva === item.seccion}
                id={`instructivo-${item.seccion.replace(/\s/g, '-')}`}
              >
                <header class="card-head">
                  <h4>{item.seccion}</h4>
                  <span
                    class="responsable-badge"
                    class:cliente={item.responsable === 'Cliente'}
                    class:oficial={item.responsable === 'Oficial de Cumplimiento'}
                    class:ambos={item.responsable === 'Ambos'}
                  >
                    {item.responsable}
                  </span>
                </header>
                <ul>
                  {#each item.indicaciones as indicacion}
                    <li>
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{indicacion}</span>
                    </li>
                  {/each}
                </ul>
              </article>
            {/each}
          </div>
        </section>

        <!-- Glosario -->
        <section id="instructivo-glosario">
          <h3>Glosario</h3>
          <p class="section-intro">
            Términos técnicos utilizados en el formulario y en el marco normativo SARLAFT + PTEE.
          </p>
          <dl class="glosario">
            {#each glosarioEntries as [termino, definicion]}
              <div class="glosario-item">
                <dt>{termino}</dt>
                <dd>{definicion}</dd>
              </div>
            {/each}
          </dl>
        </section>

        <!-- Documentos a anexar -->
        <section id="instructivo-documentos">
          <h3>Documentos a anexar</h3>
          <p class="section-intro">
            Una vez enviado el formulario, debes hacer llegar los siguientes documentos al correo
            <strong>operaciones.transmeraldasas@gmail.com</strong> o entregarlos físicamente en las
            instalaciones de TRANSMERALDA S.A.S.
          </p>

          <div class="documentos-grid">
            <article class="doc-block">
              <h4><span class="badge-pj">PJ</span> Personas Jurídicas</h4>
              <ol>
                {#each DOCUMENTOS_ANEXAR.personas_juridicas as doc}
                  <li>{doc.replace(/^\d+\.\s*/, '')}</li>
                {/each}
              </ol>
            </article>
            <article class="doc-block">
              <h4><span class="badge-pn">PN</span> Personas Naturales</h4>
              <ol>
                {#each DOCUMENTOS_ANEXAR.personas_naturales as doc}
                  <li>{doc.replace(/^\d+\.\s*/, '')}</li>
                {/each}
              </ol>
            </article>
          </div>

          <p class="doc-nota">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            {DOCUMENTOS_ANEXAR.nota}
          </p>
        </section>

        <!-- Marco normativo -->
        <section id="instructivo-marco">
          <h3>Marco normativo</h3>
          <ul class="marco">
            <li><strong>Resolución 2328 de 2025</strong> — Superintendencia de Sociedades</li>
            <li><strong>Resolución 14673 de 2025</strong> — Superintendencia de Sociedades</li>
            <li><strong>Ley 1581 de 2012</strong> — Protección de datos personales</li>
            <li><strong>Decreto 1377 de 2013</strong> — Reglamentación parcial sobre protección de datos</li>
          </ul>
        </section>
      </div>

      <footer class="modal-footer">
        <button class="btn-secondary" onclick={onClose}>Cerrar</button>
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
    max-width: 900px;
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
  .close-btn svg {
    width: 18px;
    height: 18px;
  }
  .modal-body {
    flex: 1;
    overflow-y: auto;
    padding: 1.5rem 2rem 2rem;
  }
  .toc {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    background: white;
    border: 1px solid rgba(0, 0, 0, 0.06);
    border-radius: 12px;
    margin-bottom: 1.5rem;
  }
  .toc a {
    font-size: 0.78rem;
    color: #065F46;
    text-decoration: none;
    padding: 0.35rem 0.7rem;
    border-radius: 8px;
    background: rgba(16, 185, 129, 0.06);
    font-weight: 500;
    transition: background 0.15s;
  }
  .toc a:hover {
    background: rgba(16, 185, 129, 0.15);
  }
  .modal-body h3 {
    font-family: 'Fraunces', Georgia, serif;
    font-size: 1.25rem;
    font-weight: 500;
    color: #0F1F1A;
    margin: 2rem 0 0.4rem;
  }
  .modal-body h3:first-child {
    margin-top: 0;
  }
  .section-intro {
    font-size: 0.85rem;
    color: #4A4A4A;
    line-height: 1.55;
    margin: 0 0 1.25rem;
  }
  .secciones-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  @media (min-width: 768px) {
    .secciones-grid { grid-template-columns: repeat(2, 1fr); }
  }
  .instructivo-card {
    background: white;
    border: 1px solid rgba(0, 0, 0, 0.06);
    border-radius: 14px;
    padding: 1.1rem;
    transition: all 0.3s;
  }
  .instructivo-card.highlight {
    border-color: #10B981;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  }
  .card-head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
  }
  .card-head h4 {
    font-size: 0.85rem;
    font-weight: 700;
    color: #0F1F1A;
    margin: 0;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-family: 'Inter Tight', system-ui, sans-serif;
  }
  .responsable-badge {
    display: inline-block;
    padding: 0.2rem 0.5rem;
    border-radius: 5px;
    font-size: 0.65rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-family: 'JetBrains Mono', monospace;
    white-space: nowrap;
  }
  .responsable-badge.cliente {
    background: rgba(16, 185, 129, 0.1);
    color: #065F46;
  }
  .responsable-badge.oficial {
    background: rgba(99, 102, 241, 0.1);
    color: #4338CA;
  }
  .responsable-badge.ambos {
    background: rgba(245, 158, 11, 0.1);
    color: #B45309;
  }
  .instructivo-card ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .instructivo-card li {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    font-size: 0.82rem;
    line-height: 1.5;
    color: #4A4A4A;
  }
  .instructivo-card li svg {
    width: 16px;
    height: 16px;
    color: #10B981;
    flex-shrink: 0;
    margin-top: 2px;
  }
  .glosario {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
  @media (min-width: 768px) {
    .glosario { grid-template-columns: repeat(2, 1fr); }
  }
  .glosario-item {
    background: white;
    border: 1px solid rgba(0, 0, 0, 0.06);
    border-radius: 12px;
    padding: 1rem;
  }
  .glosario-item dt {
    font-size: 0.78rem;
    font-weight: 700;
    color: #065F46;
    margin-bottom: 0.3rem;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }
  .glosario-item dd {
    font-size: 0.82rem;
    line-height: 1.55;
    color: #4A4A4A;
    margin: 0;
  }
  .documentos-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  @media (min-width: 768px) {
    .documentos-grid { grid-template-columns: repeat(2, 1fr); }
  }
  .doc-block {
    background: white;
    border: 1px solid rgba(0, 0, 0, 0.06);
    border-radius: 14px;
    padding: 1.1rem;
  }
  .doc-block h4 {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9rem;
    font-weight: 700;
    color: #0F1F1A;
    margin: 0 0 0.75rem;
  }
  .badge-pj, .badge-pn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 22px;
    border-radius: 5px;
    font-size: 0.65rem;
    font-weight: 700;
    color: white;
    font-family: 'JetBrains Mono', monospace;
  }
  .badge-pj { background: #4338CA; }
  .badge-pn { background: #0891B2; }
  .doc-block ol {
    padding-left: 1.25rem;
    margin: 0;
  }
  .doc-block li {
    font-size: 0.82rem;
    line-height: 1.55;
    color: #4A4A4A;
    margin-bottom: 0.4rem;
  }
  .doc-nota {
    display: flex;
    align-items: flex-start;
    gap: 0.6rem;
    margin-top: 1rem;
    padding: 0.85rem 1rem;
    background: rgba(245, 158, 11, 0.08);
    border: 1px solid rgba(245, 158, 11, 0.2);
    border-radius: 10px;
    font-size: 0.78rem;
    line-height: 1.55;
    color: #92400E;
  }
  .doc-nota svg {
    width: 18px;
    height: 18px;
    color: #D97706;
    flex-shrink: 0;
    margin-top: 2px;
  }
  .marco {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .marco li {
    background: white;
    border: 1px solid rgba(0, 0, 0, 0.06);
    border-radius: 10px;
    padding: 0.75rem 1rem;
    font-size: 0.85rem;
    color: #4A4A4A;
  }
  .marco strong {
    color: #065F46;
    font-weight: 700;
  }
  .modal-footer {
    padding: 1rem 2rem;
    background: white;
    border-top: 1px solid rgba(0, 0, 0, 0.06);
    display: flex;
    justify-content: flex-end;
  }
  .btn-secondary {
    padding: 0.6rem 1.5rem;
    border-radius: 10px;
    background: white;
    color: #1A1A1A;
    border: 1px solid rgba(0, 0, 0, 0.12);
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    font-family: 'Inter Tight', system-ui, sans-serif;
  }
  .btn-secondary:hover {
    background: #FAF7F2;
    border-color: rgba(0, 0, 0, 0.2);
  }
</style>
