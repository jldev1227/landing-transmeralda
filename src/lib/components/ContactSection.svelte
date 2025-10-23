<script>
	import ContactCard from './ContactCard.svelte';
	
	export let email = 'gerenciatransmeraldasas@gmail.com';
	export let phone = '323340117';
	export let phoneDisplay = 'Yopal 323340117';
	export let logoUrl = '';
	
	function scrollToSection(id) {
		document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
	}
</script>

<section id="contact" class="py-32 bg-white">
	<div class="max-w-screen-lg mx-auto px-6 lg:px-12 text-center">
		<div>
			<!-- Logo/Mascota -->
			<div class="mb-12">
				<img 
					src={logoUrl}
					alt="Logo" 
					class="w-32 h-32 mx-auto object-contain hover:rotate-12 hover:scale-110 transition-all duration-500"
				/>
			</div>
			
			<h2 class="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
				<slot name="title">Comencemos a trabajar juntos</slot>
			</h2>
			<p class="text-xl text-gray-600 mb-16">
				<slot name="subtitle">¿Tienes alguna pregunta? Estamos aquí para ayudarte</slot>
			</p>
			
			<!-- Contact Cards -->
			<div class="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
				<!-- Email Card -->
				<ContactCard 
					title="Email"
					content={email}
					link="mailto:{email}"
					delay={100}
					rotation={-1}
				>
					<svelte:fragment slot="icon">
						<svg class="w-7 h-7 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
						</svg>
					</svelte:fragment>
				</ContactCard>
				
				<!-- Web Card -->
				<ContactCard 
					title="Web"
					content="En Proceso"
					delay={200}
					rotation={0}
				>
					<svelte:fragment slot="icon">
						<svg class="w-7 h-7 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
						</svg>
					</svelte:fragment>
				</ContactCard>
				
				<!-- Phone Card -->
				<ContactCard 
					title="Teléfono"
					content={phoneDisplay}
					link="tel:+57{phone}"
					delay={300}
					rotation={1}
				>
					<svelte:fragment slot="icon">
						<svg class="w-7 h-7 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
						</svg>
					</svelte:fragment>
				</ContactCard>
			</div>
			
			<!-- CTA Button -->
			<div class="mt-16">
				<button 
					on:click={() => scrollToSection('hero')}
					class="group bg-emerald-600 hover:bg-emerald-700 text-white px-12 py-4 rounded-full text-lg font-medium transition-all duration-300 hover:scale-110 shadow-xl relative overflow-hidden"
				>
					<span class="relative z-10">
						<slot name="cta-text">Solicitar servicio</slot>
					</span>
					<div class="absolute inset-0 bg-gradient-to-r from-emerald-500 to-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
				</button>
			</div>
		</div>
	</div>
</section>
