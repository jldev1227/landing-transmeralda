<script lang="ts">
	/**
	 * Formulario de solicitud (cotización, servicio, información).
	 *
	 * Reemplaza a los botones de WhatsApp, teléfono y correo. La solicitud entra
	 * al backend (`POST /public/solicitudes`), que la radica, la clasifica y la
	 * deja en la bandeja del panel para que operaciones la verifique antes de
	 * responder. Por eso aquí NO se promete respuesta inmediata.
	 */
	import { env } from '$env/dynamic/public';
	import { onMount } from 'svelte';

	const BASE = env.PUBLIC_API_URL || 'http://localhost:4000/api';
	const ORIGEN_SITIO = 'transmeralda.com';

	type Tipo = 'cotizacion' | 'servicio' | 'informacion' | 'otro';

	const TIPOS: { valor: Tipo; etiqueta: string; ayuda: string }[] = [
		{ valor: 'cotizacion', etiqueta: 'Cotización', ayuda: 'Quiero un precio para un servicio o contrato.' },
		{ valor: 'servicio', etiqueta: 'Solicitud de servicio', ayuda: 'Ya sé qué necesito y quiero programarlo.' },
		{ valor: 'informacion', etiqueta: 'Información', ayuda: 'Tengo una pregunta sobre la empresa o el servicio.' },
		{ valor: 'otro', etiqueta: 'Otro', ayuda: 'Proveedores, empleo, convenios…' }
	];

	let tipo = $state<Tipo>('cotizacion');
	let nombre = $state('');
	let empresa = $state('');
	let documento = $state('');
	let cargo = $state('');
	let correo = $state('');
	let telefono = $state('');
	let origen = $state('');
	let destino = $state('');
	let fechaServicio = $state('');
	let pasajeros = $state('');
	let tipoVehiculo = $state('');
	let modalidad = $state('');
	let mensaje = $state('');
	let aceptaPolitica = $state(false);
	/// Campo trampa para bots: oculto a las personas, debe quedar vacío.
	let sitioWeb = $state('');

	let enviando = $state(false);
	let error = $state<string | null>(null);
	let detalles = $state<string[]>([]);
	let radicado = $state<string | null>(null);
	let inicio = 0;

	onMount(() => {
		inicio = Date.now();
	});

	const pideServicio = $derived(tipo === 'cotizacion' || tipo === 'servicio');
	const hoy = new Date().toISOString().slice(0, 10);

	async function enviar(e: SubmitEvent) {
		e.preventDefault();
		if (enviando) return;
		error = null;
		detalles = [];
		if (!aceptaPolitica) {
			error = 'Necesitamos tu autorización para tratar los datos de la solicitud.';
			return;
		}
		enviando = true;
		try {
			const r = await fetch(`${BASE}/public/solicitudes`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					tipo,
					nombre,
					empresa,
					documento,
					cargo,
					correo,
					telefono,
					origen: pideServicio ? origen : '',
					destino: pideServicio ? destino : '',
					fecha_servicio: pideServicio ? fechaServicio : '',
					pasajeros: pideServicio ? pasajeros : '',
					tipo_vehiculo: pideServicio ? tipoVehiculo : '',
					modalidad: pideServicio ? modalidad : '',
					mensaje,
					acepta_politica: aceptaPolitica,
					sitio_web: sitioWeb,
					tiempo_llenado_ms: Date.now() - inicio,
					origen_sitio: ORIGEN_SITIO
				})
			});
			const data = await r.json().catch(() => ({}));
			if (!r.ok || !data?.success) {
				error = data?.message || 'No pudimos registrar la solicitud. Intenta de nuevo en unos minutos.';
				detalles = Array.isArray(data?.details) ? data.details : [];
				return;
			}
			radicado = data.radicado ?? 'registrada';
		} catch {
			error = 'No hay conexión con el servidor. Revisa tu red e intenta de nuevo.';
		} finally {
			enviando = false;
		}
	}

	function otra() {
		radicado = null;
		mensaje = '';
		origen = '';
		destino = '';
		fechaServicio = '';
		pasajeros = '';
		tipoVehiculo = '';
		modalidad = '';
		inicio = Date.now();
	}
