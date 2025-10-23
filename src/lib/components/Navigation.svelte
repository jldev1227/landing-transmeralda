<script>
	import { onMount } from 'svelte';
	import { scale } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';

	export let sections = [];
	export let activeSection = 0;

	let scrollY = 0;

	function scrollToSection(id) {
		document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
	}
</script>

<svelte:window bind:scrollY />

<nav
	class="fixed top-0 right-0 left-0 z-50 transition-all duration-500"
	class:bg-emerald-950={scrollY > 50}
	class:backdrop-blur-xl={scrollY > 50}
	class:shadow-2xl={scrollY > 50}
	class:py-4={scrollY <= 50}
	class:py-2={scrollY > 50}
>
	<div class="mx-auto max-w-screen-2xl px-6 lg:px-12">
		<div class="flex items-center justify-between">
			<!-- Logo -->
			<div class="flex items-center space-x-3 transition-transform duration-300 hover:scale-105">
				<div class="flex items-center justify-center bg-white rounded-sm shadow-lg">
					<img src="/assets/logo_transmeralda.png" width="150" height="100" alt="Logo" />
				</div>
			</div>

			<!-- Desktop Menu -->
			<div class="hidden items-center space-x-8 lg:flex">
				{#each sections as section, i}
					<button
						on:click={() => scrollToSection(section.id)}
						class="relative py-2 text-sm font-medium text-white/80 transition-all duration-300 hover:text-white"
						class:text-white={activeSection === i}
					>
						{section.name}
						{#if activeSection === i}
							<div
								class="absolute right-0 bottom-0 left-0 h-0.5 rounded-full bg-emerald-400"
								transition:scale={{ duration: 300, easing: cubicOut }}
							/>
						{/if}
					</button>
				{/each}
				<button
					on:click={() => scrollToSection('contact')}
					class="rounded-full bg-emerald-500 px-6 py-2 text-sm font-medium text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-emerald-400 hover:shadow-emerald-500/50"
				>
					<slot name="cta-text">Contactar</slot>
				</button>
			</div>
		</div>
	</div>
</nav>
