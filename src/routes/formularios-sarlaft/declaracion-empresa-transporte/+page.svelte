<script lang="ts">
  import FormularioSarlaftApp from '$lib/sarlaft/FormularioSarlaftApp.svelte'

  let { data } = $props()
</script>

<!-- Ruta standalone de un único formato: sin selector y sin enlaces al landing.
     El instructivo y el glosario que se muestran son los propios de
     SLFT-PTEE-FR-13 (ver `getInstructivo` en $lib/sarlaft/instructivo).

     A diferencia de los demás formatos, aquí la confirmación NO es el fin del
     trámite para el declarante: desde ella descarga su copia del documento
     firmado, que además le llega por correo. -->
<FormularioSarlaftApp
  {data}
  basePath="/declaracion-empresa-transporte"
  standalone
  tipoUnico="declaracion_empresa_transporte"
  tituloSelector="Declaración SARLAFT y PTEE para empresa de transporte"
/>
