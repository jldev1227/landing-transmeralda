<script lang="ts">
	import { fly, fade } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import '$lib/styles/app-theme.css';
</script>

<svelte:head>
	<title>Política de Privacidad de la App | Portal del Conductor Transmeralda</title>
	<meta
		name="description"
		content="Qué datos recopila la app Portal del Conductor de Transmeralda S.A.S., con qué finalidad, con quién se comparten y cómo ejercer sus derechos bajo la Ley 1581 de 2012."
	/>
	<link rel="canonical" href="https://transmeralda.com/app/politica-de-privacidad" />

	<meta property="og:title" content="Política de Privacidad | Portal del Conductor Transmeralda" />
	<meta
		property="og:description"
		content="Tratamiento de datos personales de la aplicación móvil Portal del Conductor de Transmeralda S.A.S."
	/>
	<meta property="og:url" content="https://transmeralda.com/app/politica-de-privacidad" />
	<meta property="og:image" content="https://transmeralda.com/app/og-app.jpg" />
	<meta property="og:image:type" content="image/jpeg" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />

	<meta name="twitter:title" content="Política de Privacidad | Portal del Conductor Transmeralda" />
	<meta
		name="twitter:description"
		content="Tratamiento de datos personales de la aplicación móvil Portal del Conductor de Transmeralda S.A.S."
	/>
	<meta name="twitter:image" content="https://transmeralda.com/app/og-app.jpg" />
</svelte:head>

