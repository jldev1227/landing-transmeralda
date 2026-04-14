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
	</nav>

	<!-- Mobile Sidebar Overlay -->
	{#if mobileMenuOpen}
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			class="sidebar-overlay"
			transition:fade={{ duration: 250 }}
			on:click={() => (mobileMenuOpen = false)}
			on:keydown={(e) => e.key === 'Escape' && (mobileMenuOpen = false)}
			role="button"
			tabindex="0"
		></div>
	{/if}

	<aside
		class="sidebar"
		class:open={mobileMenuOpen}
		role="navigation"
		aria-label="Menú principal"
	>
		<!-- Sidebar Header -->
		<div class="sidebar-header">
			<img
				src="/assets/logo_transmeralda.png"
				alt="Transmeralda"
				class="sidebar-logo"
			/>
			<button
				on:click={() => (mobileMenuOpen = false)}
				class="sidebar-close"
				aria-label="Cerrar menú"
			>
				<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<line x1="18" y1="6" x2="6" y2="18"></line>
					<line x1="6" y1="6" x2="18" y2="18"></line>
				</svg>
			</button>
		</div>

		<!-- Sidebar Links -->
		<nav class="sidebar-nav">
			{#each sections as section}
				<button
					on:click={() => scrollToSection(section)}
					class="sidebar-link"
					class:active={activeSection === section}
				>
					{section.charAt(0).toUpperCase() + section.slice(1)}
				</button>
			{/each}
		</nav>

		<!-- Sidebar Footer -->
		<div class="sidebar-footer">
			<a href="tel:+573001234567" class="sidebar-cta">
				<svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
				</svg>
				Contáctanos
			</a>
		</div>
	</aside>

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
		     SECCIÓN - CONTACTO
		     ======================================== -->
		<section id="contacto" class="section-contact">
			<div class="container">
				<div class="section-header">
					<h2 class="section-title">Contáctanos</h2>
					<p class="section-subtitle">
						Estamos listos para atender tus necesidades de transporte.
					</p>
				</div>

				<div class="contact-grid">
					<a href="mailto:operaciones.transmeraldasas@gmail.com" class="contact-card">
						<svg class="contact-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
							/>
						</svg>
						<div class="contact-info">
							<span class="contact-label">Correo electrónico</span>
							<span class="contact-text">operaciones.transmeraldasas@gmail.com</span>
						</div>
					</a>

					<a
						href="https://wa.me/573232340117"
						target="_blank"
						rel="noopener noreferrer"
						class="contact-card"
					>
						<svg class="contact-icon" fill="currentColor" viewBox="0 0 24 24">
							<path
								d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"
							/>
						</svg>
						<div class="contact-info">
							<span class="contact-label">WhatsApp</span>
							<span class="contact-text">323 234 0117</span>
						</div>
					</a>
				</div>
			</div>
		</section>
	</main>

	<!-- ========================================
	     FOOTER
	     ======================================== -->
	<footer class="footer">
		<div class="footer-container">
			<div class="footer-brand">
				<img src="/assets/logo_transmeralda.png" alt="Transmeralda" class="footer-logo" />
				<p class="footer-tagline">Movilidad inteligente, eficiencia real.</p>
			</div>
			<div class="footer-divider"></div>
			<p class="footer-copy">&copy; {new Date().getFullYear()} Transmeralda S.A.S. Todos los derechos reservados.</p>
		</div>
	</footer>
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

	/* Sidebar Mobile */
	.sidebar-overlay {
		position: fixed;
		inset: 0;
		z-index: 1001;
		background: rgba(0, 0, 0, 0.5);
		backdrop-filter: blur(4px);
	}

	.sidebar {
		position: fixed;
		top: 0;
		left: 0;
		bottom: 0;
		z-index: 1002;
		width: 280px;
		max-width: 80vw;
		background: #ffffff;
		transform: translateX(-100%);
		transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
		display: flex;
		flex-direction: column;
		box-shadow: 4px 0 24px rgba(0, 0, 0, 0.15);
		overflow-y: auto;
	}

	.sidebar.open {
		transform: translateX(0);
	}

	@media (min-width: 768px) {
		.sidebar {
			display: none;
		}
		.sidebar-overlay {
			display: none;
		}
	}

	.sidebar-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1.25rem 1.25rem 1rem;
		border-bottom: 1px solid rgba(0, 0, 0, 0.08);
	}

	.sidebar-logo {
		height: 1.75rem;
		width: auto;
		object-fit: contain;
	}

	.sidebar-close {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 36px;
		height: 36px;
		border: none;
		background: rgba(0, 0, 0, 0.04);
		border-radius: 0.5rem;
		cursor: pointer;
		color: rgba(0, 0, 0, 0.6);
		transition: all 0.2s ease;
	}

	.sidebar-close:hover {
		background: rgba(0, 0, 0, 0.08);
		color: rgba(0, 0, 0, 0.9);
	}

	.sidebar-nav {
		flex: 1;
		padding: 0.75rem;
		display: flex;
		flex-direction: column;
		gap: 0.125rem;
	}

	.sidebar-link {
		display: flex;
		align-items: center;
		width: 100%;
		padding: 0.875rem 1rem;
		font-size: 1rem;
		font-weight: 400;
		color: rgba(0, 0, 0, 0.75);
		text-align: left;
		background: transparent;
		border: none;
		border-radius: 0.625rem;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.sidebar-link:hover {
		background: rgba(16, 185, 129, 0.08);
		color: #059669;
	}

	.sidebar-link.active {
		background: rgba(16, 185, 129, 0.12);
		color: #059669;
		font-weight: 600;
	}

	.sidebar-footer {
		padding: 1rem 1.25rem 1.5rem;
		border-top: 1px solid rgba(0, 0, 0, 0.08);
	}

	.sidebar-cta {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		width: 100%;
		padding: 0.75rem 1rem;
		font-size: 0.9375rem;
		font-weight: 600;
		color: white;
		background: #10b981;
		border: none;
		border-radius: 0.625rem;
		cursor: pointer;
		text-decoration: none;
		transition: all 0.2s ease;
		box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
	}

	.sidebar-cta:hover {
		background: #059669;
		transform: translateY(-1px);
		box-shadow: 0 4px 14px rgba(16, 185, 129, 0.4);
	}

	/* ========================================
	   SECCIÓN HERO
	   ======================================== */
	/* ---- HERO ---- */
	.section-hero {
		position: relative;
		width: 100%;
		height: 100vh;
		height: 100dvh; /* viewport dinámico: se ajusta cuando la barra del navegador aparece/desaparece */
		min-height: 480px;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
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
		background: rgba(6, 78, 59, 0.45);
	}

	.hero-content {
		position: relative;
		z-index: 10;
		width: 100%;
		max-width: 1280px;
		height: 100%;
		margin: 0 auto;
		padding: 4.5rem 1.25rem 2rem; /* top: navbar (48px) + respiro */
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
		gap: 0;
	}

	@media (min-width: 768px) {
		.hero-content {
			padding: 5rem 2rem 2rem;
			align-items: flex-start;
			text-align: left;
		}
	}

	@media (min-width: 1024px) {
		.hero-content {
			padding: 6rem 3rem 3rem;
		}
	}

	.hero-text {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: clamp(0.75rem, 2vh, 1.5rem);
		max-width: 680px;
	}

	@media (min-width: 768px) {
		.hero-text {
			align-items: flex-start;
			max-width: 55%;
		}
	}

	.hero-title {
		font-size: clamp(1.75rem, 6vw + 1vh, 3.5rem);
		font-weight: 800;
		line-height: 1.1;
		color: white;
		text-shadow: 0 2px 20px rgba(16, 185, 129, 0.3);
		margin: 0;
	}

	.hero-subtitle {
		font-size: clamp(0.9rem, 2.5vw + 0.5vh, 1.25rem);
		line-height: 1.6;
		color: rgba(255, 255, 255, 0.95);
		font-weight: 400;
		margin: 0;
	}

	.hero-cta {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: clamp(0.6rem, 1.5vh, 1rem) clamp(1.25rem, 3vw, 2rem);
		font-size: clamp(0.875rem, 1.5vw, 1rem);
		font-weight: 600;
		color: white;
		background: rgba(255, 255, 255, 0.2);
		border: none;
		border-radius: 0.75rem;
		backdrop-filter: blur(10px);
		cursor: pointer;
		transition: all 0.3s ease;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
		white-space: nowrap;
	}

	.hero-cta:hover {
		background: rgba(255, 255, 255, 0.28);
		transform: translateY(-2px);
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
	}

	.hero-cta-icon {
		width: 1.25rem;
		height: 1.25rem;
		flex-shrink: 0;
	}

	/* Mascota anclada al borde inferior del hero */
	.hero-mascot {
		position: absolute;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%) translateY(5%);
		width: 16rem;
		height: auto;
		object-fit: contain;
		pointer-events: none;
		z-index: 15;
	}

	@media (min-width: 480px) {
		.hero-mascot {
			width: 19rem;
		}
	}

	@media (min-width: 768px) {
		.hero-mascot {
			left: auto;
			right: 0;
			transform: translateY(6%);
			width: clamp(14rem, 22vw, 20rem);
			opacity: 1;
		}
	}

	@media (min-width: 1024px) {
		.hero-mascot {
			width: clamp(18rem, 22vw, 24rem);
		}
	}

	@media (min-width: 1280px) {
		.hero-mascot {
			width: clamp(22rem, 24vw, 30rem);
			transform: translateY(8%);
		}
	}

	/* ========================================
	   LAYOUT PRINCIPAL
	   ======================================== */
	.main-content {
		width: 100%;
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
	   SECCIÓN CONTACTO
	   ======================================== */
	.section-contact {
		background: #f0fdf4;
		padding: 4rem 0;
	}

	@media (min-width: 768px) {
		.section-contact {
			padding: 6rem 0;
		}
	}

	.contact-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1rem;
		max-width: 500px;
		margin: 0 auto;
	}

	@media (min-width: 640px) {
		.contact-grid {
			grid-template-columns: repeat(2, 1fr);
			max-width: 960px;
		}
	}

	.contact-card {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 1rem;
		background: white;
		border: 1px solid #d1fae5;
		border-radius: 1rem;
		text-decoration: none;
		transition: all 0.3s ease;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
		overflow: hidden;
	}

	.contact-card:hover {
		background: #ecfdf5;
		transform: translateY(-2px);
		box-shadow: 0 8px 24px rgba(16, 185, 129, 0.12);
		border-color: #a7f3d0;
	}

	@media (min-width: 768px) {
		.contact-card {
			padding: 1.5rem 2rem;
			gap: 1rem;
		}
	}

	.contact-icon {
		width: 1.5rem;
		height: 1.5rem;
		color: #10b981;
		flex-shrink: 0;
	}

	@media (min-width: 768px) {
		.contact-icon {
			width: 2rem;
			height: 2rem;
		}
	}

	.contact-info {
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
		min-width: 0;
		overflow: hidden;
	}

	.contact-label {
		font-size: 0.6875rem;
		font-weight: 500;
		color: #94a3b8;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	@media (min-width: 768px) {
		.contact-label {
			font-size: 0.75rem;
		}
	}

	.contact-text {
		color: #064e3b;
		font-size: 0.75rem;
		font-weight: 500;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	@media (min-width: 768px) {
		.contact-text {
			font-size: 1rem;
		}
	}

	/* ========================================
	   FOOTER
	   ======================================== */
	.footer {
		background: #014f3d;
		padding: 2rem 0;
	}

	.footer-container {
		max-width: 1280px;
		margin: 0 auto;
		padding: 0 1rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		text-align: center;
	}

	@media (min-width: 768px) {
		.footer-container {
			padding: 0 2rem;
		}
	}

	.footer-brand {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
	}

	.footer-logo {
		height: 1.75rem;
		width: auto;
		object-fit: contain;
		filter: brightness(0) invert(1);
		opacity: 0.85;
	}

	.footer-tagline {
		font-size: 0.8125rem;
		color: rgba(255, 255, 255, 0.5);
		font-weight: 400;
	}

	.footer-divider {
		width: 60px;
		height: 1px;
		background: rgba(255, 255, 255, 0.12);
	}

	.footer-copy {
		font-size: 0.75rem;
		color: rgba(255, 255, 255, 0.35);
		font-weight: 400;
	}

	/* ========================================
	   UTILITY CLASSES
	   ======================================== */
</style>