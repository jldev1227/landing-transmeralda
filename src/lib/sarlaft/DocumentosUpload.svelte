<script lang="ts">
  /**
   * DocumentosUpload — Componente de subida de documentos con drag & drop.
   * Muestra un slot por cada documento requerido, con preview, validación
   * y estado (vacío / cargando / listo / error).
   */
  import { fly } from 'svelte/transition'
  import { quintOut } from 'svelte/easing'

  export interface DocumentoRequeridoFE {
    id: string
    nombre: string
    descripcion: string
  }

  export interface ArchivoSubido {
    file: File
    preview?: string
  }

  type Props = {
    documentos: DocumentoRequeridoFE[]
    archivos: Record<string, ArchivoSubido | null>
    errors: Record<string, string | null>
    onChange: (archivos: Record<string, ArchivoSubido | null>) => void
    onError: (errors: Record<string, string | null>) => void
    maxBytes?: number
    mimesPermitidos?: string[]
    extensionesPermitidas?: string[]
  }

  let {
    documentos,
    archivos,
    errors,
    onChange,
    onError,
    maxBytes = 10 * 1024 * 1024,
    mimesPermitidos = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'],
    extensionesPermitidas = ['.pdf', '.jpg', '.jpeg', '.png', '.webp', '.heic', '.heif']
  }: Props = $props()

  let dragOver = $state<string | null>(null)
  let fileInputs: Record<string, HTMLInputElement | undefined> = $state({})

  function formatBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`
  }

  function validar(file: File): string | null {
    if (file.size > maxBytes) {
      return `El archivo pesa ${formatBytes(file.size)}, excede el máximo de ${formatBytes(maxBytes)}.`
    }
    const mimeOk = mimesPermitidos.includes(file.type)
    const extOk = extensionesPermitidas.some((ext) => file.name.toLowerCase().endsWith(ext))
    if (!mimeOk && !extOk) {
      return `Formato no permitido. Solo se aceptan: ${extensionesPermitidas.join(', ')}.`
    }
    return null
  }

  function setArchivo(docId: string, file: File) {
    const err = validar(file)
    const newErrors = { ...errors, [docId]: err }
    onError(newErrors)
    if (err) return

    // Generar preview si es imagen
    let preview: string | undefined
    if (file.type.startsWith('image/')) {
      preview = URL.createObjectURL(file)
    }

    onChange({ ...archivos, [docId]: { file, preview } })
  }

  function handleSelect(docId: string, e: Event) {
    const input = e.target as HTMLInputElement
    const file = input.files?.[0]
    if (file) setArchivo(docId, file)
  }

  function handleDrop(docId: string, e: DragEvent) {
    e.preventDefault()
    dragOver = null
    const file = e.dataTransfer?.files?.[0]
    if (file) setArchivo(docId, file)
  }

  function handleDragOver(docId: string, e: DragEvent) {
    e.preventDefault()
    dragOver = docId
  }

  function handleDragLeave(docId: string) {
    if (dragOver === docId) dragOver = null
  }

  function removeArchivo(docId: string) {
    const archivo = archivos[docId]
    if (archivo?.preview) URL.revokeObjectURL(archivo.preview)
    onChange({ ...archivos, [docId]: null })
    onError({ ...errors, [docId]: null })
  }

  function getFileIcon(file: File): string {
    if (file.type === 'application/pdf') return 'pdf'
    if (file.type.startsWith('image/')) return 'image'
    return 'file'
  }
</script>

<div class="docs-upload">
  <header class="docs-header">
    <div class="head-icon">
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
      </svg>
    </div>
    <div>
      <h3>Documentos a anexar</h3>
      <p>
        Sube los siguientes documentos en formato <strong>PDF, JPG o PNG</strong> (máx. 10 MB cada uno).
        Los campos marcados con <span class="req-inline">*</span> son obligatorios.
      </p>
    </div>
  </header>

  <div class="docs-list">
    {#each documentos as doc (doc.id)}
      {@const archivo = archivos[doc.id]}
      {@const error = errors[doc.id]}

      <div
        class="doc-slot"
        class:has-file={!!archivo}
        class:has-error={!!error}
        class:dragging={dragOver === doc.id}
        in:fly={{ y: 10, duration: 250, easing: quintOut }}
      >
        <div class="doc-info">
          <div class="doc-title">
            <span class="doc-num">{doc.id.slice(0, 3).toUpperCase()}</span>
            <h4>
              {doc.nombre}
              <span class="req-inline">*</span>
            </h4>
          </div>
          <p class="doc-desc">{doc.descripcion}</p>
        </div>

        {#if archivo}
          <!-- Archivo cargado -->
          <div class="file-loaded">
            <div class="file-preview">
              {#if archivo.preview}
                <img src={archivo.preview} alt="Preview de {archivo.file.name}" />
              {:else if archivo.file.type === 'application/pdf'}
                <div class="pdf-icon">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                </div>
              {:else}
                <div class="file-icon">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                </div>
              {/if}
            </div>
            <div class="file-info">
              <p class="file-name">{archivo.file.name}</p>
              <p class="file-meta">
                {formatBytes(archivo.file.size)} · {archivo.file.type || 'archivo'}
              </p>
              <div class="file-actions">
                <button
                  type="button"
                  class="btn-replace"
                  onclick={() => fileInputs[doc.id]?.click()}
                >
                  Reemplazar
                </button>
                <button
                  type="button"
                  class="btn-remove"
                  onclick={() => removeArchivo(doc.id)}
                >
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                  Quitar
                </button>
              </div>
            </div>
          </div>
        {:else}
          <!-- Zona de drop / upload -->
          <label
            class="drop-zone"
            ondragover={(e) => handleDragOver(doc.id, e)}
            ondragleave={() => handleDragLeave(doc.id)}
            ondrop={(e) => handleDrop(doc.id, e)}
          >
            <input
              type="file"
              accept={mimesPermitidos.join(',')}
              bind:this={fileInputs[doc.id]}
              onchange={(e) => handleSelect(doc.id, e)}
              hidden
            />
            <div class="drop-content">
              <div class="upload-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
              </div>
              <p class="drop-primary">
                <strong>Suelta el archivo aquí</strong> o haz clic para seleccionar
              </p>
              <p class="drop-secondary">PDF, JPG, PNG, WebP o HEIC · Máx. 10 MB</p>
            </div>
          </label>
        {/if}

        {#if error}
          <p class="error-msg" in:fly={{ y: -5, duration: 200 }}>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            {error}
          </p>
        {/if}
      </div>
    {/each}
  </div>
</div>

<style>
  .docs-upload {
    background: white;
    border: 1px solid rgba(0, 0, 0, 0.08);
    border-radius: 20px;
    padding: 1.75rem;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.04);
  }
  .docs-header {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 1rem;
    align-items: start;
    margin-bottom: 1.5rem;
    padding-bottom: 1.25rem;
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  }
  @media (max-width: 640px) {
    .docs-header { grid-template-columns: 1fr; }
  }
  .head-icon {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    background: linear-gradient(135deg, #10B981, #059669);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 16px rgba(16, 185, 129, 0.3);
  }
  .head-icon svg { width: 22px; height: 22px; }
  .docs-header h3 {
    font-size: 1.1rem;
    font-weight: 700;
    color: #0F1F1A;
    margin: 0 0 0.4rem;
  }
  .docs-header p {
    font-size: 0.82rem;
    line-height: 1.55;
    color: #4A4A4A;
    margin: 0;
  }
  .docs-header strong { color: #0F1F1A; }
  .req-inline { color: #B91C1C; font-weight: 700; }

  .docs-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  .doc-slot {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    background: #FAF7F2;
    border: 1px solid rgba(0, 0, 0, 0.04);
    border-radius: 14px;
    padding: 1rem;
    transition: all 0.2s;
  }
  .doc-slot.has-file {
    background: rgba(16, 185, 129, 0.04);
    border-color: rgba(16, 185, 129, 0.2);
  }
  .doc-slot.has-error {
    background: rgba(239, 68, 68, 0.04);
    border-color: rgba(239, 68, 68, 0.3);
  }
  .doc-info { display: flex; flex-direction: column; gap: 0.3rem; }
  .doc-title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .doc-num {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 38px;
    height: 22px;
    padding: 0 0.5rem;
    border-radius: 5px;
    background: rgba(16, 185, 129, 0.1);
    color: #065F46;
    font-size: 0.65rem;
    font-weight: 700;
    font-family: 'JetBrains Mono', monospace;
    letter-spacing: 0.05em;
  }
  .doc-info h4 {
    font-size: 0.92rem;
    font-weight: 700;
    color: #0F1F1A;
    margin: 0;
  }
  .doc-desc {
    font-size: 0.78rem;
    line-height: 1.5;
    color: #6B6B6B;
    margin: 0;
    padding-left: 46px;
  }
  @media (max-width: 640px) {
    .doc-desc { padding-left: 0; }
  }

  .drop-zone {
    display: block;
    border: 2px dashed rgba(16, 185, 129, 0.3);
    border-radius: 10px;
    background: white;
    padding: 1.25rem 1rem;
    cursor: pointer;
    transition: all 0.2s;
  }
  .drop-zone:hover {
    border-color: rgba(16, 185, 129, 0.5);
    background: rgba(16, 185, 129, 0.03);
  }
  .doc-slot.dragging .drop-zone {
    border-color: #10B981;
    background: rgba(16, 185, 129, 0.08);
    border-style: solid;
  }
  .drop-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    text-align: center;
  }
  .upload-icon {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    background: rgba(16, 185, 129, 0.1);
    color: #10B981;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .upload-icon svg { width: 22px; height: 22px; }
  .drop-primary {
    font-size: 0.85rem;
    color: #1A1A1A;
    margin: 0;
  }
  .drop-primary strong { color: #065F46; }
  .drop-secondary {
    font-size: 0.72rem;
    color: #6B6B6B;
    margin: 0;
  }

  .file-loaded {
    display: flex;
    align-items: center;
    gap: 0.85rem;
    background: white;
    border-radius: 10px;
    padding: 0.85rem;
  }
  .file-preview {
    width: 64px;
    height: 64px;
    border-radius: 10px;
    background: #FAF7F2;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .file-preview img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .pdf-icon, .file-icon {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #B91C1C;
  }
  .pdf-icon svg, .file-icon svg { width: 32px; height: 32px; }
  .file-info { flex: 1; min-width: 0; }
  .file-name {
    font-size: 0.85rem;
    font-weight: 600;
    color: #0F1F1A;
    margin: 0 0 0.2rem;
    word-break: break-all;
  }
  .file-meta {
    font-size: 0.72rem;
    color: #6B6B6B;
    margin: 0 0 0.5rem;
  }
  .file-actions {
    display: flex;
    gap: 0.4rem;
  }
  .btn-replace, .btn-remove {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.3rem 0.7rem;
    border-radius: 6px;
    font-size: 0.72rem;
    font-weight: 600;
    cursor: pointer;
    border: 1px solid transparent;
    transition: all 0.2s;
    font-family: 'Inter Tight', system-ui, sans-serif;
  }
  .btn-replace {
    background: white;
    color: #065F46;
    border-color: rgba(16, 185, 129, 0.3);
  }
  .btn-replace:hover {
    background: rgba(16, 185, 129, 0.08);
    border-color: #10B981;
  }
  .btn-remove {
    background: white;
    color: #B91C1C;
    border-color: rgba(239, 68, 68, 0.2);
  }
  .btn-remove:hover {
    background: rgba(239, 68, 68, 0.08);
    border-color: #FCA5A5;
  }
  .btn-remove svg { width: 12px; height: 12px; }

  .error-msg {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.78rem;
    color: #991B1B;
    background: rgba(239, 68, 68, 0.08);
    padding: 0.5rem 0.75rem;
    border-radius: 8px;
    margin: 0;
  }
  .error-msg svg { width: 14px; height: 14px; flex-shrink: 0; }
</style>
