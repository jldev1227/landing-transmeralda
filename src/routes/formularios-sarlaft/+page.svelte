<script lang="ts">
  import FormularioSarlaftApp from '$lib/sarlaft/FormularioSarlaftApp.svelte'

  let { data } = $props()
</script>

<!-- Índice histórico: conserva los enlaces de vuelta al sitio para no romper el
     link ya compartido. Muestra los dos formularios internos y la Declaración
     de empresa de transporte, cuya tarjeta lleva a su ruta hija. Cliente /
     Proveedor se atiende desde `clientes-proveedores`. -->
<FormularioSarlaftApp {data} basePath="/formularios-sarlaft" />
