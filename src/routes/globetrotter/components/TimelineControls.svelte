<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    let { allTrips = [], selectedIndex = $bindable(0) } = $props<{ allTrips: any[], selectedIndex: number }>();
    
    let uniquePeriods = $derived([...new Set(allTrips.map(t => t.period))].sort());
    
    let isPlaying = $state(false);
    let interval: ReturnType<typeof setInterval>;

    function togglePlay() {
        isPlaying = !isPlaying;
        if (isPlaying) {
            if (selectedIndex >= uniquePeriods.length - 1) {
                selectedIndex = 0;
            }
            interval = setInterval(() => {
                if (selectedIndex < uniquePeriods.length - 1) {
                    selectedIndex++;
                } else {
                    isPlaying = false;
                    clearInterval(interval);
                }
            }, 800);
        } else {
            clearInterval(interval);
        }
    }

    $effect(() => {
        return () => clearInterval(interval);
    });
</script>

<div class="timeline-controls">
    <button class="play-btn" onclick={togglePlay} aria-label={isPlaying ? "Pause timeline" : "Play timeline"}>
        {#if isPlaying}
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
        {:else}
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
        {/if}
    </button>
    
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
        gap: 1.5rem;
        padding: 1.5rem;
        background: var(--bg-surface, #1e1e1e);
        border: 1px solid var(--border-color, #333);
        border-radius: 0.75rem;
        margin: 2rem 0;
    }
    
    :global([data-theme='light']) .timeline-controls {
        background: #fff;
        border-color: #eee;
    }

    .play-btn {
        background: #9d4edd;
        color: white;
        border: none;
        width: 48px;
        height: 48px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s ease;
        flex-shrink: 0;
    }

    .play-btn:hover {
        background: #7b2cbf;
        transform: scale(1.05);
    }

    .slider-container {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .timeline-slider {
        -webkit-appearance: none;
        width: 100%;
        height: 8px;
        background: #333;
        border-radius: 4px;
        outline: none;
    }
    
    :global([data-theme='light']) .timeline-slider {
        background: #e0e0e0;
    }

    .timeline-slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: #9d4edd;
        cursor: pointer;
        transition: transform 0.1s;
    }

    .timeline-slider::-webkit-slider-thumb:hover {
        transform: scale(1.2);
    }

    .period-display {
        text-align: right;
        font-weight: 700;
        font-size: 1.125rem;
        color: #9d4edd;
    }
</style>
