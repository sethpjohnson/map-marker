<script lang="ts">
    import { onMount } from 'svelte';
    import { browser } from '$app/environment';
    import type { Feature, Geometry, GeoJsonProperties } from 'geojson';
    import type { PathOptions } from 'leaflet';
    import type L from 'leaflet';
    import PopupContent from './PopupContent.svelte';
    import MapControls from './MapControls.svelte';
    import MapDebug from './MapDebug.svelte';
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher<{
        featureClick: Feature<Geometry, GeoJsonProperties>;
    }>();

    export let hoveredFeature: Feature<Geometry, GeoJsonProperties> | null = null;
    
    let map: L.Map;
    let mapContainer: HTMLDivElement;
    let geojsonLayer: L.GeoJSON;
    let selectedFeature: Feature<Geometry, GeoJsonProperties> | null = null;
    let leaflet: typeof L;
    let currentPopup: L.Popup | null = null;
    let debugMessages: string[] = [];

    type Status = 'unknown' | 'survey_planned' | 'survey_completed' | 'engineering' | 'ready_not_funded' | 'ready_partially_funded' | 'ready_fully_funded' | 'in_progress' | 'complete';
    const statusColors: Record<Status, string> = {
        'unknown': getComputedStyle(document.documentElement).getPropertyValue('--status-unknown'),
        'survey_planned': getComputedStyle(document.documentElement).getPropertyValue('--status-survey-planned'),
        'survey_completed': getComputedStyle(document.documentElement).getPropertyValue('--status-survey-completed'),
        'engineering': getComputedStyle(document.documentElement).getPropertyValue('--status-engineering'), 
        'ready_not_funded': getComputedStyle(document.documentElement).getPropertyValue('--status-ready-not-funded'),
        'ready_partially_funded': getComputedStyle(document.documentElement).getPropertyValue('--status-ready-partially-funded'),
        'ready_fully_funded': getComputedStyle(document.documentElement).getPropertyValue('--status-ready-fully-funded'),
        'in_progress': getComputedStyle(document.documentElement).getPropertyValue('--status-in-progress'),
        'complete': getComputedStyle(document.documentElement).getPropertyValue('--status-complete')
    };

    $: if (hoveredFeature) {
        selectedFeature = hoveredFeature;
    }

    function handleFeatureClick(feature: Feature<Geometry, GeoJsonProperties>, e: L.LeafletMouseEvent) {
        debugMessages = [...debugMessages, `${new Date().toISOString()}: handleFeatureClick called with event type: ${e.type}`];
        
        selectedFeature = feature;
        hoveredFeature = feature;
        
        map.closePopup();
        
        const popupDiv = document.createElement('div');
        new PopupContent({
            target: popupDiv,
            props: {
                feature,
                status: feature.properties?.status || 'unknown',
                notes: feature.properties?.notes || ''
            }
        });

        currentPopup = leaflet.popup({
            className: 'custom-popup',
            closeButton: true,
            autoClose: false,
            closeOnClick: false,
            maxWidth: 300
        })
        .setLatLng(e.latlng)
        .setContent(popupDiv.innerHTML)
        .openOn(map);

        // Dispatch the feature click event
        dispatch('featureClick', feature);
    }

    function handleFeatureUnclick() {
        selectedFeature = null;
        hoveredFeature = null;
        currentPopup = null;
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

    function getStatusColor(status: string): string {
        switch (status) {
            case 'unknown':
                return 'var(--status-unknown)';
            case 'survey_planned':
                return 'var(--status-survey-planned)';
            case 'survey_completed':
                return 'var(--status-survey-completed)';
            case 'engineering':
                return 'var(--status-engineering)';
            case 'ready_not_funded':
                return 'var(--status-ready-not-funded)';
            case 'ready_partially_funded':
                return 'var(--status-ready-partially-funded)';
            case 'ready_fully_funded':
                return 'var(--status-ready-fully-funded)';
            case 'in_progress':
                return 'var(--status-in-progress)';
            case 'complete':
                return 'var(--status-complete)';
            default:
                return 'var(--status-unknown)';
        }
    }

    function styleFeature(feature?: Feature<Geometry, GeoJsonProperties>) {
        if (!feature) {
            return {
                fillColor: 'var(--status-unknown)',
                weight: 1,
                opacity: 0.3,
                color: 'white',
                dashArray: '3',
                fillOpacity: 0.8
            };
        }
        return {
            fillColor: getStatusColor(feature.properties?.status || 'unknown'),
            weight: 1,
            opacity: 0.3,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.8
        };
    }

    function onEachFeature(feature: Feature<Geometry, GeoJsonProperties>, layer: L.Layer) {
        layer.on({
            mouseover: (e) => {
                const layer = e.target;
                layer.setStyle({
                    weight: 2,
                    color: '#666',
                    dashArray: '',
                    fillOpacity: 0.7
                });
                layer.bringToFront();
                hoveredFeature = feature;
            },
            mouseout: (e) => {
                geojsonLayer.resetStyle(e.target);
                hoveredFeature = null;
            },
            click: (e: L.LeafletMouseEvent) => {
                handleFeatureClick(feature, e);
                dispatch('featureClick', feature);
            }
        });
    }

    onMount(async () => {
        if (!browser) return;

        // Initialize map asynchronously
        leaflet = await import('leaflet');
        await import('leaflet/dist/leaflet.css');

        // Initialize the map
        map = leaflet.map(mapContainer).setView([27.29550, -82.52077], 14);

        // Add the tile layer
        leaflet.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        }).addTo(map);

        // Load and add the GeoJSON data
        const response = await fetch(import.meta.env.DEV ? '/phillippi_creek.geojson' : '/map-marker/phillippi_creek.geojson');
        const data = await response.json();
        
        geojsonLayer = leaflet.geoJSON(data, {
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
            onEachFeature
        }).addTo(map);

        // Apply status to features
        await applyStatusToFeatures();

        // Listen for status updates
        window.addEventListener('statusUpdated', ((event: Event) => {
            const customEvent = event as CustomEvent<{ 
                featureId: string; 
                newStatus: Status;
                feature: Feature<Geometry, GeoJsonProperties>;
            }>;
            const { featureId, newStatus, feature } = customEvent.detail;
            
            geojsonLayer.eachLayer((layer: any) => {
                if (layer.feature?.properties?.facilityid === featureId) {
                    layer.feature.properties.status = newStatus;
                    layer.setStyle({
                        fillColor: statusColors[newStatus] || '#000',
                        color: '#000',
                        weight: 1,
                        opacity: 0.3,
                        fillOpacity: 0.8
                    });

                    // Update the popup if it's open
                    if (currentPopup && currentPopup.isOpen()) {
                        const popupDiv = document.createElement('div');
                        new PopupContent({
                            target: popupDiv,
                            props: {
                                feature,
                                status: newStatus,
                                notes: feature.properties?.notes || ''
                            }
                        });
                        currentPopup.setContent(popupDiv.innerHTML);
                    }
                }
            });
        }) as EventListener);
    });
</script>

<div class="w-full h-full" bind:this={mapContainer}>
    <MapControls {map} {leaflet} />
</div>

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

    :global(.custom-popup) {
        padding: 0;
        margin: 0;
    }
</style> 