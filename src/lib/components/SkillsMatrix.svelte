<script lang="ts">
	import { slide } from 'svelte/transition';
	import { EVENTS, SKILLS, type SkillItem } from '../../routes/about/skillsData';

	let activeSkillId = $state<string | null>(null);
	let activeEventId = $state<string | null>(null);

	const categories = ['Leadership & Ops', 'Tech & Product', 'Design & Content', 'Community & Outreach'] as const;

	// Default all categories to collapsed (closed) by default
	let collapsedCategories = $state<Record<string, boolean>>({
		'Leadership & Ops': true,
		'Tech & Product': true,
		'Design & Content': true,
		'Community & Outreach': true
	});

	function toggleCategory(cat: string) {
		collapsedCategories[cat] = !collapsedCategories[cat];
	}

	function isSkillActiveInEvent(skill: SkillItem, eventId: string): boolean {
		return skill.events.includes(eventId);
	}

	function isCategoryActiveInEvent(cat: string, eventId: string): boolean {
		return SKILLS.filter((s) => s.category === cat).some((s) => s.events.includes(eventId));
	}

	function getSkillRange(skill: SkillItem) {
		const activeIndices = EVENTS.map((e, idx) => (skill.events.includes(e.id) ? idx : -1)).filter(
			(idx) => idx !== -1
		);
		if (activeIndices.length === 0) return { min: -1, max: -1 };
		return {
			min: Math.min(...activeIndices), // Leftmost active (newest)
			max: Math.max(...activeIndices) // Rightmost active (oldest)
		};
	}

	function handleSkillHover(skillId: string | null) {
		activeSkillId = skillId;
	}

	function handleEventHover(eventId: string | null) {
		activeEventId = eventId;
	}
</script>