<div class="pc policy-page" in:fade={{ duration: 400 }}>
	<nav class="policy-nav">
		<a href="/app" class="policy-back">
			<svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
			</svg>
			Volver a la aplicación
		</a>
	</nav>

	<article class="policy-content" in:fly={{ y: 30, duration: 600, easing: cubicOut }}>
		<h1 class="pc-hero-title">Política de Privacidad de la Aplicación</h1>
		<p class="policy-subtitle">Portal del Conductor — Transmeralda S.A.S.</p>
		<p class="policy-updated">
			Última actualización: {new Date().toLocaleDateString('es-CO', {
				year: 'numeric',
				month: 'long',
				day: 'numeric'
			})}
		</p>

		<div class="policy-note">
			Esta política aplica exclusivamente a la aplicación móvil <strong>Portal del Conductor</strong>
			(identificador <code>com.transmeralda.conductores</code>). El tratamiento de datos del sitio web
			se rige por la <a href="/politica-de-privacidad">política de privacidad del sitio</a>.
		</div>

		<section>
			<h2>1. Responsable del tratamiento</h2>
			<p>
				<strong>Transmeralda S.A.S.</strong>, empresa de transporte terrestre automotor especial con
				domicilio en Yopal, Casanare, Colombia, es responsable del tratamiento de los datos
				personales recopilados a través de esta aplicación.
			</p>
			<ul>
				<li><strong>Correo:</strong> operaciones.transmeraldasas@gmail.com</li>
				<li><strong>Teléfono:</strong> +57 323 234 0117</li>
			</ul>
		</section>

		<section>
			<h2>2. Alcance y usuarios</h2>
			<p>
				La aplicación es una herramienta interna de uso laboral, disponible únicamente para
				conductores vinculados a Transmeralda S.A.S. No admite registro abierto: el acceso se
				autoriza con el número de cédula previamente registrado por la empresa y un enlace temporal
				enviado al correo asociado.
			</p>
		</section>

		<section>
			<h2>3. Datos que recopilamos</h2>
			<p>La aplicación recopila los siguientes datos, todos ligados a la actividad laboral:</p>

			<h3>Identificación y acceso</h3>
			<ul>
				<li>Número de cédula, usado para solicitar el enlace de acceso.</li>
				<li>Nombre completo y correo electrónico corporativo o personal registrado por la empresa.</li>
			</ul>

			<h3>Ubicación</h3>
			<ul>
				<li>
					Ubicación precisa y aproximada del dispositivo, <strong>solo mientras la aplicación está
					en uso</strong> y únicamente al consultar el mapa o la navegación de un servicio asignado.
				</li>
				<li>
					La aplicación <strong>no accede a la ubicación en segundo plano</strong> y no realiza
					seguimiento del conductor fuera de la aplicación.
				</li>
			</ul>

			<h3>Contenido generado en la operación</h3>
			<ul>
				<li>Respuestas de los formatos HSEQ diligenciados.</li>
				<li>Fotografías y archivos adjuntos como evidencia, cuando el formato lo exige.</li>
				<li>Firma manuscrita capturada en pantalla, cuando el formato lo exige.</li>
				<li>
					Registros de jornada: fecha, tipo de jornada, vehículo, cliente, horas de inicio y fin,
					kilometraje y descripción del servicio.
				</li>
			</ul>

			<h3>Datos técnicos</h3>
			<ul>
				<li>
					Identificador de notificaciones push del dispositivo, necesario para entregar avisos
					operativos.
				</li>
				<li>Versión de la aplicación y sistema operativo, adjuntos al sincronizar para dar soporte.</li>
			</ul>

			<p>
				La aplicación <strong>no recopila</strong> contactos, mensajes, historial de navegación,
				datos de salud ni información financiera del usuario, y <strong>no incluye publicidad</strong>.
			</p>
		</section>

		<section>
			<h2>4. Finalidad del tratamiento</h2>
			<ul>
				<li>Autenticar al conductor y mantener su sesión activa de forma segura.</li>
				<li>
					Recibir y conservar los formatos de seguridad exigidos por la normativa de transporte y por
					el sistema de gestión de la empresa.
				</li>
				<li>Liquidar y soportar la jornada laboral, los recorridos y el kilometraje reportado.</li>
				<li>Mostrar los servicios asignados y guiar al conductor hasta el punto de encuentro.</li>
				<li>Poner a disposición del conductor sus desprendibles de pago y primas.</li>
				<li>Notificar pendientes y novedades operativas.</li>
			</ul>
		</section>

		<section>
			<h2>5. Almacenamiento y seguridad</h2>
			<p>
				Para permitir el trabajo sin conexión, la información diligenciada se guarda cifrada en el
				propio dispositivo y se sincroniza con los servidores de Transmeralda S.A.S. cuando hay
				internet. Las credenciales de sesión se almacenan en el almacenamiento seguro del sistema
				operativo.
			</p>
			<p>
				Las comunicaciones con nuestros servidores viajan cifradas mediante HTTPS. Al cerrar sesión,
				los datos locales asociados a la cuenta se eliminan del dispositivo.
			</p>
		</section>

		<section>
			<h2>6. Terceros con los que se comparten datos</h2>
			<p>
				No vendemos datos personales ni los cedemos con fines comerciales. Compartimos únicamente lo
				indispensable con los siguientes proveedores de infraestructura:
			</p>
			<ul>
				<li>
					<strong>Mapbox:</strong> recibe coordenadas de origen y destino para calcular y dibujar la
					ruta del servicio.
				</li>
				<li>
					<strong>Google (Firebase Cloud Messaging):</strong> entrega las notificaciones push al
					dispositivo.
				</li>
				<li>
					<strong>Expo:</strong> plataforma de construcción y distribución de la aplicación y de
					envío de notificaciones.
				</li>
			</ul>
			<p>
				También podremos revelar información cuando lo exija una autoridad competente o una
				obligación legal.
			</p>
		</section>

		<section>
			<h2>7. Conservación</h2>
			<p>
				Los formatos, registros de jornada y evidencias se conservan mientras dure la relación
				laboral o contractual y, después de terminada, durante el tiempo que exijan las obligaciones
				legales, contables y del sistema de gestión aplicables al transporte terrestre. Cumplido ese
				plazo, se eliminan o se anonimizan.
			</p>
		</section>

		<section>
			<h2>8. Derechos del titular</h2>
			<p>
				De conformidad con la Ley 1581 de 2012 y el Decreto 1377 de 2013, usted tiene derecho a:
			</p>
			<ul>
				<li>Conocer, actualizar y rectificar sus datos personales.</li>
				<li>Solicitar prueba de la autorización otorgada.</li>
				<li>Ser informado sobre el uso que se ha dado a sus datos.</li>
				<li>Presentar quejas ante la Superintendencia de Industria y Comercio.</li>
				<li>
					Revocar la autorización y solicitar la supresión de sus datos, salvo cuando exista un deber
					legal o contractual de conservarlos.
				</li>
			</ul>
		</section>

		<section>
			<h2>9. Eliminación de la cuenta y de los datos</h2>
			<p>
				Para solicitar la eliminación de su cuenta y de los datos asociados, escriba a
				<strong>operaciones.transmeraldasas@gmail.com</strong> desde el correo registrado, indicando
				su nombre y número de cédula. Atenderemos la solicitud en un plazo máximo de quince (15) días
				hábiles.
			</p>
			<p>
				Tenga en cuenta que los formatos de seguridad y los registros de jornada ya enviados
				constituyen soporte legal y contable de la operación, por lo que deben conservarse durante
				los plazos señalados en el numeral 7, aun después de eliminada la cuenta. Desinstalar la
				aplicación borra la copia local, pero no la información ya sincronizada.
			</p>
		</section>

		<section>
			<h2>10. Menores de edad</h2>
			<p>
				La aplicación está dirigida exclusivamente a personas mayores de edad vinculadas laboral o
				contractualmente a Transmeralda S.A.S. No recopilamos datos de menores de forma consciente.
			</p>
		</section>

		<section>
			<h2>11. Cambios en esta política</h2>
			<p>
				Podremos actualizar esta política para reflejar cambios en la aplicación o en la normativa.
				La fecha de la última actualización aparece al inicio del documento; los cambios sustanciales
				se comunicarán a través de la propia aplicación.
			</p>
		</section>

		<section>
			<h2>12. Contacto</h2>
			<p>Para ejercer sus derechos o resolver dudas sobre esta política:</p>
			<ul>
				<li><strong>Correo:</strong> operaciones.transmeraldasas@gmail.com</li>
				<li><strong>Teléfono:</strong> +57 323 234 0117</li>
				<li><strong>Domicilio:</strong> Yopal, Casanare, Colombia</li>
			</ul>
		</section>
	</article>
