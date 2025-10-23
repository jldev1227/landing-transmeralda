<script>
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	
	export let title = '';
	export let subtitle = '';
	export let imageUrl = '';
	export let delay = 0;
</script>

<div 
	in:fly={{ y: 60, duration: 800, delay, easing: quintOut }}
	class="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer"
>
	<!-- Imagen -->
	<div class="aspect-[4/5] overflow-hidden">
		<img 
			src={imageUrl} 
			alt="{title} - {subtitle}"
			class="w-full h-full object-cover group-hover:scale-125 group-hover:rotate-2 transition-all duration-700"
		/>
	</div>
	
	<!-- Overlay con contenido -->
	<div class="absolute inset-0 bg-gradient-to-t from-emerald-900/90 via-emerald-900/50 to-transparent flex flex-col justify-end p-6 group-hover:from-emerald-800/95 transition-colors duration-500">
		<div class="text-emerald-300 text-sm font-semibold mb-2">
			{subtitle}
		</div>
		<h3 class="text-2xl font-bold text-white">
			{title}
		</h3>
	</div>
	
	<!-- Shine Effect -->
	<div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
		<div class="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
	</div>
</div>
