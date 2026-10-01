<script lang="ts">
	import { fly, fade } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import '$lib/styles/app-theme.css';

	const datosEstructurados = {
		'@context': 'https://schema.org',
		'@type': 'MobileApplication',
		name: 'Portal del Conductor',
		alternateName: 'Portal del Conductor Transmeralda',
		applicationCategory: 'BusinessApplication',
		operatingSystem: 'Android, iOS',
		url: 'https://transmeralda.com/app',
		image: 'https://transmeralda.com/app/og-app.jpg',
		inLanguage: 'es-CO',
		description:
			'Aplicación móvil interna de Transmeralda S.A.S. para que sus conductores diligencien formatos HSEQ sin conexión, registren su jornada laboral y consulten servicios asignados y desprendibles de pago.',
		privacyPolicy: 'https://transmeralda.com/app/politica-de-privacidad',
		// Sin `offers`: es una herramienta interna, no se distribuye al público.
		author: {
			'@type': 'Organization',
			name: 'Transmeralda S.A.S.',
			'@id': 'https://transmeralda.com/#organization',
			url: 'https://transmeralda.com'
		},
		featureList: [
			'Diligenciamiento de formatos HSEQ sin conexión',
			'Formularios preoperacionales por etapas con autoguardado',
			'Calendario de días laborados por tipo de jornada',
			'Consulta de servicios asignados con mapa, tráfico y riesgo de la vía',
			'Guía de navegación giro a giro hasta el destino',
			'Descarga de desprendibles de pago y primas',
			'Captura de evidencias fotográficas y firma digital'
		]
	};

	const metricas = [
		{ valor: 'Offline', etiqueta: 'Diligencia sin señal' },
		{ valor: 'Android', etiqueta: 'y iOS' },
		{ valor: 'Interno', etiqueta: 'Solo conductores' }
	];

	// Una entrada por captura de tienda (static/app/capturas), en el orden del recorrido.
	const bloques = [
		{
			eyebrow: 'CENTRO DE OPERACIONES',
			corto: 'Formularios',
			titulo: 'Lo pendiente de hoy, de un vistazo',
			detalle:
				'Al abrir la app el conductor ve los formatos HSEQ que tiene asignados, cuántos le faltan por diligenciar, cuántos esperan en la cola local y cuántos ya envió. Cada formato muestra su código y si está listo para iniciar.',
			puntos: [
				'Buscador por nombre o código del formato',
				'Contadores de pendientes, en cola y completados',
				'Inspecciones, actas y reportes en la misma lista'
			],
			imagen: '/app/capturas/formularios',
			alt: 'Pantalla de formularios con el saludo al conductor, el buscador, los contadores y la lista de formatos asignados'
		},
		{
			eyebrow: 'FORMULARIO OFFLINE',
			corto: 'Por etapas',
			titulo: 'Diligencia sin depender de la señal',
			detalle:
				'Los preoperacionales se llenan por etapas, con el avance siempre visible. Cada respuesta queda guardada en el teléfono aunque se cierre la app, y el envío entra en una cola que se sincroniza sola al recuperar internet, sin duplicar registros.',
			puntos: [
				'Etapas con barra de progreso',
				'Contexto obligatorio: la placa del vehículo antes de empezar',
				'Autoguardado local y cola de envío con reintento'
			],
			imagen: '/app/capturas/formulario-etapas',
			alt: 'Formulario preoperacional por etapas, en la etapa 1 de 3 con 90% de avance y la placa seleccionada'
		},
		{
			eyebrow: 'MIS RECORRIDOS',
			corto: 'Servicios',
			titulo: 'Saber a dónde antes de salir',
			detalle:
				'Cada asignación muestra origen, destino, fecha, cliente y placa, con su estado. Arriba están los servicios activos, los finalizados y el total, para que el conductor sepa qué le queda por delante.',
			puntos: [
				'Origen y destino con estado del servicio',
				'Cliente y placa en cada tarjeta',
				'Búsqueda por ciudad, cliente o placa'
			],
			imagen: '/app/capturas/servicios',
			alt: 'Listado de servicios con contadores de activos, finalizados y total, y tarjetas de origen, destino, cliente y placa'
		},
		{
			eyebrow: 'DETALLE DEL SERVICIO',
			corto: 'Ruta',
			titulo: 'El recorrido sobre el mapa',
			detalle:
				'El detalle dibuja la ruta entre origen y destino y permite activar las capas de tráfico y de riesgo de la vía. Debajo queda la programación del servicio: cuándo se solicitó, cuándo se realiza y cuándo se registró.',
			puntos: [
				'Ruta trazada entre origen y destino',
				'Capas de tráfico y riesgo',
				'Fechas de solicitud, realización y registro'
			],
			imagen: '/app/capturas/detalle-ruta',
			alt: 'Detalle de un servicio con el mapa del recorrido, botones de tráfico y riesgo, y la sección de programación'
		},
		{
			eyebrow: 'GUÍA EN CARRETERA',
			corto: 'Navegación',
			titulo: 'Indicaciones giro a giro',
			detalle:
				'La guía de navegación acompaña al conductor hasta el destino del servicio con instrucciones de giro, la distancia que falta y el tiempo estimado de llegada. Usa la ubicación solo mientras la app está abierta.',
			puntos: [
				'Instrucción de la siguiente maniobra con su distancia',
				'Kilómetros restantes y tiempo estimado',
				'Vista de la ruta completa o centrada en el vehículo'
			],
			imagen: '/app/capturas/navegacion',
			alt: 'Guía de navegación en carretera con la instrucción de giro, el mapa en perspectiva y el destino con kilómetros y tiempo restantes'
		},
		{
			eyebrow: 'CONTROL DE JORNADA',
			corto: 'Días laborados',
			titulo: 'El mes entero en un calendario',
			detalle:
				'El conductor registra la jornada de hoy con un toque o completa cualquier día desde el calendario. Cada día se pinta según el tipo de jornada y el avance del mes muestra cuántos faltan por registrar. En los días de mantenimiento se adjuntan las facturas como soporte. También consulta sus desprendibles de pago y primas, con descarga en PDF.',
			puntos: [
				'Tipo de jornada: laborado, disponible, descanso o mantenimiento',
				'Avance del mes y días pendientes por registrar',
				'Desprendibles y primas descargables'
			],
			imagen: '/app/capturas/dias-laborados',
			alt: 'Calendario de días laborados del mes con el botón para registrar la jornada de hoy y el avance del mes'
		}
	];
