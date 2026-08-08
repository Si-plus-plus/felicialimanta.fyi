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
        <span class="stat-label">Total Trips</span>
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
        grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
        gap: 1rem;
        margin: 2rem 0;
    }

    .stat-card {
        background: var(--bg-surface, #1e1e1e);
        border: 1px solid var(--border-color, #333);
        border-radius: 0.75rem;
        padding: 1.5rem;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .stat-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(157, 78, 221, 0.15); /* subtle purple glow */
    }

    .stat-value {
        font-size: 2.5rem;
        font-weight: 800;
        color: #9d4edd; /* Purple accent */
        line-height: 1;
        margin-bottom: 0.5rem;
    }

    .stat-label {
        font-size: 0.875rem;
        color: var(--text-muted, #888);
        text-transform: uppercase;
        letter-spacing: 0.05em;
        font-weight: 600;
    }
    
    :global([data-theme='light']) .stat-card {
        background: #fff;
        border-color: #eee;
    }
    :global([data-theme='light']) .stat-label {
        color: #666;
    }
</style>
