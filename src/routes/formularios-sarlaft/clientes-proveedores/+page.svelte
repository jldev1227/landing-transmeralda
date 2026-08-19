<script lang="ts">
  import FormularioSarlaftApp from '$lib/sarlaft/FormularioSarlaftApp.svelte'

  let { data } = $props()
</script>

<!-- Ruta standalone: sin selector, sin enlaces al landing. Al enviar, la
     confirmación es el fin del documento. -->
<FormularioSarlaftApp
  {data}
  basePath="/formularios-sarlaft/clientes-proveedores"
  standalone
  tipoUnico="cliente_proveedor"
  tituloSelector="Formulario de Conocimiento — Cliente / Proveedor"
/>