</div>

<style>
	.policy-page {
		min-height: 100vh;
	}

	.policy-nav {
		padding: 1rem 1.5rem;
		border-bottom: 1px solid var(--pc-border);
		background: var(--pc-white);
		position: sticky;
		top: 0;
		z-index: 10;
	}

	.policy-back {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		color: var(--pc-primary);
		text-decoration: none;
		font-size: 0.9rem;
		font-weight: 700;
		transition: color 0.2s ease;
	}

	.policy-back:hover {
		color: var(--pc-primary-dark);
	}

	/* Documento montado sobre una tarjeta, como las `Card` del móvil. */
	.policy-content {
		max-width: 760px;
		margin: 1.5rem auto;
		background: var(--pc-white);
		border-radius: var(--pc-radius-large);
		box-shadow: var(--pc-shadow-card);
		padding: 2.25rem 1.5rem 3rem;
	}

	.policy-content h1 {
		color: var(--pc-primary-dark);
		margin-bottom: 0.3rem;
	}

	.policy-subtitle {
		font-size: 0.95rem;
		font-weight: 800;
		color: var(--pc-primary);
		margin-bottom: 0.4rem;
	}

	.policy-updated {
		font-size: 0.8rem;
		font-weight: 600;
		color: var(--pc-muted);
		margin-bottom: 1.5rem;
	}

	.policy-note {
		background: var(--pc-primary-soft);
		border: 1px solid var(--pc-primary-tint);
		border-radius: var(--pc-radius-medium);
		padding: 0.95rem 1.1rem;
		font-size: 0.9rem;
		color: var(--pc-primary-dark);
		line-height: 1.65;
		margin-bottom: 2.25rem;
	}

	.policy-note code {
		background: var(--pc-primary-tint);
		border-radius: 6px;
		padding: 0.1rem 0.35rem;
		font-size: 0.85em;
	}

	.policy-note a {
		color: var(--pc-brand-700);
		font-weight: 800;
	}

	.policy-content section {
		margin-bottom: 1.9rem;
	}

	.policy-content h2 {
		font-size: 1.05rem;
		font-weight: 800;
		color: var(--pc-text);
		letter-spacing: -0.2px;
		margin-bottom: 0.6rem;
	}

	.policy-content h3 {
		font-size: 0.9rem;
		font-weight: 800;
		color: var(--pc-primary-dark);
		margin: 1.1rem 0 0.4rem;
	}

	.policy-content p {
		font-size: 0.95rem;
		color: var(--pc-muted);
		line-height: 1.7;
		margin-bottom: 0.7rem;
	}

	.policy-content ul {
		padding-left: 1.25rem;
		margin-bottom: 0.7rem;
	}

	.policy-content li {
		font-size: 0.95rem;
		color: var(--pc-muted);
		line-height: 1.7;
		margin-bottom: 0.35rem;
	}

	.policy-content strong {
		color: var(--pc-text);
	}
</style>
