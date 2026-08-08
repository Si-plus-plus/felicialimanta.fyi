<script lang="ts">
    let { allTrips = [], selectedIndex = $bindable(0) } = $props<{ allTrips: any[], selectedIndex: number }>();
    
    let uniquePeriods = $derived([...new Set(allTrips.map(t => t.period))].sort());
</script>

<div class="timeline-controls">
    <div class="slider-container">
        <input 
            type="range" 
            min="0" 
            max={Math.max(0, uniquePeriods.length - 1)} 
            bind:value={selectedIndex} 
            class="timeline-slider"
        />
        <div class="period-display">
            {#if uniquePeriods.length > 0}
                {uniquePeriods[selectedIndex] || ''}
            {:else}
                No trips
            {/if}
        </div>
    </div>
</div>

<style>
    .timeline-controls {
        display: flex;
        align-items: center;
        padding: 1.5rem;
        background: var(--bg-primary);
        border-radius: 0.75rem;
        margin: 2rem 0;
    }

    .slider-container {
        flex-grow: 1;
        display: flex;
        align-items: center;
        gap: 1.5rem;
    }

    .timeline-slider {
        -webkit-appearance: none;
        flex-grow: 1;
        height: 6px;
        background: var(--lines);
        border-radius: 4px;
        outline: none;
    }

    .timeline-slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: var(--accent);
        cursor: pointer;
        transition: transform 0.1s;
    }

    .timeline-slider::-webkit-slider-thumb:hover {
        transform: scale(1.2);
    }

    .period-display {
        font-weight: 600;
        font-size: 1rem;
        color: var(--accent);
        min-width: 60px;
        text-align: right;
    }
</style>
