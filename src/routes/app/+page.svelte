<script lang="ts">
	import { fly, fade } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import '$lib/styles/app-theme.css';

	const metricas = [
		{ valor: 'Offline', etiqueta: 'Diligencia sin señal' },
		{ valor: 'Android', etiqueta: 'y iOS' },
		{ valor: 'Interno', etiqueta: 'Solo conductores' }
	];

	const bloques = [
		{
			eyebrow: 'FORMATOS HSEQ',
			titulo: 'Diligencia sin depender de la señal',
			detalle:
				'Inspecciones preoperacionales, actas de entrega y reportes se llenan aunque no haya cobertura. Cada cambio queda guardado en el teléfono y el envío entra en una cola que se sincroniza sola al recuperar internet, sin duplicar registros.',
			puntos: [
				'Autoguardado permanente en el dispositivo',
				'Cola de envío con reintento automático',
				'Campos obligatorios señalados antes de enviar'
			],
			imagen: '/app/formato.png',
			alt: 'Formato preoperacional abierto en la aplicación, con la tarjeta de contexto obligatorio para seleccionar la placa'
		},
		{
			eyebrow: 'JORNADA LABORAL',
			titulo: 'El día reportado en un minuto',
			detalle:
				'El conductor registra su jornada con uno o varios tramos: vehículo, cliente, horas, kilometraje y descripción del servicio. Las horas se calculan solas y la app avisa cuando la jornada cruzó la medianoche.',
			puntos: [
				'Buscador de placas y clientes, sin escribir a mano',
				'Selectores nativos de fecha y hora',
				'Cálculo automático de horas conducidas'
			],
			imagen: '/app/jornada.png',
			alt: 'Pantalla de registro de jornada con selección de vehículo, cliente y horas de inicio y fin'
		},
		{
			eyebrow: 'SERVICIOS',
			titulo: 'Saber a dónde antes de salir',
			detalle:
				'Cada asignación muestra origen, destino, cliente y vehículo. Desde el detalle se abre el recorrido sobre el mapa y la navegación hasta el punto de encuentro.',
			puntos: [
				'Origen y destino con estado del servicio',
				'Recorrido dibujado sobre el mapa',
				'Búsqueda por ciudad, cliente o placa'
			],
			imagen: '/app/servicios.png',
			alt: 'Listado de servicios asignados con origen, destino, cliente y placa'
		},
		{
			eyebrow: 'HISTORIAL',
			titulo: 'Todo lo reportado, a la mano',
			detalle:
				'El conductor consulta sus días laborados del mes, cuántos quedan por sincronizar y el detalle de cada jornada. También accede a sus desprendibles de pago y primas, con descarga en PDF.',
			puntos: [
				'Historial mensual navegable',
				'Indicador de registros pendientes por sincronizar',
				'Desprendibles y primas descargables'
			],
			imagen: '/app/dias.png',
			alt: 'Historial mensual de días laborados con métricas del mes'
		}
	];
</script>

<svelte:head>
	<title>Portal del Conductor | Transmeralda S.A.S.</title>
	<meta
		name="description"
		content="Aplicación móvil de Transmeralda S.A.S. para que sus conductores diligencien formatos HSEQ, registren su jornada y consulten servicios y desprendibles, incluso sin conexión."
	/>
</svelte:head>

