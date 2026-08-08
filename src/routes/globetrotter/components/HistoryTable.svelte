<script lang="ts">
    let { trips = [] } = $props<{ trips: any[] }>();
    
    // Sort descending by period
    let sortedTrips = $derived([...trips].sort((a, b) => b.period.localeCompare(a.period)));
</script>

<div class="table-container">
    <table class="history-table">
        <thead>
            <tr>
                <th>Period</th>
                <th>Location</th>
                <th>Continent</th>
                <th>Purpose</th>
            </tr>
        </thead>
        <tbody>
            {#each sortedTrips as trip (trip.id)}
                <tr>
                    <td class="period-col">{trip.period}</td>
                    <td class="location-col">
                        <span class="city">{trip.city}</span>, <span class="country">{trip.country}</span>
                    </td>
                    <td>{trip.continent}</td>
                    <td>{trip.purpose}</td>
                </tr>
            {/each}
            {#if sortedTrips.length === 0}
                <tr>
                    <td colspan="4" class="empty-state">No trips found for this period.</td>
                </tr>
            {/if}
        </tbody>
    </table>
</div>

<style>
    .table-container {
        width: 100%;
        overflow-x: auto;
        background: var(--bg-primary);
        border-radius: 0.5rem;
    }

    .history-table {
        width: 100%;
        border-collapse: collapse;
        text-align: left;
    }

    th, td {
        padding: 1rem 1.5rem;
        border-bottom: 1px solid var(--lines);
        font-size: 0.95rem;
    }

    th {
        font-weight: 500;
        color: var(--text-primary);
        opacity: 0.7;
        text-transform: uppercase;
        font-size: 0.75rem;
        letter-spacing: 0.05em;
        background: transparent;
    }

    tbody tr {
        transition: background-color var(--transition-speed) ease;
    }

    tbody tr:hover {
        background: var(--lines);
    }

    .period-col {
        font-weight: 500;
        color: var(--accent);
        white-space: nowrap;
    }

    .city {
        font-weight: 500;
        color: var(--text-primary);
    }

    .country {
        color: var(--text-primary);
        opacity: 0.7;
    }
    
    .empty-state {
        text-align: center;
        padding: 3rem;
        color: var(--text-primary);
        opacity: 0.7;
        font-style: italic;
    }
</style>