</script>

{#if radicado}
	<div class="sf-ok" role="status" aria-live="polite">
		<span class="sf-ok__eyebrow">Solicitud recibida</span>
		<p class="sf-ok__radicado">{radicado}</p>
		<p class="sf-ok__text">
			Guarda este número. Nuestro equipo de operaciones revisa cada solicitud, verifica los datos y se comunica
			contigo por el correo o el teléfono que indicaste, en horario de atención.
		</p>
		<p class="sf-ok__muted">
			Por seguridad de nuestros conductores y pasajeros, solo programamos servicios con solicitudes verificadas.
		</p>
		<button type="button" class="sf-btn sf-btn--ghost" onclick={otra}>Enviar otra solicitud</button>
	</div>
{:else}
	<form class="sf" onsubmit={enviar} novalidate>
		<fieldset class="sf-tipos">
			<legend class="sf-label">¿Qué necesitas?</legend>
			<div class="sf-tipos__grid">
				{#each TIPOS as t}
					<label class="sf-tipo" class:sf-tipo--activo={tipo === t.valor}>
						<input type="radio" name="tipo" value={t.valor} bind:group={tipo} />
						<span class="sf-tipo__titulo">{t.etiqueta}</span>
						<span class="sf-tipo__ayuda">{t.ayuda}</span>
					</label>
				{/each}
			</div>
		</fieldset>

		<div class="sf-grid">
			<label class="sf-campo">
				<span class="sf-label">Nombre completo <em>*</em></span>
				<input type="text" bind:value={nombre} required minlength="3" maxlength="120" autocomplete="name" />
			</label>
			<label class="sf-campo">
				<span class="sf-label">Empresa {pideServicio ? '' : '(opcional)'}</span>
				<input type="text" bind:value={empresa} maxlength="160" autocomplete="organization" placeholder="Razón social o nombre comercial" />
			</label>
			<label class="sf-campo">
				<span class="sf-label">NIT o cédula</span>
				<input type="text" bind:value={documento} maxlength="30" inputmode="numeric" placeholder="Para verificar la solicitud" />
			</label>
			<label class="sf-campo">
				<span class="sf-label">Cargo (opcional)</span>
				<input type="text" bind:value={cargo} maxlength="80" autocomplete="organization-title" />
			</label>
			<label class="sf-campo">
				<span class="sf-label">Correo <em>*</em></span>
				<input type="email" bind:value={correo} required maxlength="160" autocomplete="email" placeholder="Preferiblemente corporativo" />
			</label>
			<label class="sf-campo">
				<span class="sf-label">Teléfono <em>*</em></span>
				<input type="tel" bind:value={telefono} required maxlength="30" autocomplete="tel" placeholder="310 000 0000" />
			</label>
		</div>

		{#if pideServicio}
			<div class="sf-grid">
				<label class="sf-campo">
					<span class="sf-label">Origen</span>
					<input type="text" bind:value={origen} maxlength="160" placeholder="Municipio o base" />
				</label>
				<label class="sf-campo">
					<span class="sf-label">Destino</span>
					<input type="text" bind:value={destino} maxlength="160" placeholder="Municipio, campo o locación" />
				</label>
				<label class="sf-campo">
					<span class="sf-label">Fecha del servicio</span>
					<input type="date" bind:value={fechaServicio} min={hoy} />
				</label>
				<label class="sf-campo">
					<span class="sf-label">Pasajeros</span>
					<input type="number" bind:value={pasajeros} min="1" max="500" inputmode="numeric" />
				</label>
				<label class="sf-campo">
					<span class="sf-label">Tipo de vehículo</span>
					<select bind:value={tipoVehiculo}>
						<option value="">Sin preferencia</option>
						<option>Camioneta 4x4</option>
						<option>Van (hasta 19 pasajeros)</option>
						<option>Microbús / buseta</option>
						<option>Bus (más de 30 pasajeros)</option>
					</select>
				</label>
				<label class="sf-campo">
					<span class="sf-label">Modalidad</span>
					<select bind:value={modalidad}>
						<option value="">Sin definir</option>
						<option value="eventual">Eventual (un viaje o evento)</option>
						<option value="recurrente">Recurrente (rutas o turnos)</option>
						<option value="contrato">Contrato (mensual o por proyecto)</option>
					</select>
				</label>
			</div>
		{/if}

		<label class="sf-campo">
			<span class="sf-label">Cuéntanos el detalle <em>*</em></span>
			<textarea bind:value={mensaje} required minlength="10" maxlength="3000" rows="4" placeholder={pideServicio ? 'Turnos, frecuencia, requisitos HSEQ, duración del contrato…' : 'Escribe tu consulta'}></textarea>
		</label>

		<!-- Trampa para bots: fuera de la vista y del orden de tabulación. -->
		<div class="sf-trampa" aria-hidden="true">
			<label>Sitio web <input type="text" bind:value={sitioWeb} tabindex="-1" autocomplete="off" /></label>
		</div>

		<label class="sf-check">
			<input type="checkbox" bind:checked={aceptaPolitica} required />
			<span>
				Autorizo a Transmeralda S.A.S. el tratamiento de mis datos para atender esta solicitud, según la
				<a href="/politica-de-privacidad">política de privacidad</a> (Ley 1581 de 2012).
			</span>
		</label>

		{#if error}
			<div class="sf-error" role="alert">
				<p>{error}</p>
				{#if detalles.length}
					<ul>{#each detalles as d}<li>{d}</li>{/each}</ul>
				{/if}
			</div>
		{/if}

		<div class="sf-pie">
			<button type="submit" class="sf-btn" disabled={enviando}>
				{enviando ? 'Enviando…' : 'Enviar solicitud'}
			</button>
			<p class="sf-pie__nota">
				Verificamos cada solicitud antes de responder. Horario de atención: lunes a sábado, 6:00 a. m. a 6:00 p. m.
			</p>
		</div>
	</form>
{/if}

<style>
	.sf { display: flex; flex-direction: column; gap: 1.5rem; }
	.sf-label {
		display: block;
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.6875rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--text-on-dark-muted);
		margin-bottom: 0.4rem;
	}
	.sf-label em { color: var(--emerald-500); font-style: normal; }
	.sf-tipos { border: 0; padding: 0; margin: 0; min-width: 0; }
	.sf-tipos__grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; }
	@media (min-width: 640px) { .sf-tipos__grid { grid-template-columns: repeat(4, 1fr); } }
	.sf-tipo {
		position: relative;
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
		padding: 0.85rem 0.9rem;
		border: 1px solid var(--rule-on-dark);
		border-radius: 0.75rem;
		cursor: pointer;
		transition: border-color 0.2s, background 0.2s;
	}
	.sf-tipo input { position: absolute; opacity: 0; inset: 0; cursor: pointer; }
	.sf-tipo:hover { border-color: rgba(240, 237, 230, 0.4); }
	.sf-tipo--activo { border-color: var(--emerald-500); background: rgba(16, 185, 129, 0.1); }
	.sf-tipo:has(input:focus-visible) { outline: 2px solid var(--emerald-500); outline-offset: 2px; }
	.sf-tipo__titulo { font-family: 'Inter Tight', system-ui, sans-serif; font-weight: 600; font-size: 0.9375rem; color: var(--text-on-dark); }
	.sf-tipo__ayuda { font-size: 0.75rem; line-height: 1.3; color: var(--text-on-dark-muted); }
	.sf-grid { display: grid; grid-template-columns: 1fr; gap: 1rem; }
	@media (min-width: 640px) { .sf-grid { grid-template-columns: 1fr 1fr; } }
	.sf-campo { display: block; min-width: 0; }
	.sf-campo input, .sf-campo select, .sf-campo textarea {
		width: 100%;
		box-sizing: border-box;
		background: rgba(255, 255, 255, 0.04);
		border: 1px solid var(--rule-on-dark);
		border-radius: 0.6rem;
		padding: 0.7rem 0.85rem;
		color: var(--text-on-dark);
		font-family: 'Inter Tight', system-ui, sans-serif;
		font-size: 0.9375rem;
		transition: border-color 0.2s, background 0.2s;
	}
	.sf-campo select option { color: #111; }
	.sf-campo input::placeholder, .sf-campo textarea::placeholder { color: rgba(240, 237, 230, 0.35); }
	.sf-campo input:focus, .sf-campo select:focus, .sf-campo textarea:focus {
		outline: none;
		border-color: var(--emerald-500);
		background: rgba(255, 255, 255, 0.07);
	}
	.sf-campo input[type='date'] { color-scheme: dark; }
	.sf-campo textarea { resize: vertical; min-height: 6rem; }
	.sf-trampa { position: absolute; left: -10000px; width: 1px; height: 1px; overflow: hidden; }
	.sf-check { display: flex; gap: 0.75rem; align-items: flex-start; font-size: 0.8125rem; line-height: 1.5; color: var(--text-on-dark-muted); cursor: pointer; }
	.sf-check input { margin-top: 0.2rem; accent-color: var(--emerald-500); flex-shrink: 0; }
	.sf-check a { color: var(--text-on-dark); text-decoration: underline; text-underline-offset: 2px; }
	.sf-error {
		border: 1px solid rgba(248, 113, 113, 0.5);
		background: rgba(248, 113, 113, 0.1);
		color: #fecaca;
		border-radius: 0.6rem;
		padding: 0.75rem 1rem;
		font-size: 0.875rem;
	}
	.sf-error p { margin: 0; }
	.sf-error ul { margin: 0.5rem 0 0; padding-left: 1.1rem; font-size: 0.8125rem; }
	.sf-pie { display: flex; flex-direction: column; gap: 0.75rem; align-items: flex-start; }
	.sf-pie__nota { margin: 0; font-size: 0.8125rem; color: var(--text-on-dark-muted); }
	.sf-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.9rem 1.75rem;
		border-radius: 999px;
		border: 1px solid transparent;
		background: var(--emerald-500);
		color: #fff;
		font-family: 'Inter Tight', system-ui, sans-serif;
		font-weight: 600;
		font-size: 0.9375rem;
		cursor: pointer;
		transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
		box-shadow: 0 4px 20px rgba(16, 185, 129, 0.3);
	}
	.sf-btn:hover:not(:disabled) { background: var(--emerald-600); transform: translateY(-2px); }
	.sf-btn:disabled { opacity: 0.6; cursor: wait; }
	.sf-btn--ghost { background: transparent; border-color: var(--rule-on-dark); color: var(--text-on-dark); box-shadow: none; }
	.sf-btn--ghost:hover:not(:disabled) { background: rgba(255, 255, 255, 0.06); }
	.sf-ok { display: flex; flex-direction: column; gap: 0.75rem; align-items: flex-start; padding: 1.5rem; border: 1px solid rgba(16, 185, 129, 0.4); border-radius: 1rem; background: rgba(16, 185, 129, 0.08); }
	.sf-ok__eyebrow { font-family: 'JetBrains Mono', monospace; font-size: 0.6875rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--emerald-500); }
	.sf-ok__radicado { margin: 0; font-family: 'JetBrains Mono', monospace; font-size: clamp(1.5rem, 3vw, 2.25rem); color: var(--text-on-dark); }
	.sf-ok__text { margin: 0; font-size: 0.9375rem; line-height: 1.6; color: var(--text-on-dark); }
	.sf-ok__muted { margin: 0; font-size: 0.8125rem; color: var(--text-on-dark-muted); }
</style>
