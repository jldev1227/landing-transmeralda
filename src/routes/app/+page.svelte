<script lang="ts">
	import { fly, fade } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';

	const funcionalidades = [
		{
			titulo: 'Formularios HSEQ sin conexión',
			detalle:
				'Inspecciones preoperacionales, actas de entrega y reportes se diligencian aunque no haya señal. Cada cambio se guarda en el dispositivo y el envío queda en una cola que se sincroniza sola al recuperar internet, sin duplicar registros.'
		},
		{
			titulo: 'Registro de jornada',
			detalle:
				'El conductor reporta su día laborado con uno o varios tramos: vehículo, cliente, horas de inicio y fin, kilometraje y descripción del servicio. Las horas se calculan solas, incluso cuando la jornada cruza la medianoche.'
		},
		{
			titulo: 'Servicios asignados',
			detalle:
				'Consulta los servicios del día con su origen, destino y recorrido sobre el mapa, y abre la navegación hacia el punto de encuentro.'
		},
		{
			titulo: 'Desprendibles de pago',
			detalle:
				'Acceso al historial de desprendibles y primas, con opción de descargarlos en PDF desde el mismo teléfono.'
		},
		{
			titulo: 'Evidencias y firmas',
			detalle:
				'Los formatos que lo exigen permiten adjuntar fotos, archivos y la firma del conductor, capturada directamente en pantalla.'
		},
		{
			titulo: 'Notificaciones',
			detalle:
				'Avisos sobre formatos pendientes y novedades operativas relevantes para la jornada.'
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

	<article class="app-content" in:fly={{ y: 30, duration: 600, easing: cubicOut }}>
		<span class="app-eyebrow">Aplicación móvil</span>
		<h1>Portal del Conductor</h1>
		<p class="app-lead">
			Herramienta interna de Transmeralda S.A.S. para el personal de conducción vinculado a la empresa.
			Reúne en el teléfono los formatos, reportes y consultas que antes dependían del papel o de una
			oficina con internet.
		</p>

		<section>
			<h2>Para qué sirve</h2>
			<p>
				La operación de transporte especial exige diligenciar formatos de seguridad antes de cada
				recorrido y dejar constancia de la jornada trabajada. En carretera eso rara vez ocurre con
				buena señal.
			</p>
			<p>
				La aplicación resuelve ese vacío: todo se diligencia en el dispositivo y se sincroniza cuando
				hay conexión. El conductor no pierde trabajo por quedarse sin datos, y la empresa recibe la
				información con la trazabilidad que exigen sus obligaciones legales y de calidad.
			</p>
		</section>

		<section>
			<h2>Quién la usa</h2>
			<p>
				El acceso está restringido a conductores vinculados a Transmeralda S.A.S. No es una aplicación
				de uso público ni permite registro abierto: el ingreso se hace con el número de cédula y un
				enlace temporal enviado al correo registrado por la empresa.
			</p>
		</section>

		<section>
			<h2>Funcionalidades</h2>
			<ul class="app-features">
				{#each funcionalidades as item (item.titulo)}
					<li>
						<h3>{item.titulo}</h3>
						<p>{item.detalle}</p>
					</li>
				{/each}
			</ul>
		</section>

		<section>
			<h2>Datos que utiliza</h2>
			<p>
				La aplicación trata datos personales del conductor y, para la navegación hacia los servicios,
				solicita acceso a la ubicación del dispositivo mientras está en uso. No accede a la ubicación
				en segundo plano ni realiza seguimiento fuera de la aplicación.
			</p>
			<p>
				El detalle completo de qué se recopila, con qué finalidad, con quién se comparte y cómo
				ejercer sus derechos está en la política de privacidad de la aplicación.
			</p>
			<a class="app-cta" href="/app/politica-de-privacidad">Ver política de privacidad de la app</a>
		</section>

		<section>
			<h2>Soporte</h2>
			<p>
				Para reportar fallas, solicitar acceso o resolver dudas sobre el tratamiento de sus datos:
			</p>
			<ul>
				<li><strong>Correo:</strong> operaciones.transmeraldasas@gmail.com</li>
				<li><strong>Teléfono:</strong> +57 323 234 0117</li>
			</ul>
		</section>
	</article>
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

	.app-content {
		max-width: 720px;
		margin: 0 auto;
		padding: 3rem 1.5rem 4rem;
	}

	.app-eyebrow {
		display: inline-block;
		font-size: 0.75rem;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: #059669;
		margin-bottom: 0.5rem;
	}

	.app-content h1 {
		font-size: clamp(1.75rem, 4vw, 2.5rem);
		font-weight: 700;
		color: #064e3b;
		margin-bottom: 0.75rem;
	}

	.app-lead {
		font-size: 1.05rem;
		color: #334155;
		line-height: 1.7;
		margin-bottom: 2.5rem;
	}

	.app-content section {
		margin-bottom: 2rem;
	}

	.app-content h2 {
		font-size: 1.2rem;
		font-weight: 600;
		color: #1e293b;
		margin-bottom: 0.75rem;
	}

	.app-content p {
		font-size: 0.95rem;
		color: #475569;
		line-height: 1.7;
		margin-bottom: 0.75rem;
	}

	.app-content ul {
		padding-left: 1.25rem;
		margin-bottom: 0.75rem;
	}

	.app-content li {
		font-size: 0.95rem;
		color: #475569;
		line-height: 1.7;
		margin-bottom: 0.35rem;
	}

	.app-features {
		list-style: none;
		padding-left: 0;
		display: grid;
		gap: 0.75rem;
	}

	.app-features li {
		background: white;
		border: 1px solid #e2e8f0;
		border-radius: 12px;
		padding: 1rem 1.1rem;
		margin-bottom: 0;
	}

	.app-features h3 {
		font-size: 0.95rem;
		font-weight: 700;
		color: #064e3b;
		margin: 0 0 0.35rem;
	}

	.app-features p {
		margin-bottom: 0;
		font-size: 0.9rem;
	}

	.app-cta {
		display: inline-block;
		margin-top: 0.5rem;
		padding: 0.7rem 1.1rem;
		border-radius: 10px;
		background: #059669;
		color: white;
		font-size: 0.9rem;
		font-weight: 600;
		text-decoration: none;
		transition: background 0.2s ease;
	}

	.app-cta:hover {
		background: #047857;
	}
</style>
