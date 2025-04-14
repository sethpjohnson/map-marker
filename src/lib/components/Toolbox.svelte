<script lang="ts">
    import StatusLegend from './StatusLegend.svelte';
    import StatusUpdateForm from './StatusUpdateForm.svelte';
    import type { Feature, Geometry, GeoJsonProperties } from 'geojson';

    // We can add more props and functionality as needed
    export let isOpen = true;
    export let selectedFeature: Feature<Geometry, GeoJsonProperties> | null = null;
</script>

<div class="bg-white p-4 rounded-lg shadow-lg h-full">


    {#if isOpen}
        <div class="space-y-4">
            <!-- Status Legend Section -->
            <div>
                
                <StatusLegend />
            </div>

            <!-- Status Update Form (Development Only) -->
            <StatusUpdateForm {selectedFeature} />
        </div>
    {/if}
</div> 