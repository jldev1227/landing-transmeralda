<script lang="ts">
  import FormularioSarlaftApp from '$lib/sarlaft/FormularioSarlaftApp.svelte'

  let { data } = $props()
</script>

<!-- Ruta standalone: mantiene el selector (dos tarjetas) pero sin enlaces al
     landing. Al enviar, la confirmación es el fin del documento. -->
<FormularioSarlaftApp
  {data}
  basePath="/formularios-sarlaft/personal-accionistas"
  standalone
  tituloSelector="Formularios de Conocimiento — Personal y Accionistas"
  introSelector="En cumplimiento de la Resolución 2328 de 2025 y la Resolución 14673 de 2025, TRANSMERALDA S.A.S. requiere que completes el formulario correspondiente a tu vínculo con la empresa."
/>
