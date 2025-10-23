<script>
	import { fly, scale } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	
	export let title = '';
	export let description = '';
	export let delay = 0;
</script>

<div 
	in:fly={{ y: 60, duration: 800, delay, easing: quintOut }}
	class="group bg-white rounded-2xl p-8 hover:bg-emerald-50 transition-all duration-500 hover:scale-105 hover:-rotate-1 cursor-pointer shadow-lg hover:shadow-2xl"
>
	<div class="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-200 group-hover:scale-110 transition-all duration-300">
		<slot name="icon">
			<!-- Icono por defecto -->
			<svg class="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
			</svg>
		</slot>
	</div>
	<h3 class="text-2xl font-bold text-gray-900 mb-4 group-hover:text-emerald-700 transition-colors duration-300">
		{title}
	</h3>
	<p class="text-gray-600 leading-relaxed">
		{description}
	</p>
	<slot name="extra-content" />
</div>
