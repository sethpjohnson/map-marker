<script lang="ts">
    import { browser } from '$app/environment';
    import Map from '$lib/components/Map.svelte';
    import Toolbox from '$lib/components/Toolbox.svelte';
    import '$lib/styles/colors.css';
    import type { Feature, Geometry, GeoJsonProperties } from 'geojson';

    let hoveredFeature: Feature<Geometry, GeoJsonProperties> | null = null;
    let selectedFeature: Feature<Geometry, GeoJsonProperties> | null = null;
    let mapComponent: Map;

    function handleFeatureClick(event: CustomEvent<Feature<Geometry, GeoJsonProperties>>) {
        selectedFeature = event.detail;
    }
</script>

<div class="min-h-screen bg-base-200">
    <div class="container mx-auto p-4 h-[calc(100vh-2rem)] flex flex-col">
        <h1 class="text-3xl font-bold mb-4">Phillippi Creek Dredging Tracker</h1>
        
        <div class="flex-1 flex flex-col lg:flex-row gap-4 min-h-0">
            <!-- Map -->
            <div class="flex-1 bg-white rounded-lg shadow-lg h-full">
                {#if browser}
                    <Map 
                        bind:hoveredFeature 
                        bind:this={mapComponent}
                        on:featureClick={handleFeatureClick}
                    />
                {:else}
                    <div class="flex items-center justify-center h-full">
                        <p>Loading map...</p>
                    </div>
                {/if}
            </div>

            <!-- Toolbox -->
            <div class="lg:w-64">
                <Toolbox {selectedFeature} />
            </div>
        </div>
    </div>
</div>
