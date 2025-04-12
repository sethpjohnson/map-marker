<script lang="ts">
    import { onMount } from 'svelte';
    import { browser } from '$app/environment';
    import type { Feature, Geometry, GeoJsonProperties } from 'geojson';
    import type { PathOptions } from 'leaflet';
    import type L from 'leaflet';
    import PopupContent from './PopupContent.svelte';
    import MapControls from './MapControls.svelte';
    import MapDebug from './MapDebug.svelte';

    export let hoveredFeature: Feature<Geometry, GeoJsonProperties> | null = null;
    
    let map: L.Map;
    let mapContainer: HTMLDivElement;
    let geojsonLayer: L.GeoJSON;
    let selectedFeature: Feature<Geometry, GeoJsonProperties> | null = null;
    let leaflet: typeof L;
    let currentPopup: L.Popup | null = null;
    let debugMessages: string[] = [];

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

    export async function updateStatus(data: { feature_id: string; status: Status; notes: string }) {
        if (!selectedFeature) return;

        selectedFeature.properties = {
            ...selectedFeature.properties,
            status: data.status,
            notes: data.notes
        };

        geojsonLayer?.eachLayer((layer: any) => {
            if (layer.feature?.properties?.facilityid === data.feature_id) {
                layer.setStyle({
                    fillColor: statusColors[data.status] || '#000',
                    color: '#000',
                    weight: 1,
                    opacity: 0.3,
                    fillOpacity: 0.8
                });
            }
        });

        const savedStatus = JSON.parse(localStorage.getItem('creek_status') || '{}');
        savedStatus[data.feature_id] = {
            status: data.status,
            notes: data.notes
        };
        localStorage.setItem('creek_status', JSON.stringify(savedStatus));

        if (currentPopup) {
            const popupDiv = document.createElement('div');
            new PopupContent({
                target: popupDiv,
                props: {
                    feature: selectedFeature,
                    status: data.status,
                    notes: data.notes
                }
            });
            currentPopup.setContent(popupDiv.innerHTML);
        }
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

    onMount(async () => {
        if (!browser) return;

        leaflet = await import('leaflet');
        await import('leaflet/dist/leaflet.css');

        map = leaflet.map(mapContainer).setView([27.29550, -82.52077], 14);

        leaflet.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        }).addTo(map);

        const response = await fetch(import.meta.env.DEV ? '/phillippi_creek.geojson' : '/map-marker/phillippi_creek.geojson');
        const data = await response.json();

        geojsonLayer = new leaflet.GeoJSON(data, {
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
            onEachFeature: (feature: Feature<Geometry, GeoJsonProperties>, layer: L.Layer) => {
                layer.on({
                    click: (e: L.LeafletMouseEvent) => handleFeatureClick(feature, e),
                    mouseout: () => {
                        if (layer instanceof leaflet.Path) {
                            layer.setStyle({
                                weight: 1,
                                opacity: 0.3,
                                fillOpacity: 0.8
                            });
                        }
                    }
                });
            }
        }).addTo(map);

        mapContainer.addEventListener('touchstart', (e) => {
            debugMessages = [...debugMessages, `Global touchstart: ${JSON.stringify({
                type: e.type,
                touches: e.touches.length,
                target: (e.target as HTMLElement)?.tagName
            })}`];
        }, { passive: false });

        await applyStatusToFeatures();
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