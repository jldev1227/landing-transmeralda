<script lang="ts">
	import { onMount } from 'svelte';
	import { fly, fade } from 'svelte/transition';
	import { elasticOut, cubicOut } from 'svelte/easing';
	import Galeria from '../lib/components/Galeria.svelte';

	// Estado reactivo
	let show: boolean = false;
	let scrolled: boolean = false;
	let mobileMenuOpen: boolean = false;
	let activeSection: string = 'inicio';

	const sections: string[] = [
		'inicio',
		'capacidades',
		'nosotros',
		'beneficios',
		'galeria',
		'contacto'
	];

	// ========================================
	// SCROLL DETECTION & NAVIGATION
	// ========================================
	function handleScroll() {
		if (typeof window === 'undefined') return;

		// Navbar cambia después de 50px
		scrolled = window.scrollY > 50;

		// Detectar sección activa
		const scrollPosition = window.scrollY + 100;

		for (const sectionId of sections) {
			const section = document.getElementById(sectionId);
			if (section) {
				const offsetTop = section.offsetTop;
				const offsetBottom = offsetTop + section.offsetHeight;

				if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
					activeSection = sectionId;
					break;
				}
			}
		}
	}

	function scrollToSection(id: string): void {
		const section = document.getElementById(id);
		if (!section) return;

		mobileMenuOpen = false;

		// Smooth scroll to section
		section.scrollIntoView({
			behavior: 'smooth',
			block: 'start'
		});
	}

	// ========================================
	// LIFECYCLE
	// ========================================
	onMount(() => {
		setTimeout(() => {
			show = true;
		}, 100);

		window.addEventListener('scroll', handleScroll, { passive: true });
		handleScroll();

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	});

	// ========================================
	// DATA
	// ========================================
	type Card = {
		title: string;
		desc: string;
		img: string;
	};

	const capacidades: Card[] = [
		{
			title: 'Contamos con GPS',
			desc: 'Ubicación en tiempo real de toda la flota para trazabilidad y respuesta rápida.',
			img: '/images/capacidades/gps.png'
		},
		{
			title: 'Protocolos',
			desc: 'Estandarización operativa, seguridad y bioseguridad documentadas.',
			img: '/images/capacidades/protocolos.png'
		},
		{
			title: 'Planificación',
			desc: 'Rutas, horarios y asignaciones optimizadas para puntualidad.',
			img: '/images/capacidades/planificacion.png'
		},
		{
			title: 'Mantenimiento',
			desc: 'Preventivo y correctivo con registros digitales y alertas.',
			img: '/images/capacidades/mantenimiento.png'
		},
		{
			title: 'Personal Calificado',
			desc: 'Conductores certificados, EPP y formación continua.',
			img: '/images/capacidades/personal.png'
		},
		{
			title: 'App & Reportes',
			desc: 'Seguimiento, novedades y reportes para tus auditorías.',
			img: '/images/capacidades/app.jpg'
		}
	];

	const beneficios: Card[] = [
		{
			title: 'Reducción de Costos',
			desc: 'Optimiza el uso de combustible y reduce gastos operativos hasta un 30%.',
			img: '/images/beneficios/costos.jpg'
		},
		{
			title: 'Mayor Seguridad',
			desc: 'Monitoreo 24/7 y protocolos certificados para la protección de tu equipo.',
			img: '/images/beneficios/seguridad.jpg'
		},
		{
			title: 'Cumplimiento Legal',
			desc: 'Documentación actualizada y auditable para todas las normativas vigentes.',
			img: '/images/beneficios/legal.jpg'
		}
	];
</script>

