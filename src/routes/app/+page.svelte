<script lang="ts">
	import { fly, fade } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';

	const bloques = [
		{
			eyebrow: 'Formatos HSEQ',
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
			eyebrow: 'Jornada laboral',
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
			eyebrow: 'Servicios',
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
			eyebrow: 'Historial',
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

<div class="app-page" in:fade={{ duration: 400 }}>
	<nav class="app-nav">
		<a href="/" class="app-back">
			<svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
			</svg>
			Volver al inicio
		</a>
	</nav>

	<header class="hero">
		<div class="hero-inner" in:fly={{ y: 30, duration: 600, easing: cubicOut }}>
			<div class="hero-copy">
				<span class="hero-eyebrow">Aplicación móvil</span>
				<h1>Portal del Conductor</h1>
				<p class="hero-lead">
					La operación de transporte especial exige diligenciar formatos antes de cada recorrido y
					dejar constancia de la jornada. En carretera eso rara vez ocurre con buena señal.
				</p>
				<p class="hero-lead">
					Esta aplicación pone esos trámites en el teléfono del conductor y los sincroniza cuando
					haya internet. Nadie pierde trabajo por quedarse sin datos.
				</p>
				<div class="hero-tags">
					<span>Funciona sin conexión</span>
					<span>Android e iOS</span>
					<span>Uso interno</span>
				</div>
			</div>
			<div class="hero-device">
				<div class="device">
					<img src="/app/formularios.png" alt="Pantalla principal de la aplicación con los formatos asignados al conductor" />
				</div>
			</div>
		</div>
	</header>

	<main class="app-content">
		<section class="intro">
			<h2>Quién la usa</h2>
			<p>
				El acceso está restringido a conductores vinculados a Transmeralda S.A.S. No es una aplicación
				de uso público ni permite registro abierto: el ingreso se hace con el número de cédula y un
				enlace temporal enviado al correo registrado por la empresa.
			</p>
		</section>

		{#each bloques as bloque, i (bloque.titulo)}
			<section class="bloque" class:invertido={i % 2 === 1}>
				<div class="bloque-copy">
					<span class="bloque-eyebrow">{bloque.eyebrow}</span>
					<h2>{bloque.titulo}</h2>
					<p>{bloque.detalle}</p>
					<ul>
						{#each bloque.puntos as punto (punto)}
							<li>{punto}</li>
						{/each}
					</ul>
				</div>
				<div class="bloque-device">
					<div class="device">
						<img src={bloque.imagen} alt={bloque.alt} loading="lazy" />
					</div>
				</div>
			</section>
		{/each}

		<section class="cierre">
			<h2>Datos y privacidad</h2>
			<p>
				La aplicación trata datos personales del conductor y, para la navegación hacia los servicios,
				solicita acceso a la ubicación del dispositivo mientras está en uso. No accede a la ubicación
				en segundo plano ni realiza seguimiento fuera de la aplicación.
			</p>
			<a class="cierre-cta" href="/app/politica-de-privacidad">Ver política de privacidad de la app</a>

			<div class="soporte">
				<h3>Soporte</h3>
				<p>Para reportar fallas, solicitar acceso o resolver dudas sobre el tratamiento de sus datos:</p>
				<ul>
					<li><strong>Correo:</strong> operaciones.transmeraldasas@gmail.com</li>
					<li><strong>Teléfono:</strong> +57 323 234 0117</li>
				</ul>
			</div>
		</section>
	</main>
</div>

<style>
	.app-page {
		min-height: 100vh;
		background: #f8fafb;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
	}

	.app-nav {
		padding: 1rem 1.5rem;
		border-bottom: 1px solid #e2e8f0;
		background: white;
		position: sticky;
		top: 0;
		z-index: 10;
	}

	.app-back {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		color: #059669;
		text-decoration: none;
		font-size: 0.9rem;
		font-weight: 500;
		transition: color 0.2s ease;
	}

	.app-back:hover {
		color: #047857;
	}

	/* Hero */
	.hero {
		background: linear-gradient(160deg, #064e3b 0%, #022c22 100%);
		overflow: hidden;
	}

	.hero-inner {
		max-width: 1080px;
		margin: 0 auto;
		padding: 3.5rem 1.5rem 0;
		display: grid;
		grid-template-columns: 1fr;
		gap: 2rem;
		align-items: end;
	}

	.hero-copy {
		padding-bottom: 2rem;
	}

	.hero-eyebrow {
		display: inline-block;
		font-size: 0.75rem;
		font-weight: 700;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: #6ee7b7;
		margin-bottom: 0.75rem;
	}

	.hero h1 {
		font-size: clamp(2rem, 5vw, 3rem);
		font-weight: 800;
		color: white;
		line-height: 1.1;
		letter-spacing: -0.02em;
		margin-bottom: 1rem;
	}

	.hero-lead {
		font-size: 1rem;
		color: #b7ddcd;
		line-height: 1.7;
		margin-bottom: 0.75rem;
		max-width: 46ch;
	}

	.hero-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-top: 1.5rem;
	}

	.hero-tags span {
		font-size: 0.8rem;
		font-weight: 600;
		color: #a7f3d0;
		background: rgba(255, 255, 255, 0.08);
		border: 1px solid rgba(167, 243, 208, 0.25);
		border-radius: 999px;
		padding: 0.35rem 0.8rem;
	}

	.hero-device {
		display: flex;
		justify-content: center;
	}

	.hero-device .device {
		max-width: 260px;
		margin-bottom: -2rem;
	}

	/* Marco de dispositivo */
	.device {
		border-radius: 30px;
		border: 7px solid #0f1f1a;
		background: #0f1f1a;
		overflow: hidden;
		box-shadow: 0 24px 60px rgba(2, 44, 34, 0.35);
		line-height: 0;
	}

	.device img {
		width: 100%;
		height: auto;
		display: block;
	}

	/* Contenido */
	.app-content {
		max-width: 1080px;
		margin: 0 auto;
		padding: 3.5rem 1.5rem 4rem;
	}

	.intro {
		max-width: 62ch;
		margin-bottom: 3.5rem;
	}

	.app-content h2 {
		font-size: 1.5rem;
		font-weight: 700;
		color: #064e3b;
		letter-spacing: -0.01em;
		margin-bottom: 0.75rem;
	}

	.app-content p {
		font-size: 0.98rem;
		color: #475569;
		line-height: 1.75;
		margin-bottom: 0.75rem;
	}

	.bloque {
		display: grid;
		grid-template-columns: 1fr;
		gap: 2rem;
		align-items: center;
		padding: 2.5rem 0;
		border-top: 1px solid #e2e8f0;
	}

	.bloque-eyebrow {
		display: inline-block;
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: #059669;
		margin-bottom: 0.5rem;
	}

	.bloque ul {
		list-style: none;
		padding-left: 0;
		margin-top: 1rem;
	}

	.bloque li {
		position: relative;
		padding-left: 1.5rem;
		font-size: 0.93rem;
		color: #334155;
		line-height: 1.6;
		margin-bottom: 0.5rem;
	}

	.bloque li::before {
		content: '';
		position: absolute;
		left: 0;
		top: 0.5em;
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: #059669;
	}

	.bloque-device {
		display: flex;
		justify-content: center;
	}

	.bloque-device .device {
		max-width: 240px;
	}

	.cierre {
		border-top: 1px solid #e2e8f0;
		padding-top: 2.5rem;
		max-width: 62ch;
	}

	.cierre-cta {
		display: inline-block;
		margin-top: 0.5rem;
		padding: 0.75rem 1.2rem;
		border-radius: 10px;
		background: #059669;
		color: white;
		font-size: 0.92rem;
		font-weight: 600;
		text-decoration: none;
		transition: background 0.2s ease;
	}

	.cierre-cta:hover {
		background: #047857;
	}

	.soporte {
		margin-top: 2.5rem;
		background: white;
		border: 1px solid #e2e8f0;
		border-radius: 14px;
		padding: 1.25rem 1.4rem;
	}

	.soporte h3 {
		font-size: 1rem;
		font-weight: 700;
		color: #064e3b;
		margin-bottom: 0.5rem;
	}

	.soporte ul {
		padding-left: 1.25rem;
		margin: 0;
	}

	.soporte li {
		font-size: 0.93rem;
		color: #475569;
		line-height: 1.7;
	}

	@media (min-width: 820px) {
		.hero-inner {
			grid-template-columns: 1.15fr 0.85fr;
			padding-top: 4.5rem;
		}

		.hero-copy {
			padding-bottom: 4.5rem;
		}

		.bloque {
			grid-template-columns: 1fr 1fr;
			gap: 3.5rem;
			padding: 3.5rem 0;
		}

		.bloque.invertido .bloque-copy {
			order: 2;
		}
	}
</style>
