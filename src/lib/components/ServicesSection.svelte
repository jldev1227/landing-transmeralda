<script>
	import ServiceCard from './ServiceCard.svelte';
	
	export let services = [
		{
			title: 'Transporte empresarial',
			description: 'Soluciones de movilidad corporativa con vehículos modernos y conductores profesionales',
			icon: 'building'
		},
		{
			title: 'Rutas especiales',
			description: 'Diseñamos rutas personalizadas según tus necesidades específicas de transporte',
			icon: 'map'
		},
		{
			title: 'Servicio 24/7',
			description: 'Disponibilidad completa para atender tus necesidades de transporte en cualquier momento',
			icon: 'clock'
		}
	];
	
	function getIcon(iconName) {
		const icons = {
			building: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
			map: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7',
			clock: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
		};
		return icons[iconName] || icons.building;
	}
</script>

<section id="services" class="py-32 bg-gray-50">
	<div class="max-w-screen-xl mx-auto px-6 lg:px-12">
		<div class="text-center mb-20">
			<h2 class="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
				<slot name="title">Nuestros servicios</slot>
			</h2>
			<p class="text-xl text-gray-600 max-w-3xl mx-auto">
				<slot name="subtitle">
					Ofrecemos soluciones de transporte terrestre especializadas para empresas y particulares
				</slot>
			</p>
		</div>

		<div class="grid md:grid-cols-3 gap-8">
			{#each services as service, i}
				<ServiceCard 
					title={service.title} 
					description={service.description}
					delay={i * 150}
				>
					<svelte:fragment slot="icon">
						<svg class="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={getIcon(service.icon)} />
						</svg>
					</svelte:fragment>
				</ServiceCard>
			{/each}
		</div>
	</div>
</section>
