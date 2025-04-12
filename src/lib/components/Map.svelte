<script lang="ts">
    import { onMount } from 'svelte';
    import { browser } from '$app/environment';
    import StatusModal from './StatusModal.svelte';
    import MapTooltip from './MapTooltip.svelte';
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
    let showModal = false;
    let showTooltip = false;
    let clickCoordinates: [number, number] | null = null;

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
        if (!selectedFeature) return;

        const featureId = selectedFeature.properties?.id;
        if (!featureId) return;

        // Update the feature's status
        selectedFeature.properties = {
            ...selectedFeature.properties,
            status: data.status,
            notes: data.notes
        };

        // Update the GeoJSON layer
        geojsonLayer?.eachLayer((layer: any) => {
            if (layer.feature?.properties?.id === featureId) {
                layer.setStyle({
                    fillColor: statusColors[data.status] || '#000',
                    color: '#000',
                    weight: 1,
                    opacity: 0.3,
                    fillOpacity: 0.8
                });
            }
        });

        // Save to localStorage
        const savedStatus = JSON.parse(localStorage.getItem('creek_status') || '{}');
        savedStatus[featureId] = data.status;
        localStorage.setItem('creek_status', JSON.stringify(savedStatus));

        // Close modal
        handleModalClose();
    }

    function handleFeatureClick(feature: Feature<Geometry, GeoJsonProperties>, e: any) {
        selectedFeature = feature;
        showTooltip = true;
        // Convert layer point to screen point
        const layerPoint = e.layerPoint;
        const containerPoint = map.containerPointToLayerPoint(layerPoint);
        const screenPoint = map.layerPointToContainerPoint(containerPoint);
        clickCoordinates = [screenPoint.x, screenPoint.y];
        
        if (import.meta.env.DEV) {
            showModal = true;
        }
    }

    function handleModalClose() {
        showTooltip = false;
        clickCoordinates = null;
        if (import.meta.env.DEV) {
            showModal = false;
        }
        selectedFeature = null;
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
                                fillColor: statusColors[status.status as Status] || '#000',
                                color: '#000',
                                weight: 1,
                                opacity: 0.3,
                                fillOpacity: 0.8
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
                if (!feature) return { 
                    fillColor: '#000',
                    color: '#000',
                    weight: 1,
                    opacity: 0.3,
                    fillOpacity: 0.8
                };
                const status = feature.properties?.status as Status;
                return {
                    fillColor: statusColors[status] || '#000',
                    color: '#000',
                    weight: 1,
                    opacity: 0.3,
                    fillOpacity: 0.8
                };
            },
            onEachFeature: (feature: Feature<Geometry, GeoJsonProperties>, layer: any) => {
                layer.on({
                    click: (e: any) => handleFeatureClick(feature, e),
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

    <!-- Tooltip for both environments -->
    <MapTooltip
        feature={selectedFeature}
        isOpen={showTooltip}
        coordinates={clickCoordinates}
        on:close={handleModalClose}
    />

    <!-- Editor for dev only -->
    {#if import.meta.env.DEV}
        <div class="fixed bottom-0 left-0 right-0 md:right-auto md:w-80 bg-white shadow-lg rounded-t-lg md:rounded-t-none md:rounded-l-lg z-50">
            <StatusModal
                isOpen={showModal}
                feature={selectedFeature}
                {currentStatus}
                {currentNotes}
                onSave={updateStatus}
                onClose={handleModalClose}
            />
        </div>
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

    /* Mobile optimizations */
    @media (max-width: 768px) {
        :global(.leaflet-control-zoom) {
            margin: 10px !important;
        }

        :global(.leaflet-control-attribution) {
            font-size: 10px;
            padding: 2px 4px;
        }
    }

    /* Desktop sidebar */
    @media (min-width: 768px) {
        .fixed {
            bottom: 0;
            left: 0;
            width: 320px;
            height: 100%;
            border-radius: 0;
            border-top-left-radius: 0.5rem;
            border-bottom-left-radius: 0.5rem;
        }
    }
</style> 