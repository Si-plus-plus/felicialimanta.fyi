<script lang="ts">
    import TravelMap from './components/TravelMap.svelte';
    import TravelStats from './components/TravelStats.svelte';
    import TimelineControls from './components/TimelineControls.svelte';
    import HistoryTable from './components/HistoryTable.svelte';
    import travelData from '$lib/data/travelData.json';

    let allTrips = travelData;
    let uniquePeriods = [...new Set(allTrips.map(t => t.period))].sort();
    
    let selectedIndex = $state(uniquePeriods.length - 1);
    
    let filteredTrips = $derived(() => {
        if (uniquePeriods.length === 0) return [];
        const currentPeriod = uniquePeriods[selectedIndex];
        // Show all trips up to the selected period
        return allTrips.filter(t => t.period <= currentPeriod);
    });
</script>

<svelte:head>
    <title>Globetrotter - felicialimanta.fyi</title>
    <meta name="description" content="A dynamic visual history of my global travels and professional milestones." />
</svelte:head>

<div class="globetrotter-page">
    <header class="page-header">
        <h1 class="page-title">Globetrotter</h1>
        <p class="subtitle">A visual history of my official professional travels around the world. Inspired by <a href="https://www.comp.nus.edu.sg/~stevenha/globetrotter.html">Steven Halim's globetrotter page</a>.</p>
    </header>

    <TravelMap trips={filteredTrips()} />
    
    <TimelineControls {allTrips} bind:selectedIndex />
    
    <TravelStats trips={filteredTrips()} />
    
    <section class="history-section">
        <h2>Travel Log</h2>
        <HistoryTable trips={filteredTrips()} />
    </section>
</div>

<style>
    .globetrotter-page {
        padding: 0;
        animation: fadeIn 0.4s ease-out;
    }

    .page-header {
        margin-bottom: 32px;
    }

    .subtitle {
        color: var(--text-primary);
        opacity: 0.8;
        font-size: 1rem;
        line-height: 1.6;
        margin: 0 0 32px 0;
    }

    .history-section {
        margin-top: 40px;
    }

    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(4px); }
        to { opacity: 1; transform: translateY(0); }
    }
</style>
