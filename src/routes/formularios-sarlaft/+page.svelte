<script lang="ts">
  import FormularioSarlaftApp from '$lib/sarlaft/FormularioSarlaftApp.svelte'

  let { data } = $props()
</script>

<!-- Índice completo: las tres tarjetas y los enlaces de vuelta al sitio.
     No cambia respecto de la versión original para no romper los links
     que ya se compartieron. -->
<FormularioSarlaftApp {data} basePath="/formularios-sarlaft" />
