<script lang="ts">
    import { browser } from '$app/environment';
    import Map from '$lib/components/Map.svelte';
    import '$lib/styles/colors.css';
    import type { Feature, Geometry, GeoJsonProperties } from 'geojson';

    let hoveredFeature: Feature<Geometry, GeoJsonProperties> | null = null;
</script>

<div class="min-h-screen bg-base-200">
    <div class="container mx-auto p-4 h-[calc(100vh-2rem)] flex flex-col">
        <h1 class="text-3xl font-bold mb-4">Phillippi Creek Dredging Tracker</h1>
        
        <div class="flex-1 flex flex-col lg:flex-row gap-4 min-h-0">
            <!-- Map -->
            <div class="flex-1 bg-white rounded-lg shadow-lg h-full">
                {#if browser}
                    <Map bind:hoveredFeature />
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

                {#if hoveredFeature}
                    <div class="mt-8 pt-4 border-t border-gray-200">
                        <h3 class="font-semibold mb-4">Section {hoveredFeature.properties?.name}</h3>
                        <table class="w-full text-sm">
                            <tbody>
                                <tr class="border-b border-gray-200">
                                    <td class="py-2 font-medium">Status</td>
                                    <td class="py-2">{hoveredFeature.properties?.status || 'Unknown'}</td>
                                </tr>
                                {#if hoveredFeature.properties?.notes}
                                    <tr class="border-b border-gray-200">
                                        <td class="py-2 font-medium">Notes</td>
                                        <td class="py-2">{hoveredFeature.properties.notes}</td>
                                    </tr>
                                {/if}
                                <tr class="border-b border-gray-200">
                                    <td class="py-2 font-medium">Ownership</td>
                                    <td class="py-2">{hoveredFeature.properties?.ownership}</td>
                                </tr>
                                <tr class="border-b border-gray-200">
                                    <td class="py-2 font-medium">Maintained by</td>
                                    <td class="py-2">{hoveredFeature.properties?.maintenanceentity}</td>
                                </tr>
                                <tr class="border-b border-gray-200">
                                    <td class="py-2 font-medium">Maintenance Type</td>
                                    <td class="py-2">{hoveredFeature.properties?.maintenancetype}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                {/if}
            </div>
        </div>
    </div>
</div>
