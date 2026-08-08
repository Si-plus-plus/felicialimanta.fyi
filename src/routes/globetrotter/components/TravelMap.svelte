<script lang="ts">
    import { onMount } from 'svelte';
    import * as d3geo from 'd3-geo';
    import { zoom as d3zoom, zoomIdentity } from 'd3-zoom';
    import { select } from 'd3-selection';
    import * as topojson from 'topojson-client';
    import worldData from '$lib/data/world.json';

    let { trips = [] } = $props<{ trips: any[] }>();
    
    let svg: SVGElement;
    let width = 800;
    let height = 500;
    
    const projection = d3geo.geoMercator()
        .scale(120)
        .translate([width / 2, height / 1.5]);

    const pathGenerator = d3geo.geoPath().projection(projection);
    
    let countries = $state<any[]>([]);
    let transform = $state(zoomIdentity);
    let zoomBehavior: any;

    onMount(() => {
        // @ts-ignore - topojson typings can be finicky
        const geojson = topojson.feature(worldData, worldData.objects.countries);
        countries = geojson.features;

        zoomBehavior = d3zoom()
            .scaleExtent([1, 8])
            .on('zoom', (e) => {
                transform = e.transform;
            });

        select(svg).call(zoomBehavior);
    });

    function zoomIn() {
        if (zoomBehavior && svg) {
            select(svg).transition().duration(500).call(zoomBehavior.scaleBy, 2);
        }
    }

    function zoomOut() {
        if (zoomBehavior && svg) {
            select(svg).transition().duration(500).call(zoomBehavior.scaleBy, 0.5);
        }
    }
</script>

<div class="map-container">
    <div class="map-control-panel">
        <button class="control-btn" onclick={zoomOut} aria-label="Zoom Out" title="Zoom Out">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
        </button>
        <div class="control-divider"></div>
        <button class="control-btn" onclick={zoomIn} aria-label="Zoom In" title="Zoom In">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
        </button>
    </div>
    <svg bind:this={svg} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
        <g transform={transform.toString()}>
            <g class="countries">
                {#each countries as country}
                    <path d={pathGenerator(country) || ''} class="country" />
                {/each}
            </g>
            <g class="markers">
                {#each trips as trip}
                    {@const coords = projection([trip.longitude, trip.latitude])}
                    {#if coords}
                        <circle cx={coords[0]} cy={coords[1]} r={4 / transform.k} class="marker" stroke-width={1.5 / transform.k} />
                        <text x={coords[0]} y={coords[1] - (8 / transform.k)} font-size={`${10 / transform.k}px`} class="marker-label" text-anchor="middle">{trip.city}</text>
                    {/if}
                {/each}
            </g>
        </g>
    </svg>
</div>

<style>
    .map-container {
        width: 100%;
        margin: 0 auto;
        border-radius: 0.5rem;
        overflow: hidden;
        background: var(--bg-primary);
        position: relative;
    }

    .map-control-panel {
        position: absolute;
        bottom: 1.5rem;
        right: 1.5rem;
        display: flex;
        align-items: center;
        background: var(--bg-primary);
        border: 1px solid var(--lines);
        border-radius: 24px;
        padding: 4px 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        z-index: 10;
        transition: all var(--transition-speed) ease;
    }

    :global([data-theme='dark']) .map-control-panel {
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
    }

    .control-btn {
        background: transparent;
        border: none;
        color: var(--text-primary);
        cursor: pointer;
        padding: 6px 8px;
        opacity: 0.5;
        transition: all var(--transition-speed) ease;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .control-btn:hover {
        color: var(--accent);
        opacity: 1;
    }

    .control-divider {
        width: 1px;
        height: 14px;
        background-color: var(--lines);
        margin: 0 4px;
    }
    
    svg {
        width: 100%;
        height: auto;
        display: block;
        cursor: grab;
    }

    svg:active {
        cursor: grabbing;
    }

    .country {
        fill: var(--bg-primary);
        stroke: var(--text-primary);
        stroke-opacity: 0.2;
        stroke-width: 0.5;
        transition: fill var(--transition-speed) ease, stroke var(--transition-speed) ease;
    }

    .marker {
        fill: var(--accent);
        stroke: var(--bg-primary);
        transition: fill var(--transition-speed) ease;
    }

    .marker-label {
        fill: var(--text-primary);
        font-weight: 500;
        pointer-events: none;
        opacity: 0.8;
    }
</style>
