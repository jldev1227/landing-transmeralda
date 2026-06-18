<script lang="ts">
	/**
	 * SmartImage — Loads AVIF first, then WebP fallback.
	 * Uses master files (no responsive variants) for simplicity.
	 */
	type Props = {
		src: string; // e.g. /images/capacidades/localizacion-tiempo-real.avif
		alt: string;
		width?: number;
		height?: number;
		loading?: 'lazy' | 'eager';
		fetchpriority?: 'high' | 'low' | 'auto';
		class?: string;
	};

	let {
		src,
		alt,
		width,
		height,
		loading = 'lazy',
		fetchpriority = 'auto',
		class: className = ''
	}: Props = $props();

	// Derive base name (strips any .jpg/.png/.webp/.avif extension)
	const base = src.replace(/\.(jpe?g|png|webp|avif)$/i, '');

	const avifSrc = `${base}.avif`;
	const webpSrc = `${base}.webp`;
</script>

<picture class={className}>
	<source srcset={avifSrc} type="image/avif" />
	<source srcset={webpSrc} type="image/webp" />
	<img
		src={webpSrc}
		{alt}
		{width}
		{height}
		{loading}
		decoding="async"
		fetchpriority={fetchpriority}
	/>
</picture>
