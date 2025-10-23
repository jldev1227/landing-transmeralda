<script>
	import { onMount } from 'svelte';
	import { fly, fade } from 'svelte/transition';
	import { elasticOut, quintIn, cubicOut } from 'svelte/easing';

	let show = false;
	let container;
	let active = 'inicio';
	let currentIndex = 0;

	const sections = ['inicio', 'servicios', 'equipo', 'contacto'];

	// Función que lleva al usuario a una sección específica
	function scrollToSection(id) {
		const section = document.getElementById(id);
		if (section && container) {
			container.scrollTo({
				left: section.offsetLeft,
				behavior: 'smooth'
			});
			currentIndex = sections.indexOf(id);
		}
	}

	// Navegar a la siguiente sección
	function nextSection() {
		if (currentIndex < sections.length - 1) {
			currentIndex++;
			scrollToSection(sections[currentIndex]);
		}
	}

	// Navegar a la sección anterior
	function prevSection() {
		if (currentIndex > 0) {
			currentIndex--;
			scrollToSection(sections[currentIndex]);
		}
	}

	// Manejar scroll con teclado
	function handleKeydown(event) {
		if (event.key === 'ArrowRight') {
			nextSection();
		} else if (event.key === 'ArrowLeft') {
			prevSection();
		}
	}

	// Resalta la sección activa y actualiza el índice
	function handleScroll() {
		if (!container) return;

		const containerWidth = container.offsetWidth;
		const scrollLeft = container.scrollLeft;
		const sectionIndex = Math.round(scrollLeft / containerWidth);

		if (sectionIndex >= 0 && sectionIndex < sections.length) {
			active = sections[sectionIndex];
			currentIndex = sectionIndex;
		}
	}

	onMount(() => {
		setTimeout(() => {
			show = true;
		}, 100);

		if (container) {
			container.addEventListener('scroll', handleScroll);
		}

		return () => {
			if (container) {
				container.removeEventListener('scroll', handleScroll);
			}
		};
	});
</script>

<svelte:window on:keydown={handleKeydown} />

