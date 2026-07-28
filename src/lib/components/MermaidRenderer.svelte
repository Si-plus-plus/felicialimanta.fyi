<script lang="ts">
	import { onMount } from 'svelte';

	let { code = '' }: { code: string } = $props();
	let container: HTMLDivElement | null = $state(null);
	let error = $state('');

	const renderId = `mermaid-${Math.random().toString(36).substring(2, 9)}`;

	async function renderChart() {
		if (!code || !container) return;
		try {
			const mermaid = (await import('mermaid')).default;
			mermaid.initialize({
				startOnLoad: false,
				theme: 'neutral',
				securityLevel: 'loose'
			});
			const { svg } = await mermaid.render(renderId, code);
			if (container) {
				container.innerHTML = svg;
				error = '';
			}
		} catch (e: any) {
			console.error('Mermaid render error:', e);
			error = e?.message || 'Failed to render Mermaid chart';
		}
	}

	$effect(() => {
		if (code && container) {
			renderChart();
		}
	});
</script>

<div class="mermaid-container">
	{#if error}
		<div class="mermaid-error">
			<pre>{code}</pre>
			<p>{error}</p>
		</div>
	{:else}
		<div bind:this={container} class="mermaid-wrapper"></div>
	{/if}
</div>

<style>
	.mermaid-container {
		width: 100%;
		overflow-x: auto;
		margin: 1.5rem 0;
		padding: 1rem;
		background: var(--bg-secondary, rgba(0, 0, 0, 0.02));
		border-radius: 8px;
		border: 1px solid var(--border-color, #e2e8f0);
	}

	.mermaid-wrapper {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.mermaid-wrapper :global(svg) {
		max-width: 100%;
		height: auto;
	}

	.mermaid-error {
		color: #e53e3e;
		font-family: monospace;
	}
</style>
