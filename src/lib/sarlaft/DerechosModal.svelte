<script lang="ts">
  import { fade, fly } from 'svelte/transition'
  import { quintOut } from 'svelte/easing'

  type Props = {
    open: boolean
    onClose: () => void
  }

  let { open, onClose }: Props = $props()
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
      aria-labelledby="derechos-title"
      transition:fly={{ y: 30, duration: 300, easing: quintOut }}
    >
      <header class="modal-header">
        <div>
          <span class="eyebrow">Ley 1581 de 2012 · Decreto 1377 de 2013</span>
          <h2 id="derechos-title">Tus derechos como titular de los datos</h2>
        </div>
        <button class="close-btn" onclick={onClose} aria-label="Cerrar">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </header>

      <div class="modal-body">
        <p class="lead">
          TRANSMERALDA S.A.S., en su calidad de responsable del tratamiento de datos personales,
          garantiza el pleno ejercicio de los derechos que te asisten conforme a la
          <strong>Ley 1581 de 2012</strong> y el <strong>Decreto 1377 de 2013</strong>.
        </p>

        <!-- Datos que recolectamos -->
        <section class="block">
          <h3>¿Qué datos recolectamos?</h3>
          <div class="data-grid">
            <div class="data-item">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
              <div>
                <strong>Identificación</strong>
                <p>Nombre, cédula/NIT, fecha de nacimiento, nacionalidad, firma.</p>
              </div>
            </div>
            <div class="data-item">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
              <div>
                <strong>Contacto</strong>
                <p>Dirección, teléfono, correo electrónico.</p>
              </div>
            </div>
            <div class="data-item">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
              </svg>
              <div>
                <strong>Financieros</strong>
                <p>Ingresos, egresos, patrimonio, cuentas bancarias.</p>
              </div>
            </div>
            <div class="data-item">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
              </svg>
              <div>
                <strong>Vinculación</strong>
                <p>Composición accionaria, beneficiarios finales, PEP.</p>
              </div>
            </div>
          </div>
        </section>

        <!-- Finalidad -->
        <section class="block">
          <h3>¿Para qué los usamos?</h3>
          <ul class="purpose-list">
            <li>
              <span class="bullet"></span>
              Cumplir las obligaciones de <strong>SARLAFT + PTEE</strong> (Resolución 2328 de 2025 y Resolución 14673 de 2025).
            </li>
            <li>
              <span class="bullet"></span>
              Adelantar el proceso de <strong>vinculación</strong> y conocimiento del cliente/proveedor/accionista.
            </li>
            <li>
              <span class="bullet"></span>
              Realizar <strong>validaciones en listas restrictivas</strong> y consultas de antecedentes.
            </li>
            <li>
              <span class="bullet"></span>
              Gestionar la <strong>relación contractual</strong> y el cumplimiento de obligaciones legales.
            </li>
          </ul>
        </section>

        <!-- Tus derechos -->
        <section class="block">
          <h3>Tus derechos (ARCO + revocación)</h3>
          <div class="rights-grid">
            <div class="right-item">
              <strong>Conocer</strong>
              <p>Qué datos tenemos sobre ti y para qué los usamos.</p>
            </div>
            <div class="right-item">
              <strong>Actualizar</strong>
              <p>Corregir datos desactualizados, incorrectos o incompletos.</p>
            </div>
            <div class="right-item">
              <strong>Rectificar</strong>
              <p>Modificar información que consideres errónea.</p>
            </div>
            <div class="right-item">
              <strong>Suprimir</strong>
              <p>Solicitar la eliminación de tus datos cuando aplique.</p>
            </div>
            <div class="right-item">
              <strong>Revocar</strong>
              <p>Retirar la autorización de tratamiento en cualquier momento.</p>
            </div>
            <div class="right-item">
              <strong>Quejarte</strong>
              <p>Presentar quejas ante la Superintendencia de Industria y Comercio.</p>
            </div>
          </div>
        </section>

        <!-- Contacto -->
        <section class="block contact-block">
          <h3>¿Cómo ejercer tus derechos?</h3>
          <p>
            Escríbenos a <strong>operaciones.transmeraldasas@gmail.com</strong> con tu solicitud
            y copia de tu documento de identidad. Responderemos en un plazo máximo de
            <strong>15 días hábiles</strong>.
          </p>
          <div class="contact-info">
            <div>
              <span class="ci-label">Email</span>
              <span class="ci-value">operaciones.transmeraldasas@gmail.com</span>
            </div>
            <div>
              <span class="ci-label">WhatsApp</span>
              <span class="ci-value">+57 323 234 0117</span>
            </div>
          </div>
        </section>
      </div>

      <footer class="modal-footer">
        <button class="btn-primary" onclick={onClose}>
          Entendido
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
    max-width: 800px;
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
    letter-spacing: 0.1em;
    color: #B45309;
    background: rgba(245, 158, 11, 0.08);
    padding: 0.25rem 0.6rem;
    border-radius: 5px;
    margin-bottom: 0.5rem;
    font-family: 'JetBrains Mono', monospace;
  }
  .modal-header h2 {
    font-family: 'Fraunces', Georgia, serif;
    font-size: 1.4rem;
    font-weight: 500;
    color: #0F1F1A;
    margin: 0;
    line-height: 1.25;
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
    font-size: 0.88rem;
    line-height: 1.6;
    color: #4A4A4A;
    background: rgba(245, 158, 11, 0.06);
    border: 1px solid rgba(245, 158, 11, 0.18);
    border-radius: 12px;
    padding: 0.85rem 1rem;
    margin: 0 0 1.75rem;
  }
  .lead strong { color: #92400E; }
  .block { margin-bottom: 1.75rem; }
  .block:last-child { margin-bottom: 0; }
  .modal-body h3 {
    font-family: 'Fraunces', Georgia, serif;
    font-size: 1.1rem;
    font-weight: 500;
    color: #0F1F1A;
    margin: 0 0 0.85rem;
  }
  .data-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.65rem;
  }
  @media (min-width: 600px) {
    .data-grid { grid-template-columns: repeat(2, 1fr); }
  }
  .data-item {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    background: white;
    border: 1px solid rgba(0, 0, 0, 0.06);
    border-radius: 10px;
    padding: 0.85rem 1rem;
  }
  .data-item svg {
    width: 20px;
    height: 20px;
    color: #10B981;
    flex-shrink: 0;
    margin-top: 2px;
  }
  .data-item strong {
    display: block;
    font-size: 0.82rem;
    color: #0F1F1A;
    margin-bottom: 0.2rem;
  }
  .data-item p {
    font-size: 0.78rem;
    line-height: 1.5;
    color: #4A4A4A;
    margin: 0;
  }
  .purpose-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
  }
  .purpose-list li {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    font-size: 0.85rem;
    line-height: 1.55;
    color: #4A4A4A;
  }
  .purpose-list .bullet {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #10B981;
    flex-shrink: 0;
    margin-top: 9px;
  }
  .purpose-list strong { color: #0F1F1A; }
  .rights-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.6rem;
  }
  @media (min-width: 600px) {
    .rights-grid { grid-template-columns: repeat(2, 1fr); }
  }
  @media (min-width: 900px) {
    .rights-grid { grid-template-columns: repeat(3, 1fr); }
  }
  .right-item {
    background: white;
    border: 1px solid rgba(0, 0, 0, 0.06);
    border-radius: 10px;
    padding: 0.85rem 1rem;
  }
  .right-item strong {
    display: block;
    font-size: 0.8rem;
    color: #065F46;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    margin-bottom: 0.3rem;
  }
  .right-item p {
    font-size: 0.78rem;
    line-height: 1.5;
    color: #4A4A4A;
    margin: 0;
  }
  .contact-block p {
    font-size: 0.85rem;
    line-height: 1.55;
    color: #4A4A4A;
    margin: 0 0 0.85rem;
  }
  .contact-block strong { color: #0F1F1A; }
  .contact-info {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem;
  }
  .contact-info > div {
    display: flex;
    flex-direction: column;
    background: white;
    border: 1px solid rgba(0, 0, 0, 0.06);
    border-radius: 10px;
    padding: 0.7rem 0.9rem;
  }
  .ci-label {
    font-size: 0.65rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #6B6B6B;
    font-family: 'JetBrains Mono', monospace;
  }
  .ci-value {
    font-size: 0.85rem;
    color: #0F1F1A;
    font-weight: 600;
    margin-top: 0.15rem;
  }
  .modal-footer {
    padding: 1rem 2rem;
    background: white;
    border-top: 1px solid rgba(0, 0, 0, 0.06);
    display: flex;
    justify-content: flex-end;
  }
  .btn-primary {
    padding: 0.7rem 1.6rem;
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
</style>
