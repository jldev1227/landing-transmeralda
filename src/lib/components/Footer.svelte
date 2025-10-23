<script>
	export let companyName = 'Transmeralda S.A.S';
	export let nit = '901.528.440-6';
	export let logoUrl = '';
	export let year = new Date().getFullYear();
</script>

<footer class="bg-gray-900 py-12">
	<div class="max-w-screen-2xl mx-auto px-6 lg:px-12">
		<div class="flex flex-col md:flex-row justify-between items-center">
			<!-- Logo y nombre -->
			<div class="flex items-center space-x-3 mb-4 md:mb-0 hover:scale-105 transition-transform duration-300 cursor-pointer">
				<div class="w-10 h-10 bg-white rounded-full flex items-center justify-center">
					<img src={logoUrl} alt="{companyName} Logo" class="w-8 h-8 object-contain" />
				</div>
				<span class="text-white font-semibold">{companyName}</span>
			</div>
			
			<!-- Información legal -->
			<div class="text-center md:text-right">
				<p class="text-gray-400 text-sm">
					© {year} {companyName.split(' ')[0]}. Todos los derechos reservados.
				</p>
				<p class="text-gray-500 text-xs mt-1">
					NIT. {nit}
				</p>
				<slot name="extra-info" />
			</div>
		</div>
	</div>
</footer>
