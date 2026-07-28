<script lang="ts">
	let { 
		code = '',
		initialScale = 1,
		minWidth = '',
		minHeight = ''
	}: { 
		code: string;
		initialScale?: number;
		minWidth?: string;
		minHeight?: string;
	} = $props();

	let inlineContainer: HTMLDivElement | null = $state(null);
	let modalContainer: HTMLDivElement | null = $state(null);
	let error = $state('');

	// svelte-ignore state_referenced_locally
	let zoomScale = $state(initialScale);
	let isFullscreen = $state(false);

	let backdropMouseDownTarget: EventTarget | null = $state(null);

	function portal(node: HTMLElement) {
		document.body.appendChild(node);
		return {
			destroy() {
				if (node.parentNode) {
					node.parentNode.removeChild(node);
				}
			}
		};
	}

	function handleBackdropMouseDown(e: MouseEvent) {
		backdropMouseDownTarget = e.target;
	}

	function handleBackdropClick(e: MouseEvent) {
		if (
			e.target === e.currentTarget && 
			backdropMouseDownTarget === e.currentTarget
		) {
			toggleFullscreen();
		}
		backdropMouseDownTarget = null;
	}

	function pan(node: HTMLElement) {
		let isMouseDown = false;
		let startX = 0;
		let startY = 0;
		let scrollLeft = 0;
		let scrollTop = 0;

		function onMouseDown(e: MouseEvent) {
			if (e.button !== 0) return;
			isMouseDown = true;
			node.classList.add('is-dragging');
			startX = e.clientX;
			startY = e.clientY;
			scrollLeft = node.scrollLeft;
			scrollTop = node.scrollTop;
		}

		function onMouseMove(e: MouseEvent) {
			if (!isMouseDown) return;
			e.preventDefault();
			const dx = e.clientX - startX;
			const dy = e.clientY - startY;
			node.scrollLeft = scrollLeft - dx;
			node.scrollTop = scrollTop - dy;
		}

		function onMouseUp() {
			if (isMouseDown) {
				isMouseDown = false;
				node.classList.remove('is-dragging');
			}
		}

		node.addEventListener('mousedown', onMouseDown);
		window.addEventListener('mousemove', onMouseMove);
		window.addEventListener('mouseup', onMouseUp);

		return {
			destroy() {
				node.removeEventListener('mousedown', onMouseDown);
				window.removeEventListener('mousemove', onMouseMove);
				window.removeEventListener('mouseup', onMouseUp);
			}
		};
	}

	function wheelZoom(node: HTMLElement) {
		function onWheel(e: WheelEvent) {
			if (e.ctrlKey || e.metaKey) {
				e.preventDefault();
				if (e.deltaY < 0) {
					zoomIn();
				} else if (e.deltaY > 0) {
					zoomOut();
				}
			}
		}

		node.addEventListener('wheel', onWheel, { passive: false });

		return {
			destroy() {
				node.removeEventListener('wheel', onWheel);
			}
		};
	}

	async function renderChart(target: HTMLDivElement | null, idSuffix: string) {
		if (!code || !target) return;
		try {
			const mermaid = (await import('mermaid')).default;
			mermaid.initialize({
				startOnLoad: false,
				theme: 'neutral',
				securityLevel: 'loose'
			});
			const renderId = `mermaid-${Math.random().toString(36).substring(2, 9)}-${idSuffix}`;
			const { svg } = await mermaid.render(renderId, code);
			if (target) {
				target.innerHTML = svg;
				error = '';
			}
		} catch (e: any) {
			console.error('Mermaid render error:', e);
			error = e?.message || 'Failed to render Mermaid chart';
		}
	}

	function zoomIn() {
		if (zoomScale < 10) zoomScale = parseFloat((zoomScale + 0.25).toFixed(2));
	}

	function zoomOut() {
		if (zoomScale > 0.25) zoomScale = parseFloat((zoomScale - 0.25).toFixed(2));
	}

	function resetZoom() {
		zoomScale = initialScale;
	}

	function toggleFullscreen() {
		isFullscreen = !isFullscreen;
		if (!isFullscreen) {
			zoomScale = initialScale;
			document.body.style.overflow = '';
			document.documentElement.style.overflow = '';
			document.documentElement.style.scrollbarGutter = '';
		} else {
			document.body.style.overflow = 'hidden';
			document.documentElement.style.overflow = 'hidden';
			document.documentElement.style.scrollbarGutter = 'auto';
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape' && isFullscreen) {
			toggleFullscreen();
		}
	}

	$effect(() => {
		if (code && inlineContainer) {
			renderChart(inlineContainer, 'inline');
		}
	});

	$effect(() => {
		if (isFullscreen && code && modalContainer) {
			renderChart(modalContainer, 'modal');
		}
	});
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="mermaid-container">
	<div class="mermaid-controls inline-controls">
		<button class="control-btn" onclick={zoomOut} title="Zoom Out" aria-label="Zoom Out">-</button>
		<span class="zoom-level">{Math.round(zoomScale * 100)}%</span>
		<button class="control-btn" onclick={zoomIn} title="Zoom In" aria-label="Zoom In">+</button>
		<button class="control-btn reset-btn" onclick={resetZoom} title="Reset Zoom" aria-label="Reset Zoom">Reset</button>
		<button class="control-btn icon-btn" onclick={toggleFullscreen} title="Fullscreen Modal" aria-label="Open Fullscreen Modal">
			<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/></svg>
		</button>
	</div>

	{#if error}
		<div class="mermaid-error">
			<pre>{code}</pre>
			<p>{error}</p>
		</div>
	{:else}
		<div use:pan use:wheelZoom class="mermaid-scroll-area">
			<div 
				class="mermaid-scalable-outer" 
				style="width: calc(({minWidth || '100%'}) * {zoomScale});"
			>
				<div 
					bind:this={inlineContainer} 
					class="mermaid-wrapper" 
					style="transform: scale({zoomScale}); transform-origin: 0 0; width: {minWidth || '100%'}; {minHeight ? `min-height: ${minHeight};` : ''}"
				></div>
			</div>
		</div>
	{/if}
</div>

{#if isFullscreen}
	<div 
		use:portal
		class="mermaid-modal-backdrop"
		onmousedown={handleBackdropMouseDown}
		onclick={handleBackdropClick}
		role="button"
		tabindex="0"
		onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggleFullscreen(); }}
	>
		<div class="mermaid-modal-content">
			<div class="mermaid-modal-header">
				<div class="modal-title-group">
					<span class="modal-title">Chart View</span>
					<span class="zoom-hint">Ctrl + Scroll to zoom • mouse drag to pan</span>
				</div>
				<div class="mermaid-controls">
					<button class="control-btn" onclick={zoomOut} title="Zoom Out" aria-label="Zoom Out">-</button>
					<span class="zoom-level">{Math.round(zoomScale * 100)}%</span>
					<button class="control-btn" onclick={zoomIn} title="Zoom In" aria-label="Zoom In">+</button>
					<button class="control-btn reset-btn" onclick={resetZoom} title="Reset Zoom" aria-label="Reset Zoom">Reset</button>
					<button class="control-btn icon-btn close-btn" onclick={toggleFullscreen} title="Close Fullscreen" aria-label="Close Fullscreen">
						<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
					</button>
				</div>
			</div>
			<div use:pan use:wheelZoom class="mermaid-modal-body">
				<div 
					class="mermaid-scalable-outer" 
					style="width: calc(({minWidth || '100%'}) * {zoomScale});"
				>
					<div 
						bind:this={modalContainer} 
						class="mermaid-wrapper" 
						style="transform: scale({zoomScale}); transform-origin: 0 0; width: {minWidth || '100%'};"
					></div>
				</div>
			</div>
		</div>
	</div>
{/if}

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

	.mermaid-controls {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		gap: 0.35rem;
		user-select: none;
		flex-shrink: 0;
	}

	.inline-controls {
		width: 100%;
		margin-bottom: 0.75rem;
	}

	.modal-title-group {
		display: flex;
		align-items: center;
		gap: 1rem;
		min-width: 0;
		flex-shrink: 1;
	}

	.modal-title {
		font-weight: 600;
		font-size: 0.95rem;
		color: var(--text-primary, #0f172a);
		white-space: nowrap;
	}

	.zoom-hint {
		font-size: 0.75rem;
		color: var(--text-secondary, #64748b);
		opacity: 0.8;
		user-select: none;
		white-space: nowrap;
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
		min-width: 52px;
		text-align: center;
	}

	.mermaid-scroll-area {
		width: 100%;
		overflow: auto;
		padding: 1rem 0;
		flex: 1;
		cursor: grab;
		user-select: none;
	}

	.mermaid-scalable-outer {
		margin: 0 auto;
		box-sizing: content-box;
		position: relative;
	}

	.mermaid-wrapper {
		display: flex;
		justify-content: center;
		align-items: center;
		transition: transform 0.2s ease-out;
	}

	.mermaid-wrapper :global(svg) {
		width: 100%;
		height: auto;
	}

	.mermaid-error {
		color: #e53e3e;
		font-family: monospace;
	}

	.mermaid-modal-backdrop {
		position: fixed;
		inset: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.65);
		backdrop-filter: blur(4px);
		z-index: 99999;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1.5rem;
		box-sizing: border-box;
		margin: 0 !important;
	}

	.mermaid-modal-content {
		background: var(--bg-primary, #ffffff);
		border-radius: 12px;
		width: 100%;
		max-width: 1200px;
		height: 85vh;
		display: flex;
		flex-direction: column;
		overflow: hidden;
		box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.2);
		border: 1px solid var(--border-color, #cbd5e1);
		margin: 0 !important;
	}

	.mermaid-modal-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.75rem 1.25rem;
		border-bottom: 1px solid var(--border-color, #e2e8f0);
		background: var(--bg-secondary, #f8fafc);
		gap: 1rem;
	}

	.mermaid-modal-body {
		flex: 1;
		overflow: auto;
		padding: 1.5rem;
		background: var(--bg-primary, #ffffff);
		cursor: grab;
		user-select: none;
	}

	.mermaid-scroll-area:active,
	.mermaid-modal-body:active,
	:global(.mermaid-scroll-area.is-dragging),
	:global(.mermaid-modal-body.is-dragging) {
		cursor: grabbing;
	}

	.close-btn {
		background: transparent;
		border: none;
		color: var(--text-primary, #0f172a);
		margin-left: 0.5rem;
	}
	
	.close-btn:hover {
		background: rgba(0, 0, 0, 0.08);
	}
</style>