{#if show}
	<!-- 🍎 NAVBAR ESTILO APPLE -->
	<nav in:fly={{ y: -50, duration: 600, easing: cubicOut }} class="navbar-apple" class:scrolled>
		<div class="navbar-container">
			<!-- Logo -->
			<button on:click={() => scrollToSection('inicio')} class="navbar-logo">
				<img
					src="/assets/logo_transmeralda.png"
					alt="Transmeralda"
					class="h-8 w-auto object-contain"
				/>
			</button>

			<!-- Desktop Menu -->
			<div class="navbar-menu-desktop">
				{#each sections as section}
					<button
						on:click={() => scrollToSection(section)}
						class="navbar-link"
						class:active={activeSection === section}
					>
						{section.charAt(0).toUpperCase() + section.slice(1)}
					</button>
				{/each}
			</div>

			<!-- Mobile Menu Button -->
			<button
				on:click={() => (mobileMenuOpen = !mobileMenuOpen)}
				class="navbar-menu-button"
				aria-label="Toggle menu"
			>
				<div class="hamburger" class:open={mobileMenuOpen}>
					<span></span>
					<span></span>
					<span></span>
				</div>
			</button>
		</div>

		<!-- Mobile Menu Overlay -->
		{#if mobileMenuOpen}
			<div
				class="mobile-menu-overlay"
				transition:fade={{ duration: 300 }}
				on:click={() => (mobileMenuOpen = false)}
				on:keydown={(e) => e.key === 'Escape' && (mobileMenuOpen = false)}
				role="button"
				tabindex="0"
			>
				<div
					class="mobile-menu"
					on:click={(e) => e.stopPropagation()}
					on:keydown={(e) => e.stopPropagation()}
					role="menu"
					tabindex="-1"
				>
					{#each sections as section, i}
						<button
							on:click={() => scrollToSection(section)}
							class="mobile-menu-link"
							class:active={activeSection === section}
							in:fly={{ y: -20, duration: 300, delay: i * 50 }}
						>
							{section.charAt(0).toUpperCase() + section.slice(1)}
						</button>
					{/each}
				</div>
			</div>
		{/if}
	</nav>

	<!-- 📜 CONTENIDO PRINCIPAL -->
	<main class="main-content">
		<!-- ========================================
		SECCIÓN 1 - INICIO (FULLSCREEN)
		======================================== -->
		<section
			id="inicio"
			class="section relative flex shrink-0 snap-start flex-col items-center justify-start overflow-hidden p-20 2xl:p-48"
		>
			<!-- ✨ Contenido principal -->
			<video
				autoplay
				muted
				loop
				playsinline
				class="absolute inset-0 h-full w-full object-cover opacity-80"
			>
				<source src="/videos/fondo_transmeralda.mp4" type="video/mp4" />
			</video>

			<!-- 🟢 Capa de color -->
			<div class="absolute inset-0 bg-emerald-900/40 backdrop-blur-sm"></div>

			<div
				class="relative z-10 px-6 text-center"
				in:fly={{ y: 200, duration: 1000, easing: elasticOut }}
			>
				<img
					src="/assets/logo_transmeralda_white.png"
					alt="Logo Transmeralda"
					class="mx-auto h-40 w-80 object-contain"
				/>
				<h1 class="mb-4 font-display text-5xl font-bold text-white drop-shadow-lg md:text-6xl">
					Bienvenido a Transmeralda
				</h1>
				<p class="mx-auto max-w-md font-sans text-lg text-white/90">
					Innovación en transporte y gestión inteligente de flotas.
				</p>
			</div>

			<button class="">Contactanos</button>

			<!-- <img
			src="/assets/codi_vehiculo_front.png"
			alt="Vehículo Transmeralda"
			class="animate-float-vertical absolute bottom-0 mx-auto h-64 w-[16rem] object-contain sm:h-64 sm:w-[16rem] md:h-[20rem] md:w-[20rem] lg:h-[24rem] lg:w-[24rem] xl:h-[26rem] xl:w-[26rem] 2xl:h-96 2xl:w-96"
			/> -->
		</section>
		<!-- ========================================
		     SECCIÓN 1.5 - CARRUSEL DE IMÁGENES
		     ======================================== -->

		<!-- 💫 Galería de vehículos -->

		<section class="section-light">
			<Galeria />
		</section>

		<!-- ========================================
		     SECCIÓN 2 - CAPACIDADES (AUTO HEIGHT)
		     ======================================== -->
		<section id="capacidades" class="section-normal">
			<div class="container">
				<div class="section-header">
					<h2 class="section-title">Capacidades que respaldan nuestro servicio</h2>
					<p class="section-subtitle">
						Todo lo que usamos para garantizar un transporte seguro, puntual y confiable.
					</p>
				</div>

				<div class="grid-3">
					{#each capacidades as card}
						<article class="card">
							<div class="card-image">
								<img src={card.img} alt={card.title} loading="lazy" />
							</div>
							<div class="card-content">
								<h3 class="card-title">{card.title}</h3>
								<p class="card-desc">{card.desc}</p>
							</div>
						</article>
					{/each}
				</div>
			</div>
		</section>

		<!-- ========================================
		     SECCIÓN 3 - NOSOTROS (AUTO HEIGHT)
		     ======================================== -->
		<section id="nosotros" class="section-colored">
			<div class="container">
				<div class="section-header">
					<h2 class="section-title text-white">Nosotros</h2>
					<p class="section-subtitle text-emerald-100">
						Profesionales dedicados a la innovación y el transporte inteligente.
					</p>
				</div>

				<div class="stats-grid">
					<div class="stat-card">
						<div class="stat-number">10+</div>
						<div class="stat-label">Años de experiencia</div>
					</div>
					<div class="stat-card">
						<div class="stat-number">500+</div>
						<div class="stat-label">Vehículos gestionados</div>
					</div>
					<div class="stat-card">
						<div class="stat-number">24/7</div>
						<div class="stat-label">Soporte disponible</div>
					</div>
				</div>
			</div>
		</section>

		<!-- ========================================
		     SECCIÓN 4 - BENEFICIOS (AUTO HEIGHT)
		     ======================================== -->
		<section id="beneficios" class="section-normal">
			<div class="container">
				<div class="section-header">
					<h2 class="section-title">Beneficios de trabajar con nosotros</h2>
					<p class="section-subtitle">Resultados comprobados que transforman tu operación</p>
				</div>

				<div class="grid-3">
					{#each beneficios as card}
						<article class="card card-hover">
							<div class="card-image">
								<img src={card.img} alt={card.title} loading="lazy" />
							</div>
							<div class="card-content">
								<h3 class="card-title">{card.title}</h3>
								<p class="card-desc">{card.desc}</p>
							</div>
						</article>
					{/each}
				</div>
			</div>
		</section>

		<!-- ========================================
		     SECCIÓN 5 - GALERÍA (AUTO HEIGHT)
		     ======================================== -->
		<section id="galeria" class="section-light">
			<div class="container">
				<div class="section-header">
					<h2 class="section-title">Nuestra Flota</h2>
					<p class="section-subtitle">Vehículos modernos y bien mantenidos</p>
				</div>

				<div class="gallery-grid">
					<div class="gallery-item">
						<img src="/images/galeria/1.jpg" alt="Vehículo 1" loading="lazy" />
					</div>
					<div class="gallery-item">
						<img src="/images/galeria/2.jpg" alt="Vehículo 2" loading="lazy" />
					</div>
					<div class="gallery-item">
						<img src="/images/galeria/3.jpg" alt="Vehículo 3" loading="lazy" />
					</div>
					<div class="gallery-item">
						<img src="/images/galeria/4.jpg" alt="Vehículo 4" loading="lazy" />
					</div>
				</div>
			</div>
		</section>

		<!-- ========================================
		     SECCIÓN 6 - CONTACTO (AUTO HEIGHT)
		     ======================================== -->
		<section id="contacto" class="section-dark">
			<div class="container">
				<div class="section-header">
					<h2 class="section-title text-white">Contáctanos</h2>
					<p class="section-subtitle text-slate-300">
						¿Listo para modernizar tu gestión de transporte?
					</p>
				</div>

				<div class="contact-grid">
					<a href="mailto:gerenciatransmeraldasas@gmail.com" class="contact-card">
						<svg class="contact-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
							/>
						</svg>
						<span class="contact-text">gerenciatransmeraldasas@gmail.com</span>
					</a>

					<a href="tel:+573233340117" class="contact-card">
						<svg class="contact-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
							/>
						</svg>
						<span class="contact-text">323340117</span>
					</a>
				</div>

				<button on:click={() => scrollToSection('inicio')} class="btn-back-to-top">
					Volver al inicio
				</button>
			</div>
		</section>
	</main>
{/if}

<style>
	/* ========================================
	   NAVBAR ESTILO APPLE
	   ======================================== */

	.navbar-apple {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 1000;
		background: rgba(255, 255, 255, 0.7);
		backdrop-filter: saturate(180%) blur(20px);
		-webkit-backdrop-filter: saturate(180%) blur(20px);
		border-bottom: 1px solid rgba(0, 0, 0, 0.08);
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.navbar-apple.scrolled {
		background: rgba(255, 255, 255, 0.85);
		backdrop-filter: saturate(180%) blur(30px);
		-webkit-backdrop-filter: saturate(180%) blur(30px);
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
	}

	.navbar-container {
		max-width: 1280px;
		margin: 0 auto;
		padding: 0 1rem;
		height: 48px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.navbar-logo {
		display: flex;
		align-items: center;
		background: transparent;
		border: none;
		cursor: pointer;
		transition: opacity 0.2s ease;
	}

	.navbar-logo:hover {
		opacity: 0.8;
	}

	.navbar-menu-desktop {
		display: none;
		gap: 0.25rem;
	}

	@media (min-width: 768px) {
		.navbar-menu-desktop {
			display: flex;
		}
	}

	.navbar-link {
		position: relative;
		padding: 0.5rem 1rem;
		font-size: 0.875rem;
		font-weight: 400;
		color: rgba(0, 0, 0, 0.8);
		background: transparent;
		border: none;
		border-radius: 0.5rem;
		cursor: pointer;
		transition: all 0.2s ease;
		white-space: nowrap;
	}

	.navbar-link:hover {
		color: rgba(0, 0, 0, 1);
		background: rgba(0, 0, 0, 0.04);
	}

	.navbar-link.active {
		color: #059669;
		font-weight: 500;
	}

	.navbar-link.active::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
		width: 4px;
		height: 4px;
		background: #059669;
		border-radius: 50%;
	}

	.navbar-menu-button {
		display: flex;
		width: 40px;
		height: 40px;
		background: transparent;
		border: none;
		border-radius: 0.5rem;
		cursor: pointer;
		transition: background 0.2s ease;
	}

	@media (min-width: 768px) {
		.navbar-menu-button {
			display: none;
		}
	}

	.navbar-menu-button:hover {
		background: rgba(0, 0, 0, 0.04);
	}

	.hamburger {
		position: relative;
		width: 18px;
		height: 14px;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		margin: auto;
	}

	.hamburger span {
		display: block;
		width: 100%;
		height: 2px;
		background: rgba(0, 0, 0, 0.8);
		border-radius: 2px;
		transition: all 0.3s ease;
	}

	.hamburger.open span:nth-child(1) {
		transform: translateY(6px) rotate(45deg);
	}

	.hamburger.open span:nth-child(2) {
		opacity: 0;
	}

	.hamburger.open span:nth-child(3) {
		transform: translateY(-6px) rotate(-45deg);
	}

	.mobile-menu-overlay {
		position: fixed;
		top: 48px;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 999;
		background: rgba(0, 0, 0, 0.4);
		backdrop-filter: blur(10px);
	}

	.mobile-menu {
		background: rgba(255, 255, 255, 0.95);
		backdrop-filter: saturate(180%) blur(20px);
		border-radius: 0 0 1.5rem 1.5rem;
		padding: 1rem;
		margin: 0 1rem;
		box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
	}

	.mobile-menu-link {
		display: block;
		width: 100%;
		padding: 1rem 1.5rem;
		font-size: 1.125rem;
		font-weight: 400;
		color: rgba(0, 0, 0, 0.8);
		text-align: left;
		background: transparent;
		border: none;
		border-radius: 0.75rem;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.mobile-menu-link:hover,
	.mobile-menu-link.active {
		background: rgba(16, 185, 129, 0.1);
		color: #059669;
	}

	/* ========================================
	   LAYOUT PRINCIPAL
	   ======================================== */

	.main-content {
		width: 100%;
	}

	/* ========================================
	   HERO SECTION (FULLSCREEN)
	   ======================================== */

	.hero-section {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		min-height: 100vh;
		overflow: hidden;
	}

	.hero-content {
		position: relative;
		z-index: 10;
		text-align: center;
		max-width: 800px;
	}

	.hero-title {
		font-size: clamp(2rem, 5vw, 3.75rem);
		font-weight: 700;
		color: white;
		margin-bottom: 1rem;
		text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
	}

	.hero-subtitle {
		font-size: clamp(1rem, 2vw, 1.25rem);
		color: rgba(255, 255, 255, 0.9);
		margin-bottom: 2rem;
	}

	.hero-cta {
		display: flex;
		gap: 1rem;
		justify-content: center;
		flex-wrap: wrap;
	}

	.btn-primary {
		padding: 0.75rem 2rem;
		background: #059669;
		color: white;
		border: none;
		border-radius: 9999px;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.3s ease;
	}

	.btn-primary:hover {
		background: #047857;
		transform: translateY(-2px);
		box-shadow: 0 10px 25px rgba(5, 150, 105, 0.3);
	}

	.btn-secondary {
		padding: 0.75rem 2rem;
		background: rgba(255, 255, 255, 0.2);
		color: white;
		border: 2px solid white;
		border-radius: 9999px;
		font-weight: 600;
		cursor: pointer;
		backdrop-filter: blur(10px);
		transition: all 0.3s ease;
	}

	.btn-secondary:hover {
		background: white;
		color: #059669;
		transform: translateY(-2px);
	}

	.hero-vehicle {
		position: absolute;
		bottom: 0;
		height: clamp(12rem, 30vw, 24rem);
		width: auto;
		object-fit: contain;
	}

	@keyframes float {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-20px);
		}
	}

	.scroll-indicator {
		position: absolute;
		bottom: 2rem;
		left: 50%;
		transform: translateX(-50%);
		color: white;
		opacity: 0.7;
	}

	/* ========================================
	   SECTIONS (AUTO HEIGHT)
	   ======================================== */

	.container {
		max-width: 1280px;
		margin: 0 auto;
	}

	.section-header {
		text-align: center;
		margin-bottom: 4rem;
	}

	.section-title {
		font-size: clamp(2rem, 4vw, 2.5rem);
		font-weight: 700;
		color: #064e3b;
		margin-bottom: 1rem;
	}

	.section-subtitle {
		font-size: clamp(1rem, 2vw, 1.125rem);
		color: #64748b;
		max-width: 600px;
		margin: 0 auto;
	}

	/* ========================================
	   GRIDS
	   ======================================== */

	.grid-3 {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 2rem;
	}

	.card {
		background: white;
		border-radius: 1.5rem;
		overflow: hidden;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
		transition: all 0.3s ease;
	}

	.card:hover {
		transform: translateY(-4px);
		box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
	}

	.card-image {
		width: 100%;
		aspect-ratio: 16 / 9;
		overflow: hidden;
	}

	.card-image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.3s ease;
	}

	.card:hover .card-image img {
		transform: scale(1.05);
	}

	.card-content {
		padding: 1.5rem;
	}

	.card-title {
		font-size: 1.25rem;
		font-weight: 600;
		color: #064e3b;
		margin-bottom: 0.5rem;
	}

	.card-desc {
		font-size: 0.875rem;
		color: #64748b;
		line-height: 1.6;
	}

	/* Stats */
	.stats-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 2rem;
	}

	.stat-card {
		text-align: center;
		padding: 2rem;
		background: rgba(255, 255, 255, 0.1);
		border-radius: 1rem;
		backdrop-filter: blur(10px);
		transition: all 0.3s ease;
	}

	.stat-card:hover {
		background: rgba(255, 255, 255, 0.15);
		transform: translateY(-4px);
	}

	.stat-number {
		font-size: 3rem;
		font-weight: 700;
		color: white;
		margin-bottom: 0.5rem;
	}

	.stat-label {
		font-size: 1rem;
		color: rgba(255, 255, 255, 0.9);
	}

	/* Gallery */
	.gallery-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 1.5rem;
	}

	.gallery-item {
		aspect-ratio: 4 / 3;
		border-radius: 1rem;
		overflow: hidden;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		transition: all 0.3s ease;
	}

	.gallery-item:hover {
		transform: scale(1.02);
		box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
	}

	.gallery-item img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	/* Contact */
	.contact-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 1.5rem;
		margin-bottom: 3rem;
	}

	.contact-card {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 1.5rem;
		background: rgba(255, 255, 255, 0.1);
		border-radius: 1rem;
		backdrop-filter: blur(10px);
		text-decoration: none;
		transition: all 0.3s ease;
	}

	.contact-card:hover {
		background: rgba(255, 255, 255, 0.15);
		transform: translateY(-2px);
	}

	.contact-icon {
		width: 1.5rem;
		height: 1.5rem;
		color: #10b981;
		flex-shrink: 0;
	}

	.contact-text {
		color: white;
		font-size: 0.875rem;
		word-break: break-all;
	}

	.btn-back-to-top {
		display: block;
		margin: 0 auto;
		padding: 0.75rem 2rem;
		background: white;
		color: #059669;
		border: none;
		border-radius: 9999px;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.3s ease;
	}

	.btn-back-to-top:hover {
		background: #f0fdf4;
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(255, 255, 255, 0.2);
	}

	/* ========================================
	   UTILITIES
	   ======================================== */

	* {
		scroll-behavior: smooth;
	}

	body {
		margin: 0;
		padding: 0;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
	}
</style>
