<script>
	import ProcessStep from './ProcessStep.svelte';
	
	export let steps = [
		{ title: 'GPS', subtitle: 'Rastreo en tiempo real', imageUrl: '' },
		{ title: 'Protocolos', subtitle: 'Seguridad garantizada', imageUrl: '' },
		{ title: 'Planificación', subtitle: 'Rutas optimizadas', imageUrl: '' },
		{ title: 'Actuación', subtitle: 'Servicio profesional', imageUrl: '' }
	];
</script>

<section class="py-32 bg-white">
	<div class="max-w-screen-xl mx-auto px-6 lg:px-12">
		<div class="text-center mb-20">
			<h2 class="text-5xl font-bold text-gray-900 mb-4">
				<slot name="title">Nuestro proceso</slot>
			</h2>
		</div>
		
		<div class="grid md:grid-cols-4 gap-8">
			{#each steps as step, i}
				<ProcessStep 
					title={step.title}
					subtitle={step.subtitle}
					imageUrl={step.imageUrl}
					delay={i * 150}
				/>
			{/each}
		</div>
	</div>
</section>
