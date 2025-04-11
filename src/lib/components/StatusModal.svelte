<script lang="ts">
    import { browser } from '$app/environment';
    import type { Feature, Geometry, GeoJsonProperties } from 'geojson';

    type Status = 'planned' | 'funded' | 'not funded' | 'completed';

    export let isOpen = false;
    export let feature: Feature<Geometry, GeoJsonProperties> | null = null;
    export let currentStatus = '';
    export let currentNotes = '';
    export let onSave: (data: { feature_id: string; status: Status; notes: string }) => void;
    export let onClose: () => void;

    function handleSave() {
        if (!feature) return;
        onSave({
            feature_id: feature.properties?.facilityid,
            status: currentStatus as Status,
            notes: currentNotes
        });
        onClose();
    }

    function handleClose() {
        onClose();
    }

    function handleStatusChange(e: Event) {
        const target = e.target as HTMLSelectElement;
        currentStatus = target.value;
    }

    function handleNotesChange(e: Event) {
        const target = e.target as HTMLTextAreaElement;
        currentNotes = target.value;
    }

    $: if (isOpen && feature) {
        currentStatus = feature.properties?.status || '';
        currentNotes = feature.properties?.notes || '';
    }
</script>

{#if browser}
    {#if isOpen && feature}
        <!-- Modal backdrop -->
        <button 
            type="button"
            class="fixed inset-0 bg-black bg-opacity-50 z-40 w-full h-full cursor-default" 
            on:click={handleClose}
            on:keydown={(e) => e.key === 'Escape' && handleClose()}
            aria-label="Close modal"
        ></button>
        
        <!-- Modal content -->
        <div class="modal modal-open z-50">
            <div class="modal-box relative bg-white">
                <h3 class="font-bold text-xl mb-6">Update Dredging Status</h3>
                
                <div class="form-control w-full max-w-md mb-4">
                    <label class="label" for="status-select">
                        <p class="label-text text-base font-medium">Status</p>
                    </label>
                    <select 
                        id="status-select"
                        class="select select-bordered w-full bg-white" 
                        value={currentStatus}
                        on:change={handleStatusChange}
                    >
                        <option value="">Select a status...</option>
                        <option value="planned">Planned</option>
                        <option value="funded">Funded</option>
                        <option value="not funded">Not Funded</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>

                <div class="form-control w-full max-w-md mb-6">
                    <label class="label" for="notes-textarea">
                        <span class="label-text text-base font-medium">Notes</span>
                    </label>
                    <textarea 
                        id="notes-textarea"
                        class="textarea textarea-bordered h-32 bg-white" 
                        placeholder="Add notes about this section..."
                        value={currentNotes}
                        on:input={handleNotesChange}
                    ></textarea>
                </div>

                <div class="modal-action">
                    <button 
                        type="button"
                        class="btn btn-ghost" 
                        on:click={handleClose}
                    >
                        Cancel
                    </button>
                    <button 
                        type="button"
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