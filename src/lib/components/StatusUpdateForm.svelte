<script lang="ts">
    import { browser } from '$app/environment';
    import type { Feature, Geometry, GeoJsonProperties } from 'geojson';

    export let selectedFeature: Feature<Geometry, GeoJsonProperties> | null = null;

    console.log('StatusUpdateForm - Development mode:', import.meta.env.DEV);
    console.log('StatusUpdateForm - Selected feature:', selectedFeature);

    const statusOptions = [
        { value: 'unknown', label: 'Unknown' },
        { value: 'survey_planned', label: 'Survey Planned' },
        { value: 'engineering', label: 'Engineering' },
        { value: 'ready_not_funded', label: 'Ready - Not Funded' },
        { value: 'ready_partially_funded', label: 'Ready - Partially Funded' },
        { value: 'ready_fully_funded', label: 'Ready - Fully Funded' },
        { value: 'in_progress', label: 'In Progress' },
        { value: 'complete', label: 'Complete' }
    ];

    // Initialize selectedStatus with the feature's current status
    let selectedStatus = selectedFeature?.properties?.status || 'unknown';

    // Update selectedStatus only when selectedFeature changes to a different feature
    $: if (selectedFeature && selectedFeature.properties?.facilityid !== previousFeatureId) {
        selectedStatus = selectedFeature.properties?.status || 'unknown';
        previousFeatureId = selectedFeature.properties?.facilityid;
    }

    let previousFeatureId: string | undefined;

    async function handleSubmit() {
        if (!selectedFeature) return;

        try {
            const response = await fetch(`/api/dredging_sections/${selectedFeature.properties?.facilityid}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    status: selectedStatus,
                    notes: selectedFeature.properties?.notes || ''
                })
            });

            if (!response.ok) {
                throw new Error('Failed to update status');
            }
            
            // Update the feature's properties
            selectedFeature.properties = {
                ...selectedFeature.properties,
                status: selectedStatus
            };

            // Dispatch a custom event to notify the map to update
            const event = new CustomEvent('statusUpdated', {
                detail: {
                    featureId: selectedFeature.properties?.facilityid,
                    newStatus: selectedStatus,
                    feature: selectedFeature
                }
            });
            window.dispatchEvent(event);
        } catch (error) {
            console.error('Error updating status:', error);
        }
    }
</script>

{#if browser && import.meta.env.DEV && selectedFeature}
    <div class="mt-4 p-4 border-t border-base-200">
        <h3 class="text-lg font-medium mb-2">Update Status</h3>
        <form on:submit|preventDefault={handleSubmit} class="space-y-4">
            <div>
                <label for="status" class="label">
                    <span class="label-text">Status</span>
                </label>
                <select
                    id="status"
                    bind:value={selectedStatus}
                    class="select select-bordered w-full"
                >
                    {#each statusOptions as option}
                        <option value={option.value}>{option.label}</option>
                    {/each}
                </select>
            </div>
            <button
                type="submit"
                class="btn btn-primary w-full"
            >
                Update Status
            </button>
        </form>
    </div>
{/if} 