<script lang="ts">
	import emblaCarousel from 'svelte-embla';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import type { EmblaCarouselType } from 'embla-carousel';

	let embla: EmblaCarouselType | undefined;
	let viewport: HTMLElement;
	let autoplayInterval: ReturnType<typeof setInterval> | undefined;

	const images = [
		'/images/flota/slide-1.jpg',
		'/images/flota/slide-2.jpg',
		'/images/flota/slide-3.png',
		'/images/flota/slide-4.png',
		'/images/flota/slide-5.png'
	];

	onMount(() => {
		const emblaApi = emblaCarousel(viewport, {
			loop: true,
			align: 'start',
			dragFree: false,
			speed: 10,
			skipSnaps: false,
			slidesToScroll: 1
		});
		
		embla = emblaApi.embla;

		// Autoplay cada 2 segundos
		const startAutoplay = () => {
			if (autoplayInterval) clearInterval(autoplayInterval);
			autoplayInterval = setInterval(() => {
				if (embla && embla.canScrollNext()) {
					embla.scrollNext();
				}
			}, 2000);
		};

		const stopAutoplay = () => {
			if (autoplayInterval) {
				clearInterval(autoplayInterval);
				autoplayInterval = undefined;
			}
		};

		// Iniciar autoplay cuando se monte
		if (embla) {
			startAutoplay();

			// Pausar cuando el usuario interactúa
			embla.on('pointerDown', stopAutoplay);
			embla.on('settle', () => {
				// Reanudar después de que termine la interacción
				if (!autoplayInterval) {
					startAutoplay();
				}
			});
		}

		return () => {
			stopAutoplay();
			emblaApi.destroy();
		};
	});

	// Navegación manual
	function scrollPrev() {
		if (embla) {
			embla.scrollPrev();
		}
	}

	function scrollNext() {
		if (embla) {
			embla.scrollNext();
		}
	}
</script>

