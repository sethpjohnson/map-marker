<script lang="ts">
    import { onMount } from 'svelte';
    import { browser } from '$app/environment';
    import StatusModal from './StatusModal.svelte';
    import type { Feature, Geometry, GeoJsonProperties } from 'geojson';
    import type { PathOptions } from 'leaflet';

    let map: any;
    let mapContainer: HTMLDivElement;
    let geojsonLayer: any;
    let selectedFeature: Feature<Geometry, GeoJsonProperties> | null = null;
    let isModalOpen = false;
    let currentStatus = '';
    let currentNotes = '';

    type Status = 'planned' | 'funded' | 'not funded' | 'completed';
    const statusColors: Record<Status, string> = {
        'planned': '#FFA500', // Orange
        'funded': '#008000',  // Green
        'not funded': '#FF0000', // Red
        'completed': '#0000FF' // Blue
    };

    async function fetchStatus(featureId: string) {
        try {
            const response = await fetch(`/api/dredging_sections?feature_id=${featureId}`);
            if (response.ok) {
                const data = await response.json();
                if (data.length > 0) {
                    return data[0];
                }
            }
            return null;
        } catch (error) {
            console.error('Error fetching status:', error);
            return null;
        }
    }

    async function updateStatus(data: { feature_id: string; status: Status; notes: string }) {
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
                        }
                    }
                });
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    }

    onMount(async () => {
        if (!browser) return;

        // Dynamically import Leaflet only on the client side
        const L = await import('leaflet');
        await import('leaflet/dist/leaflet.css');

        // Initialize map
        map = L.map(mapContainer).setView([27.3364, -82.5307], 12); // Sarasota coordinates

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // Load GeoJSON data
        const response = await fetch('/api/geojson');
        const data = await response.json();

        geojsonLayer = new L.GeoJSON(data, {
            style: (feature?: Feature<Geometry, GeoJsonProperties>): PathOptions => {
                if (!feature) return { color: '#000' };
                const status = feature.properties?.status as Status;
                return {
                    color: statusColors[status] || '#000',
                    weight: 2,
                    opacity: 0.8,
                    fillOpacity: 0.3
                };
            },
            onEachFeature: (feature: Feature<Geometry, GeoJsonProperties>, layer: any) => {
                layer.on({
                    click: () => {
                        selectedFeature = feature;
                        isModalOpen = true;
                    }
                });
            }
        }).addTo(map);
    });
</script>

{#if browser}
    <div class="w-full h-full relative" bind:this={mapContainer}></div>

    <StatusModal
        isOpen={isModalOpen}
        feature={selectedFeature}
        {currentStatus}
        {currentNotes}
        on:save={({ detail }) => updateStatus(detail)}
    />
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
</style> 