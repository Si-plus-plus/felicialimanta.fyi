<script lang="ts">
    import { onMount } from 'svelte';
    import * as d3 from 'd3-geo';
    import * as topojson from 'topojson-client';
    import worldData from '$lib/data/world.json';

    let { trips = [] } = $props<{ trips: any[] }>();
    
    let svg: SVGElement;
    let width = 800;
    let height = 500;
    
    const projection = d3.geoMercator()
        .scale(120)
        .translate([width / 2, height / 1.5]);

    const pathGenerator = d3.geoPath().projection(projection);
    
    let countries = $state<any[]>([]);

    onMount(() => {
        // @ts-ignore - topojson typings can be finicky
        const geojson = topojson.feature(worldData, worldData.objects.countries);
        countries = geojson.features;
    });
</script>

<div class="map-container">
    <svg bind:this={svg} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
        <g class="countries">
            {#each countries as country}
                <path d={pathGenerator(country) || ''} class="country" />
            {/each}
        </g>
        <g class="markers">
            {#each trips as trip}
                {@const coords = projection([trip.longitude, trip.latitude])}
                {#if coords}
                    <circle cx={coords[0]} cy={coords[1]} r="4" class="marker" />
                    <text x={coords[0]} y={coords[1] - 8} class="marker-label" text-anchor="middle">{trip.city}</text>
                {/if}
            {/each}
        </g>
    </svg>
</div>

<style>
    .map-container {
        width: 100%;
        max-width: 1000px;
        margin: 0 auto;
        border-radius: 1rem;
        overflow: hidden;
        background: var(--bg-surface, #1a1a1a);
        border: 1px solid var(--border-color, #333);
        box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    }
    
    svg {
        width: 100%;
        height: auto;
        display: block;
    }

    .country {
        fill: #2a2a2a; /* Dark gray for countries */
        stroke: #444;  /* Lighter gray borders */
        stroke-width: 0.5;
        transition: fill 0.3s ease;
    }

    /* Switch map colors if light mode */
    :global([data-theme='light']) .country {
        fill: #e0e0e0;
        stroke: #fff;
    }
    
    :global([data-theme='light']) .map-container {
        background: #f5f5f5;
        border-color: #ddd;
        box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    }

    .marker {
        fill: #9d4edd; /* Purple accent */
        stroke: #fff;
        stroke-width: 1.5;
        transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    .marker-label {
        fill: #fff;
        font-size: 10px;
        font-weight: 600;
        pointer-events: none;
        opacity: 0.8;
    }
    
    :global([data-theme='light']) .marker-label {
        fill: #333;
    }
</style>
