<script>
	import { scale } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	
	export let title = '';
	export let content = '';
	export let link = null;
	export let delay = 0;
	export let rotation = 0; // 0, -1, or 1 for hover rotation
</script>

<div 
	in:scale={{ duration: 600, delay, easing: quintOut }}
	class="bg-gray-50 rounded-2xl p-8 hover:bg-emerald-50 transition-all duration-300 hover:scale-105 cursor-pointer"
	class:hover:-rotate-1={rotation === -1}
	class:hover:rotate-1={rotation === 1}
>
	<div class="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 hover:rotate-12 transition-transform duration-300">
		<slot name="icon">
			<svg class="w-7 h-7 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
			</svg>
		</slot>
	</div>
	<h3 class="text-gray-900 font-semibold mb-2">{title}</h3>
	{#if link}
		<a 
			href={link}
			class="text-emerald-600 hover:text-emerald-700 text-sm transition-colors duration-300 hover:underline"
		>
			{content}
		</a>
	{:else}
		<p class="text-gray-500 text-sm">{content}</p>
	{/if}
</div>
