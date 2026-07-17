/**
 * Triggers a purple 4-line click burst effect at the specified coordinates.
 */
export function triggerClickBurst(x: number, y: number) {
	console.log('triggerClickBurst: click detected at coordinate', { x, y });

	const burst = document.createElement('div');
	burst.className = 'burst-container';
	burst.style.left = `${x}px`;
	burst.style.top = `${y}px`;

	const directions = ['n', 's', 'e', 'w'];
	directions.forEach((dir) => {
		const line = document.createElement('div');
		line.className = `burst-line ${dir === 'n' || dir === 's' ? 'v' : 'h'} ${dir}`;
		burst.appendChild(line);
	});

	document.body.appendChild(burst);
	console.log('triggerClickBurst: appended burst element to document body', burst);

	// Clean up after the fast fade duration (180ms matches CSS animation)
	setTimeout(() => {
		burst.remove();
		console.log('triggerClickBurst: removed burst element from DOM');
	}, 180);
}

/**
 * Svelte action fallback to add click burst to specific elements.
 */
export function clickBurst(node: HTMLElement) {
	function handleClick(event: MouseEvent) {
		triggerClickBurst(event.clientX, event.clientY);
	}

	node.addEventListener('click', handleClick);

	return {
		destroy() {
			node.removeEventListener('click', handleClick);
		}
	};
}
