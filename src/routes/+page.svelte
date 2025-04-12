<script lang="ts">
    import { browser } from '$app/environment';
    import Map from '$lib/components/Map.svelte';
    import '$lib/styles/colors.css';
    import type { Feature, Geometry, GeoJsonProperties } from 'geojson';
    import StatusForm from '$lib/components/StatusForm.svelte';

    let hoveredFeature: Feature<Geometry, GeoJsonProperties> | null = null;
    let mapComponent: Map;
    
    function handleStatusSave(data: { feature_id: string; status: string; notes: string }) {
        if (mapComponent) {
            mapComponent.updateStatus(data);
        }
    }
</script>

<div class="min-h-screen bg-base-200">
    <div class="container mx-auto p-4 h-[calc(100vh-2rem)] flex flex-col">
        <h1 class="text-3xl font-bold mb-4">Phillippi Creek Dredging Tracker</h1>
        
        <div class="flex-1 flex flex-col lg:flex-row gap-4 min-h-0">
            <!-- Map -->
            <div class="flex-1 bg-white rounded-lg shadow-lg h-full">
                {#if browser}
                    <Map bind:hoveredFeature bind:this={mapComponent} />
                {:else}
                    <div class="flex items-center justify-center h-full">
                        <p>Loading map...</p>
                    </div>
                {/if}
            </div>

            <!-- Legend -->
            <div class="lg:w-64 bg-white p-4 rounded-lg shadow-lg">
                <h2 class="text-xl font-semibold mb-4">Status Legend</h2>
                <div class="space-y-2">
                    <div class="flex items-center">
                        <div class="w-4 h-4 bg-[var(--status-unknown)] mr-2"></div>
                        <span>Unknown</span>
                    </div>
                    <div class="flex items-center">
                        <div class="w-4 h-4 bg-[var(--status-survey-planned)] mr-2"></div>
                        <span>Survey Planned</span>
                    </div>
                    <div class="flex items-center">
                        <div class="w-4 h-4 bg-[var(--status-engineering)] mr-2"></div>
                        <span>Engineering</span>
                    </div>
                    <div class="flex items-center">
                        <div class="w-4 h-4 bg-[var(--status-ready-not-funded)] mr-2"></div>
                        <span>Ready - Not Funded</span>
                    </div>
                    <div class="flex items-center">
                        <div class="w-4 h-4 bg-[var(--status-ready-partially-funded)] mr-2"></div>
                        <span>Ready - Partially Funded</span>
                    </div>
                    <div class="flex items-center">
                        <div class="w-4 h-4 bg-[var(--status-ready-fully-funded)] mr-2"></div>
                        <span>Ready - Fully Funded</span>
                    </div>
                    <div class="flex items-center">
                        <div class="w-4 h-4 bg-[var(--status-in-progress)] mr-2"></div>
                        <span>In Progress</span>
                    </div>
                    <div class="flex items-center">
                        <div class="w-4 h-4 bg-[var(--status-complete)] mr-2"></div>
                        <span>Complete</span>
                    </div>
                </div>
                <div class="mt-6">
                    <StatusForm 
                        feature={hoveredFeature}
                        onSave={handleStatusSave}
                    />
                </div>
            </div>
        </div>
    </div>
</div>
