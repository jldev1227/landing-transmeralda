<script lang="ts">
	import { fly, fade } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
</script>

<svelte:head>
	<title>Política de Privacidad | Transmeralda S.A.S.</title>
	<meta name="description" content="Política de privacidad y tratamiento de datos personales de Transmeralda S.A.S." />
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="policy-page" in:fade={{ duration: 400 }}>
	<nav class="policy-nav">
		<a href="/" class="policy-back">
			<svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
			</svg>
			Volver al inicio
		</a>
	</nav>

	<article class="policy-content" in:fly={{ y: 30, duration: 600, easing: cubicOut }}>
		<h1>Política de Privacidad</h1>
		<p class="policy-updated">Última actualización: {new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

		<section>
			<h2>1. Responsable del Tratamiento</h2>
			<p><strong>Transmeralda S.A.S.</strong>, empresa de transporte terrestre automotor especial con domicilio en Yopal, Casanare, Colombia, es responsable del tratamiento de los datos personales recopilados a través de este sitio web.</p>
			<ul>
				<li><strong>Email:</strong> operaciones.transmeraldasas@gmail.com</li>
				<li><strong>Teléfono:</strong> +57 323 234 0117</li>
			</ul>
		</section>

		<section>
			<h2>2. Datos Recopilados</h2>
			<p>A través de este sitio web podemos recopilar la siguiente información:</p>
			<ul>
				<li>Nombre completo</li>
				<li>Número de teléfono</li>
				<li>Correo electrónico</li>
				<li>Información de navegación (cookies, dirección IP)</li>
			</ul>
		</section>

		<section>
			<h2>3. Finalidad del Tratamiento</h2>
			<p>Los datos personales recopilados serán utilizados para:</p>
			<ul>
				<li>Responder solicitudes de cotización de servicios de transporte.</li>
				<li>Gestionar la comunicación con clientes actuales y potenciales.</li>
				<li>Mejorar la experiencia de usuario en nuestro sitio web.</li>
				<li>Cumplir con obligaciones legales y regulatorias.</li>
			</ul>
		</section>

		<section>
			<h2>4. Derechos del Titular</h2>
			<p>De conformidad con la Ley 1581 de 2012 y el Decreto 1377 de 2013, usted tiene derecho a:</p>
			<ul>
				<li>Conocer, actualizar y rectificar sus datos personales.</li>
				<li>Solicitar prueba de la autorización otorgada.</li>
				<li>Ser informado sobre el uso que se le ha dado a sus datos.</li>
				<li>Revocar la autorización y/o solicitar la supresión de sus datos.</li>
				<li>Presentar quejas ante la Superintendencia de Industria y Comercio.</li>
			</ul>
		</section>

		<section>
			<h2>5. Seguridad</h2>
			<p>Transmeralda S.A.S. implementa medidas de seguridad técnicas, administrativas y físicas para proteger los datos personales contra acceso no autorizado, alteración, divulgación o destrucción.</p>
		</section>

		<section>
			<h2>6. Contacto</h2>
			<p>Para ejercer sus derechos o realizar consultas sobre esta política, puede contactarnos a través de:</p>
			<ul>
				<li><strong>Email:</strong> operaciones.transmeraldasas@gmail.com</li>
				<li><strong>WhatsApp:</strong> +57 323 234 0117</li>
			</ul>
		</section>
	</article>
</div>

<style>
	.policy-page {
		min-height: 100vh;
		background: #f8fafb;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
	}

	.policy-nav {
		padding: 1rem 1.5rem;
		border-bottom: 1px solid #e2e8f0;
		background: white;
		position: sticky;
		top: 0;
		z-index: 10;
	}

	.policy-back {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		color: #059669;
		text-decoration: none;
		font-size: 0.9rem;
		font-weight: 500;
		transition: color 0.2s ease;
	}

	.policy-back:hover {
		color: #047857;
	}

	.policy-content {
		max-width: 720px;
		margin: 0 auto;
		padding: 3rem 1.5rem 4rem;
	}

	.policy-content h1 {
		font-size: clamp(1.75rem, 4vw, 2.5rem);
		font-weight: 700;
		color: #064e3b;
		margin-bottom: 0.5rem;
	}

	.policy-updated {
		font-size: 0.85rem;
		color: #94a3b8;
		margin-bottom: 2.5rem;
	}

	.policy-content section {
		margin-bottom: 2rem;
	}

	.policy-content h2 {
		font-size: 1.2rem;
		font-weight: 600;
		color: #1e293b;
		margin-bottom: 0.75rem;
	}

	.policy-content p {
		font-size: 0.95rem;
		color: #475569;
		line-height: 1.7;
		margin-bottom: 0.75rem;
	}

	.policy-content ul {
		padding-left: 1.25rem;
		margin-bottom: 0.75rem;
	}

	.policy-content li {
		font-size: 0.95rem;
		color: #475569;
		line-height: 1.7;
		margin-bottom: 0.35rem;
	}

	.policy-content strong {
		color: #1e293b;
	}
</style>
