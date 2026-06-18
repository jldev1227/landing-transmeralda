<script lang="ts">
	/**
	 * SmartImage — Loads AVIF first, then WebP fallback.
	 * Uses responsive srcset with 320/640/1024/1600/1920 sizes.
	 */
	type Props = {
		src: string; // e.g. /images/capacidades/localizacion-tiempo-real.avif
		alt: string;
		width?: number;
		height?: number;
		loading?: 'lazy' | 'eager';
		fetchpriority?: 'high' | 'low' | 'auto';
		class?: string;
		sizes?: string;
	};

	let {
		src,
		alt,
		width,
		height,
		loading = 'lazy',
		fetchpriority = 'auto',
		class: className = '',
		sizes = '(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw'
	}: Props = $props();

	// Derive base name (strips any .jpg/.png/.webp/.avif extension)
	const base = src.replace(/\.(jpe?g|png|webp|avif)$/i, '');

	// Responsive variants: 320, 640, 1024, 1600, 1920
	const avif320 = `${base}-320.avif`;
	const avif640 = `${base}-640.avif`;
	const avif1024 = `${base}-1024.avif`;
	const avif1600 = `${base}-1600.avif`;
	const avif1920 = `${base}-1920.avif`;
	const webp320 = `${base}-320.webp`;
	const webp640 = `${base}-640.webp`;
	const webp1024 = `${base}-1024.webp`;
	const webp1600 = `${base}-1600.webp`;
	const webp1920 = `${base}-1920.webp`;

	// Final fallback is the master WebP
	const fallbackSrc = `${base}.webp`;
</script>

<picture class={className}>
	<source
		type="image/avif"
		srcset={`${avif320} 320w, ${avif640} 640w, ${avif1024} 1024w, ${avif1600} 1600w, ${avif1920} 1920w`}
		{sizes}
	/>
	<source
		type="image/webp"
		srcset={`${webp320} 320w, ${webp640} 640w, ${webp1024} 1024w, ${webp1600} 1600w, ${webp1920} 1920w`}
		{sizes}
	/>
	<img
		src={fallbackSrc}
		{alt}
		{width}
		{height}
		{loading}
		decoding="async"
		fetchpriority={fetchpriority}
	/>
</picture>
