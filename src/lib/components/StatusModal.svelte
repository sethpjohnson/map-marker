<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import type { Feature, Geometry, GeoJsonProperties } from 'geojson';

    export let isOpen = false;
    export let feature: Feature<Geometry, GeoJsonProperties> | null = null;
    export let currentStatus = '';
    export let currentNotes = '';

    const dispatch = createEventDispatcher();

    function handleSave() {
        if (!feature) return;
        dispatch('save', {
            feature_id: feature.properties?.facilityid,
            status: currentStatus,
            notes: currentNotes
        });
        isOpen = false;
    }

    function handleClose() {
        isOpen = false;
    }

    $: if (isOpen && feature) {
        currentStatus = feature.properties?.status || '';
        currentNotes = feature.properties?.notes || '';
    }
</script>

{#if isOpen && feature}
    <!-- Modal backdrop -->
    <div class="fixed inset-0 bg-black bg-opacity-50 z-40" on:click={handleClose}></div>
    
    <!-- Modal content -->
    <div class="modal modal-open z-50">
        <div class="modal-box relative bg-white">
            <h3 class="font-bold text-xl mb-6">Update Dredging Status</h3>
            
            <div class="form-control w-full max-w-md mb-4">
                <label class="label">
                    <span class="label-text text-base font-medium">Status</span>
                </label>
                <select 
                    class="select select-bordered w-full bg-white" 
                    bind:value={currentStatus}
                >
                    <option value="">Select a status...</option>
                    <option value="planned">Planned</option>
                    <option value="funded">Funded</option>
                    <option value="not funded">Not Funded</option>
                    <option value="completed">Completed</option>
                </select>
            </div>

            <div class="form-control w-full max-w-md mb-6">
                <label class="label">
                    <span class="label-text text-base font-medium">Notes</span>
                </label>
                <textarea 
                    class="textarea textarea-bordered h-32 bg-white" 
                    placeholder="Add notes about this section..."
                    bind:value={currentNotes}
                ></textarea>
            </div>

            <div class="modal-action">
                <button 
                    class="btn btn-ghost" 
                    on:click={handleClose}
                >
                    Cancel
                </button>
                <button 
                    class="btn btn-primary" 
                    on:click={handleSave}
                    disabled={!currentStatus}
                >
                    Save Changes
                </button>
            </div>
        </div>
    </div>
{/if}

<style>
    /* Ensure modal appears above map */
    :global(.modal) {
        z-index: 1000;
    }
    
    :global(.modal-box) {
        max-height: 90vh;
        width: 95%;
        max-width: 32rem;
        padding: 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    }
</style> 