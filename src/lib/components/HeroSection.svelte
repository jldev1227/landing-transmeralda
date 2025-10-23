<script>
	import { fade } from 'svelte/transition';
	
	export let scrollY = 0;
	
	// Parallax calculations
	$: heroParallax = scrollY * 0.5;
	$: heroScale = 1 + (scrollY * 0.0002);
	$: heroOpacity = Math.max(0, 1 - (scrollY * 0.0015));
	$: contentParallax = scrollY * -0.15;
	$: backgroundParallax = scrollY * 0.2;
	
	function scrollToSection(id) {
		document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
	}
</script>

<section id="hero" class="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
	<!-- Animated Background Shapes - Layer 1 (Slowest) -->
	<div 
		class="absolute inset-0 pointer-events-none"
		style="transform: translate3d(0, {backgroundParallax}px, 0);"
	>
		<div class="absolute top-1/4 -left-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
		<div class="absolute bottom-1/4 -right-20 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl" />
	</div>
	
	<!-- Background Image - Layer 2 (Medium Speed) -->
	<div 
		class="absolute inset-0"
		style="transform: translate3d(0, {heroParallax}px, 0) scale({heroScale}); opacity: {heroOpacity};"
	>
		<div class="absolute inset-0 bg-gradient-to-b from-emerald-950/90 via-emerald-900/80 to-black/90 z-10" />
		<img 
			src="" 
			alt="Background" 
			class="w-full h-full object-cover opacity-50"
		/>
	</div>
	
	<!-- Content - Layer 3 (Fastest) -->
	<div 
		class="relative z-20 text-center px-6 max-w-6xl mx-auto pt-20"
		style="transform: translate3d(0, {contentParallax}px, 0);"
	>
		<div in:fade={{ duration: 1000, delay: 300 }}>
			<h1 class="text-5xl md:text-7xl lg:text-9xl font-bold text-white mb-6 tracking-tight leading-tight">
				<slot name="title">
					Transporte<br/>
					<span class="text-emerald-400 inline-block hover:scale-110 transition-transform duration-500">excepcional</span>
				</slot>
			</h1>
		</div>
		
		<div in:fade={{ duration: 1000, delay: 600 }}>
			<p class="text-xl md:text-2xl text-white/90 mb-12 font-light max-w-3xl mx-auto leading-relaxed">
				<slot name="subtitle">
					Nuestro equipo de profesionales garantiza la seguridad, calidad y eficiencia en cada viaje
				</slot>
			</p>
		</div>
		
		<div in:fade={{ duration: 1000, delay: 900 }} class="flex flex-col sm:flex-row gap-4 justify-center">
			<button 
				on:click={() => scrollToSection('services')}
				class="group bg-emerald-500 hover:bg-emerald-400 text-white px-10 py-4 rounded-full text-lg font-medium transition-all duration-300 hover:scale-105 shadow-2xl hover:shadow-emerald-500/50 relative overflow-hidden"
			>
				<span class="relative z-10">
					<slot name="primary-cta">Conocer servicios</slot>
				</span>
				<div class="absolute inset-0 bg-gradient-to-r from-emerald-400 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
			</button>
			<button 
				on:click={() => scrollToSection('vision')}
				class="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white px-10 py-4 rounded-full text-lg font-medium transition-all duration-300 hover:scale-105 border border-white/20"
			>
				<slot name="secondary-cta">Nuestra historia</slot>
			</button>
		</div>
	</div>
</section>
