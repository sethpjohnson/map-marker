<script lang="ts">
    import { onMount } from 'svelte';
    import { browser } from '$app/environment';
    import StatusModal from './StatusModal.svelte';
    import type { Feature, Geometry, GeoJsonProperties } from 'geojson';
    import type { PathOptions } from 'leaflet';

    export let hoveredFeature: Feature<Geometry, GeoJsonProperties> | null = null;
    
    let map: any;
    let mapContainer: HTMLDivElement;
    let geojsonLayer: any;
    let selectedFeature: Feature<Geometry, GeoJsonProperties> | null = null;
    let isModalOpen = false;
    let currentStatus = '';
    let currentNotes = '';

    type Status = 'unknown' | 'survey_planned' | 'engineering' | 'ready_not_funded' | 'ready_partially_funded' | 'ready_fully_funded' | 'in_progress' | 'complete';
    const statusColors: Record<Status, string> = {
        'unknown': getComputedStyle(document.documentElement).getPropertyValue('--status-unknown'),
        'survey_planned': getComputedStyle(document.documentElement).getPropertyValue('--status-survey-planned'),
        'engineering': getComputedStyle(document.documentElement).getPropertyValue('--status-engineering'), 
        'ready_not_funded': getComputedStyle(document.documentElement).getPropertyValue('--status-ready-not-funded'),
        'ready_partially_funded': getComputedStyle(document.documentElement).getPropertyValue('--status-ready-partially-funded'),
        'ready_fully_funded': getComputedStyle(document.documentElement).getPropertyValue('--status-ready-fully-funded'),
        'in_progress': getComputedStyle(document.documentElement).getPropertyValue('--status-in-progress'),
        'complete': getComputedStyle(document.documentElement).getPropertyValue('--status-complete')
    };

    async function fetchStatus(featureId: string) {
        try {
            const response = await fetch(import.meta.env.DEV ? '/dredging_sections.json' : '/map-marker/dredging_sections.json');
            if (response.ok) {
                const data = await response.json();
                if (import.meta.env.DEV) {
                    if (data.length > 0) {
                        return data[0];
                    }
                } else {
                    const section = data.sections.find((s: any) => s.feature_id === featureId);
                    if (section) {
                        return section;
                    }
                }
            }
            return null;
        } catch (error) {
            console.error('Error fetching status:', error);
            return null;
        }
    }

    async function updateStatus(data: { feature_id: string; status: Status; notes: string }) {
        if (!import.meta.env.DEV) return;
        
        try {
            const response = await fetch('/api/dredging_sections', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                // Update the feature's style
                geojsonLayer.eachLayer((layer: any) => {
                    if (layer.feature) {
                        const feature = layer.feature as Feature<Geometry, GeoJsonProperties>;
                        if (feature.properties?.facilityid === data.feature_id) {
                            layer.setStyle({
                                fillColor: statusColors[data.status]
                            });
                            // Update the feature's properties
                            feature.properties = {
                                ...feature.properties,
                                status: data.status,
                                notes: data.notes
                            };
                        }
                    }
                });
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    }

    function handleFeatureClick(feature: Feature<Geometry, GeoJsonProperties>) {
        if (import.meta.env.DEV) {
            selectedFeature = feature;
            isModalOpen = true;
        }
    }

    function handleModalClose() {
        if (import.meta.env.DEV) {
            isModalOpen = false;
            selectedFeature = null;
            currentStatus = '';
            currentNotes = '';
        }
    }

    async function applyStatusToFeatures() {
        try {
            const response = await fetch(import.meta.env.DEV ? '/api/dredging_sections' : '/map-marker/dredging_sections.json');
            if (response.ok) {
                const data = await response.json();
                geojsonLayer.eachLayer((layer: any) => {
                    if (layer.feature) {
                        const feature = layer.feature as Feature<Geometry, GeoJsonProperties>;
                        const status = import.meta.env.DEV 
                            ? data.find((s: any) => s.feature_id === feature.properties?.facilityid)
                            : data.sections.find((s: any) => s.feature_id === feature.properties?.facilityid);
                        if (status) {
                            feature.properties = {
                                ...feature.properties,
                                status: status.status,
                                notes: status.notes
                            };
                            layer.setStyle({
                                fillColor: statusColors[status.status as Status]
                            });
                        }
                    }
                });
            }
        } catch (error) {
            console.error('Error applying status to features:', error);
        }
    }

    onMount(async () => {
        if (!browser) return;

        // Dynamically import Leaflet only on the client side
        const L = await import('leaflet');
        await import('leaflet/dist/leaflet.css');

        // Initialize map
        map = L.map(mapContainer).setView([27.29550, -82.52077], 14); // Sarasota coordinates

        // Add OpenStreetMap Water Color tiles
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        }).addTo(map);

        // Load GeoJSON data
        const response = await fetch(import.meta.env.DEV ? '/phillippi_creek.geojson' : '/map-marker/phillippi_creek.geojson');
        const data = await response.json();

        geojsonLayer = new L.GeoJSON(data, {
            style: (feature?: Feature<Geometry, GeoJsonProperties>): PathOptions => {
                if (!feature) return { color: '#000' };
                const status = feature.properties?.status as Status;
                return {
                    color: statusColors[status] || '#000',
                    weight: 1,
                    opacity: 0.3,
                    fillOpacity: 0.8
                };
            },
            onEachFeature: (feature: Feature<Geometry, GeoJsonProperties>, layer: any) => {
                layer.on({
                    click: () => handleFeatureClick(feature),
                    mouseover: () => {
                        hoveredFeature = feature;
                    },
                    mouseout: () => {
                        hoveredFeature = null;
                    }
                });
            }
        }).addTo(map);

        // Apply saved status data to features
        await applyStatusToFeatures();
    });
</script>

{#if browser}
    <div class="w-full h-full relative" bind:this={mapContainer}></div>

    {#if import.meta.env.DEV}
        <StatusModal
            isOpen={isModalOpen}
            feature={selectedFeature}
            {currentStatus}
            {currentNotes}
            onSave={updateStatus}
            onClose={handleModalClose}
        />
    {/if}
{/if}

<style>
    :global(.leaflet-container) {
        height: 100%;
        width: 100%;
        position: relative;
        z-index: 0;
    }

    :global(.leaflet-control) {
        z-index: 1;
    }

    :global(.leaflet-pane) {
        z-index: 0;
    }

    .w-full {
        height: 100%;
        min-height: 0;
    }
</style> 