<!-- 🌿 Galería estilo Apple Glass - Ancho completo -->
<section class="relative w-full">
	<div class="embla-wrapper relative w-full">
		<!-- Controles de navegación -->
		<button
			on:click={scrollPrev}
			type="button"
			class="nav-button nav-button-left"
			aria-label="Anterior"
		>
			<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
			</svg>
		</button>

		<button
			on:click={scrollNext}
			type="button"
			class="nav-button nav-button-right"
			aria-label="Siguiente"
		>
			<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
			</svg>
		</button>

		<!-- Carrusel -->
		<div class="embla overflow-hidden w-full" bind:this={viewport}>
			<div class="embla__container flex">
				{#each images as img, i (img)}
					<div
						class="embla__slide flex-shrink-0"
						in:fade={{ duration: 600, delay: i * 80, easing: cubicOut }}
					>
						<div class="glass-card group relative">
							<img
								src={img}
								alt="Vehículo Transmeralda {i + 1}"
								class="slide-image"
								draggable="false"
								loading="lazy"
							/>

							<!-- Overlay gradiente -->
							<div class="overlay-gradient"></div>

							<!-- Reflejo glass superior -->
							<div class="glass-reflection"></div>

							<!-- Indicador de número -->
							<div class="slide-number">
								<span>{i + 1}</span>
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
</section>

<style>
	.embla-wrapper {
		position: relative;
		width: 100%;
	}

	.embla {
		position: relative;
		width: 100%;
		cursor: grab;
	}

	.embla:active {
		cursor: grabbing;
	}

	.embla__container {
		display: flex;
		backface-visibility: hidden;
		touch-action: pan-y;
	}

	/* Cada imagen ocupa 100% del ancho - UNA imagen a la vez */
	.embla__slide {
		flex: 0 0 100%;
		min-width: 0;
		padding: 0;
		margin: 0;
	}

	/* Glass Card - Sin márgenes ni padding */
	.glass-card {
		position: relative;
		overflow: hidden;
		background: rgba(255, 255, 255, 0.05);
		backdrop-filter: blur(12px);
		box-shadow: 
			0 8px 32px rgba(0, 0, 0, 0.12),
			0 2px 8px rgba(0, 0, 0, 0.08),
			inset 0 1px 1px rgba(255, 255, 255, 0.1);
		transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
		border: none;
		margin: 0;
		padding: 0;
		width: 100%;
		height: 100%;
	}

	.glass-card:hover {
		transform: scale(1.02);
		box-shadow: 
			0 20px 60px rgba(16, 185, 129, 0.15),
			0 8px 24px rgba(0, 0, 0, 0.15),
			inset 0 1px 1px rgba(255, 255, 255, 0.15);
		border: 1px solid rgba(16, 185, 129, 0.3);
		z-index: 2;
	}

	.slide-image {
		width: 100%;
		height: 24rem;
		object-fit: cover;
		opacity: 0.9;
		transition: all 0.7s cubic-bezier(0.4, 0, 0.2, 1);
		display: block;
		margin: 0;
		padding: 0;
	}

	@media (min-width: 768px) {
		.slide-image {
			height: 32rem;
		}
	}

	@media (min-width: 1024px) {
		.slide-image {
			height: 40rem;
		}
	}

	.glass-card:hover .slide-image {
		opacity: 1;
		transform: scale(1.05);
	}

	/* Overlay gradiente */
	.overlay-gradient {
		position: absolute;
		inset: 0;
		background: linear-gradient(
			to top,
			rgba(16, 185, 129, 0.3) 0%,
			transparent 50%,
			transparent 100%
		);
		opacity: 0;
		transition: opacity 0.7s ease;
		pointer-events: none;
	}

	.glass-card:hover .overlay-gradient {
		opacity: 1;
	}

	/* Reflejo glass */
	.glass-reflection {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 40%;
		background: linear-gradient(
			to bottom,
			rgba(255, 255, 255, 0.3) 0%,
			transparent 100%
		);
		opacity: 0.2;
		transition: opacity 0.7s ease;
		pointer-events: none;
	}

	.glass-card:hover .glass-reflection {
		opacity: 0.4;
	}

	/* Número de slide */
	.slide-number {
		position: absolute;
		top: 1rem;
		right: 1rem;
		width: 2.5rem;
		height: 2.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
		background: rgba(16, 185, 129, 0.2);
		backdrop-filter: blur(8px);
		border-radius: 50%;
		border: 1px solid rgba(255, 255, 255, 0.2);
		color: white;
		font-weight: 600;
		font-size: 0.875rem;
		opacity: 0;
		transform: scale(0.8);
		transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
		pointer-events: none;
	}

	.glass-card:hover .slide-number {
		opacity: 1;
		transform: scale(1);
	}

	/* Botones de navegación */
	.nav-button {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		z-index: 10;
		width: 3rem;
		height: 3rem;
		display: flex;
		align-items: center;
		justify-content: center;
		background: rgba(255, 255, 255, 0.1);
		backdrop-filter: blur(12px);
		border: 1px solid rgba(255, 255, 255, 0.2);
		border-radius: 50%;
		color: white;
		cursor: pointer;
		transition: all 0.3s ease;
		opacity: 0;
	}

	.embla-wrapper:hover .nav-button {
		opacity: 1;
	}

	.nav-button:hover {
		background: rgba(16, 185, 129, 0.3);
		border-color: rgba(16, 185, 129, 0.5);
		transform: translateY(-50%) scale(1.1);
	}

	.nav-button:active {
		transform: translateY(-50%) scale(0.95);
	}

	.nav-button-left {
		left: 1rem;
	}

	.nav-button-right {
		right: 1rem;
	}

	@media (max-width: 768px) {
		.nav-button {
			width: 2.5rem;
			height: 2.5rem;
			opacity: 0.7;
		}
		
		.nav-button-left {
			left: 0.5rem;
		}

		.nav-button-right {
			right: 0.5rem;
		}
	}
</style>