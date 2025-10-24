<script lang="ts">
	import { onMount } from 'svelte';
	import { fly, fade } from 'svelte/transition';
	import { elasticOut, cubicOut } from 'svelte/easing';

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
			img: '/images/capacidades/app.png'
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
					class="navbar-logo-img"
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
		<section id="inicio" class="section-hero">
			<!-- ✨ Video de fondo -->
			<video
				autoplay
				muted
				loop
				playsinline
				class="hero-video"
			>
				<source src="/videos/fondo_transmeralda.mp4" type="video/mp4" />
			</video>

			<!-- 🟢 Capa de color -->
			<div class="hero-overlay"></div>

			<div class="hero-content" in:fly={{ y: 200, duration: 1000, easing: elasticOut }}>
				<div class="hero-text">
					<h1 class="hero-title">
						Bienvenido a Transmeralda
					</h1>
					<p class="hero-subtitle">
						Movilidad inteligente, eficiencia real. Una nueva experiencia en transporte corporativo
						con el sello Transmeralda.
					</p>
					<button
						in:fly={{ y: 200, duration: 1000, easing: elasticOut }}
						on:click={() => scrollToSection('contacto')}
						class="hero-cta"
					>
						<svg
							class="hero-cta-icon"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
							/>
						</svg>
						Contáctanos
					</button>
				</div>
			</div>
			
			<img
				in:fly={{ y: 200, duration: 1000, easing: elasticOut, delay: 200 }}
				class="hero-mascot"
				src="/assets/codi.png"
				alt="Logo Transmeralda"
			/>
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
						<div class="stat-label">Clientes satisfechos</div>
					</div>
					<div class="stat-card">
						<div class="stat-number">50+</div>
						<div class="stat-label">Vehículos en operación</div>
					</div>
					<div class="stat-card">
						<div class="stat-number">99%</div>
						<div class="stat-label">Tasa de cumplimiento</div>
					</div>
				</div>
			</div>
		</section>

		<!-- ========================================
		     SECCIÓN 4 - BENEFICIOS
		     ======================================== -->
		<section id="beneficios" class="section-normal">
			<div class="container">
				<div class="section-header">
					<h2 class="section-title">Beneficios reales para tu empresa</h2>
					<p class="section-subtitle">
						Resultados medibles que impactan positivamente tu operación.
					</p>
				</div>

				<div class="grid-3">
					{#each beneficios as card}
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
		     SECCIÓN 5 - GALERÍA
		     ======================================== -->
		<section id="galeria" class="section-colored">
			<div class="container">
				<div class="section-header">
					<h2 class="section-title text-white">Galería</h2>
					<p class="section-subtitle text-emerald-100">
						Conoce nuestra flota y operaciones en imágenes.
					</p>
				</div>

				<div class="gallery-grid">
					{#each Array(6) as _, i}
						<div class="gallery-item">
							<img
								src={`/images/galeria/imagen-${i + 1}.jpg`}
								alt={`Galería ${i + 1}`}
								loading="lazy"
							/>
						</div>
					{/each}
				</div>
			</div>
		</section>

		<!-- ========================================
		     SECCIÓN 6 - CONTACTO
		     ======================================== -->
		<section id="contacto" class="section-normal">
			<div class="container">
				<div class="section-header">
					<h2 class="section-title">Contáctanos</h2>
					<p class="section-subtitle">Estamos listos para atender tus necesidades de transporte.</p>
				</div>

				<div class="contact-grid">
					<a href="tel:+573001234567" class="contact-card">
						<svg class="contact-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
							/>
						</svg>
						<span class="contact-text">+57 300 123 4567</span>
					</a>

					<a href="mailto:info@transmeralda.com" class="contact-card">
						<svg class="contact-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
							/>
						</svg>
						<span class="contact-text">info@transmeralda.com</span>
					</a>

					<a
						href="https://wa.me/573001234567"
						target="_blank"
						rel="noopener noreferrer"
						class="contact-card"
					>
						<svg class="contact-icon" fill="currentColor" viewBox="0 0 24 24">
							<path
								d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"
							/>
						</svg>
						<span class="contact-text">WhatsApp</span>
					</a>
				</div>

				<button on:click={() => scrollToSection('inicio')} class="btn-back-to-top">
					↑ Volver al inicio
				</button>
			</div>
		</section>
	</main>
{/if}

<style>
	/* ========================================
	   RESET & BASE
	   ======================================== */
	:global(*) {
		box-sizing: border-box;
		margin: 0;
		padding: 0;
	}

	:global(body) {
		margin: 0;
		padding: 0;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
			sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		overflow-x: hidden;
	}

	:global(*) {
		scroll-behavior: smooth;
	}

	/* ========================================
	   NAVBAR - ESTILO APPLE
	   ======================================== */
	.navbar-apple {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 1000;
		height: 48px;
		background: rgba(255, 255, 255, 0.72);
		backdrop-filter: saturate(180%) blur(20px);
		border-bottom: 1px solid rgba(0, 0, 0, 0.08);
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.navbar-apple.scrolled {
		background: rgba(255, 255, 255, 0.8);
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	}

	.navbar-container {
		max-width: 1280px;
		height: 100%;
		margin: 0 auto;
		padding: 0 1rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	/* Logo */
	.navbar-logo {
		display: flex;
		align-items: center;
		background: transparent;
		border: none;
		cursor: pointer;
		padding: 0.5rem;
		margin-left: -0.5rem;
		border-radius: 0.5rem;
		transition: background 0.2s ease;
	}

	.navbar-logo:hover {
		background: rgba(0, 0, 0, 0.04);
	}

	.navbar-logo-img {
		height: 2rem;
		width: auto;
		object-fit: contain;
	}

	/* Desktop Menu */
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
		background: rgba(0, 0, 0, 0.04);
	}

	.navbar-link.active {
		color: #059669;
		font-weight: 500;
	}

	/* Mobile Menu Button */
	.navbar-menu-button {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		background: transparent;
		border: none;
		border-radius: 0.5rem;
		cursor: pointer;
		transition: background 0.2s ease;
		padding: 0;
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

	/* Mobile Menu Overlay */
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
	   SECCIÓN HERO
	   ======================================== */
	.section-hero {
		position: relative;
		min-height: 100vh;
		min-height: 100dvh;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
		padding: 6rem 1rem 4rem;
	}

	@media (min-width: 768px) {
		.section-hero {
			padding: 8rem 2rem;
		}
	}

	@media (min-width: 1024px) {
		.section-hero {
			padding: 12rem 3rem;
		}
	}

	.hero-video {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		opacity: 0.8;
	}

	.hero-overlay {
		position: absolute;
		inset: 0;
		background: rgba(6, 78, 59, 0.4);
	}

	.hero-content {
		position: relative;
		z-index: 10;
		width: 100%;
		max-width: 1280px;
		margin: 0 auto;
		display: grid;
		grid-template-columns: 1fr;
		gap: 2rem;
		text-align: center;
	}

	@media (min-width: 768px) {
		.hero-content {
			text-align: left;
		}
	}

	.hero-text {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.5rem;
	}

	@media (min-width: 768px) {
		.hero-text {
			align-items: flex-start;
		}
	}

	.hero-title {
		font-size: clamp(2rem, 8vw, 3.5rem);
		font-weight: 800;
		line-height: 1.1;
		color: white;
		text-shadow: 0 2px 20px rgba(16, 185, 129, 0.3);
		margin-bottom: 1rem;
	}

	@media (min-width: 768px) {
		.hero-title {
			font-size: clamp(2.5rem, 5vw, 3.5rem);
		}
	}

	.hero-subtitle {
		max-width: 600px;
		font-size: clamp(1rem, 3vw, 1.25rem);
		line-height: 1.6;
		color: rgba(255, 255, 255, 0.95);
		font-weight: 400;
	}

	.hero-cta {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 1rem 2rem;
		font-size: 1rem;
		font-weight: 600;
		color: white;
		background: rgba(255, 255, 255, 0.2);
		border: none;
		border-radius: 0.75rem;
		backdrop-filter: blur(10px);
		cursor: pointer;
		transition: all 0.3s ease;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	}

	.hero-cta:hover {
		background: rgba(255, 255, 255, 0.25);
		transform: translateY(-2px);
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
	}

	.hero-cta-icon {
		width: 1.25rem;
		height: 1.25rem;
		flex-shrink: 0;
	}

	.hero-mascot {
		position: absolute;
		right: 0;
		bottom: -5rem;
		width: 16rem;
		height: 16rem;
		object-fit: contain;
		pointer-events: none;
		display: none;
	}

	@media (min-width: 768px) {
		.hero-mascot {
			display: block;
			width: 20rem;
			height: 20rem;
			bottom: -6rem;
		}
	}

	@media (min-width: 1024px) {
		.hero-mascot {
			width: 28rem;
			height: 28rem;
			bottom: -8rem;
		}
	}

	@media (min-width: 1536px) {
		.hero-mascot {
			width: 32rem;
			height: 32rem;
			bottom: -10rem;
		}
	}

	/* ========================================
	   LAYOUT PRINCIPAL
	   ======================================== */
	.main-content {
		width: 100%;
		margin-top: 48px;
	}

	.container {
		max-width: 1280px;
		margin: 0 auto;
		padding: 0 1rem;
	}

	@media (min-width: 768px) {
		.container {
			padding: 0 2rem;
		}
	}

	/* Secciones */
	.section-normal {
		padding: 4rem 0;
	}

	@media (min-width: 768px) {
		.section-normal {
			padding: 6rem 0;
		}
	}

	@media (min-width: 1024px) {
		.section-normal {
			padding: 8rem 0;
		}
	}

	.section-colored {
		background: linear-gradient(135deg, #064e3b 0%, #059669 100%);
		padding: 4rem 0;
	}

	@media (min-width: 768px) {
		.section-colored {
			padding: 6rem 0;
		}
	}

	@media (min-width: 1024px) {
		.section-colored {
			padding: 8rem 0;
		}
	}

	.section-header {
		text-align: center;
		margin-bottom: 3rem;
	}

	@media (min-width: 768px) {
		.section-header {
			margin-bottom: 4rem;
		}
	}

	.section-title {
		font-size: clamp(1.75rem, 5vw, 2.5rem);
		font-weight: 700;
		color: #064e3b;
		margin-bottom: 1rem;
		line-height: 1.2;
	}

	.section-subtitle {
		font-size: clamp(0.875rem, 2.5vw, 1.125rem);
		color: #64748b;
		max-width: 600px;
		margin: 0 auto;
		line-height: 1.6;
	}

	/* Utilities */
	.text-white {
		color: white;
	}

	.text-emerald-100 {
		color: rgba(255, 255, 255, 0.9);
	}

	/* ========================================
	   GRIDS
	   ======================================== */
	.grid-3 {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1.5rem;
	}

	@media (min-width: 640px) {
		.grid-3 {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (min-width: 1024px) {
		.grid-3 {
			grid-template-columns: repeat(3, 1fr);
			gap: 2rem;
		}
	}

	/* Cards */
	.card {
		background: white;
		border-radius: 1rem;
		overflow: hidden;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
		transition: all 0.3s ease;
	}

	@media (min-width: 768px) {
		.card {
			border-radius: 1.5rem;
		}
	}

	.card:hover {
		transform: translateY(-4px);
		box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
	}

	.card-image {
		width: 100%;
		aspect-ratio: 16 / 9;
		overflow: hidden;
		background: #f1f5f9;
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
		padding: 1.25rem;
	}

	@media (min-width: 768px) {
		.card-content {
			padding: 1.5rem;
		}
	}

	.card-title {
		font-size: 1.125rem;
		font-weight: 600;
		color: #064e3b;
		margin-bottom: 0.5rem;
		line-height: 1.3;
	}

	@media (min-width: 768px) {
		.card-title {
			font-size: 1.25rem;
		}
	}

	.card-desc {
		font-size: 0.875rem;
		color: #64748b;
		line-height: 1.6;
	}

	/* Stats Grid */
	.stats-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 1rem;
	}

	@media (min-width: 768px) {
		.stats-grid {
			grid-template-columns: repeat(4, 1fr);
			gap: 2rem;
		}
	}

	.stat-card {
		text-align: center;
		padding: 1.5rem 1rem;
		background: rgba(255, 255, 255, 0.1);
		border-radius: 1rem;
		backdrop-filter: blur(10px);
		transition: all 0.3s ease;
	}

	@media (min-width: 768px) {
		.stat-card {
			padding: 2rem;
		}
	}

	.stat-card:hover {
		background: rgba(255, 255, 255, 0.15);
		transform: translateY(-4px);
	}

	.stat-number {
		font-size: clamp(2rem, 6vw, 3rem);
		font-weight: 700;
		color: white;
		margin-bottom: 0.5rem;
		line-height: 1;
	}

	.stat-label {
		font-size: clamp(0.75rem, 2vw, 1rem);
		color: rgba(255, 255, 255, 0.9);
		line-height: 1.4;
	}

	/* Gallery Grid */
	.gallery-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1rem;
	}

	@media (min-width: 640px) {
		.gallery-grid {
			grid-template-columns: repeat(2, 1fr);
			gap: 1.5rem;
		}
	}

	@media (min-width: 1024px) {
		.gallery-grid {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	.gallery-item {
		aspect-ratio: 4 / 3;
		border-radius: 0.75rem;
		overflow: hidden;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		transition: all 0.3s ease;
		background: #f1f5f9;
	}

	@media (min-width: 768px) {
		.gallery-item {
			border-radius: 1rem;
		}
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

	/* Contact Grid */
	.contact-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1rem;
		margin-bottom: 2rem;
	}

	@media (min-width: 640px) {
		.contact-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (min-width: 1024px) {
		.contact-grid {
			grid-template-columns: repeat(3, 1fr);
			gap: 1.5rem;
			margin-bottom: 3rem;
		}
	}

	.contact-card {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 1.25rem;
		background: rgba(16, 185, 129, 0.1);
		border-radius: 0.75rem;
		text-decoration: none;
		transition: all 0.3s ease;
	}

	@media (min-width: 768px) {
		.contact-card {
			padding: 1.5rem;
			border-radius: 1rem;
		}
	}

	.contact-card:hover {
		background: rgba(16, 185, 129, 0.15);
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
	}

	.contact-icon {
		width: 1.5rem;
		height: 1.5rem;
		color: #10b981;
		flex-shrink: 0;
	}

	.contact-text {
		color: #064e3b;
		font-size: 0.875rem;
		font-weight: 500;
		word-break: break-word;
	}

	@media (min-width: 768px) {
		.contact-text {
			font-size: 1rem;
		}
	}

	/* Back to Top Button */
	.btn-back-to-top {
		display: block;
		margin: 0 auto;
		padding: 0.875rem 2rem;
		background: #10b981;
		color: white;
		border: none;
		border-radius: 9999px;
		font-weight: 600;
		font-size: 0.875rem;
		cursor: pointer;
		transition: all 0.3s ease;
		box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
	}

	@media (min-width: 768px) {
		.btn-back-to-top {
			padding: 1rem 2.5rem;
			font-size: 1rem;
		}
	}

	.btn-back-to-top:hover {
		background: #059669;
		transform: translateY(-2px);
		box-shadow: 0 8px 20px rgba(16, 185, 129, 0.4);
	}

	/* ========================================
	   UTILITY CLASSES
	   ======================================== */
	@media (max-width: 640px) {
		.mobile-hidden {
			display: none;
		}
	}
</style>