<div class="skills-matrix-wrapper">
	<!--
	<div class="matrix-legend">
		<span class="legend-item"><span class="dot active">●</span> Skill Applied</span>
		<span class="legend-hint">Click category to expand details • Hover skill to trace timeline</span>
	</div>
	-->


	<div class="table-container">
		<table class="skills-table">
			<thead>
				<tr>
					<th class="sticky-col header-skill">Skills</th>
					{#each EVENTS as event, idx (event.id)}
						<th
							class="event-col-header"
							class:highlighted={activeEventId === event.id}
							onmouseenter={() => handleEventHover(event.id)}
							onmouseleave={() => handleEventHover(null)}
						>
							<div class="header-tooltip-wrapper">
								<div class="event-title-wrap">
									<div class="title-line">{event.line1}</div>
									{#if event.line2}
										<div class="title-line">{event.line2}</div>
									{/if}
								</div>
								<div class="event-years">{event.years}</div>
								<div
									class="header-tooltip"
									class:align-right={idx >= EVENTS.length - 4}
									class:align-left={idx <= 2}
								>
									{event.title} ({event.years})
								</div>
							</div>
						</th>
					{/each}
				</tr>
			</thead>
			<tbody>
				{#each categories as category}
					{@const isCollapsed = collapsedCategories[category]}
					<tr
						class="category-row"
						class:collapsed={isCollapsed}
						onclick={() => toggleCategory(category)}
					>
						<td class="sticky-col category-header">
							<div class="category-header-content">
								<svg
									class="chevron"
									class:rotated={!isCollapsed}
									viewBox="0 0 24 24"
									width="14"
									height="14"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
								>
									<polyline points="9 18 15 12 9 6"></polyline>
								</svg>
								<span class="category-title">{category}</span>
							</div>
						</td>
						{#each EVENTS as event (event.id)}
							{@const catActive = isCategoryActiveInEvent(category, event.id)}
							<td
								class="cell category-cell"
								class:col-highlighted={activeEventId === event.id}
							>
								{#if catActive}
									<span class="dot cat-dot active" title={`${category} active in ${event.title}`}>●</span>
								{:else}
									<span class="dot inactive">·</span>
								{/if}
							</td>
						{/each}
					</tr>

					{#if !isCollapsed}
						{#each SKILLS.filter((s) => s.category === category) as skill (skill.id)}
							{@const isHovered = activeSkillId === skill.id}
							{@const range = getSkillRange(skill)}
							<tr
								transition:slide={{ duration: 180 }}
								class="skill-row"
								class:highlighted={isHovered}
								onmouseenter={() => handleSkillHover(skill.id)}
								onmouseleave={() => handleSkillHover(null)}
							>
								<td class="sticky-col skill-name">
									<span class="skill-label">{skill.name}</span>
								</td>
								{#each EVENTS as event, idx (event.id)}
									{@const active = isSkillActiveInEvent(skill, event.id)}
									{@const inRange = idx >= range.min && idx <= range.max}
									{@const hasLeftLine = isHovered && inRange && idx > range.min}
									{@const hasRightLine = isHovered && inRange && idx < range.max}
									<td
										class="cell skill-cell"
										class:active-cell={active}
										class:col-highlighted={activeEventId === event.id}
									>
										{#if isHovered}
											{#if hasRightLine}
												<div class="arrow-dash-line line-right">
													<div class="chevron-stream"></div>
												</div>
											{/if}
											{#if hasLeftLine}
												<div class="arrow-dash-line line-left">
													<div class="chevron-stream"></div>
												</div>
											{/if}
										{/if}

										{#if active}
											<span class="dot active" title={`${skill.name} used in ${event.title}`}>●</span>
										{:else if isHovered && inRange}
											<span class="dot active dot-in-range" title={`${skill.name} timeline span`}>·</span>
										{:else}
											<span class="dot inactive">·</span>
										{/if}
									</td>
								{/each}
							</tr>
						{/each}
					{/if}
				{/each}
			</tbody>
		</table>
	</div>
</div>

<style>
	.skills-matrix-wrapper {
		margin: 24px 0 32px;
		width: 100%;
	}

	.matrix-legend {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 12px;
		font-size: 0.82rem;
		color: var(--text-primary);
		opacity: 0.75;
	}

	.legend-item {
		display: flex;
		align-items: center;
		gap: 6px;
	}

	.legend-hint {
		font-style: italic;
		font-size: 0.75rem;
		opacity: 0.7;
	}

	.table-container {
		width: 100%;
		overflow-x: auto;
		border: 1px solid var(--lines);
		border-radius: 8px;
		background: var(--bg-primary);
	}

	.skills-table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.82rem;
		text-align: center;
		min-width: 980px;
		table-layout: fixed;
	}

	th, td {
		padding: 6px 4px;
		border-bottom: 1px solid var(--lines);
		height: 42px;
		box-sizing: border-box;
	}

	/* Header Row Styling (Solid Light/Dark Grey Fill) */
	thead tr {
		background-color: #f3f4f6;
	}

	:root[data-theme='dark'] thead tr {
		background-color: #18181b;
	}

	/* Solid Opaque Sticky Left Column with Subtle Uniform Gradient Edge Overlay */
	.sticky-col {
		position: sticky;
		left: 0;
		background-color: var(--bg-primary) !important;
		z-index: 45;
		box-shadow: inset -1px -1px 0 var(--lines);
		width: 230px;
		min-width: 230px;
		max-width: 230px;
		white-space: normal;
		line-height: 1.25;
	}

	.sticky-col::after {
		content: '';
		position: absolute;
		top: 0;
		right: -6px;
		bottom: 0;
		width: 6px;
		background: linear-gradient(to right, rgba(0, 0, 0, 0.035), transparent);
		pointer-events: none;
		z-index: 48;
	}

	:root[data-theme='dark'] .sticky-col::after {
		background: linear-gradient(to right, rgba(0, 0, 0, 0.15), transparent);
	}

	thead th.sticky-col {
		z-index: 60;
		background-color: #f3f4f6 !important;
		vertical-align: bottom;
		padding-bottom: 10px;
		opacity: 1 !important;
	}

	thead th.sticky-col::after {
		z-index: 65;
	}

	:root[data-theme='dark'] thead th.sticky-col {
		background-color: #18181b !important;
	}

	.header-skill {
		font-weight: 600;
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		color: var(--text-primary);
		color: rgba(23, 23, 23, 0.65);
		padding-left: 12px;
	}

	:root[data-theme='dark'] .header-skill {
		color: rgba(250, 250, 250, 0.65);
	}

	.event-col-header {
		font-weight: 500;
		padding: 8px 4px;
		transition: background-color var(--transition-speed) ease;
		width: 75px;
		min-width: 75px;
		vertical-align: bottom;
		position: relative;
		z-index: 30;
	}

	.header-tooltip-wrapper {
		position: relative;
		cursor: help;
	}

	.event-title-wrap {
		font-weight: 600;
		font-size: 0.76rem;
		line-height: 1.2;
		white-space: normal;
		word-break: break-word;
	}

	.title-line {
		display: block;
	}

	.event-years {
		font-size: 0.68rem;
		opacity: 0.6;
		margin-top: 4px;
	}

	/* Smart Header Tooltip on Hover (Clean Border) */
	.header-tooltip {
		position: absolute;
		top: 100%;
		left: 50%;
		transform: translateX(-50%) translateY(4px);
		background-color: var(--text-primary);
		color: var(--bg-primary);
		padding: 6px 10px;
		border-radius: 4px;
		font-size: 0.72rem;
		max-width: 220px;
		white-space: normal;
		text-align: center;
		pointer-events: none;
		opacity: 0;
		visibility: hidden;
		transition: opacity 0.2s ease, transform 0.2s ease;
		border: 1px solid var(--lines);
		z-index: 50;
	}

	.header-tooltip.align-right {
		left: auto;
		right: 0;
		transform: translateY(4px);
	}

	.header-tooltip.align-left {
		left: 0;
		right: auto;
		transform: translateY(4px);
	}

	.header-tooltip-wrapper:hover .header-tooltip {
		opacity: 1;
		visibility: visible;
		transform: translateX(-50%) translateY(8px);
	}

	.header-tooltip-wrapper:hover .header-tooltip.align-right {
		transform: translateY(8px);
	}

	.header-tooltip-wrapper:hover .header-tooltip.align-left {
		transform: translateY(8px);
	}

	.category-row {
		background-color: #f8f9fa;
		cursor: pointer;
		user-select: none;
		transition: background-color var(--transition-speed) ease;
	}

	:root[data-theme='dark'] .category-row {
		background-color: #141416;
	}

	.category-row:hover {
		background-color: #f1f3f5;
	}

	:root[data-theme='dark'] .category-row:hover {
		background-color: #1c1c1f;
	}

	.category-row .sticky-col {
		background-color: #f8f9fa !important;
		z-index: 45;
	}

	:root[data-theme='dark'] .category-row .sticky-col {
		background-color: #141416 !important;
	}

	.category-row:hover .sticky-col {
		background-color: #f1f3f5 !important;
	}

	:root[data-theme='dark'] .category-row:hover .sticky-col {
		background-color: #1c1c1f !important;
	}

	.category-header {
		font-weight: 600;
		font-size: 0.78rem;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		color: var(--accent);
		padding: 8px 12px;
		vertical-align: middle;
	}

	.category-header-content {
		display: flex;
		align-items: center;
		gap: 8px;
		overflow: visible;
	}

	.chevron {
		transition: transform 0.25s ease;
		opacity: 0.8;
		flex-shrink: 0;
		color: var(--accent);
	}

	.chevron.rotated {
		transform: rotate(90deg);
	}

	.category-title {
		flex: 1;
		white-space: normal;
		line-height: 1.25;
	}

	.skill-row {
		transition: background-color var(--transition-speed) ease;
	}

	.skill-name {
		padding-left: 12px;
	}

	.skill-label {
		font-weight: 400;
		font-size: 0.70rem;
		white-space: normal;
		line-height: 1.25;
		display: block;
	}

	.skill-row.highlighted {
		background-color: rgba(79, 59, 120, 0.04);
	}

	:root[data-theme='dark'] .skill-row.highlighted {
		background-color: rgba(165, 146, 214, 0.08);
	}

	.skill-row.highlighted .sticky-col {
		color: var(--accent);
	}

	.cell {
		position: relative;
		transition: background-color var(--transition-speed) ease;
		vertical-align: middle;
	}

	.cell.col-highlighted {
		background-color: rgba(79, 59, 120, 0.03);
	}

	:root[data-theme='dark'] .cell.col-highlighted {
		background-color: rgba(165, 146, 214, 0.06);
	}

	.dot {
		display: inline-block;
		position: relative;
		z-index: 2;
		line-height: 1;
	}

	.dot.active {
		color: var(--accent);
		font-size: 0.95rem;
	}

	.dot-in-range {
		color: var(--accent);
		opacity: 0.5;
		font-size: 1rem;
	}

	.cat-dot.active {
		color: #9d8ec4;
		opacity: 0.7;
		font-size: 0.85rem;
	}

	:root[data-theme='dark'] .cat-dot.active {
		color: #c4b5fd;
		opacity: 0.75;
	}

	.dot.inactive {
		color: var(--lines);
		font-size: 0.85rem;
		opacity: 0.4;
	}

	/* Chevron Arrow Stream strictly bounded between dots: o < < < o */
	.arrow-dash-line {
		position: absolute;
		top: 50%;
		height: 8px;
		z-index: 1;
		transform: translateY(-50%);
		overflow: hidden;
		pointer-events: none;
	}

	.line-right {
		right: 0;
		width: 50%;
	}

	.line-left {
		left: 0;
		width: 50%;
	}

	.chevron-stream {
		width: 100%;
		height: 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='8' viewBox='0 0 10 8'%3E%3Cpath d='M7 1L3 4L7 7' fill='none' stroke='%234F3B78' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
		background-repeat: repeat-x;
		background-position: 0 center;
		animation: flowChevrons 0.8s linear infinite;
		opacity: 0.7;
	}

	:root[data-theme='dark'] .chevron-stream {
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='8' viewBox='0 0 10 8'%3E%3Cpath d='M7 1L3 4L7 7' fill='none' stroke='%23A592D6' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
	}

	@keyframes flowChevrons {
		from {
			background-position: 0 center;
		}
		to {
			background-position: -10px center;
		}
	}
</style>
