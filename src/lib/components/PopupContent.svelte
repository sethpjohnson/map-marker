<script lang="ts">
    import type { Feature, Geometry, GeoJsonProperties } from 'geojson';
    
    export let feature: Feature<Geometry, GeoJsonProperties>;
    export let status: string;
    export let notes: string;
</script>

<div class="p-3">
    <h3 class="text-base font-semibold text-gray-800 mb-3">NAE: {feature.properties?.name || 'Unnamed Section'}</h3>
    <table class="w-full text-sm">
        <tbody>
            <tr class="border-b border-gray-100">
                <td class="py-1.5 text-gray-500 font-medium">ID</td>
                <td class="py-1.5 text-gray-700">{feature.properties?.facilityid || 'Unknown ID'}</td>
            </tr>
            <tr class="border-b border-gray-100">
                <td class="py-1.5 text-gray-500 font-medium">Status</td>
                <td class="py-1.5 text-gray-700 capitalize">{(status || 'unknown').replace(/_/g, ' ')}</td>
            </tr>
            <tr class="border-b border-gray-100">
                <td class="py-1.5 text-gray-500 font-medium">Length</td>
                <td class="py-1.5 text-gray-700">{feature.properties?.length || 'Unknown'}</td>
            </tr>
            <tr>
                <td class="py-1.5 text-gray-500 font-medium">Area</td>
                <td class="py-1.5 text-gray-700">{feature.properties?.area || 'Unknown'}</td>
            </tr>
        </tbody>
    </table>
    {#if notes}
        <div class="pt-2">
            <p class="text-xs text-gray-500 font-medium mb-1">Notes</p>
            <p class="text-sm text-gray-600 leading-relaxed">{notes}</p>
        </div>
    {/if}
</div> 