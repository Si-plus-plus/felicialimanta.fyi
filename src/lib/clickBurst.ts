/**
 * Svelte action to add a purple 4-line click burst effect.
 * Only applies if the user does not prefer reduced motion.
 */
export function clickBurst(node: HTMLElement) {
	function handleClick(event: MouseEvent) {
		// Respect user preferences for reduced motion
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			return;
		}

		const x = event.clientX;
		const y = event.clientY;

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

		// Clean up after the fast fade duration (180ms matches CSS animation)
		setTimeout(() => {
			burst.remove();
		}, 180);
	}

	node.addEventListener('click', handleClick);

	return {
		destroy() {
			node.removeEventListener('click', handleClick);
		}
	};
}
