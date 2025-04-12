<script lang="ts">
    import type { Feature, Geometry, GeoJsonProperties } from 'geojson';
    import { fade } from 'svelte/transition';
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    export let feature: Feature<Geometry, GeoJsonProperties> | null = null;
    export let isOpen = false;
    export let coordinates: [number, number] | null = null;

    $: featureInfo = feature ? {
        name: feature.properties?.name || 'Unnamed Section',
        status: feature.properties?.status || 'unknown',
        notes: feature.properties?.notes || 'No additional information available',
        facilityid: feature.properties?.facilityid || 'Unknown ID',
        length: feature.properties?.length || 'Unknown',
        area: feature.properties?.area || 'Unknown'
    } : null;

    function handleClose() {
        dispatch('close');
    }

    $: tooltipStyle = coordinates ? `left: ${coordinates[0]}px; top: ${coordinates[1]}px; transform: translate(-50%, -100%); margin-top: -10px;` : '';
</script>

{#if isOpen && featureInfo}
    <div 
        class="fixed bg-white p-3 shadow-lg rounded-lg z-[1000] max-w-xs pointer-events-auto border border-gray-100"
        style={tooltipStyle}
        role="dialog"
        aria-labelledby="tooltip-title"
        aria-describedby="tooltip-content"
        transition:fade={{ duration: 200 }}
    >
        <div class="flex justify-between items-start mb-3">
            <h3 id="tooltip-title" class="text-base font-semibold text-gray-800">{featureInfo.name}</h3>
            <button 
                class="text-gray-400 hover:text-gray-600 text-sm"
                on:click={handleClose}
                aria-label="Close tooltip"
            >
                ✕
            </button>
        </div>
        <div id="tooltip-content" class="space-y-3">
            <table class="w-full text-sm">
                <tbody>
                    <tr class="border-b border-gray-100">
                        <td class="py-1.5 text-gray-500 font-medium">ID</td>
                        <td class="py-1.5 text-gray-700">{featureInfo.facilityid}</td>
                    </tr>
                    <tr class="border-b border-gray-100">
                        <td class="py-1.5 text-gray-500 font-medium">Status</td>
                        <td class="py-1.5 text-gray-700 capitalize">{featureInfo.status.replace(/_/g, ' ')}</td>
                    </tr>
                    <tr class="border-b border-gray-100">
                        <td class="py-1.5 text-gray-500 font-medium">Length</td>
                        <td class="py-1.5 text-gray-700">{featureInfo.length}</td>
                    </tr>
                    <tr>
                        <td class="py-1.5 text-gray-500 font-medium">Area</td>
                        <td class="py-1.5 text-gray-700">{featureInfo.area}</td>
                    </tr>
                </tbody>
            </table>
            {#if featureInfo.notes}
                <div class="pt-2">
                    <p class="text-xs text-gray-500 font-medium mb-1">Notes</p>
                    <p class="text-sm text-gray-600 leading-relaxed">{featureInfo.notes}</p>
                </div>
            {/if}
        </div>
    </div>
{/if} 