<div class="pc page" in:fade={{ duration: 400 }}>
	<nav class="nav">
		<a href="/" class="back">
			<svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
			</svg>
			Volver al inicio
		</a>
	</nav>

	<div class="shell" in:fly={{ y: 24, duration: 600, easing: cubicOut }}>
		<header class="pc-hero hero">
			<div class="hero-copy">
				<span class="pc-eyebrow hero-eyebrow">PORTAL DEL CONDUCTOR</span>
				<h1 class="pc-hero-title">Tu jornada, en un solo lugar</h1>
				<p class="hero-subtitle">
					La operación de transporte especial exige diligenciar formatos antes de cada recorrido y
					dejar constancia de la jornada. En carretera eso rara vez ocurre con buena señal.
				</p>
			</div>
			<img class="hero-mascot" src="/app/saludando.png" alt="" aria-hidden="true" />
		</header>

		<div class="metrics">
			{#each metricas as metrica, i (metrica.etiqueta)}
				<div class="metric" class:divider={i > 0}>
					<span class="metric-value">{metrica.valor}</span>
					<span class="metric-label">{metrica.etiqueta}</span>
				</div>
			{/each}
		</div>

		<section class="pc-card intro">
			<h2 class="pc-card-title">Quién la usa</h2>
			<p class="pc-body">
				El acceso está restringido a conductores vinculados a Transmeralda S.A.S. No es una aplicación
				de uso público ni permite registro abierto: el ingreso se hace con el número de cédula y un
				enlace temporal enviado al correo registrado por la empresa.
			</p>
		</section>

		<div class="pc-section-header">
			<h2 class="pc-title">Qué hace la aplicación</h2>
			<span class="pc-section-detail">{bloques.length} módulos</span>
		</div>

		{#each bloques as bloque, i (bloque.titulo)}
			<section class="bloque" class:invertido={i % 2 === 1}>
				<div class="bloque-copy">
					<span class="pc-eyebrow bloque-eyebrow">{bloque.eyebrow}</span>
					<h3 class="pc-title">{bloque.titulo}</h3>
					<p class="pc-body">{bloque.detalle}</p>
					<ul class="puntos">
						{#each bloque.puntos as punto (punto)}
							<li>{punto}</li>
						{/each}
					</ul>
				</div>
				<div class="bloque-device">
					<div class="pc-device">
						<img src={bloque.imagen} alt={bloque.alt} loading="lazy" />
					</div>
				</div>
			</section>
		{/each}

		<section class="pc-card cierre">
			<span class="pc-chip">Privacidad</span>
			<h2 class="pc-title">Datos que utiliza</h2>
			<p class="pc-body">
				La aplicación trata datos personales del conductor y, para la navegación hacia los servicios,
				solicita acceso a la ubicación del dispositivo mientras está en uso. No accede a la ubicación
				en segundo plano ni realiza seguimiento fuera de la aplicación.
			</p>
			<a class="pc-button" href="/app/politica-de-privacidad">Ver política de privacidad</a>
		</section>

		<section class="pc-card soporte">
			<img class="soporte-mascot" src="/app/trabajando.png" alt="" aria-hidden="true" />
			<div>
				<h2 class="pc-card-title">Soporte</h2>
				<p class="pc-body">
					Para reportar fallas, solicitar acceso o resolver dudas sobre el tratamiento de sus datos:
				</p>
				<ul class="contacto">
					<li><strong>Correo:</strong> operaciones.transmeraldasas@gmail.com</li>
					<li><strong>Teléfono:</strong> +57 323 234 0117</li>
				</ul>
			</div>
		</section>
	</div>
</div>

<style>
	.page {
		min-height: 100vh;
	}

	.nav {
		padding: 1rem 1.5rem;
		border-bottom: 1px solid var(--pc-border);
		background: var(--pc-white);
		position: sticky;
		top: 0;
		z-index: 10;
	}

	.back {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		color: var(--pc-primary);
		text-decoration: none;
		font-size: 0.9rem;
		font-weight: 700;
		transition: color 0.2s ease;
	}

	.back:hover {
		color: var(--pc-primary-dark);
	}

	/* El contenedor imita el `Page` del móvil: 16px de gutter y 14 de gap. */
	.shell {
		max-width: 1040px;
		margin: 0 auto;
		padding: 1.5rem 1rem 4rem;
		display: flex;
		flex-direction: column;
		gap: 0.9rem;
	}

	/* Hero */
	.hero {
		min-height: 200px;
		padding: 1.5rem;
		display: flex;
		align-items: center;
	}

	.hero-copy {
		position: relative;
		z-index: 2;
		width: 100%;
		max-width: 34rem;
	}

	.hero-eyebrow {
		color: var(--pc-hero-eyebrow);
		margin-bottom: 0.6rem;
	}

	.hero :global(h1) {
		color: var(--pc-white);
		margin-bottom: 0.75rem;
	}

	.hero-subtitle {
		color: var(--pc-hero-subtitle);
		font-size: 0.95rem;
		line-height: 1.65;
		margin: 0;
	}

	.hero-mascot {
		position: absolute;
		right: -12px;
		bottom: -14px;
		width: 170px;
		height: 170px;
		object-fit: contain;
		z-index: 2;
		display: none;
	}

	/* `MetricStrip` del móvil */
	.metrics {
		display: flex;
		background: var(--pc-white);
		border-radius: var(--pc-radius-large);
		box-shadow: var(--pc-shadow-card);
		padding: 0.9rem 0;
	}

	.metric {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.15rem;
		padding: 0 0.5rem;
		text-align: center;
	}

	.metric.divider {
		border-left: 1px solid var(--pc-border);
	}

	.metric-value {
		color: var(--pc-primary-dark);
		font-size: 1.15rem;
		font-weight: 900;
		letter-spacing: -0.4px;
	}

	.metric-label {
		color: var(--pc-muted);
		font-size: 0.65rem;
		font-weight: 700;
	}

	.intro {
		display: flex;
		flex-direction: column;
		gap: 0.55rem;
	}

	.pc-section-header {
		margin-top: 0.75rem;
		padding: 0 0.15rem;
	}

	/* Bloques de funcionalidad */
	.bloque {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1.5rem;
		align-items: center;
		background: var(--pc-white);
		border-radius: var(--pc-radius-large);
		box-shadow: var(--pc-shadow-card);
		padding: 1.4rem 1.2rem;
	}

	.bloque-eyebrow {
		color: var(--pc-primary);
		margin-bottom: 0.4rem;
	}

	.bloque :global(h3) {
		color: var(--pc-text);
		margin: 0 0 0.5rem;
	}

	.puntos {
		list-style: none;
		padding-left: 0;
		margin: 0.9rem 0 0;
	}

	.puntos li {
		position: relative;
		padding-left: 1.4rem;
		font-size: 0.9rem;
		color: var(--pc-neutral-800);
		line-height: 1.6;
		margin-bottom: 0.45rem;
	}

	.puntos li::before {
		content: '';
		position: absolute;
		left: 0;
		top: 0.5em;
		width: 9px;
		height: 9px;
		border-radius: var(--pc-radius-pill);
		background: var(--pc-primary-tint);
		border: 2px solid var(--pc-primary);
	}

	.bloque-device {
		display: flex;
		justify-content: center;
	}

	.bloque-device .pc-device {
		max-width: 230px;
	}

	.cierre {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 0.6rem;
		margin-top: 0.75rem;
	}

	.cierre :global(.pc-button) {
		margin-top: 0.4rem;
	}

	.soporte {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.soporte-mascot {
		width: 84px;
		height: 84px;
		object-fit: contain;
		flex-shrink: 0;
		display: none;
	}

	.contacto {
		list-style: none;
		padding-left: 0;
		margin: 0.5rem 0 0;
	}

	.contacto li {
		font-size: 0.9rem;
		color: var(--pc-muted);
		line-height: 1.7;
	}

	.contacto strong {
		color: var(--pc-text);
	}

	@media (min-width: 560px) {
		.hero-mascot,
		.soporte-mascot {
			display: block;
		}

		.hero-copy {
			width: 68%;
		}
	}

	@media (min-width: 860px) {
		.shell {
			padding: 2rem 1.5rem 5rem;
			gap: 1rem;
		}

		.hero {
			min-height: 240px;
			padding: 2.25rem;
		}

		.hero-mascot {
			width: 220px;
			height: 220px;
		}

		.bloque {
			grid-template-columns: 1fr 0.78fr;
			gap: 2.5rem;
			padding: 2rem 2.25rem;
		}

		.bloque.invertido .bloque-copy {
			order: 2;
		}
	}
</style>
