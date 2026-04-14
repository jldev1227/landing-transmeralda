<script lang="ts">
	import { onMount } from 'svelte';
	import { fly, fade, scale, slide } from 'svelte/transition';
	import { elasticOut, cubicOut, quintOut } from 'svelte/easing';

	// Estado reactivo
	let show: boolean = false;
	let scrolled: boolean = false;
	let mobileMenuOpen: boolean = false;
	let activeSection: string = 'inicio';

	// Scroll-triggered visibility
	let capVisible: boolean = false;
	let nosotrosVisible: boolean = false;
	let flotaVisible: boolean = false;

	// Flota showcase
	let activeFlota: number = 0;
	let flotaInterval: ReturnType<typeof setInterval> | null = null;

	function startFlotaAutoplay() {
		stopFlotaAutoplay();
		flotaInterval = setInterval(() => {
			activeFlota = (activeFlota + 1) % flotaItems.length;
		}, 4000);
	}

	function stopFlotaAutoplay() {
		if (flotaInterval) {
			clearInterval(flotaInterval);
			flotaInterval = null;
		}
	}

	function selectFlota(index: number) {
		activeFlota = index;
		// Reiniciar el autoplay al seleccionar manualmente
		startFlotaAutoplay();
	}

	const flotaItems = [
		{
			img: '/images/flota/slide-1.jpg',
			title: 'Camionetas',
			desc: 'Camionetas robustas y confiables para rutas exigentes en el piedemonte llanero.',
			alt: 'Camioneta Transmeralda para transporte especial en Casanare'
		},
		{
			img: '/images/flota/slide-2.jpg',
			title: 'Buses',
			desc: 'Buses cómodos y seguros para el transporte grupal de personal corporativo.',
			alt: 'Bus Transmeralda - Transporte de personal en Casanare'
		},
		{
			img: '/images/flota/slide-3.png',
			title: 'Equipamiento completo',
			desc: 'Todas nuestras unidades cuentan con GPS, aire acondicionado y protocolos de seguridad.',
			alt: 'Vehículo Transmeralda equipado con GPS y aire acondicionado'
		},
		{
			img: '/images/flota/',
			title: 'Transporte especial',
			desc: 'Camionetas y buses habilitados para transporte terrestre automotor especial.',
			alt: 'Transporte terrestre automotor especial - Transmeralda Yopal'
		}
	];

	// Años de experiencia calculados automáticamente desde el 3 de octubre de 2021
	const FECHA_FUNDACION = new Date(2021, 9, 3); // Octubre = mes 9 (0-indexed)
	const hoy = new Date();
	const yearsExperiencia = Math.floor(
		(hoy.getTime() - FECHA_FUNDACION.getTime()) / (365.25 * 24 * 60 * 60 * 1000)
	);

	const sections: string[] = [
		'inicio',
		'capacidades',
		'nosotros',
		'servicios',
		'flota',
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

		// Intersection Observer para animaciones al hacer scroll
		const observerOptions = { threshold: 0.15 };
		const observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					if (entry.target.id === 'capacidades') capVisible = true;
					if (entry.target.id === 'nosotros') nosotrosVisible = true;
					if (entry.target.id === 'flota') flotaVisible = true;
				}
			});
		}, observerOptions);

		// Observar secciones después de un tick
		setTimeout(() => {
			const capSection = document.getElementById('capacidades');
			const nosSection = document.getElementById('nosotros');
			const flotaSection = document.getElementById('flota');
			if (capSection) observer.observe(capSection);
			if (nosSection) observer.observe(nosSection);
			if (flotaSection) observer.observe(flotaSection);
		}, 200);

		// Iniciar autoplay de flota
		startFlotaAutoplay();

		return () => {
			window.removeEventListener('scroll', handleScroll);
			observer.disconnect();
			stopFlotaAutoplay();
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
				preload="auto"
				poster="/images/flota/slide-1.jpg"
				class="hero-video"
			>
				<source src="/videos/fondo_transmeralda.mp4" type="video/mp4" />
			</video>

			<!-- 🟢 Capa de color -->
			<div class="hero-overlay"></div>

			<div class="hero-content" in:fly={{ y: 200, duration: 1000, easing: elasticOut }}>
				<div class="hero-text">
					<h1 class="hero-title">
						Servicio de Transporte Especial en Casanare y toda Colombia
					</h1>
					<p class="hero-subtitle">
						Transmeralda S.A.S. — Transporte terrestre automotor especial desde Yopal, Casanare. Movilidad inteligente, eficiencia real y seguridad para tu equipo.
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
				alt="Codi - Mascota de Transmeralda, empresa de transporte especial en Casanare"
			/>
		</section>

		<!-- ========================================
		     SECCIÓN - CAPACIDADES
		     ======================================== -->
		<section id="capacidades" class="section-cap">
			<div class="container">
				{#if capVisible}
					<div class="cap-header" in:fly={{ y: 40, duration: 700, easing: quintOut }}>
						<span class="cap-badge">Lo que nos respalda</span>
						<h2 class="section-title">Nuestras Capacidades</h2>
						<p class="section-subtitle">
							Tecnología, talento y procesos que garantizan un servicio de primer nivel.
						</p>
					</div>

					<div class="cap-grid">
						{#each capacidades as cap, i}
							<div
								class="cap-card"
								in:fly={{ y: 60, duration: 600, delay: 100 + i * 120, easing: quintOut }}
							>
								<div class="cap-card-icon">
									<img src={cap.img} alt={cap.title} loading="lazy" />
								</div>
								<div class="cap-card-body">
									<h3 class="cap-card-title">{cap.title}</h3>
									<p class="cap-card-desc">{cap.desc}</p>
								</div>
								<div class="cap-card-number">{String(i + 1).padStart(2, '0')}</div>
							</div>
						{/each}
					</div>
				{/if}
			</div>
		</section>

		<!-- ========================================
		     SECCIÓN - NOSOTROS
		     ======================================== -->
		<section id="nosotros" class="section-nosotros">
			<div class="container">
				{#if nosotrosVisible}
					<div class="nosotros-layout">
						<div class="nosotros-text" in:fly={{ x: -60, duration: 800, easing: quintOut }}>
							<span class="nosotros-badge">Sobre nosotros</span>
							<h2 class="nosotros-title">Una empresa casanareña con alcance nacional</h2>
							<p class="nosotros-desc">
								Desde Yopal, Casanare, nos hemos consolidado como referente en transporte terrestre automotor especial. Nuestra misión es mover personas con seguridad, eficiencia y calidez humana.
							</p>
							<div class="nosotros-highlights">
								<div class="nosotros-highlight" in:fly={{ y: 20, duration: 500, delay: 400, easing: quintOut }}>
									<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
									<span>Habilitación nacional vigente</span>
								</div>
								<div class="nosotros-highlight" in:fly={{ y: 20, duration: 500, delay: 550, easing: quintOut }}>
									<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
									<span>Cobertura en todo el territorio</span>
								</div>
							</div>

							<!-- Certificaciones ISO -->
							<div class="nosotros-iso" in:fly={{ y: 30, duration: 600, delay: 800, easing: quintOut }}>
								<span class="iso-label">Alineados con estándares internacionales</span>
								<div class="iso-badges">
									<div class="iso-badge">
										<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" /></svg>
										<div>
											<strong>ISO 9001</strong>
											<span>Gestión de Calidad</span>
										</div>
									</div>
									<div class="iso-badge">
										<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5a17.92 17.92 0 0 1-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" /></svg>
										<div>
											<strong>ISO 14001</strong>
											<span>Gestión Ambiental</span>
										</div>
									</div>
									<div class="iso-badge">
										<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg>
										<div>
											<strong>ISO 45001</strong>
											<span>Seguridad y Salud en el Trabajo</span>
										</div>
									</div>
								</div>
							</div>
						</div>

						<div class="nosotros-visual" in:fly={{ x: 60, duration: 800, delay: 200, easing: quintOut }}>
							<!-- Casanare showcase -->
							<div class="casanare-showcase">
								<div class="casanare-pulse"></div>
								<img class="casanare-outline" src="/assets/casanare-polyline.png" alt="Departamento de Casanare" />
								<span class="casanare-label">Casanare, Colombia</span>
							</div>

							<!-- Stats cards debajo -->
							<div class="nosotros-stats">
								<div class="stat-item">
									<span class="stat-value">{yearsExperiencia}+</span>
									<span class="stat-name">Años de experiencia</span>
								</div>
								<div class="stat-item">
									<span class="stat-value">50+</span>
									<span class="stat-name">Vehículos en flota</span>
								</div>
								<div class="stat-item">
									<span class="stat-value">100+</span>
									<span class="stat-name">Conductores certificados</span>
								</div>
								<div class="stat-item stat-item--accent">
									<span class="stat-value">24/7</span>
									<span class="stat-name">Monitoreo GPS</span>
								</div>
							</div>
						</div>
					</div>
				{/if}
			</div>
		</section>

		<!-- ========================================
		     SECCIÓN - SERVICIOS
		     ======================================== -->
		<section id="servicios" class="section-servicios">
			<div class="container">
				<div class="section-header">
					<h2 class="section-title">Nuestros Servicios</h2>
					<p class="section-subtitle">
						Desde los llanos orientales, en tierras casanareñas, prestamos el Servicio Público de Transporte Terrestre Automotor Especial, no solo a nivel local, sino en todo el territorio nacional.
					</p>
				</div>

				<!-- Banner con imagen de flota -->
				<div class="servicios-banner">
					<div class="servicios-banner-img">
						<img src="/images/flota/slide-1.jpg" alt="Flota de vehículos Transmeralda para transporte especial en Yopal, Casanare" loading="lazy" />
					</div>
					<div class="servicios-banner-content">
						<h3 class="servicios-banner-title">Flota moderna y segura</h3>
						<p class="servicios-banner-desc">
							Vehículos equipados con GPS, aire acondicionado y todas las medidas de seguridad para garantizar el bienestar de tu equipo.
						</p>
					</div>
				</div>

				<!-- Cards de servicios -->
				<div class="servicios-grid">
					<article class="servicio-card">
						<div class="servicio-icon">
							<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
								<path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.747L15.33 3.79a3.375 3.375 0 0 0-2.808-1.54H6.75A2.25 2.25 0 0 0 4.5 4.5v9.75" />
							</svg>
						</div>
						<h3 class="servicio-title">Transporte de Personal</h3>
						<p class="servicio-desc">Rutas empresariales, turnos rotativos y traslados desde punto de origen hasta la operación. Puntualidad garantizada.</p>
					</article>

					<article class="servicio-card">
						<div class="servicio-icon">
							<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
								<path stroke-linecap="round" stroke-linejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" />
							</svg>
						</div>
						<h3 class="servicio-title">Logística y Rutas Especiales</h3>
						<p class="servicio-desc">Diseñamos rutas optimizadas según la ubicación de tus colaboradores, reduciendo tiempos y costos de desplazamiento.</p>
					</article>

					<article class="servicio-card">
						<div class="servicio-icon">
							<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
								<path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
							</svg>
						</div>
						<h3 class="servicio-title">Seguridad y Cumplimiento</h3>
						<p class="servicio-desc">Conductores certificados, documentación al día, protocolos de bioseguridad y monitoreo GPS en tiempo real 24/7.</p>
					</article>
				</div>
			</div>
		</section>

		<!-- ========================================
		     SECCIÓN - FLOTA
		     ======================================== -->
		<section id="flota" class="section-flota">
			<div class="container">
				{#if flotaVisible}
					<div class="flota-header" in:fly={{ y: 40, duration: 700, easing: quintOut }}>
						<span class="flota-badge">Nuestra Flota</span>
						<h2 class="section-title">Vehículos que inspiran confianza</h2>
						<p class="section-subtitle">
							Cada unidad cuenta con GPS, aire acondicionado, documentación al día y protocolos de seguridad certificados.
						</p>
					</div>

					<!-- Showcase principal -->
					<div class="flota-showcase" in:fly={{ y: 60, duration: 800, delay: 200, easing: quintOut }}>
						<!-- Imagen principal con crossfade -->
						<div class="flota-hero">
							{#each flotaItems as item, i}
								{#if activeFlota === i}
									<div class="flota-hero-img" in:fade={{ duration: 500 }} out:fade={{ duration: 300 }}>
										<img src={item.img} alt={item.alt} />
										<div class="flota-hero-overlay">
											<div class="flota-hero-info" in:fly={{ y: 20, duration: 400, delay: 200, easing: quintOut }}>
												<h3>{item.title}</h3>
												<p>{item.desc}</p>
											</div>
										</div>
									</div>
								{/if}
							{/each}
							<!-- Indicador de posición -->
							<div class="flota-counter">
								<span class="flota-counter-current">{String(activeFlota + 1).padStart(2, '0')}</span>
								<span class="flota-counter-sep">/</span>
								<span class="flota-counter-total">{String(flotaItems.length).padStart(2, '0')}</span>
							</div>
						</div>

						<!-- Thumbnails -->
						<div class="flota-thumbs">
							{#each flotaItems as item, i}
								<button
									class="flota-thumb"
									class:flota-thumb--active={activeFlota === i}
									on:click={() => selectFlota(i)}
									in:fly={{ y: 30, duration: 500, delay: 400 + i * 100, easing: quintOut }}
								>
									<img src={item.img} alt={item.alt} loading="lazy" />
									<div class="flota-thumb-label">
										<span class="flota-thumb-num">{String(i + 1).padStart(2, '0')}</span>
										<span class="flota-thumb-title">{item.title}</span>
									</div>
								</button>
							{/each}
						</div>
					</div>
				{/if}
			</div>
		</section>

		<!-- ========================================
		     SECCIÓN - CONTACTO
		     ======================================== -->
		<section id="contacto" class="section-contact">
			<div class="container">
				<div class="contact-layout">
					<!-- Lado izquierdo: Cody + vehículo -->
					<div class="contact-visual">
						<img src="/assets/codi_vehiculo.png" alt="Cody, mascota de Transmeralda, junto a camioneta" class="contact-cody" />
					</div>

					<!-- Lado derecho: contenido -->
					<div class="contact-content">
						<span class="contact-badge">¿Listo para viajar seguro?</span>
						<h2 class="contact-title">Hablemos sobre tu próximo <span class="contact-highlight">servicio de transporte</span></h2>
						<p class="contact-desc">
							Nuestro equipo está disponible para cotizar, resolver dudas y organizar el transporte de tu personal. ¡Escríbenos ahora!
						</p>

						<!-- CTA Buttons -->
						<div class="contact-actions">
							<a
								href="https://wa.me/573232340117?text=Hola%20Transmeralda%2C%20estoy%20interesado%20en%20cotizar%20un%20servicio%20de%20transporte%20especial.%20%C2%BFPodr%C3%ADan%20brindarme%20informaci%C3%B3n%3F"
								target="_blank"
								rel="noopener noreferrer"
								class="contact-cta contact-cta--whatsapp"
							>
								<span class="cta-pulse"></span>
								<svg class="cta-icon" fill="currentColor" viewBox="0 0 24 24">
									<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
								</svg>
								Cotizar por WhatsApp
							</a>

							<a href="mailto:operaciones.transmeraldasas@gmail.com" class="contact-cta contact-cta--email">
								<svg class="cta-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
									<path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
								</svg>
								Enviar correo
							</a>

							<a href="tel:+573232340117" class="contact-cta contact-cta--phone">
								<svg class="cta-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
									<path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
								</svg>
								Llamar ahora
							</a>
						</div>

						<!-- Info cards compactas -->
						<div class="contact-info-row">
							<div class="contact-info-chip">
								<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
								<span>Lun - Sáb · 6am a 6pm</span>
							</div>
							<div class="contact-info-chip">
								<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 0 1 15 0Z" /></svg>
								<span>Villanueva</span>
							</div>
							<div class="contact-info-chip">
								<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 0 1 15 0Z" /></svg>
								<span>Monterrey</span>
							</div>
							<div class="contact-info-chip">
								<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 0 1 15 0Z" /></svg>
								<span>Tauramena</span>
							</div>
						</div>
					</div>
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
				<img src="/assets/logo_transmeralda.png" alt="Transmeralda S.A.S. - Transporte Especial Casanare" class="footer-logo" />
				<p class="footer-tagline">Transporte terrestre automotor especial desde los llanos orientales.</p>
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
		height: 100dvh;
		min-height: 480px;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
		background-color: #064e3b;
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

	/* ========================================
	   CAPACIDADES SECTION
	   ======================================== */
	.section-cap {
		background: #f8fafb;
		padding: 4rem 0;
		min-height: 100vh;
		min-height: 100dvh;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	@media (min-width: 768px) {
		.section-cap {
			padding: 6rem 0;
		}
	}

	@media (min-width: 1024px) {
		.section-cap {
			padding: 8rem 0;
		}
	}

	.cap-header {
		text-align: center;
		margin-bottom: 3rem;
	}

	.cap-badge {
		display: inline-block;
		background: #ecfdf5;
		color: #059669;
		padding: 0.375rem 1rem;
		border-radius: 2rem;
		font-size: 0.8rem;
		font-weight: 600;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		margin-bottom: 1rem;
	}

	.cap-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1rem;
	}

	@media (min-width: 640px) {
		.cap-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (min-width: 1024px) {
		.cap-grid {
			grid-template-columns: repeat(3, 1fr);
			gap: 1.25rem;
		}
	}

	.cap-card {
		position: relative;
		display: flex;
		align-items: flex-start;
		gap: 1rem;
		background: white;
		padding: 1.5rem;
		border-radius: 1rem;
		border: 1px solid #e2e8f0;
		transition: all 0.35s ease;
		overflow: hidden;
	}

	.cap-card:hover {
		border-color: #a7f3d0;
		box-shadow: 0 8px 30px rgba(5, 150, 105, 0.08);
		transform: translateY(-2px);
	}

	.cap-card-icon {
		flex-shrink: 0;
		width: 48px;
		height: 48px;
		background: #ecfdf5;
		border-radius: 0.75rem;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0.5rem;
	}

	.cap-card-icon img {
		width: 100%;
		height: 100%;
		object-fit: contain;
	}

	.cap-card-body {
		flex: 1;
		min-width: 0;
	}

	.cap-card-title {
		font-size: 1rem;
		font-weight: 600;
		color: #1e293b;
		margin-bottom: 0.35rem;
		line-height: 1.3;
	}

	.cap-card-desc {
		font-size: 0.85rem;
		color: #64748b;
		line-height: 1.55;
	}

	.cap-card-number {
		position: absolute;
		bottom: 0.75rem;
		right: 1rem;
		font-size: 2rem;
		font-weight: 800;
		color: #f1f5f9;
		line-height: 1;
		pointer-events: none;
	}

	.cap-card:hover .cap-card-number {
		color: #d1fae5;
	}

	/* ========================================
	   NOSOTROS SECTION
	   ======================================== */
	.section-nosotros {
		background: linear-gradient(160deg, #064e3b 0%, #047857 50%, #059669 100%);
		padding: 4rem 0;
		position: relative;
		overflow: hidden;
		min-height: 100vh;
		min-height: 100dvh;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.section-nosotros::before {
		content: '';
		position: absolute;
		top: -50%;
		right: -20%;
		width: 500px;
		height: 500px;
		background: radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%);
		border-radius: 50%;
		pointer-events: none;
	}

	@media (min-width: 768px) {
		.section-nosotros {
			padding: 6rem 0;
		}
	}

	@media (min-width: 1024px) {
		.section-nosotros {
			padding: 8rem 0;
		}
	}

	.nosotros-layout {
		display: flex;
		flex-direction: column;
		gap: 3rem;
	}

	@media (min-width: 1024px) {
		.nosotros-layout {
			flex-direction: row;
			align-items: center;
			gap: 4rem;
		}
	}

	.nosotros-text {
		flex: 1.2;
	}

	.nosotros-badge {
		display: inline-block;
		background: rgba(255,255,255,0.12);
		color: #a7f3d0;
		padding: 0.375rem 1rem;
		border-radius: 2rem;
		font-size: 0.8rem;
		font-weight: 600;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		margin-bottom: 1rem;
		backdrop-filter: blur(4px);
	}

	.nosotros-title {
		font-size: clamp(1.75rem, 4vw, 2.5rem);
		font-weight: 700;
		color: white;
		line-height: 1.2;
		margin-bottom: 1rem;
	}

	.nosotros-desc {
		font-size: clamp(0.9rem, 2vw, 1.05rem);
		color: rgba(255,255,255,0.85);
		line-height: 1.7;
		margin-bottom: 1.5rem;
	}

	.nosotros-highlights {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.nosotros-highlight {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		color: #a7f3d0;
		font-size: 0.9rem;
		font-weight: 500;
	}

	.nosotros-highlight svg {
		width: 20px;
		height: 20px;
		flex-shrink: 0;
	}

	/* ISO Certifications */
	.nosotros-iso {
		margin-top: 2rem;
		padding-top: 1.5rem;
		border-top: 1px solid rgba(255,255,255,0.1);
	}

	.iso-label {
		display: block;
		font-size: 0.75rem;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: rgba(255,255,255,0.5);
		margin-bottom: 1rem;
	}

	.iso-badges {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	@media (min-width: 640px) {
		.iso-badges {
			flex-direction: row;
			gap: 1rem;
		}
	}

	.iso-badge {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		background: rgba(255,255,255,0.06);
		border: 1px solid rgba(255,255,255,0.08);
		border-radius: 0.75rem;
		padding: 0.65rem 0.85rem;
		transition: all 0.3s ease;
		flex: 1;
	}

	.iso-badge:hover {
		background: rgba(255,255,255,0.1);
		border-color: rgba(167, 243, 208, 0.25);
	}

	.iso-badge svg {
		width: 22px;
		height: 22px;
		color: #6ee7b7;
		flex-shrink: 0;
	}

	.iso-badge div {
		display: flex;
		flex-direction: column;
		min-width: 0;
	}

	.iso-badge strong {
		font-size: 0.8rem;
		font-weight: 700;
		color: white;
		line-height: 1.2;
	}

	.iso-badge span {
		font-size: 0.7rem;
		color: rgba(255,255,255,0.6);
		line-height: 1.3;
	}

	.nosotros-visual {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2rem;
	}

	.casanare-showcase {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 380px;
		height: 250px;
	}

	.casanare-pulse {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 75%;
		height: 75%;
		background: radial-gradient(circle, rgba(16, 185, 129, 0.35) 0%, rgba(16, 185, 129, 0) 70%);
		border-radius: 50%;
		animation: casanarePulse 3s ease-in-out infinite;
		z-index: 0;
	}

	@keyframes casanarePulse {
		0%, 100% {
			transform: translate(-50%, -50%) scale(0.85);
			opacity: 0.4;
		}
		50% {
			transform: translate(-50%, -50%) scale(1.2);
			opacity: 0.8;
		}
	}

	.casanare-outline {
		position: relative;
		width: 100%;
		height: 100%;
		object-fit: contain;
		z-index: 1;
		filter: drop-shadow(0 0 20px rgba(16, 185, 129, 0.3));
		animation: casanareFloat 4s ease-in-out infinite;
	}

	@keyframes casanareFloat {
		0%, 100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-8px);
		}
	}

	.casanare-label {
		position: relative;
		z-index: 1;
		margin-top: 0.5rem;
		font-size: 0.8rem;
		font-weight: 600;
		color: rgba(167, 243, 208, 0.8);
		letter-spacing: 0.15em;
		text-transform: uppercase;
	}

	.nosotros-stats {
		width: 100%;
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 1rem;
	}

	.stat-item {
		background: rgba(255,255,255,0.08);
		border: 1px solid rgba(255,255,255,0.1);
		border-radius: 1rem;
		padding: 1.5rem 1.25rem;
		text-align: center;
		backdrop-filter: blur(8px);
		transition: all 0.3s ease;
	}

	.stat-item:hover {
		background: rgba(255,255,255,0.13);
		transform: translateY(-3px);
	}

	.stat-item--accent {
		background: rgba(167, 243, 208, 0.15);
		border-color: rgba(167, 243, 208, 0.25);
	}

	.stat-value {
		display: block;
		font-size: clamp(1.75rem, 5vw, 2.5rem);
		font-weight: 800;
		color: white;
		line-height: 1;
		margin-bottom: 0.4rem;
	}

	.stat-name {
		display: block;
		font-size: 0.8rem;
		color: rgba(255,255,255,0.75);
		line-height: 1.4;
		font-weight: 500;
	}

	.section-header {
		text-align: center;
		margin-bottom: 2rem;
	}

	@media (min-width: 768px) {
		.section-header {
			margin-bottom: 2.5rem;
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

	/* ========================================
	   FLOTA SHOWCASE
	   ======================================== */
	.section-flota {
		background: #0f172a;
		padding: 3rem 0;
		overflow: hidden;
		min-height: 100vh;
		min-height: 100dvh;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	@media (min-width: 768px) {
		.section-flota {
			padding: 4rem 0;
		}
	}

	@media (min-width: 1024px) {
		.section-flota {
			padding: 4rem 0;
		}
	}

	.section-flota .section-title {
		color: white;
	}

	.section-flota .section-subtitle {
		color: rgba(255, 255, 255, 0.6);
	}

	.flota-header {
		text-align: center;
		margin-bottom: 1.5rem;
	}

	.flota-badge {
		display: inline-block;
		background: rgba(5, 150, 105, 0.15);
		color: #6ee7b7;
		padding: 0.375rem 1rem;
		border-radius: 2rem;
		font-size: 0.8rem;
		font-weight: 600;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		margin-bottom: 1rem;
		border: 1px solid rgba(110, 231, 183, 0.15);
	}

	.flota-showcase {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	/* Hero image */
	.flota-hero {
		position: relative;
		width: 100%;
		aspect-ratio: 16 / 7;
		max-height: 45vh;
		border-radius: 1rem;
		overflow: hidden;
		background: #1e293b;
	}

	@media (min-width: 768px) {
		.flota-hero {
			border-radius: 1.5rem;
			aspect-ratio: 21 / 8;
			max-height: 50vh;
		}
	}

	.flota-hero-img {
		position: absolute;
		inset: 0;
	}

	.flota-hero-img img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.flota-hero-overlay {
		position: absolute;
		inset: 0;
		background: linear-gradient(
			0deg,
			rgba(0, 0, 0, 0.7) 0%,
			rgba(0, 0, 0, 0.1) 40%,
			transparent 100%
		);
		display: flex;
		align-items: flex-end;
		padding: 1.5rem;
	}

	@media (min-width: 768px) {
		.flota-hero-overlay {
			padding: 2.5rem;
		}
	}

	.flota-hero-info h3 {
		font-size: clamp(1.125rem, 3vw, 1.5rem);
		font-weight: 700;
		color: white;
		margin-bottom: 0.35rem;
	}

	.flota-hero-info p {
		font-size: clamp(0.8rem, 2vw, 0.95rem);
		color: rgba(255, 255, 255, 0.75);
		line-height: 1.5;
		max-width: 500px;
	}

	/* Counter */
	.flota-counter {
		position: absolute;
		top: 1rem;
		right: 1rem;
		background: rgba(0, 0, 0, 0.4);
		backdrop-filter: blur(8px);
		border-radius: 0.5rem;
		padding: 0.4rem 0.75rem;
		display: flex;
		align-items: baseline;
		gap: 0.15rem;
		font-family: 'Space Grotesk', monospace;
	}

	@media (min-width: 768px) {
		.flota-counter {
			top: 1.5rem;
			right: 1.5rem;
		}
	}

	.flota-counter-current {
		font-size: 1.25rem;
		font-weight: 700;
		color: white;
	}

	.flota-counter-sep {
		font-size: 0.85rem;
		color: rgba(255, 255, 255, 0.35);
		margin: 0 0.1rem;
	}

	.flota-counter-total {
		font-size: 0.85rem;
		font-weight: 500;
		color: rgba(255, 255, 255, 0.5);
	}

	/* Thumbnails */
	.flota-thumbs {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 0.6rem;
	}

	@media (min-width: 768px) {
		.flota-thumbs {
			gap: 1rem;
		}
	}

	.flota-thumb {
		position: relative;
		aspect-ratio: 4 / 3;
		border-radius: 0.6rem;
		overflow: hidden;
		cursor: pointer;
		border: 2px solid transparent;
		transition: all 0.35s ease;
		background: #1e293b;
		padding: 0;
	}

	@media (min-width: 768px) {
		.flota-thumb {
			border-radius: 0.75rem;
		}
	}

	.flota-thumb img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: all 0.4s ease;
		opacity: 0.5;
	}

	.flota-thumb:hover img {
		opacity: 0.8;
	}

	.flota-thumb--active {
		border-color: #10b981;
		box-shadow: 0 0 20px rgba(16, 185, 129, 0.25);
	}

	.flota-thumb--active img {
		opacity: 1;
	}

	.flota-thumb-label {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		padding: 0.4rem 0.5rem;
		background: linear-gradient(0deg, rgba(0,0,0,0.7) 0%, transparent 100%);
		display: flex;
		flex-direction: column;
		opacity: 0;
		transition: opacity 0.3s ease;
	}

	.flota-thumb:hover .flota-thumb-label,
	.flota-thumb--active .flota-thumb-label {
		opacity: 1;
	}

	.flota-thumb-num {
		font-size: 0.6rem;
		font-weight: 700;
		color: #6ee7b7;
		font-family: 'Space Grotesk', monospace;
		letter-spacing: 0.05em;
	}

	.flota-thumb-title {
		font-size: 0.65rem;
		font-weight: 600;
		color: white;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	@media (min-width: 768px) {
		.flota-thumb-label {
			padding: 0.5rem 0.65rem;
		}

		.flota-thumb-num {
			font-size: 0.65rem;
		}

		.flota-thumb-title {
			font-size: 0.75rem;
		}
	}

	/* ========================================
	   SECCIÓN SERVICIOS
	   ======================================== */
	.section-servicios {
		background-color: #ffffff;
		background-image: radial-gradient(circle, rgba(16, 185, 129, 0.09) 1px, transparent 1px);
		background-size: 24px 24px;
		padding: 3rem 0;
		position: relative;
		min-height: 100vh;
		min-height: 100dvh;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	@media (min-width: 768px) {
		.section-servicios {
			padding: 4rem 0;
		}
	}

	/* Banner de flota */
	.servicios-banner {
		display: flex;
		flex-direction: column;
		border-radius: 1.25rem;
		overflow: hidden;
		background: #064e3b;
		margin-bottom: 2rem;
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
	}

	@media (min-width: 768px) {
		.servicios-banner {
			flex-direction: row;
			max-height: 220px;
		}
	}

	.servicios-banner-img {
		flex: 1;
		max-height: 180px;
		overflow: hidden;
	}

	@media (min-width: 768px) {
		.servicios-banner-img {
			flex: 1.2;
			max-height: none;
		}
	}

	.servicios-banner-img img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	.servicios-banner-content {
		flex: 1;
		padding: 1.5rem 1.25rem;
		display: flex;
		flex-direction: column;
		justify-content: center;
		color: #ffffff;
	}

	@media (min-width: 768px) {
		.servicios-banner-content {
			padding: 2rem 2.5rem;
		}
	}

	.servicios-banner-title {
		font-size: 1.5rem;
		font-weight: 700;
		margin-bottom: 0.75rem;
		letter-spacing: -0.02em;
	}

	@media (min-width: 768px) {
		.servicios-banner-title {
			font-size: 2rem;
		}
	}

	.servicios-banner-desc {
		font-size: 0.95rem;
		line-height: 1.6;
		color: #d1fae5;
	}

	@media (min-width: 768px) {
		.servicios-banner-desc {
			font-size: 1.05rem;
		}
	}

	/* Grid de servicios */
	.servicios-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1.25rem;
	}

	@media (min-width: 640px) {
		.servicios-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (min-width: 1024px) {
		.servicios-grid {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	/* Card de servicio */
	.servicio-card {
		background: #f0fdf4;
		border-radius: 1rem;
		padding: 1.5rem 1.25rem;
		text-align: center;
		transition: transform 0.3s ease, box-shadow 0.3s ease;
		border: 1px solid #d1fae5;
	}

	.servicio-card:hover {
		transform: translateY(-4px);
		box-shadow: 0 12px 32px rgba(5, 150, 105, 0.12);
	}

	.servicio-icon {
		width: 48px;
		height: 48px;
		margin: 0 auto 1rem;
		background: #064e3b;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #ffffff;
	}

	.servicio-icon svg {
		width: 24px;
		height: 24px;
	}

	.servicio-title {
		font-size: 1.1rem;
		font-weight: 700;
		color: #064e3b;
		margin-bottom: 0.5rem;
		letter-spacing: -0.01em;
	}

	.servicio-desc {
		font-size: 0.9rem;
		line-height: 1.55;
		color: #374151;
	}

	/* ========================================
	   SECCIÓN CONTACTO
	   ======================================== */
	.section-contact {
		background: linear-gradient(160deg, #064e3b 0%, #047857 50%, #059669 100%);
		padding: 3rem 0;
		min-height: 100vh;
		min-height: 100dvh;
		display: flex;
		flex-direction: column;
		justify-content: center;
		position: relative;
		overflow: hidden;
	}

	@media (min-width: 768px) {
		.section-contact {
			padding: 4rem 0;
		}
	}

	.contact-layout {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2rem;
	}

	@media (min-width: 1024px) {
		.contact-layout {
			flex-direction: row;
			align-items: center;
			gap: 3rem;
		}
	}

	.contact-visual {
		flex: 1;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.contact-cody {
		width: 280px;
		height: auto;
		filter: drop-shadow(0 20px 40px rgba(0, 0, 0, 0.3));
		animation: codyBounce 3s ease-in-out infinite;
	}

	@media (min-width: 768px) {
		.contact-cody {
			width: 380px;
		}
	}

	@media (min-width: 1024px) {
		.contact-cody {
			width: 440px;
		}
	}

	@keyframes codyBounce {
		0%, 100% { transform: translateY(0); }
		50% { transform: translateY(-12px); }
	}

	.contact-content {
		flex: 1.2;
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
	}

	@media (min-width: 1024px) {
		.contact-content {
			align-items: flex-start;
			text-align: left;
		}
	}

	.contact-badge {
		display: inline-block;
		background: rgba(255, 255, 255, 0.12);
		color: #a7f3d0;
		padding: 0.375rem 1rem;
		border-radius: 2rem;
		font-size: 0.8rem;
		font-weight: 600;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		margin-bottom: 1rem;
		border: 1px solid rgba(167, 243, 208, 0.15);
	}

	.contact-title {
		font-size: clamp(1.5rem, 4vw, 2.25rem);
		font-weight: 700;
		color: #ffffff;
		line-height: 1.2;
		margin-bottom: 0.75rem;
	}

	.contact-highlight {
		color: #a7f3d0;
	}

	.contact-desc {
		font-size: 1rem;
		color: rgba(255, 255, 255, 0.7);
		line-height: 1.6;
		margin-bottom: 1.5rem;
		max-width: 480px;
	}

	/* CTA Buttons */
	.contact-actions {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		width: 100%;
		max-width: 400px;
		margin-bottom: 1.5rem;
	}

	@media (min-width: 480px) {
		.contact-actions {
			flex-direction: row;
			flex-wrap: wrap;
			max-width: none;
		}
	}

	.contact-cta {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.6rem;
		padding: 0.875rem 1.5rem;
		border-radius: 0.75rem;
		font-size: 0.9rem;
		font-weight: 600;
		text-decoration: none;
		transition: all 0.3s ease;
		position: relative;
		overflow: hidden;
		cursor: pointer;
	}

	.contact-cta--whatsapp {
		background: #25d366;
		color: #ffffff;
		box-shadow: 0 4px 20px rgba(37, 211, 102, 0.4);
	}

	.contact-cta--whatsapp:hover {
		background: #20bd5a;
		transform: translateY(-2px);
		box-shadow: 0 8px 30px rgba(37, 211, 102, 0.5);
	}

	/* Pulse animation behind WhatsApp button */
	.cta-pulse {
		position: absolute;
		inset: 0;
		border-radius: inherit;
		animation: ctaPulse 2s ease-in-out infinite;
	}

	.contact-cta--whatsapp .cta-pulse {
		box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.5);
	}

	@keyframes ctaPulse {
		0% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.5); }
		70% { box-shadow: 0 0 0 12px rgba(37, 211, 102, 0); }
		100% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0); }
	}

	.contact-cta--email {
		background: rgba(255, 255, 255, 0.12);
		color: #ffffff;
		border: 1px solid rgba(255, 255, 255, 0.2);
		backdrop-filter: blur(8px);
	}

	.contact-cta--email:hover {
		background: rgba(255, 255, 255, 0.2);
		transform: translateY(-2px);
	}

	.contact-cta--phone {
		background: rgba(255, 255, 255, 0.12);
		color: #ffffff;
		border: 1px solid rgba(255, 255, 255, 0.2);
		backdrop-filter: blur(8px);
	}

	.contact-cta--phone:hover {
		background: rgba(255, 255, 255, 0.2);
		transform: translateY(-2px);
	}

	.cta-icon {
		width: 20px;
		height: 20px;
		flex-shrink: 0;
	}

	/* Info chips */
	.contact-info-row {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
		justify-content: center;
	}

	@media (min-width: 1024px) {
		.contact-info-row {
			justify-content: flex-start;
		}
	}

	.contact-info-chip {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.4rem 0.85rem;
		background: rgba(255, 255, 255, 0.08);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 2rem;
		color: rgba(255, 255, 255, 0.6);
		font-size: 0.8rem;
	}

	.contact-info-chip svg {
		width: 16px;
		height: 16px;
		flex-shrink: 0;
		color: #a7f3d0;
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