</script>

<svelte:head>
	<title>Portal del Conductor — App para conductores | Transmeralda S.A.S.</title>
	<meta
		name="description"
		content="Portal del Conductor es la app móvil de Transmeralda S.A.S.: diligencia formatos HSEQ sin conexión, registra tu jornada laboral y consulta servicios y desprendibles desde el teléfono."
	/>
	<link rel="canonical" href="https://transmeralda.com/app" />

	<meta property="og:title" content="Portal del Conductor | App móvil de Transmeralda S.A.S." />
	<meta
		property="og:description"
		content="Formatos HSEQ, registro de jornada y servicios asignados desde el teléfono. Funciona sin conexión y sincroniza al recuperar internet."
	/>
	<meta property="og:url" content="https://transmeralda.com/app" />
	<meta property="og:image" content="https://transmeralda.com/app/og-app.jpg" />
	<meta property="og:image:secure_url" content="https://transmeralda.com/app/og-app.jpg" />
	<meta property="og:image:type" content="image/jpeg" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta
		property="og:image:alt"
		content="Pantalla principal de la app Portal del Conductor de Transmeralda, con los formatos asignados"
	/>

	<meta name="twitter:title" content="Portal del Conductor | App móvil de Transmeralda S.A.S." />
	<meta
		name="twitter:description"
		content="Formatos HSEQ, registro de jornada y servicios asignados desde el teléfono. Funciona sin conexión."
	/>
	<meta name="twitter:image" content="https://transmeralda.com/app/og-app.jpg" />
	<meta
		name="twitter:image:alt"
		content="Pantalla principal de la app Portal del Conductor de Transmeralda"
	/>

	{@html `<script type="application/ld+json">${JSON.stringify(datosEstructurados)}<` + `/script>`}
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
			<h2 class="pc-title">Un recorrido por la app</h2>
			<span class="pc-section-detail">{bloques.length} pantallas</span>
		</div>

		<ol class="recorrido" aria-label="Pantallas de la aplicación">
			{#each bloques as bloque, i (bloque.imagen)}
				<li>
					<a href={'#' + bloque.imagen.split('/').pop()} class="recorrido-item">
						<div class="pc-device">
							<picture>
								<source srcset={bloque.imagen + '.avif'} type="image/avif" />
								<source srcset={bloque.imagen + '.webp'} type="image/webp" />
								<img
									src={bloque.imagen + '.png'}
									alt=""
									width="520"
									height="1129"
									loading={i < 3 ? 'eager' : 'lazy'}
									decoding="async"
								/>
							</picture>
						</div>
						<span class="recorrido-paso">{String(i + 1).padStart(2, '0')}</span>
						<span class="recorrido-nombre">{bloque.corto}</span>
					</a>
				</li>
			{/each}
		</ol>

		<div class="pc-section-header">
			<h2 class="pc-title">Qué hace la aplicación</h2>
			<span class="pc-section-detail">{bloques.length} módulos</span>
		</div>

		{#each bloques as bloque, i (bloque.titulo)}
			<section
				id={bloque.imagen.split('/').pop()}
				class="bloque"
				class:invertido={i % 2 === 1}
			>
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
						<picture>
							<source srcset={bloque.imagen + '.avif'} type="image/avif" />
							<source srcset={bloque.imagen + '.webp'} type="image/webp" />
							<img
								src={bloque.imagen + '.png'}
								alt={bloque.alt}
								width="520"
								height="1129"
								loading="lazy"
								decoding="async"
							/>
						</picture>
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
		color: var(--pc-primary-text);
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
	/* Tira horizontal con las seis capturas; en escritorio caben todas sin desplazar. */
	.recorrido {
		list-style: none;
		margin: 0 -1rem;
		padding: 0.4rem 1rem 1.2rem;
		display: grid;
		grid-auto-flow: column;
		grid-auto-columns: 132px;
		gap: 0.9rem;
		overflow-x: auto;
		scroll-snap-type: x mandatory;
		scroll-padding-inline: 1rem;
		scrollbar-width: none;
	}

	.recorrido::-webkit-scrollbar {
		display: none;
	}

	.recorrido li {
		scroll-snap-align: start;
	}

	.recorrido-item {
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
		text-decoration: none;
	}

	.recorrido-item .pc-device {
		border-width: 4px;
		border-radius: 20px;
		box-shadow: var(--pc-shadow-raised);
		margin-bottom: 0.55rem;
		transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1);
	}

	.recorrido-paso {
		color: var(--pc-primary-text);
		font-size: 0.7rem;
		font-weight: 800;
		letter-spacing: 1.2px;
	}

	.recorrido-nombre {
		color: var(--pc-text);
		font-size: 0.9rem;
		font-weight: 700;
	}

	@media (hover: hover) {
		.recorrido-item:hover .pc-device {
			transform: translateY(-4px);
		}
	}

	.recorrido-item:focus-visible {
		outline: 2px solid var(--pc-primary);
		outline-offset: 4px;
		border-radius: 20px;
	}

	.bloque {
		scroll-margin-top: 5rem;
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
		color: var(--pc-primary-text);
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

		.recorrido {
			margin: 0;
			padding: 0.4rem 0 1.2rem;
			grid-auto-columns: minmax(0, 1fr);
			overflow: visible;
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
