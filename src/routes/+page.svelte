<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { fly, fade } from 'svelte/transition';
	import { elasticOut, quintOut } from 'svelte/easing';

	let scrolled = $state(false);
	let mobileMenuOpen = $state(false);
	let activeSection = $state('inicio');
	let showWhatsappFab = $state(false);

	let capVisible = $state(false);
	let coberturaVisible = $state(false);
	let nosotrosVisible = $state(false);
	let serviciosVisible = $state(false);
	let yearAnimated = $state(0);
	let vehiculosAnimated = $state(0);
	let conductoresAnimated = $state(0);

	let activeMunicipio = $state<string | null>(null);
	let markerRefs: Record<string, any> = {};

	const FECHA_FUNDACION = new Date(2021, 9, 3);
	const yearsExperiencia = Math.floor(
		(Date.now() - FECHA_FUNDACION.getTime()) / (365.25 * 24 * 60 * 60 * 1000)
	);

	const sections = ['inicio', 'capacidades', 'cobertura', 'nosotros', 'servicios', 'faq', 'contacto'];

	function scrollToSection(id: string) {
		document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
		mobileMenuOpen = false;
	}

	function animateCounter(target: number, duration: number, setter: (v: number) => void) {
		const start = performance.now();
		function tick(now: number) {
			const t = Math.min((now - start) / duration, 1);
			const eased = 1 - Math.pow(1 - t, 4);
			setter(Math.round(eased * target));
			if (t < 1) requestAnimationFrame(tick);
		}
		requestAnimationFrame(tick);
	}

	// Leaflet map
	let mapContainer = $state<HTMLDivElement | undefined>(undefined);
	 let mapInstance: any = null;
	let mapInitialized = $state(false);

	const municipios = [
		{ name: 'Yopal', coords: [5.3378, -72.3959], tag: 'Capital', size: 1.0 },
		{ name: 'Tauramena', coords: [5.0181, -72.7486], tag: 'Casanare', size: 0.7 },
		{ name: 'Villanueva', coords: [4.6205, -72.9286], tag: 'Casanare', size: 0.7 }
	];

	async function initMap() {
		if (!mapContainer || mapInstance) return;
		const L = (await import('leaflet')).default;
		await import('leaflet/dist/leaflet.css');

		mapInstance = L.map(mapContainer, {
			zoomControl: false,
			scrollWheelZoom: false,
			attributionControl: true
		}).setView([5.0, -72.65], 9);

		L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
			attribution: '© OpenStreetMap, © CARTO',
			subdomains: 'abcd',
			maxZoom: 19
		}).addTo(mapInstance);

		L.control.zoom({ position: 'bottomright' }).addTo(mapInstance);

		// Custom emerald marker icon
		const emeraldIcon = (size: number) => L.divIcon({
			className: 'custom-marker',
			html: `
				<div style="
					position: relative;
					width: ${size * 24}px;
					height: ${size * 24}px;
				">
					<div style="
						position: absolute;
						inset: 0;
						border-radius: 50%;
						background: #10B981;
						opacity: 0.25;
						animation: markerPulse 2.5s ease-out infinite;
					"></div>
					<div style="
						position: absolute;
						inset: ${size * 4}px;
						border-radius: 50%;
						background: #10B981;
						border: 2px solid #FAF7F2;
						box-shadow: 0 0 12px rgba(16, 185, 129, 0.6);
					"></div>
				</div>
			`,
			iconSize: [size * 24, size * 24],
			iconAnchor: [size * 12, size * 12]
		});

		// Add markers for each municipio
		municipios.forEach((m) => {
			const marker = L.marker(m.coords as [number, number], { icon: emeraldIcon(m.size) }).addTo(mapInstance);
			marker.bindPopup(`
				<div style="font-family: 'Inter Tight', sans-serif; min-width: 140px;">
					<div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #6B6B6B; margin-bottom: 4px;">${m.tag}</div>
					<div style="font-family: 'Fraunces', serif; font-size: 18px; color: #1A1A1A; font-weight: 400; font-style: italic;">${m.name}</div>
				</div>
			`, { className: 'custom-popup' });
			marker.on('click', () => {
				activeMunicipio = m.name;
			});
			markerRefs[m.name] = marker;
		});

		// Draw a soft line connecting all municipios (representing service area)
		const polyline = L.polyline(
			municipios.map((m) => m.coords as [number, number]),
			{ color: '#10B981', weight: 1.5, opacity: 0.3, dashArray: '4 8' }
		).addTo(mapInstance);

		mapInitialized = true;
	}

	function flyToMunicipio(name: string) {
		const m = municipios.find((x) => x.name === name);
		if (!m || !mapInstance) return;
		activeMunicipio = name;
		mapInstance.flyTo(m.coords as [number, number], 12, {
			duration: 1.4,
			easeLinearity: 0.25
		});
		setTimeout(() => {
			const marker = markerRefs[name];
			if (marker) marker.openPopup();
		}, 1450);
	}

	onMount(() => {
		const handleScroll = () => {
			scrolled = window.scrollY > 50;
			showWhatsappFab = window.scrollY > 400;

			const pos = window.scrollY + 120;
			for (const id of sections) {
				const el = document.getElementById(id);
				if (!el) continue;
				const top = el.offsetTop;
				const bottom = top + el.offsetHeight;
				if (pos >= top && pos < bottom) {
					activeSection = id;
					break;
				}
			}
		};
		window.addEventListener('scroll', handleScroll, { passive: true });
		handleScroll();

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						if (entry.target.id === 'capacidades') capVisible = true;
						if (entry.target.id === 'cobertura') {
							coberturaVisible = true;
							setTimeout(() => initMap(), 100);
						}
						if (entry.target.id === 'nosotros') {
							nosotrosVisible = true;
							setTimeout(() => {
								animateCounter(yearsExperiencia, 1200, (v) => (yearAnimated = v));
								animateCounter(20, 1500, (v) => (vehiculosAnimated = v));
								animateCounter(20, 1700, (v) => (conductoresAnimated = v));
							}, 400);
						}
						if (entry.target.id === 'servicios') serviciosVisible = true;
					}
				});
			},
			{ threshold: 0.18 }
		);

		setTimeout(() => {
			sections.forEach((id) => {
				const el = document.getElementById(id);
				if (el) observer.observe(el);
			});
		}, 200);

		return () => {
			window.removeEventListener('scroll', handleScroll);
			observer.disconnect();
		};
	});

	onDestroy(() => {
		if (mapInstance) {
			mapInstance.remove();
			mapInstance = null;
		}
	});

	const capacidades = [
		{
			title: 'Monitoreo GPS 24/7 y trazabilidad en tiempo real',
			desc: 'Cada vehículo de nuestra flota cuenta con GPS rastreable desde nuestro centro de control. Disponibilidad de la información de rutas para clientes corporativos del sector petrolero en Casanare.',
			img: '/images/flota/slide-1.jpg',
			span: 'lg:col-span-2 lg:row-span-2',
			featured: true,
			alt: 'Camioneta 4x4 Transmeralda con GPS rastreando ruta en tiempo real entre Yopal y Tauramena, Casanare'
		},
		{
			title: 'Protocolos HSEQ y bioseguridad',
			desc: 'Estandarización operativa, seguridad vial y bioseguridad documentadas. Cumplimos con los protocolos HSEQ exigidos por empresas petroleras y de construcción en Casanare.',
			img: '/images/flota/slide-3.png',
			span: '',
			alt: 'Documentación de protocolos HSEQ y bioseguridad para transporte especial en Casanare'
		},
		{
			title: 'Planificación de rutas empresariales',
			desc: 'Diseño, horarios y asignaciones optimizadas para rutas de personal en Yopal, Tauramena, Villanueva y Aguazul. Menos tiempos muertos y mayor puntualidad.',
			img: '/images/flota/slide-2.jpg',
			span: '',
			alt: 'Bus de Transmeralda planificando ruta empresarial en Casanare con conductor certificado'
		},
		{
			title: 'Mantenimiento programado y vehículos modelo reciente',
			desc: 'Mantenimiento preventivo y correctivo con registros digitales, alertas tempranas y pólizas vigentes. Flota renovada modelo 2020 en adelante.',
			img: '/images/flota/slide-4.png',
			span: '',
			alt: 'Vehículo de Transmeralda en taller de mantenimiento preventivo en Yopal, Casanare'
		},
		{
			title: 'Conductores certificados y verificados',
			desc: 'Licencia vigente, exámenes médicos al día, EPP, verificación de antecedentes y formación continua en atención al cliente y seguridad vial.',
			img: '/images/flota/slide-1.jpg',
			span: '',
			alt: 'Conductor certificado de Transmeralda uniformado frente a bus de transporte especial en Casanare'
		},
		{
			title: 'Reportes digitales y app para clientes',
			desc: 'Plataforma digital para seguimiento de rutas, novedades operativas y reportes exportables para auditorías corporativas. Visibilidad total del servicio.',
			img: '/images/flota/slide-2.jpg',
			span: 'lg:col-span-2',
			alt: 'App de seguimiento de rutas y reportes digitales Transmeralda para empresas en Casanare'
		}
	];

	const servicios = [
		{
			tag: '01',
			title: 'Transporte de Personal Petrolero en Yopal',
			desc: 'Rutas empresariales, turnos rotativos y traslados punto a punto para el sector petrolero en Casanare. Diseñamos cada operación según la ubicación de tus colaboradores y los horarios de tu operación, con puntualidad garantizada contractualmente y cumplimiento de protocolos HSEQ.',
			img: '/images/flota/slide-1.jpg',
			alt: 'Transporte de personal petrolero en Yopal, Casanare con buses de Transmeralda',
			points: ['Rutas a medida', 'Punto a punto', 'Turnos rotativos', 'Cumplimiento HSEQ'],
			imgPosition: 'right'
		},
		{
			tag: '02',
			title: 'Alquiler de Buses y Camionetas con Conductor',
			desc: 'Alquiler de buses desde 19 hasta 40 pasajeros y camionetas 4x4 con conductor certificado en Yopal, Tauramena, Villanueva y toda Casanare. Servicio mensual o por evento con tarifas competitivas para empresas, gobierno y eventos.',
			img: '/images/flota/slide-2.jpg',
			alt: 'Alquiler de buses y camionetas con conductor en Casanare para empresas y eventos',
			points: ['Buses 19-40 pax', 'Camionetas 4x4', 'Conductor incluido', 'Tarifa por km o mes'],
			imgPosition: 'left'
		},
		{
			tag: '03',
			title: 'Seguridad Vial y Cumplimiento',
			desc: 'Habilitación nacional vigente del Ministerio de Transporte, SOAT y técnico-mecánica al día, protocolos de bioseguridad documentados y monitoreo GPS 24/7 desde nuestro centro de control. Cumplimos con los estándares más exigentes del sector petrolero y gubernamental.',
			img: '/images/flota/slide-3.png',
			alt: 'Centro de control con monitoreo GPS 24/7 de la flota Transmeralda en Casanare',
			points: ['Habilitación nacional', 'SOAT y revisión al día', 'Bioseguridad', 'Monitoreo GPS 24/7'],
			imgPosition: 'right'
		}
	];
