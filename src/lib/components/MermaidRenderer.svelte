<script lang="ts">
	let { code = '' }: { code: string } = $props();
	let container: HTMLDivElement | null = $state(null);
	let error = $state('');

	let zoomScale = $state(1);
	let isFullscreen = $state(false);

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

	function zoomIn() {
		if (zoomScale < 3) zoomScale = parseFloat((zoomScale + 0.25).toFixed(2));
	}

	function zoomOut() {
		if (zoomScale > 0.5) zoomScale = parseFloat((zoomScale - 0.25).toFixed(2));
	}

	function resetZoom() {
		zoomScale = 1;
	}

	function toggleFullscreen() {
		isFullscreen = !isFullscreen;
		if (!isFullscreen) {
			zoomScale = 1;
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape' && isFullscreen) {
			isFullscreen = false;
			zoomScale = 1;
		}
	}

	$effect(() => {
		if (code && container) {
			renderChart();
		}
	});
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="mermaid-container" class:fullscreen={isFullscreen}>
	<div class="mermaid-controls">
		<button class="control-btn" onclick={zoomOut} title="Zoom Out" aria-label="Zoom Out">-</button>
		<span class="zoom-level">{Math.round(zoomScale * 100)}%</span>
		<button class="control-btn" onclick={zoomIn} title="Zoom In" aria-label="Zoom In">+</button>
		<button class="control-btn reset-btn" onclick={resetZoom} title="Reset Zoom" aria-label="Reset Zoom">Reset</button>
		<button class="control-btn icon-btn" onclick={toggleFullscreen} title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"} aria-label="Toggle Fullscreen">
			{#if isFullscreen}
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3v3a2 2 0 0 1-2 2H3"/><path d="M21 8h-3a2 2 0 0 1-2-2V3"/><path d="M3 16h3a2 2 0 0 1 2 2v3"/><path d="M16 21v-3a2 2 0 0 1 2-2h3"/></svg>
			{:else}
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/></svg>
			{/if}
		</button>
	</div>

	{#if error}
		<div class="mermaid-error">
			<pre>{code}</pre>
			<p>{error}</p>
		</div>
	{:else}
		<div class="mermaid-scroll-area">
			<div 
				bind:this={container} 
				class="mermaid-wrapper" 
				style="transform: scale({zoomScale}); transform-origin: center top;"
			></div>
		</div>
	{/if}
</div>

<style>
	.mermaid-container {
		position: relative;
		width: 100%;
		overflow: hidden;
		margin: 1.5rem 0;
		padding: 1rem;
		background: var(--bg-secondary, rgba(0, 0, 0, 0.02));
		border-radius: 8px;
		border: 1px solid var(--border-color, #e2e8f0);
		transition: background-color 0.2s ease;
	}

	.mermaid-container.fullscreen {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		width: 100vw;
		height: 100vh;
		z-index: 9999;
		margin: 0;
		border-radius: 0;
		border: none;
		background: var(--bg-primary, #ffffff);
		display: flex;
		flex-direction: column;
		padding: 2rem 1rem 1rem 1rem;
	}

	.mermaid-controls {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		gap: 0.35rem;
		margin-bottom: 0.75rem;
		user-select: none;
	}

	.control-btn {
		background: var(--bg-primary, #ffffff);
		border: 1px solid var(--border-color, #cbd5e1);
		color: var(--text-primary, #1e293b);
		padding: 0.25rem 0.5rem;
		border-radius: 4px;
		font-size: 0.85rem;
		font-weight: 500;
		cursor: pointer;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-width: 28px;
		height: 28px;
		transition: all 0.15s ease;
	}

	.control-btn:hover {
		background: var(--bg-secondary, #f1f5f9);
		border-color: var(--text-secondary, #94a3b8);
	}

	.zoom-level {
		font-size: 0.8rem;
		font-family: monospace;
		padding: 0 0.25rem;
		color: var(--text-secondary, #64748b);
		min-width: 42px;
		text-align: center;
	}

	.mermaid-scroll-area {
		width: 100%;
		overflow: auto;
		display: flex;
		justify-content: center;
		align-items: flex-start;
		padding: 1rem 0;
		flex: 1;
	}

	.mermaid-wrapper {
		display: flex;
		justify-content: center;
		align-items: center;
		transition: transform 0.2s ease-out;
	}

	.mermaid-wrapper :global(svg) {
		max-width: 100%;
		height: auto;
	}

	.fullscreen .mermaid-wrapper :global(svg) {
		max-width: none;
	}

	.mermaid-error {
		color: #e53e3e;
		font-family: monospace;
	}
</style>
