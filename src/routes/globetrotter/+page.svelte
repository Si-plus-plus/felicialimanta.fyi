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
        <h1>Globetrotter</h1>
        <p class="subtitle">A visual history of my travels, ICPC competitions, and professional milestones around the world.</p>
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
        max-width: 1000px;
        margin: 0 auto;
        padding: 2rem 0;
        animation: fadeIn 0.5s ease-out;
    }

    .page-header {
        margin-bottom: 3rem;
        text-align: center;
    }

    h1 {
        font-size: 3.5rem;
        margin-bottom: 0.5rem;
        background: linear-gradient(135deg, #fff, #9d4edd);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }
    
    :global([data-theme='light']) h1 {
        background: linear-gradient(135deg, #111, #7b2cbf);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }

    .subtitle {
        color: var(--text-muted, #aaa);
        font-size: 1.125rem;
        max-width: 600px;
        margin: 0 auto;
    }
    
    :global([data-theme='light']) .subtitle {
        color: #666;
    }

    .history-section {
        margin-top: 4rem;
    }

    h2 {
        font-size: 2rem;
        margin-bottom: 1.5rem;
        color: var(--text-color, #fff);
    }
    
    :global([data-theme='light']) h2 {
        color: #111;
    }

    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
</style>