</script>

<svelte:head>
	<title>Transporte Especial en Casanare | Transmeralda Yopal</title>
	<meta
		name="description"
		content="Empresa de transporte especial en Yopal, Casanare. Alquiler de buses y camionetas con conductor para empresas, petroleras y turismo. Habilitación nacional vigente."
	/>
</svelte:head>

<!-- ═══════════════ NAVBAR ═══════════════ -->
<nav class="nav" class:nav--scrolled={scrolled}>
	<div class="nav__inner">
		<button class="nav__brand" onclick={() => scrollToSection('inicio')}>
			<img src="/assets/logo_transmeralda.png" alt="Transmeralda" class="nav__logo" />
		</button>

		<div class="nav__menu">
			{#each sections as id}
				{#if id !== 'inicio'}
					<button
						class="nav__link"
						class:nav__link--active={activeSection === id}
						onclick={() => scrollToSection(id)}
					>
						{id.charAt(0).toUpperCase() + id.slice(1)}
					</button>
				{/if}
			{/each}
		</div>

		<button
			class="nav__burger"
			onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
			aria-label="Menú"
		>
			<span class="nav__burger-line" class:nav__burger-line--open={mobileMenuOpen}></span>
			<span class="nav__burger-line" class:nav__burger-line--open={mobileMenuOpen}></span>
		</button>
	</div>
</nav>

<!-- Mobile sidebar -->
{#if mobileMenuOpen}
	<button class="sidebar-overlay" onclick={() => (mobileMenuOpen = false)} aria-label="Cerrar menú"></button>
{/if}

<aside class="sidebar" class:sidebar--open={mobileMenuOpen}>
	<div class="sidebar__header">
		<img src="/assets/logo_transmeralda.png" alt="Transmeralda" class="sidebar__logo" />
		<button class="sidebar__close" onclick={() => (mobileMenuOpen = false)} aria-label="Cerrar">
			<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<line x1="18" y1="6" x2="6" y2="18"></line>
				<line x1="6" y1="6" x2="18" y2="18"></line>
			</svg>
		</button>
	</div>
	<nav class="sidebar__nav">
		{#each sections as id}
			<button
				class="sidebar__link"
				class:sidebar__link--active={activeSection === id}
				onclick={() => scrollToSection(id)}
			>
				<span class="sidebar__link-num">0{sections.indexOf(id) + 1}</span>
				<span>{id.charAt(0).toUpperCase() + id.slice(1)}</span>
			</button>
		{/each}
	</nav>
</aside>

<main>
	<!-- ═══════════════ HERO (CONSERVADO) ═══════════════ -->
	<section id="inicio" class="section-hero" aria-label="Transporte Especial en Yopal, Casanare">
		<video autoplay muted loop playsinline preload="metadata" poster="/images/servicios/transporte-de-personal.jpg" class="hero-video" aria-label="Video de flota Transmeralda en operación en Casanare">
			<source src="/videos/fondo_transmeralda.mp4" type="video/mp4" />
		</video>
		<div class="hero-overlay"></div>

		<div class="hero-content" in:fly={{ y: 200, duration: 1000, easing: elasticOut }}>
			<div class="hero-text">
				<h1 class="hero-title">
					Transporte Especial en Yopal, Casanare — Para Empresas, Petroleras y Turismo
				</h1>
				<p class="hero-subtitle">
					Transmeralda S.A.S. — Transporte terrestre automotor especial desde Yopal, Casanare. Movilidad inteligente, eficiencia real y seguridad para tu equipo.
				</p>
				<div class="hero-buttons">
					<a
						href="https://wa.me/573232340117?text=Hola%20Transmeralda%2C%20estoy%20interesado%20en%20cotizar%20un%20servicio%20de%20transporte%20especial.%20%C2%BFPodr%C3%ADan%20brindarme%20informaci%C3%B3n%3F"
						target="_blank"
						rel="noopener noreferrer"
						in:fly={{ y: 200, duration: 1000, easing: elasticOut }}
						class="hero-cta hero-cta--primary"
					>
						<svg class="hero-cta-icon" fill="currentColor" viewBox="0 0 24 24">
							<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
						</svg>
						Cotizar ahora
					</a>
					<button
						in:fly={{ y: 200, duration: 1000, easing: elasticOut, delay: 100 }}
						onclick={() => scrollToSection('servicios')}
						class="hero-cta hero-cta--secondary"
					>
						<svg class="hero-cta-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
						</svg>
						Conocer servicios
					</button>
				</div>
			</div>
		</div>

		<img
			in:fly={{ y: 200, duration: 1000, easing: elasticOut, delay: 200 }}
			class="hero-mascot"
			src="/assets/codi.png"
			alt="Codi - Mascota de Transmeralda"
		/>

		<button class="scroll-indicator" onclick={() => scrollToSection('capacidades')} aria-label="Desplazar" in:fade={{ duration: 800, delay: 1500 }}>
			<svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
			</svg>
		</button>
	</section>

	<!-- ═══════════════ 01 CAPACIDADES (Bento grid dramático) ═══════════════ -->
	<section id="capacidades" class="section section--cap">
		<div class="container">
			{#if capVisible}
				<header class="section-header" in:fly={{ y: 24, duration: 700 }}>
					<div class="section-number">
						<span class="section-number__hash">N°</span> 01
					</div>
					<h2 class="section-title">Capacidades Diferenciales de Nuestra Flota</h2>
					<p class="section-subtitle">
						Tecnología, talento y procesos que sostienen un servicio de transporte
						especial y empresarial de primer nivel en Casanare y toda Colombia,
						todos los días del año.
					</p>
				</header>

				<div class="bento">
					{#each capacidades as cap, i}
						<div
							class="bento__card {cap.span}"
							in:fly={{ y: 30, duration: 700, delay: 100 + i * 80, easing: quintOut }}
						>
							<img src={cap.img} alt={cap.alt} width="800" height="600" class="bento__img" loading="lazy" />
							<div class="bento__overlay" class:bento__overlay--featured={cap.featured}></div>
							<div class="bento__content" class:bento__content--featured={cap.featured}>
								<div class="bento__num">0{i + 1}</div>
								<h3 class="bento__title">{cap.title}</h3>
								<p class="bento__desc">{cap.desc}</p>
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	</section>

	<!-- ═══════════════ 02 COBERTURA (Leaflet Map interactivo) ═══════════════ -->
	<section id="cobertura" class="section section--cov">
		<div class="container">
			{#if coberturaVisible}
				<header class="section-header" in:fly={{ y: 24, duration: 700 }}>
					<div class="section-number">
						<span class="section-number__hash">N°</span> 02
					</div>
					<h2 class="section-title">Sedes Operativas de Transmeralda en Casanare</h2>
					<p class="section-subtitle">
						Bases principales en Yopal, Tauramena y Villanueva. Servicio disponible
						en Aguazul, Paz de Ariporo, Monterrey, Orocué, Maní, Trinidad y Hato
						Corozal. Cobertura nacional habilitada por el Ministerio de Transporte.
					</p>
				</header>

				<div class="map-layout" in:fly={{ y: 30, duration: 800, delay: 200 }}>
					<div class="map-stats">
						<div class="map-stat">
							<div class="map-stat__num">3</div>
							<div class="map-stat__label">Bases en Casanare</div>
						</div>
						<div class="map-stat">
							<div class="map-stat__num">100<span class="map-stat__unit">%</span></div>
							<div class="map-stat__label">Cobertura nacional</div>
						</div>
						<div class="map-stat">
							<div class="map-stat__num">24<span class="map-stat__unit">/7</span></div>
							<div class="map-stat__label">Monitoreo GPS</div>
						</div>
					</div>

					<div class="map-wrap" bind:this={mapContainer}></div>

					<aside class="map-list">
						<p class="map-list__label">Bases operativas</p>
						<ul>
							{#each municipios as m, i}
							<li>
								<button
									type="button"
									class="map-list__item"
									class:map-list__item--active={activeMunicipio === m.name}
									onclick={() => flyToMunicipio(m.name)}
								>
									<span
										class="map-list__bullet"
										style="opacity: {0.5 + m.size * 0.5}"
									></span>
									<div class="map-list__text">
										<div class="map-list__name">{m.name}</div>
										<div class="map-list__tag">{m.tag}</div>
									</div>
									<svg
										class="map-list__arrow"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											d="M5 12h14M13 5l7 7-7 7"
										/>
									</svg>
								</button>
							</li>
							{/each}
						</ul>
					</aside>
				</div>
			{/if}
		</div>
	</section>

	<!-- ═══════════════ 03 NOSOTROS (Hero-style fullscreen con imagen) ═══════════════ -->
	<section id="nosotros" class="section section--nos-hero">
		<div class="nos-bg">
			<img src="/images/servicios/transporte-de-personal.jpg" alt="" class="nos-bg__img" />
			<div class="nos-bg__overlay"></div>
		</div>

		<div class="container nos-container">
			{#if nosotrosVisible}
				<header class="section-header section-header--light" in:fly={{ y: 24, duration: 700 }}>
					<div class="section-number section-number--light">
						<span class="section-number__hash">N°</span> 03
					</div>
					<h2 class="section-title section-title--light">
						Empresa de Transporte Especial con Habilitación Nacional
					</h2>
				</header>

				<div class="nos-grid">
					<div class="nos-text" in:fly={{ y: 24, duration: 700, delay: 100 }}>
						<p class="nos-paragraph">
							Desde Yopal, Casanare, nos hemos consolidado como referente en
							transporte terrestre automotor especial. Nuestra misión es mover
							personas con seguridad, eficiencia y calidez humana.
						</p>
						<p class="nos-paragraph">
							Trabajamos con empresas petroleras, agroindustriales, constructoras y
							operadores que requieren movilidad confiable para su personal en
							Casanare y a nivel nacional. Cada ruta se diseña a la medida.
						</p>
						<p class="nos-paragraph">
							Alineados con estándares internacionales de calidad, gestión
							ambiental y seguridad y salud en el trabajo.
						</p>

						<div class="nos-iso">
							<span class="nos-iso-label">Certificaciones</span>
							<div class="nos-iso-list">
								<span class="nos-iso-item">ISO 9001</span>
								<span class="nos-iso-sep">·</span>
								<span class="nos-iso-item">ISO 14001</span>
								<span class="nos-iso-sep">·</span>
								<span class="nos-iso-item">ISO 45001</span>
							</div>
						</div>
					</div>

					<div class="nos-stats" in:fly={{ y: 24, duration: 700, delay: 200 }}>
						<div class="nos-stat">
							<div class="nos-stat__num">{yearAnimated}<span class="nos-stat__plus">+</span></div>
							<div class="nos-stat__label">Años de experiencia</div>
						</div>
						<div class="nos-rule"></div>
						<div class="nos-stat">
							<div class="nos-stat__num">{vehiculosAnimated}<span class="nos-stat__plus">+</span></div>
							<div class="nos-stat__label">Vehículos en flota</div>
						</div>
						<div class="nos-rule"></div>
						<div class="nos-stat">
							<div class="nos-stat__num">{conductoresAnimated}<span class="nos-stat__plus">+</span></div>
							<div class="nos-stat__label">Conductores certificados</div>
						</div>
					</div>
				</div>
			{/if}
		</div>
	</section>

	<!-- ═══════════════ 04 SERVICIOS (Alternating image+text) ═══════════════ -->
	<section id="servicios" class="section section--srv">
		<div class="container">
			<header class="section-header">
				<div class="section-number">
					<span class="section-number__hash">N°</span> 04
				</div>
				<h2 class="section-title">Servicios de Transporte Empresarial en Casanare</h2>
				<p class="section-subtitle">
					Alquiler de buses y camionetas con conductor para empresas del sector
					petrolero, constructoras, agroindustria, turismo y gobierno en
					Casanare y toda Colombia. Servicio Público de Transporte Terrestre
					Automotor Especial con habilitación nacional vigente.
				</p>
			</header>

			<div class="srv-stack">
				{#each servicios as srv, i}
					{#if serviciosVisible}
						<article
							class="srv-row"
							class:srv-row--reverse={srv.imgPosition === 'left'}
							in:fly={{ y: 40, duration: 800, delay: 100 + i * 100, easing: quintOut }}
						>
							<div class="srv-row__visual">
								<img src={srv.img} alt={srv.alt} width="1200" height="900" class="srv-row__img" loading="lazy" />
								<div class="srv-row__visual-tag">
									<span>{srv.tag}</span>
								</div>
							</div>
							<div class="srv-row__body">
								<div class="srv-row__num">{srv.tag}</div>
								<h3 class="srv-row__title">{srv.title}</h3>
								<p class="srv-row__desc">{srv.desc}</p>
								<ul class="srv-row__points">
									{#each srv.points as p}
										<li class="srv-row__point">
											<span class="srv-row__mark"></span>{p}
										</li>
									{/each}
								</ul>
							</div>
						</article>
					{/if}
				{/each}
			</div>
		</div>
	</section>

	<!-- ═══════════════ 06 FAQ — Preguntas Frecuentes ═══════════════ -->
	<section id="faq" class="section section--faq">
		<div class="container">
			<header class="section-header">
				<div class="section-number">
					<span class="section-number__hash">N°</span> 06
				</div>
				<h2 class="section-title">Preguntas Frecuentes sobre Nuestro Servicio de Transporte</h2>
				<p class="section-subtitle">
					Resolvemos las dudas más comunes sobre el servicio de transporte
					especial, alquiler de buses y rutas empresariales en Casanare.
				</p>
			</header>

			<div class="faq-list">
				<details class="faq-item" name="faq">
					<summary class="faq-item__q">
						<span class="faq-item__num">01</span>
						<span>¿Cuánto cuesta el transporte especial en Casanare?</span>
						<svg class="faq-item__chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
					</summary>
					<div class="faq-item__a">
						<p>
							El costo del transporte especial en Casanare depende de la distancia, el tipo de vehículo y la duración del contrato. En Transmeralda cotizamos por kilómetro recorrido o por servicio mensual según tu necesidad. <strong>Solicita tu cotización gratuita por WhatsApp al +57 323 234 0117</strong> o por correo a operaciones.transmeraldasas@gmail.com.
						</p>
					</div>
				</details>

				<details class="faq-item" name="faq">
					<summary class="faq-item__q">
						<span class="faq-item__num">02</span>
						<span>¿Qué documentos se necesitan para contratar transporte especial?</span>
						<svg class="faq-item__chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
					</summary>
					<div class="faq-item__a">
						<p>
							Para contratar transporte especial con Transmeralda S.A.S. como persona jurídica necesitas: <strong>RUT, cámara de comercio vigente</strong> (no mayor a 30 días) y cédula del representante legal. Para personas naturales en servicios eventuales solo se requiere documento de identidad. Te enviamos la lista completa al solicitar la cotización.
						</p>
					</div>
				</details>

				<details class="faq-item" name="faq">
					<summary class="faq-item__q">
						<span class="faq-item__num">03</span>
						<span>¿Atienden servicios fuera del departamento de Casanare?</span>
						<svg class="faq-item__chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
					</summary>
					<div class="faq-item__a">
						<p>
							Sí. Transmeralda S.A.S. cuenta con <strong>habilitación nacional vigente del Ministerio de Transporte</strong>, lo que nos permite prestar servicios de transporte especial en cualquier municipio de Colombia. Tenemos experiencia con rutas a Bogotá, Villavicencio, Bucaramanga, Medellín y el resto del país.
						</p>
					</div>
				</details>

				<details class="faq-item" name="faq">
					<summary class="faq-item__q">
						<span class="faq-item__num">04</span>
						<span>¿Tienen habilitación del Ministerio de Transporte?</span>
						<svg class="faq-item__chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
					</summary>
					<div class="faq-item__a">
						<p>
							Sí. Transmeralda S.A.S. cuenta con habilitación vigente como empresa de Servicio Público de Transporte Terrestre Automotor Especial, según resolución del Ministerio de Transporte. Esto nos permite operar legalmente en todo el territorio nacional con nuestros vehículos, conductores y pólizas al día.
						</p>
					</div>
				</details>

				<details class="faq-item" name="faq">
					<summary class="faq-item__q">
						<span class="faq-item__num">05</span>
						<span>¿Cómo solicito una cotización de transporte especial?</span>
						<svg class="faq-item__chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
					</summary>
					<div class="faq-item__a">
						<p>
							Puedes solicitar tu cotización de tres formas: por <strong>WhatsApp al +57 323 234 0117</strong> (respuesta en menos de 1 hora en horario laboral), por correo a operaciones.transmeraldasas@gmail.com, o llamando al mismo número de lunes a sábado de 6:00 a.m. a 6:00 p.m. Te pedimos enviar origen, destino, número de pasajeros, fechas y tipo de vehículo deseado.
						</p>
					</div>
				</details>

				<details class="faq-item" name="faq">
					<summary class="faq-item__q">
						<span class="faq-item__num">06</span>
						<span>¿Cuántos pasajeros pueden sus buses?</span>
						<svg class="faq-item__chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
					</summary>
					<div class="faq-item__a">
						<p>
							Nuestra flota de buses incluye unidades <strong>desde 19 hasta 40 pasajeros</strong> según el modelo. Para grupos grandes, eventos corporativos o turnos industriales tenemos buses doble eje con capacidad ampliada. Todos los buses cuentan con aire acondicionado, cinturones de seguridad, GPS y seguro de pasajeros vigente.
						</p>
					</div>
				</details>

				<details class="faq-item" name="faq">
					<summary class="faq-item__q">
						<span class="faq-item__num">07</span>
						<span>¿El servicio de transporte incluye conductor?</span>
						<svg class="faq-item__chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
					</summary>
					<div class="faq-item__a">
						<p>
							Sí, todos nuestros servicios de transporte especial <strong>incluyen conductor certificado</strong>, con verificación de antecedentes, licencia vigente, exámenes médicos al día y capacitación continua en atención al cliente y seguridad vial. No subcontratamos conductores: todos son parte del equipo de Transmeralda.
						</p>
					</div>
				</details>

				<details class="faq-item" name="faq">
					<summary class="faq-item__q">
						<span class="faq-item__num">08</span>
						<span>¿Tienen servicio de transporte para el sector petrolero en Casanare?</span>
						<svg class="faq-item__chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
					</summary>
					<div class="faq-item__a">
						<p>
							Sí, somos especialistas en <strong>transporte de personal petrolero en Casanare</strong>. Atendemos empresas del sector de hidrocarburos con rutas a operaciones, campamentos y bases petroleras. Cumplimos con todos los protocolos HSEQ exigidos por el sector, incluyendo inducción de personal, manejo de zonas restringidas y reportes de novedades operativas.
						</p>
					</div>
				</details>
			</div>
		</div>
	</section>

	<!-- ═══════════════ 07 CONTACTO (Dark) ═══════════════ -->
	<section id="contacto" class="section section--contact">
		<div class="container">
			<header class="section-header section-header--dark">
				<div class="section-number section-number--dark">
					<span class="section-number__hash">N°</span> 07
				</div>
				<h2 class="section-title section-title--dark">Conversemos</h2>
				<p class="section-subtitle section-subtitle--dark">
					Nuestro equipo está disponible para cotizar, resolver dudas y organizar
					el transporte de tu personal. Escríbenos cuando quieras.
				</p>
			</header>

			<div class="contact-grid">
				<div class="contact-cta-col">
					<a
						href="https://wa.me/573232340117?text=Hola%20Transmeralda%2C%20estoy%20interesado%20en%20cotizar%20un%20servicio%20de%20transporte%20especial.%20%C2%BFPodr%C3%ADan%20brindarme%20informaci%C3%B3n%3F"
						target="_blank"
						rel="noopener noreferrer"
						class="contact-cta contact-cta--wa"
					>
						<span class="contact-cta__num">A</span>
						<span class="contact-cta__text">
							<span class="contact-cta__label">WhatsApp</span>
							<span class="contact-cta__value">+57 323 234 0117</span>
						</span>
						<svg class="contact-cta__arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M7 17L17 7M17 7H8M17 7v9" />
						</svg>
					</a>

					<a href="mailto:operaciones.transmeraldasas@gmail.com" class="contact-cta contact-cta--outline">
						<span class="contact-cta__num">B</span>
						<span class="contact-cta__text">
							<span class="contact-cta__label">Correo</span>
							<span class="contact-cta__value">operaciones.transmeraldasas@gmail.com</span>
						</span>
						<svg class="contact-cta__arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M7 17L17 7M17 7H8M17 7v9" />
						</svg>
					</a>

					<a href="tel:+573232340117" class="contact-cta contact-cta--outline">
						<span class="contact-cta__num">C</span>
						<span class="contact-cta__text">
							<span class="contact-cta__label">Teléfono</span>
							<span class="contact-cta__value">+57 323 234 0117</span>
						</span>
						<svg class="contact-cta__arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M7 17L17 7M17 7H8M17 7v9" />
						</svg>
					</a>
				</div>

				<aside class="contact-info">
					<div>
						<p class="contact-info__label">Base</p>
						<p class="contact-info__value">Yopal, Casanare</p>
						<p class="contact-info__muted">Colombia</p>
					</div>
					<div>
						<p class="contact-info__label">Horario</p>
						<p class="contact-info__value">Lun — Sáb</p>
						<p class="contact-info__muted">06:00 — 18:00</p>
					</div>
					<div>
						<p class="contact-info__label">Bases</p>
						<p class="contact-info__value">Yopal</p>
						<p class="contact-info__value">Tauramena</p>
						<p class="contact-info__value">Villanueva</p>
					</div>
				</aside>
			</div>
		</div>
	</section>
</main>

<!-- ═══════════════ FOOTER (conservado) ═══════════════ -->
<footer class="footer">
	<div class="footer__inner">
		<div class="footer__col footer__col--brand">
			<img src="/assets/logo_transmeralda_white.png" alt="Transmeralda" class="footer__logo" />
			<p class="footer__tagline">
				Transporte terrestre automotor especial desde los llanos orientales.
			</p>
		</div>

		<div class="footer__col">
			<p class="footer__label">Navegación</p>
			<a class="footer__link" href="#inicio">Inicio</a>
			<a class="footer__link" href="#capacidades">Capacidades</a>
			<a class="footer__link" href="#cobertura">Cobertura</a>
			<a class="footer__link" href="#nosotros">Nosotros</a>
			<a class="footer__link" href="#servicios">Servicios</a>
		</div>

		<div class="footer__col">
			<p class="footer__label">Servicios</p>
			<a class="footer__link" href="#servicios">Transporte de personal</a>
			<a class="footer__link" href="#servicios">Logística y rutas</a>
			<a class="footer__link" href="#servicios">Seguridad y cumplimiento</a>
		</div>

		<div class="footer__col">
			<p class="footer__label">Contacto</p>
			<a class="footer__link" href="https://wa.me/573232340117" target="_blank" rel="noopener noreferrer">+57 323 234 0117</a>
			<a class="footer__link" href="mailto:operaciones.transmeraldasas@gmail.com">operaciones.transmeraldasas@gmail.com</a>
			<p class="footer__muted">Yopal · Casanare · Colombia</p>
		</div>
	</div>

	<div class="footer__bottom">
		<p>© {new Date().getFullYear()} Transmeralda S.A.S. — Todos los derechos reservados.</p>
		<a href="/politica-de-privacidad">Política de privacidad</a>
	</div>
</footer>

<!-- WhatsApp FAB -->
<a
	href="https://wa.me/573232340117"
	target="_blank"
	rel="noopener noreferrer"
	class="fab"
	class:fab--visible={showWhatsappFab}
	aria-label="WhatsApp"
>
	<svg viewBox="0 0 24 24" fill="currentColor">
		<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
	</svg>
</a>

<style>
	/* ═══════════════ NAV ═══════════════ */
	.nav {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 100;
		background: rgba(250, 247, 242, 0.72);
		backdrop-filter: saturate(180%) blur(24px);
		-webkit-backdrop-filter: saturate(180%) blur(24px);
		border-bottom: 1px solid var(--border-subtle);
		transition: box-shadow 0.4s cubic-bezier(0.4, 0, 0.2, 1);
	}
	.nav--scrolled {
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
	}
	.nav__inner {
		max-width: 1280px;
		margin: 0 auto;
		padding: 0 1.5rem;
		height: 64px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 2rem;
	}
	.nav__brand {
		background: none;
		border: none;
		cursor: pointer;
		padding: 0.5rem;
		margin-left: -0.5rem;
		border-radius: 0.5rem;
		transition: background 0.2s;
	}
	.nav__brand:hover { background: rgba(0, 0, 0, 0.04); }
	.nav__logo { height: 2.5rem; width: auto; object-fit: contain; display: block; }
	.nav__menu {
		display: none;
		gap: 0.25rem;
		align-items: center;
	}
	@media (min-width: 900px) { .nav__menu { display: flex; } }
	.nav__link {
		position: relative;
		padding: 0.5rem 0.875rem;
		font-family: 'Inter Tight', system-ui, sans-serif;
		font-size: 0.8125rem;
		font-weight: 400;
		letter-spacing: 0.005em;
		color: var(--text-primary);
		background: none;
		border: none;
		cursor: pointer;
		border-radius: 0.375rem;
		transition: color 0.2s;
	}
	.nav__link::after {
		content: '';
		position: absolute;
		left: 0.875rem;
		right: 0.875rem;
		bottom: 0.3rem;
		height: 1px;
		background: var(--emerald-deep);
		transform: scaleX(0);
		transform-origin: left center;
		transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	}
	.nav__link:hover { color: var(--emerald-deep); }
	.nav__link:hover::after { transform: scaleX(1); }
	.nav__link--active { color: var(--emerald-deep); }
	.nav__link--active::after { transform: scaleX(1); }
	.nav__burger {
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 5px;
		width: 36px;
		height: 36px;
		background: none;
		border: none;
		cursor: pointer;
		padding: 0;
		border-radius: 0.375rem;
		transition: background 0.2s;
	}
	.nav__burger:hover { background: rgba(0, 0, 0, 0.04); }
	@media (min-width: 900px) { .nav__burger { display: none; } }
	.nav__burger-line {
		display: block;
		width: 20px;
		height: 1.5px;
		background: var(--text-primary);
		border-radius: 1px;
		margin: 0 auto;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	}
	.nav__burger-line--open:nth-child(1) { transform: translateY(7px) rotate(45deg); }
	.nav__burger-line--open:nth-child(2) { transform: translateY(-7px) rotate(-45deg); }

	/* ═══════════════ SIDEBAR MOBILE ═══════════════ */
	.sidebar-overlay {
		position: fixed;
		inset: 0;
		z-index: 200;
		background: rgba(0, 0, 0, 0.5);
		backdrop-filter: blur(4px);
		-webkit-backdrop-filter: blur(4px);
		border: none;
		cursor: pointer;
	}
	.sidebar {
		position: fixed;
		top: 0;
		left: 0;
		bottom: 0;
		z-index: 201;
		width: 300px;
		max-width: 85vw;
		background: var(--bg-base);
		transform: translateX(-100%);
		transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
		display: flex;
		flex-direction: column;
	}
	.sidebar--open { transform: translateX(0); }
	.sidebar__header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1.25rem 1.5rem;
		border-bottom: 1px solid var(--border-subtle);
	}
	.sidebar__logo { height: 2.5rem; width: auto; }
	.sidebar__close {
		width: 36px;
		height: 36px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: rgba(0, 0, 0, 0.04);
		border: none;
		border-radius: 0.5rem;
		cursor: pointer;
		color: var(--text-muted);
		transition: all 0.2s;
	}
	.sidebar__close:hover { background: rgba(0, 0, 0, 0.08); color: var(--text-primary); }
	.sidebar__nav {
		flex: 1;
		padding: 1.5rem 0.75rem;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}
	.sidebar__link {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 0.875rem 1rem;
		font-family: 'Inter Tight', system-ui, sans-serif;
		font-size: 0.9375rem;
		font-weight: 400;
		color: var(--text-secondary);
		text-align: left;
		background: none;
		border: none;
		border-radius: 0.5rem;
		cursor: pointer;
		transition: all 0.2s;
	}
	.sidebar__link:hover { background: rgba(14, 107, 78, 0.06); color: var(--emerald-deep); }
	.sidebar__link--active { color: var(--emerald-deep); font-weight: 500; }
	.sidebar__link-num {
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.6875rem;
		color: var(--text-very-muted);
		min-width: 1.5rem;
	}

	/* ═══════════════ HERO ═══════════════ */
	.section-hero {
		position: relative;
		width: 100%;
		height: 60vh;
		height: 60dvh;
		min-height: 420px;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
		background-color: #064e3b;
	}
	.hero-video { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
	.hero-overlay { position: absolute; inset: 0; background: rgba(6, 78, 59, 0.45); }
	.hero-content {
		position: relative;
		z-index: 10;
		width: 100%;
		max-width: 1280px;
		height: 100%;
		margin: 0 auto;
		padding: 5rem 1.25rem 2rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
	}
	@media (min-width: 768px) { .hero-content { padding: 6rem 2rem 2rem; align-items: flex-start; text-align: left; } }
	@media (min-width: 1024px) { .hero-content { padding: 7rem 3rem 3rem; } }
	.hero-text {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: clamp(0.75rem, 2vh, 1.5rem);
		max-width: 680px;
	}
	@media (min-width: 768px) { .hero-text { align-items: flex-start; max-width: 60%; } }
	@media (min-width: 1024px) { .hero-text { max-width: 55%; } }
	.hero-title {
		font-family: 'Fraunces', 'Georgia', serif;
		font-size: clamp(1.75rem, 4.5vw, 3.25rem);
		font-weight: 400;
		line-height: 1.05;
		letter-spacing: -0.025em;
		color: white;
		text-shadow: 0 4px 32px rgba(0, 0, 0, 0.25);
		margin: 0;
		font-variation-settings: 'opsz' 144;
	}
	@media (min-width: 1280px) {
		.hero-title { font-size: clamp(2.5rem, 4vw, 3.75rem); }
	}
	.hero-subtitle {
		font-family: 'Inter Tight', system-ui, sans-serif;
		font-size: clamp(0.95rem, 1.4vw, 1.15rem);
		line-height: 1.55;
		color: rgba(255, 255, 255, 0.92);
		font-weight: 400;
		letter-spacing: -0.005em;
		margin: 0;
	}
	.hero-cta {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: clamp(0.6rem, 1.5vh, 1rem) clamp(1.25rem, 3vw, 2rem);
		font-family: 'Inter Tight', system-ui, sans-serif;
		font-size: clamp(0.875rem, 1.5vw, 1rem);
		font-weight: 500;
		letter-spacing: -0.005em;
		color: white;
		border: none;
		border-radius: 0.75rem;
		cursor: pointer;
		transition: all 0.3s ease;
		white-space: nowrap;
		text-decoration: none;
	}
	.hero-cta--primary { background: #25d366; box-shadow: 0 4px 20px rgba(37, 211, 102, 0.4); }
	.hero-cta--primary:hover { background: #20bd5a; transform: translateY(-2px); box-shadow: 0 8px 28px rgba(37, 211, 102, 0.5); }
	.hero-cta--secondary { background: rgba(255, 255, 255, 0.15); backdrop-filter: blur(10px); box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); }
	.hero-cta--secondary:hover { background: rgba(255, 255, 255, 0.25); transform: translateY(-2px); }
	.hero-buttons { display: flex; flex-direction: column; gap: 0.75rem; align-items: center; }
	@media (min-width: 480px) { .hero-buttons { flex-direction: row; } }
	@media (min-width: 768px) { .hero-buttons { align-items: flex-start; } }
	.hero-cta-icon { width: 1.25rem; height: 1.25rem; flex-shrink: 0; }
	.hero-mascot {
		display: none;
	}
	@media (min-width: 768px) {
		.hero-mascot {
			display: block;
			position: absolute;
			bottom: 0;
			left: auto;
			right: 0;
			transform: translateY(6%);
			width: clamp(14rem, 22vw, 20rem);
			height: auto;
			object-fit: contain;
			pointer-events: none;
			z-index: 15;
			opacity: 1;
		}
	}
	@media (min-width: 1024px) { .hero-mascot { width: clamp(18rem, 22vw, 24rem); } }
	@media (min-width: 1280px) { .hero-mascot { width: clamp(22rem, 24vw, 30rem); transform: translateY(8%); } }
	.scroll-indicator {
		position: absolute;
		bottom: 1.5rem;
		left: 50%;
		transform: translateX(-50%);
		z-index: 15;
		background: transparent;
		border: none;
		cursor: pointer;
		color: rgba(255, 255, 255, 0.6);
		animation: scrollBounce 2s ease-in-out infinite;
		padding: 0.5rem;
		border-radius: 50%;
		transition: color 0.3s ease;
	}
	.scroll-indicator:hover { color: rgba(255, 255, 255, 0.95); }
	@keyframes scrollBounce {
		0%, 100% { transform: translateX(-50%) translateY(0); }
		50% { transform: translateX(-50%) translateY(8px); }
	}

	/* ═══════════════ SECTION BASE ═══════════════ */
	.section {
		background: var(--bg-base);
		padding: 6rem 0;
		position: relative;
	}
	@media (min-width: 1024px) { .section { padding: 8rem 0; } }
	.container {
		max-width: 1280px;
		margin: 0 auto;
		padding: 0 1.5rem;
	}
	@media (min-width: 768px) { .container { padding: 0 2rem; } }

	.section-header {
		margin-bottom: 4rem;
		max-width: 720px;
	}
	@media (min-width: 1024px) { .section-header { margin-bottom: 5rem; } }
	.section-number {
		display: inline-flex;
		align-items: baseline;
		gap: 0.4rem;
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.75rem;
		font-weight: 500;
		color: var(--emerald-deep);
		letter-spacing: 0.05em;
		margin-bottom: 1.25rem;
	}
	.section-number__hash { font-size: 0.625rem; opacity: 0.6; }
	.section-number--light { color: var(--emerald-500); }
	.section-number--dark { color: var(--emerald-500); }

	.section-title {
		font-family: 'Fraunces', serif;
		font-size: clamp(2.25rem, 5vw, 3.5rem);
		font-weight: 400;
		line-height: 1.05;
		letter-spacing: -0.02em;
		color: var(--text-primary);
		margin: 0 0 1.25rem 0;
	}
	.section-title--light { color: white; }
	.section-title--dark { color: var(--text-on-dark); }
	.section-subtitle {
		font-family: 'Inter Tight', system-ui, sans-serif;
		font-size: clamp(1rem, 1.5vw, 1.125rem);
		line-height: 1.6;
		color: var(--text-muted);
		font-weight: 400;
		max-width: 560px;
		margin: 0;
	}
	.section-subtitle--light { color: rgba(255, 255, 255, 0.8); }
	.section-subtitle--dark { color: var(--text-on-dark-muted); }

	/* ═══════════════ 01 CAPACIDADES (Bento grid) ═══════════════ */
	.section--cap {
		background: var(--bg-base);
		position: relative;
	}
	.bento {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1rem;
	}
	@media (min-width: 768px) {
		.bento {
			grid-template-columns: repeat(2, 1fr);
			grid-auto-rows: 240px;
			gap: 1.25rem;
		}
	}
	@media (min-width: 1024px) {
		.bento {
			grid-template-columns: repeat(4, 1fr);
			grid-auto-rows: 220px;
		}
	}

	.bento__card {
		position: relative;
		overflow: hidden;
		border-radius: 1.25rem;
		cursor: default;
		min-height: 280px;
	}
	@media (min-width: 768px) { .bento__card { min-height: 0; } }
	@media (min-width: 1024px) {
		.bento__card.lg\:col-span-2 { grid-column: span 2; }
		.bento__card.lg\:row-span-2 { grid-row: span 2; }
	}

	.bento__img {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
	}
	.bento__card:hover .bento__img { transform: scale(1.06); }

	.bento__overlay {
		position: absolute;
		inset: 0;
		background: linear-gradient(180deg, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.85) 100%);
		transition: background 0.4s;
	}
	.bento__overlay--featured {
		background: linear-gradient(135deg, rgba(6, 78, 59, 0.5) 0%, rgba(0, 0, 0, 0.9) 100%);
	}

	.bento__content {
		position: relative;
		z-index: 2;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		padding: 1.5rem;
		color: white;
	}
	.bento__content--featured { padding: 2rem; }

	.bento__num {
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.75rem;
		letter-spacing: 0.1em;
		color: var(--emerald-500);
		margin-bottom: 0.75rem;
		opacity: 0.9;
	}

	.bento__title {
		font-family: 'Fraunces', serif;
		font-size: clamp(1.25rem, 2vw, 1.5rem);
		font-weight: 400;
		line-height: 1.1;
		letter-spacing: -0.015em;
		margin: 0 0 0.5rem 0;
		color: white;
		font-variation-settings: 'opsz' 144;
	}
	.bento__content--featured .bento__title {
		font-size: clamp(1.75rem, 3vw, 2.25rem);
	}

	.bento__desc {
		font-family: 'Inter Tight', system-ui, sans-serif;
		font-size: 0.875rem;
		line-height: 1.55;
		color: rgba(255, 255, 255, 0.85);
		margin: 0;
		max-width: 420px;
	}
	.bento__content--featured .bento__desc {
		font-size: 1rem;
		max-width: 520px;
	}

	/* ═══════════════ 02 COBERTURA (Leaflet) ═══════════════ */
	.section--cov {
		background: var(--bg-base);
		color: var(--text-primary);
	}
	.map-layout {
		display: grid;
		grid-template-columns: 1fr;
		gap: 2rem;
	}
	@media (min-width: 1024px) {
		.map-layout {
			grid-template-columns: 280px 1fr 280px;
			gap: 2.5rem;
			align-items: stretch;
		}
	}

	.map-stats {
		display: flex;
		flex-direction: row;
		gap: 1.5rem;
		padding: 1.5rem;
		background: var(--bg-surface);
		border: 1px solid var(--border-subtle);
		border-radius: 1rem;
	}
	@media (min-width: 1024px) {
		.map-stats {
			flex-direction: column;
			justify-content: space-around;
			gap: 0;
			padding: 2rem 1.5rem;
		}
	}
	.map-stat {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}
	.map-stat__num {
		font-family: 'JetBrains Mono', monospace;
		font-size: clamp(2rem, 3.5vw, 2.75rem);
		font-weight: 400;
		color: var(--text-primary);
		line-height: 1;
		letter-spacing: -0.02em;
	}
	.map-stat__unit { color: var(--emerald-deep); font-size: 0.6em; }
	.map-stat__label {
		font-family: 'Inter Tight', system-ui, sans-serif;
		font-size: 0.75rem;
		color: var(--text-muted);
		text-transform: uppercase;
		letter-spacing: 0.08em;
	}

	.map-wrap {
		width: 100%;
		height: 480px;
		border-radius: 1rem;
		overflow: hidden;
		background: #e8e4dc;
		border: 1px solid var(--border-subtle);
	}
	@media (min-width: 1024px) { .map-wrap { height: 540px; } }

	.map-list {
		padding: 1.5rem;
		background: var(--bg-surface);
		border: 1px solid var(--border-subtle);
		border-radius: 1rem;
	}
	.map-list__label {
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.6875rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--text-very-muted);
		margin: 0 0 1rem 0;
	}
	.map-list ul {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}
	.map-list__item {
		display: flex;
		align-items: center;
		justify-content: flex-start;
		gap: 0.875rem;
		padding: 0.75rem 0.875rem;
		border: none;
		border-top: 1px solid var(--rule);
		background: none;
		cursor: pointer;
		border-radius: 0.5rem;
		transition: background 0.25s, transform 0.25s;
		width: 100%;
		box-sizing: border-box;
		text-align: left;
		font: inherit;
		color: inherit;
	}
	.map-list__item:hover { background: rgba(14, 107, 78, 0.05); }
	.map-list__item:first-child { border-top: none; }
	.map-list__item--active {
		background: rgba(14, 107, 78, 0.08);
	}
	.map-list__bullet {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: var(--emerald-deep);
		box-shadow: 0 0 0 3px rgba(14, 107, 78, 0.15);
		flex-shrink: 0;
	}
	.map-list__item--active .map-list__bullet {
		box-shadow: 0 0 0 4px rgba(14, 107, 78, 0.25);
	}
	.map-list__text { flex: 1; }
	.map-list__name {
		font-family: 'Fraunces', serif;
		font-size: 1.0625rem;
		color: var(--text-primary);
		font-weight: 400;
	}
	.map-list__item--active .map-list__name { color: var(--emerald-deep); }
	.map-list__tag {
		font-family: 'Inter Tight', system-ui, sans-serif;
		font-size: 0.6875rem;
		color: var(--text-very-muted);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}
	.map-list__arrow {
		width: 1rem;
		height: 1rem;
		color: var(--text-very-muted);
		opacity: 0;
		transform: translateX(-4px);
		transition: opacity 0.25s, transform 0.25s, color 0.25s;
		flex-shrink: 0;
	}
	.map-list__item:hover .map-list__arrow { opacity: 1; transform: translateX(0); color: var(--emerald-deep); }
	.map-list__item--active .map-list__arrow { opacity: 1; transform: translateX(0); color: var(--emerald-deep); }

	/* Leaflet overrides */
	:global(.leaflet-control-zoom a) {
		background: var(--bg-surface) !important;
		color: var(--text-primary) !important;
		border: 1px solid var(--border-subtle) !important;
	}
	:global(.leaflet-control-zoom a:hover) {
		background: var(--emerald-deep) !important;
		color: white !important;
	}
	:global(.leaflet-control-attribution) {
		background: rgba(255, 255, 255, 0.85) !important;
		color: var(--text-muted) !important;
		font-size: 9px !important;
		padding: 2px 6px !important;
	}
	:global(.leaflet-control-attribution a) { color: var(--emerald-deep) !important; }
	:global(.custom-popup .leaflet-popup-content-wrapper) {
		background: #FAF7F2;
		border-radius: 0.5rem;
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
		border: 1px solid var(--border-subtle);
	}
	:global(.custom-popup .leaflet-popup-tip) { background: #FAF7F2; }
	:global(.custom-popup .leaflet-popup-content) { margin: 12px 16px !important; }

	@keyframes markerPulse {
		0% { transform: scale(1); opacity: 0.6; }
		100% { transform: scale(2.5); opacity: 0; }
	}

	/* ═══════════════ 03 NOSOTROS (Hero fullscreen con imagen) ═══════════════ */
	.section--nos-hero {
		position: relative;
		background: #064e3b;
		overflow: hidden;
		min-height: 100vh;
		min-height: 100dvh;
		display: flex;
		align-items: center;
	}
	.nos-bg {
		position: absolute;
		inset: 0;
		z-index: 0;
	}
	.nos-bg__img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		opacity: 0.35;
	}
	.nos-bg__overlay {
		position: absolute;
		inset: 0;
		background: linear-gradient(135deg, rgba(6, 78, 59, 0.85) 0%, rgba(15, 31, 26, 0.75) 100%);
	}
	.nos-container {
		position: relative;
		z-index: 1;
	}
	.nos-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 3rem;
	}
	@media (min-width: 1024px) {
		.nos-grid { grid-template-columns: 1.3fr 1fr; gap: 4rem; align-items: center; }
	}
	.nos-paragraph {
		font-family: 'Inter Tight', system-ui, sans-serif;
		font-size: 1.0625rem;
		line-height: 1.7;
		color: rgba(255, 255, 255, 0.85);
		margin: 0 0 1.25rem 0;
	}
	.nos-paragraph:last-of-type { margin-bottom: 0; }
	.nos-iso {
		margin-top: 2.5rem;
		padding-top: 2rem;
		border-top: 1px solid rgba(255, 255, 255, 0.15);
	}
	.nos-iso-label {
		display: block;
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.6875rem;
		font-weight: 500;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: rgba(255, 255, 255, 0.5);
		margin-bottom: 0.75rem;
	}
	.nos-iso-list {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.75rem;
	}
	.nos-iso-item {
		font-family: 'Inter Tight', system-ui, sans-serif;
		font-size: 0.9375rem;
		font-weight: 500;
		color: white;
	}
	.nos-iso-sep { color: var(--emerald-500); font-weight: 600; }

	.nos-stats {
		display: grid;
		grid-template-columns: 1fr;
		gap: 0;
		background: rgba(0, 0, 0, 0.4);
		backdrop-filter: blur(20px);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 1.5rem;
		padding: 2rem;
	}
	@media (min-width: 640px) { .nos-stats { grid-template-columns: 1fr 1px 1fr; } }
	.nos-stat { padding: 1.5rem 0.5rem; }
	.nos-stat__num {
		font-family: 'JetBrains Mono', monospace;
		font-size: clamp(2.5rem, 4.5vw, 3.5rem);
		font-weight: 400;
		color: white;
		line-height: 1;
		letter-spacing: -0.02em;
	}
	.nos-stat__plus { font-size: 0.5em; color: var(--emerald-500); margin-left: 0.1em; }
	.nos-stat__label {
		font-family: 'Inter Tight', system-ui, sans-serif;
		font-size: 0.75rem;
		color: rgba(255, 255, 255, 0.6);
		margin-top: 0.5rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}
	.nos-rule {
		display: none;
		background: rgba(255, 255, 255, 0.1);
	}
	@media (min-width: 640px) { .nos-rule { display: block; width: 1px; } }

	/* ═══════════════ 04 SERVICIOS (Alternating) ═══════════════ */
	.section--srv { background: var(--bg-base); }
	.srv-stack {
		display: flex;
		flex-direction: column;
		gap: 4rem;
	}
	@media (min-width: 1024px) { .srv-stack { gap: 6rem; } }

	.srv-row {
		display: grid;
		grid-template-columns: 1fr;
		gap: 2rem;
		align-items: center;
	}
	@media (min-width: 1024px) {
		.srv-row { grid-template-columns: 1fr 1fr; gap: 4rem; }
		.srv-row--reverse .srv-row__visual { order: 2; }
		.srv-row--reverse .srv-row__body { order: 1; }
	}

	.srv-row__visual {
		position: relative;
		aspect-ratio: 4 / 3;
		overflow: hidden;
		border-radius: 1.5rem;
		background: #0F1F1A;
	}
	.srv-row__img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
	}
	.srv-row__visual:hover .srv-row__img { transform: scale(1.04); }
	.srv-row__visual-tag {
		position: absolute;
		top: 1.5rem;
		left: 1.5rem;
		width: 64px;
		height: 64px;
		background: rgba(250, 247, 242, 0.95);
		backdrop-filter: blur(8px);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-family: 'Fraunces', serif;
		font-size: 1.5rem;
		font-weight: 400;
		color: var(--emerald-deep);
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
	}

	.srv-row__body { display: flex; flex-direction: column; gap: 1rem; }
	.srv-row__num {
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.875rem;
		color: var(--emerald-deep);
		letter-spacing: 0.1em;
	}
	.srv-row__title {
		font-family: 'Fraunces', serif;
		font-size: clamp(1.75rem, 3.5vw, 2.5rem);
		font-weight: 400;
		line-height: 1.1;
		letter-spacing: -0.02em;
		color: var(--text-primary);
		margin: 0;
	}
	.srv-row__desc {
		font-family: 'Inter Tight', system-ui, sans-serif;
		font-size: 1.0625rem;
		line-height: 1.65;
		color: var(--text-muted);
		margin: 0;
	}
	.srv-row__points {
		list-style: none;
		padding: 0;
		margin: 0.5rem 0 0 0;
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.5rem 1.5rem;
	}
	.srv-row__point {
		display: flex;
		align-items: center;
		gap: 0.625rem;
		font-family: 'Inter Tight', system-ui, sans-serif;
		font-size: 0.875rem;
		color: var(--text-secondary);
	}
	.srv-row__mark {
		width: 6px;
		height: 6px;
		background: var(--emerald-deep);
		transform: rotate(45deg);
		flex-shrink: 0;
	}

	/* ═══════════════ 05 FLOTA (conservada) ═══════════════ */
	.section--flo { background: var(--bg-base); }
	.flo-hero {
		position: relative;
		width: 100%;
		aspect-ratio: 16 / 9;
		max-height: 65vh;
		background: var(--bg-charcoal);
		overflow: hidden;
	}
	.flo-hero__img { position: absolute; inset: 0; }
	.flo-hero__img img { width: 100%; height: 100%; object-fit: cover; display: block; }
	.flo-hero__caption {
		position: absolute;
		inset: 0;
		background: linear-gradient(180deg, transparent 50%, rgba(0, 0, 0, 0.75) 100%);
		display: flex;
		align-items: flex-end;
		padding: 2rem;
	}
	@media (min-width: 768px) { .flo-hero__caption { padding: 3rem; } }
	.flo-hero__caption-inner { color: white; max-width: 560px; }
	.flo-hero__caption h3 {
		font-family: 'Fraunces', serif;
		font-size: clamp(1.5rem, 3vw, 2.25rem);
		font-weight: 400;
		margin: 0 0 0.5rem 0;
		letter-spacing: -0.01em;
	}
	.flo-hero__caption p {
		font-family: 'Inter Tight', system-ui, sans-serif;
		font-size: 0.9375rem;
		color: rgba(255, 255, 255, 0.8);
		margin: 0;
		line-height: 1.5;
	}
	.flo-counter {
		position: absolute;
		top: 1.5rem;
		right: 1.5rem;
		display: flex;
		align-items: baseline;
		gap: 0.25rem;
		font-family: 'JetBrains Mono', monospace;
		color: white;
		background: rgba(0, 0, 0, 0.4);
		backdrop-filter: blur(8px);
		padding: 0.5rem 0.875rem;
		border-radius: 0.375rem;
		font-size: 0.875rem;
		z-index: 2;
	}
	.flo-counter__sep { color: rgba(255, 255, 255, 0.3); margin: 0 0.1rem; }
	.flo-counter__total { color: rgba(255, 255, 255, 0.55); font-size: 0.75rem; }

	.flo-thumbs {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 0.75rem;
		margin-top: 0.75rem;
	}
	.flo-thumb {
		position: relative;
		aspect-ratio: 4 / 3;
		overflow: hidden;
		cursor: pointer;
		border: 1px solid transparent;
		background: var(--bg-surface);
		padding: 0;
		transition: border-color 0.3s;
	}
	.flo-thumb img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		opacity: 0.45;
		transition: opacity 0.4s, transform 0.4s;
	}
	.flo-thumb:hover img { opacity: 0.7; }
	.flo-thumb--active { border-color: var(--emerald-deep); }
	.flo-thumb--active img { opacity: 1; }
	.flo-thumb__label {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		padding: 0.5rem 0.75rem;
		background: linear-gradient(0deg, rgba(0, 0, 0, 0.7) 0%, transparent 100%);
		display: flex;
		flex-direction: column;
		gap: 0.1rem;
		opacity: 0;
		transition: opacity 0.3s;
		text-align: left;
	}
	.flo-thumb__num {
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.625rem;
		color: var(--emerald-500);
		letter-spacing: 0.05em;
	}
	.flo-thumb__title {
		font-family: 'Inter Tight', system-ui, sans-serif;
		font-size: 0.75rem;
		font-weight: 500;
		letter-spacing: 0.01em;
		color: white;
	}

	/* ═══════════════ 06 FAQ (Preguntas Frecuentes) ═══════════════ */
	.section--faq { background: var(--bg-base); }
	.faq-list {
		max-width: 820px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	.faq-item {
		border: 1px solid var(--border-subtle);
		border-radius: 0.875rem;
		background: var(--bg-surface);
		overflow: hidden;
		transition: border-color 0.25s, box-shadow 0.25s;
	}
	.faq-item[open] {
		border-color: var(--emerald-deep);
		box-shadow: 0 4px 20px rgba(14, 107, 78, 0.08);
	}
	.faq-item__q {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 1.25rem 1.5rem;
		cursor: pointer;
		font-family: 'Inter Tight', system-ui, sans-serif;
		font-size: clamp(0.9375rem, 1.4vw, 1.0625rem);
		font-weight: 500;
		color: var(--text-primary);
		list-style: none;
		user-select: none;
		transition: color 0.2s;
	}
	.faq-item__q::-webkit-details-marker { display: none; }
	.faq-item__q:hover { color: var(--emerald-deep); }
	.faq-item__q > span:nth-child(2) { flex: 1; }
	.faq-item__num {
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.75rem;
		color: var(--emerald-deep);
		letter-spacing: 0.05em;
		min-width: 1.75rem;
	}
	.faq-item__chev {
		width: 1rem;
		height: 1rem;
		color: var(--text-muted);
		flex-shrink: 0;
		transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	}
	.faq-item[open] .faq-item__chev {
		transform: rotate(180deg);
		color: var(--emerald-deep);
	}
	.faq-item__a {
		padding: 0 1.5rem 1.5rem 1.5rem;
		border-top: 1px solid var(--border-subtle);
		padding-top: 1.25rem;
	}
	.faq-item__a p {
		font-family: 'Inter Tight', system-ui, sans-serif;
		font-size: 0.9375rem;
		line-height: 1.65;
		color: var(--text-muted);
		margin: 0;
	}
	.faq-item__a strong {
		color: var(--text-primary);
		font-weight: 500;
	}

	/* ═══════════════ 07 CONTACTO (Dark) ═══════════════ */
	.section--contact {
		background: var(--bg-charcoal-deep);
		color: var(--text-on-dark);
	}
	.contact-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 3rem;
	}
	@media (min-width: 1024px) {
		.contact-grid { grid-template-columns: 1.5fr 1fr; gap: 5rem; }
	}
	.contact-cta-col { display: flex; flex-direction: column; gap: 0; }
	.contact-cta {
		display: flex;
		align-items: center;
		gap: 1.5rem;
		padding: 1.5rem 0;
		text-decoration: none;
		border-top: 1px solid var(--rule-on-dark);
		transition: padding 0.3s;
		color: var(--text-on-dark);
	}
	.contact-cta:last-child { border-bottom: 1px solid var(--rule-on-dark); }
	.contact-cta:hover { padding-left: 0.5rem; }
	.contact-cta__num {
		font-family: 'Fraunces', serif;
		font-size: 1rem;
		font-weight: 400;
		color: var(--emerald-500);
		min-width: 1.5rem;
	}
	.contact-cta__text { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 0.15rem; }
	.contact-cta__label {
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.6875rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--text-on-dark-muted);
	}
	.contact-cta__value {
		font-family: 'Inter Tight', system-ui, sans-serif;
		font-size: clamp(1rem, 1.8vw, 1.375rem);
		font-weight: 500;
		color: var(--text-on-dark);
		word-break: break-word;
		overflow-wrap: anywhere;
		min-width: 0;
	}
	@media (min-width: 768px) {
		.contact-cta__value {
			word-break: normal;
			overflow-wrap: normal;
		}
	}
	.contact-cta__arrow {
		width: 1.25rem;
		height: 1.25rem;
		opacity: 0.4;
		transition: opacity 0.3s, transform 0.3s;
	}
	.contact-cta:hover .contact-cta__arrow { opacity: 1; transform: translate(2px, -2px); }

	.contact-info { display: flex; flex-direction: column; gap: 2rem; padding-top: 1rem; }
	.contact-info__label {
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.6875rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--text-on-dark-muted);
		margin: 0 0 0.5rem 0;
	}
	.contact-info__value {
		font-family: 'Inter Tight', system-ui, sans-serif;
		font-size: 0.9375rem;
		color: var(--text-on-dark);
		margin: 0;
		line-height: 1.5;
	}
	.contact-info__muted {
		font-family: 'Inter Tight', system-ui, sans-serif;
		font-size: 0.8125rem;
		color: var(--text-on-dark-muted);
		margin: 0.15rem 0 0 0;
	}

	/* ═══════════════ FOOTER ═══════════════ */
	.footer {
		background: #050908;
		color: var(--text-on-dark);
		padding: 4rem 0 2rem;
	}
	.footer__inner {
		max-width: 1280px;
		margin: 0 auto;
		padding: 0 1.5rem;
		display: grid;
		grid-template-columns: 1fr;
		gap: 2.5rem;
	}
	@media (min-width: 640px) { .footer__inner { padding: 0 2rem; } }
	@media (min-width: 900px) {
		.footer__inner { grid-template-columns: 1.5fr repeat(3, 1fr); gap: 3rem; }
	}
	.footer__col--brand { display: flex; flex-direction: column; gap: 1rem; }
	.footer__logo { height: 6.5rem; width: auto; opacity: 0.9; }
	.footer__tagline {
		font-family: 'Inter Tight', system-ui, sans-serif;
		font-size: 0.875rem;
		color: var(--text-on-dark-muted);
		max-width: 280px;
		margin: 0;
		line-height: 1.5;
	}
	.footer__col { display: flex; flex-direction: column; gap: 0.625rem; }
	.footer__label {
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.6875rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--text-on-dark-muted);
		margin: 0 0 0.5rem 0;
	}
	.footer__link {
		font-family: 'Inter Tight', system-ui, sans-serif;
		font-size: 0.875rem;
		color: var(--text-on-dark);
		text-decoration: none;
		opacity: 0.8;
		transition: opacity 0.2s;
	}
	.footer__link:hover { opacity: 1; }
	.footer__muted {
		font-family: 'Inter Tight', system-ui, sans-serif;
		font-size: 0.8125rem;
		color: var(--text-on-dark-muted);
		margin: 0.25rem 0 0 0;
	}
	.footer__bottom {
		max-width: 1280px;
		margin: 3rem auto 0;
		padding: 2rem 1.5rem 0;
		border-top: 1px solid var(--rule-on-dark);
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.75rem;
		text-align: center;
	}
	@media (min-width: 640px) {
		.footer__bottom { padding: 2rem 2rem 0; flex-direction: row; justify-content: space-between; text-align: left; }
	}
	.footer__bottom p,
	.footer__bottom a {
		font-family: 'Inter Tight', system-ui, sans-serif;
		font-size: 0.75rem;
		color: var(--text-on-dark-muted);
		text-decoration: none;
		margin: 0;
	}
	.footer__bottom a:hover { color: var(--text-on-dark); }

	/* ═══════════════ FAB ═══════════════ */
	.fab {
		position: fixed;
		bottom: 1.5rem;
		right: 1.5rem;
		z-index: 90;
		width: 56px;
		height: 56px;
		background: #10B981;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		color: white;
		text-decoration: none;
		box-shadow: 0 4px 20px rgba(16, 185, 129, 0.35);
		opacity: 0;
		pointer-events: none;
		transform: translateY(20px);
		transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
	}
	.fab--visible { opacity: 1; pointer-events: auto; transform: translateY(0); }
	.fab:hover { background: #059669; transform: translateY(-3px); box-shadow: 0 8px 24px rgba(16, 185, 129, 0.5); }
	.fab svg { width: 26px; height: 26px; }
	@media (min-width: 768px) {
		.fab { bottom: 2rem; right: 2rem; width: 60px; height: 60px; }
		.fab svg { width: 28px; height: 28px; }
	}
</style>
