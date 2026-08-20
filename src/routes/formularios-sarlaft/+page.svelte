<script lang="ts">
  import FormularioSarlaftApp from '$lib/sarlaft/FormularioSarlaftApp.svelte'

  let { data } = $props()
</script>

<!-- Índice histórico: conserva los enlaces de vuelta al sitio para no romper el
     link ya compartido, pero solo con los formularios internos. Cliente /
     Proveedor se atiende desde `clientes-proveedores`. -->
<FormularioSarlaftApp {data} basePath="/formularios-sarlaft" />
