<script lang="ts">
    import StatusLegend from './StatusLegend.svelte';
    import StatusUpdateForm from './StatusUpdateForm.svelte';
    import type { Feature, Geometry, GeoJsonProperties } from 'geojson';

    // We can add more props and functionality as needed
    export let isOpen = true;
    export let selectedFeature: Feature<Geometry, GeoJsonProperties> | null = null;
</script>

<div class="bg-white p-4 rounded-lg shadow-lg h-full">
    <div class="mb-4">
        <h2 class="text-xl font-semibold">Toolbox</h2>
    </div>

    {#if isOpen}
        <div class="space-y-4">
            <!-- Status Legend Section -->
            <div>
                <h3 class="text-lg font-medium mb-2">Status Legend</h3>
                <StatusLegend {isOpen} />
            </div>

            <!-- Status Update Form (Development Only) -->
            <StatusUpdateForm {selectedFeature} />
        </div>
    {/if}
</div> 