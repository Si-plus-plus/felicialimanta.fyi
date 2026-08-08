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
        background: var(--bg-surface, #1e1e1e);
        border: 1px solid var(--border-color, #333);
        border-radius: 0.75rem;
    }
    
    :global([data-theme='light']) .table-container {
        background: #fff;
        border-color: #eee;
    }

    .history-table {
        width: 100%;
        border-collapse: collapse;
        text-align: left;
    }

    th, td {
        padding: 1rem 1.5rem;
        border-bottom: 1px solid var(--border-color, #333);
    }
    
    :global([data-theme='light']) th, :global([data-theme='light']) td {
        border-bottom-color: #eee;
    }

    th {
        font-weight: 600;
        color: var(--text-muted, #888);
        text-transform: uppercase;
        font-size: 0.75rem;
        letter-spacing: 0.05em;
        background: rgba(0,0,0,0.2);
    }
    
    :global([data-theme='light']) th {
        background: rgba(0,0,0,0.02);
        color: #666;
    }

    tbody tr {
        transition: background-color 0.2s ease;
    }

    tbody tr:hover {
        background: rgba(157, 78, 221, 0.05); /* very faint purple */
    }

    .period-col {
        font-weight: 600;
        color: #9d4edd;
        white-space: nowrap;
    }

    .city {
        font-weight: 600;
        color: var(--text-color, #fff);
    }
    
    :global([data-theme='light']) .city {
        color: #111;
    }

    .country {
        color: var(--text-muted, #aaa);
    }
    
    :global([data-theme='light']) .country {
        color: #666;
    }
    
    .empty-state {
        text-align: center;
        padding: 3rem;
        color: var(--text-muted, #888);
        font-style: italic;
    }
</style>