{#if show}
	<!-- 🌐 Navbar -->
	<nav
		in:fly={{ y: -50, duration: 600, easing: cubicOut }}
		class="fixed top-0 left-0 z-20 w-full border-b border-emerald-100 bg-white/80 backdrop-blur-md"
	>
		<div class="flex justify-center space-x-2 p-2">
			{#each sections as section, i}
				<button
					on:click={() => scrollToSection(section)}
					class="relative cursor-pointer rounded-full px-6 py-2 font-display text-sm transition-all hover:scale-105"
					class:bg-emerald-600={currentIndex === i}
					class:text-white={currentIndex === i}
					class:text-emerald-700={currentIndex !== i}
					class:font-semibold={currentIndex === i}
					class:hover:bg-emerald-100={currentIndex !== i}
				>
					{section.charAt(0).toUpperCase() + section.slice(1)}
				</button>
			{/each}
		</div>
	</nav>

	<!-- ⬅️ ➡️ Botones de navegación -->
	{#if currentIndex > 0}
		<button
			in:fly={{ x: -50, duration: 400 }}
			on:click={prevSection}
			class="hover:bg-whit fixed top-1/2 left-4 z-20 flex h-12 w-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/80 shadow-lg backdrop-blur-md transition-all hover:scale-110"
			aria-label="Sección anterior"
		>
			<svg class="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
			</svg>
		</button>
	{/if}

	{#if currentIndex < sections.length - 1}
		<button
			in:fly={{ x: 50, duration: 400 }}
			on:click={nextSection}
			class="fixed top-1/2 right-4 z-20 flex h-12 w-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/80 shadow-lg backdrop-blur-md transition-all hover:scale-110 hover:bg-white"
			aria-label="Siguiente sección"
		>
			<svg class="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
			</svg>
		</button>
	{/if}

	<!-- 📜 Contenedor horizontal -->
	<div
		bind:this={container}
		in:fade={{ duration: 400 }}
		class="no-scrollbar flex h-screen w-screen snap-x snap-mandatory scroll-px-0 overflow-x-scroll scroll-smooth"
	>
		<!-- 🟩 Sección 1 - INICIO -->
		<section
			id="inicio"
			class="section relative flex h-screen w-screen shrink-0 snap-start flex-col items-center justify-start overflow-hidden p-20"
		>
			<!-- 🎥 Video de fondo -->
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

			<!-- ✨ Contenido principal -->
			<div
				class="relative z-10 px-6 text-center"
				in:fly={{ y: 200, duration: 1000, easing: elasticOut }}
			>
				<img
					src="/assets/logo_transmeralda.png"
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
			<img
				src="/assets/codi_vehiculo_front.png"
				alt="Vehículo Transmeralda"
				class="animate-float-vertical absolute bottom-0 mx-auto h-[16rem] w-[16rem] object-contain sm:h-[16rem] sm:w-[16rem] md:h-[20rem] md:w-[20rem] lg:h-[24rem] lg:w-[24rem] xl:h-[26rem] xl:w-[26rem] 2xl:h-[40rem] 2xl:w-[40rem]"
			/>
		</section>

		<!-- 🟦 Sección 2 - SERVICIOS -->
		<section
			id="servicios"
			class="section flex h-screen w-screen shrink-0 snap-start flex-col items-center justify-center bg-gradient-to-br from-white to-emerald-100 p-8"
		>
			<div class="max-w-4xl">
				<h2
					in:fly={{ x: -100, duration: 800, delay: 100, easing: cubicOut }}
					class="mb-8 text-center font-display text-4xl font-bold text-emerald-800"
				>
					Nuestros Servicios
				</h2>

				<!-- Grid de servicios -->
				<div class="grid gap-6 md:grid-cols-3">
					<!-- Servicio 1 -->
					<div
						in:fly={{ y: 60, duration: 800, delay: 200, easing: cubicOut }}
						class="group rounded-2xl bg-white p-6 shadow-lg transition-all hover:scale-105 hover:shadow-xl"
					>
						<div
							class="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 transition-transform group-hover:scale-110"
						>
							<svg
								class="h-6 w-6 text-emerald-600"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
								/>
							</svg>
						</div>
						<h3 class="mb-2 font-display text-xl font-semibold text-emerald-800">
							Control de Mantenimientos
						</h3>
						<p class="text-sm text-slate-600">
							Gestión completa del mantenimiento preventivo y correctivo de tu flota.
						</p>
					</div>

					<!-- Servicio 2 -->
					<div
						in:fly={{ y: 60, duration: 800, delay: 350, easing: cubicOut }}
						class="group rounded-2xl bg-white p-6 shadow-lg transition-all hover:scale-105 hover:shadow-xl"
					>
						<div
							class="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 transition-transform group-hover:scale-110"
						>
							<svg
								class="h-6 w-6 text-emerald-600"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
								/>
							</svg>
						</div>
						<h3 class="mb-2 font-display text-xl font-semibold text-emerald-800">
							Gestión de Conductores
						</h3>
						<p class="text-sm text-slate-600">
							Administra documentos, licencias y desempeño de conductores.
						</p>
					</div>

					<!-- Servicio 3 -->
					<div
						in:fly={{ y: 60, duration: 800, delay: 500, easing: cubicOut }}
						class="group rounded-2xl bg-white p-6 shadow-lg transition-all hover:scale-105 hover:shadow-xl"
					>
						<div
							class="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 transition-transform group-hover:scale-110"
						>
							<svg
								class="h-6 w-6 text-emerald-600"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
								/>
							</svg>
						</div>
						<h3 class="mb-2 font-display text-xl font-semibold text-emerald-800">
							Planillas Digitales
						</h3>
						<p class="text-sm text-slate-600">
							Control de rutas, horarios y reportes automatizados.
						</p>
					</div>
				</div>
			</div>
		</section>

		<!-- 🟧 Sección 3 - EQUIPO -->
		<section
			id="equipo"
			class="section flex h-screen w-screen shrink-0 snap-start flex-col items-center justify-center bg-gradient-to-br from-emerald-600 to-emerald-800 p-8 text-white"
		>
			<div class="max-w-4xl text-center">
				<h2
					in:fly={{ x: 100, duration: 800, delay: 100, easing: cubicOut }}
					class="mb-6 font-display text-4xl font-bold"
				>
					Nuestro Equipo
				</h2>
				<p
					in:fly={{ y: 50, duration: 800, delay: 300, easing: cubicOut }}
					class="mb-12 max-w-2xl font-sans text-lg text-emerald-50"
				>
					Profesionales dedicados a la innovación y el transporte inteligente. Trabajamos cada día
					para ofrecerte las mejores soluciones.
				</p>

				<!-- Estadísticas -->
				<div
					in:fly={{ y: 80, duration: 800, delay: 500, easing: cubicOut }}
					class="grid gap-8 md:grid-cols-3"
				>
					<div
						class="rounded-2xl bg-white/10 p-6 backdrop-blur-sm transition-all hover:scale-105 hover:bg-white/20"
					>
						<div class="mb-2 text-4xl font-bold">10+</div>
						<div class="text-emerald-100">Años de experiencia</div>
					</div>
					<div
						class="rounded-2xl bg-white/10 p-6 backdrop-blur-sm transition-all hover:scale-105 hover:bg-white/20"
					>
						<div class="mb-2 text-4xl font-bold">500+</div>
						<div class="text-emerald-100">Vehículos gestionados</div>
					</div>
					<div
						class="rounded-2xl bg-white/10 p-6 backdrop-blur-sm transition-all hover:scale-105 hover:bg-white/20"
					>
						<div class="mb-2 text-4xl font-bold">24/7</div>
						<div class="text-emerald-100">Soporte disponible</div>
					</div>
				</div>
			</div>
		</section>

		<!-- 🟥 Sección 4 - CONTACTO -->
		<section
			id="contacto"
			class="section flex h-screen w-screen shrink-0 snap-start flex-col items-center justify-center bg-gradient-to-br from-emerald-800 to-slate-900 p-8 text-white"
		>
			<div class="max-w-2xl text-center">
				<h2
					in:fly={{ scale: 0.8, duration: 800, delay: 100, easing: elasticOut }}
					class="mb-6 font-display text-4xl font-bold"
				>
					Contáctanos
				</h2>
				<p
					in:fly={{ y: 30, duration: 600, delay: 300, easing: cubicOut }}
					class="mb-8 text-lg text-slate-300"
				>
					¿Listo para modernizar tu gestión de transporte?
				</p>

				<!-- Información de contacto -->
				<div
					in:fly={{ y: 50, duration: 800, delay: 500, easing: cubicOut }}
					class="mb-8 flex flex-col gap-4 text-left"
				>
					<a
						href="mailto:gerenciatransmeraldasas@gmail.com"
						class="flex items-center gap-3 rounded-xl bg-white/10 p-4 backdrop-blur-sm transition-all hover:scale-105 hover:bg-white/20"
					>
						<svg
							class="h-6 w-6 text-emerald-400"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
							/>
						</svg>
						<span class="hover:text-emerald-300">gerenciatransmeraldasas@gmail.com</span>
					</a>

					<a
						href="tel:+573233340117"
						class="flex items-center gap-3 rounded-xl bg-white/10 p-4 backdrop-blur-sm transition-all hover:scale-105 hover:bg-white/20"
					>
						<svg
							class="h-6 w-6 text-emerald-400"
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
						<span class="hover:text-emerald-300">323340117</span>
					</a>
				</div>

				<!-- Botón volver al inicio -->
				<button
					on:click={() => scrollToSection('inicio')}
					in:fly={{ y: 50, duration: 800, delay: 700, easing: cubicOut }}
					class="rounded-xl bg-white px-8 py-3 font-semibold text-emerald-800 shadow-lg transition-all hover:scale-105 hover:bg-emerald-100"
				>
					Volver al inicio
				</button>
			</div>
		</section>
	</div>
{/if}

<style>
	/* Ocultar scrollbar horizontal */
	.no-scrollbar::-webkit-scrollbar {
		display: none;
	}
	.no-scrollbar {
		-ms-overflow-style: none;
		scrollbar-width: none;
	}

	/* Animación bounce personalizada */
	@keyframes bounce {
		0%,
		100% {
			transform: translateX(0);
		}
		50% {
			transform: translateX(10px);
		}
	}

	.animate-bounce {
		animation: bounce 2s infinite;
	}
</style>
