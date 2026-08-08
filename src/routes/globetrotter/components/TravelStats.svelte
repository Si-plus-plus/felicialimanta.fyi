<script lang="ts">
    let { trips = [] } = $props<{ trips: any[] }>();

    let stats = $derived(() => {
        const uniqueContinents = new Set(trips.map(t => t.continent));
        const uniqueCountries = new Set(trips.map(t => t.country));
        const uniqueCities = new Set(trips.map(t => t.city));
        
        return {
            trips: trips.length,
            cities: uniqueCities.size,
            countries: uniqueCountries.size,
            continents: uniqueContinents.size
        };
    });
</script>

<div class="stats-grid">
    <div class="stat-card">
        <span class="stat-value">{stats().trips}</span>
        <span class="stat-label">Trips</span>
    </div>
    <div class="stat-card">
        <span class="stat-value">{stats().cities}</span>
        <span class="stat-label">Cities</span>
    </div>
    <div class="stat-card">
        <span class="stat-value">{stats().countries}</span>
        <span class="stat-label">Countries</span>
    </div>
    <div class="stat-card">
        <span class="stat-value">{stats().continents}</span>
        <span class="stat-label">Continents</span>
    </div>
</div>

<style>
    .stats-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 1rem;
        margin: 2rem 0;
    }
    
    @media (max-width: 600px) {
        .stats-grid {
            grid-template-columns: repeat(2, 1fr);
        }
    }

    .stat-card {
        background: var(--bg-primary);
        border-radius: 0.5rem;
        padding: 1.5rem 1rem;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        transition: transform var(--transition-speed) ease;
    }

    .stat-card:hover {
        transform: translateY(-2px);
    }

    .stat-value {
        font-size: 2.25rem;
        font-weight: 500;
        color: var(--accent);
        line-height: 1.2;
        margin-bottom: 0.25rem;
    }

    .stat-label {
        font-size: 0.75rem;
        color: var(--text-primary);
        opacity: 0.7;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        font-weight: 500;
        white-space: nowrap;
    }
</style>
