<script lang="ts">
  import FormularioSarlaftApp from '$lib/sarlaft/FormularioSarlaftApp.svelte'

  let { data } = $props()
</script>

<!-- Ruta standalone de un único formato: sin selector y sin enlaces al landing.
     El instructivo y el glosario que se muestran son los propios de
     SLFT-PTEE-FR-12 (ver `getInstructivo` en $lib/sarlaft/instructivo).
     Al enviar, la confirmación es el fin del documento. -->
<FormularioSarlaftApp
  {data}
  basePath="/autorizacion-propietario"
  standalone
  tipoUnico="autorizacion_propietario"
  tituloSelector="Autorización del Propietario"
/>
