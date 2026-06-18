<script lang="ts">
	/**
	 * SmartImage — AVIF + WebP with responsive srcset.
	 * Class is applied to <img> (not <picture>) for reliable CSS targeting.
	 */
	type Props = {
		src: string;
		alt: string;
		width?: number;
		height?: number;
		loading?: 'lazy' | 'eager';
		fetchpriority?: 'high' | 'low' | 'auto';
		class?: string;
		sizes?: string;
		fit?: 'cover' | 'contain';
	};

	let {
		src,
		alt,
		width,
		height,
		loading = 'lazy',
		fetchpriority = 'auto',
		class: className = '',
		sizes = '(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw',
		fit = 'cover'
	}: Props = $props();

	const base = src.replace(/\.(jpe?g|png|webp|avif)$/i, '');

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

	const fallbackSrc = `${base}.webp`;
	const fitClass = fit === 'contain' ? 'smart-img--contain' : 'smart-img--cover';
</script>

<picture>
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
		class={`smart-img ${fitClass} ${className}`}
	/>
</picture>

<style>
	.smart-img {
		display: block;
		max-width: 100%;
		height: auto;
	}
	.smart-img--cover {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	.smart-img--contain {
		width: 100%;
		height: 100%;
		object-fit: contain;
	}
</style>
