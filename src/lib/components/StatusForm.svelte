<script lang="ts">
    import { browser } from '$app/environment';
    import type { Feature, Geometry, GeoJsonProperties } from 'geojson';

    type Status = 'unknown' | 'survey_planned' | 'engineering' | 'ready_not_funded' | 'ready_partially_funded' | 'ready_fully_funded' | 'in_progress' | 'complete';

    export let feature: Feature<Geometry, GeoJsonProperties> | null = null;
    export let currentStatus = '';
    export let currentNotes = '';
    export let onSave: (data: { feature_id: string; status: Status; notes: string }) => void;

    function handleSave() {
        if (!feature) return;
        onSave({
            feature_id: feature.properties?.facilityid,
            status: currentStatus as Status,
            notes: currentNotes
        });
    }

    function handleStatusChange(e: Event) {
        const target = e.target as HTMLSelectElement;
        currentStatus = target.value;
    }

    function handleNotesChange(e: Event) {
        const target = e.target as HTMLTextAreaElement;
        currentNotes = target.value;
    }

    $: if (feature) {
        currentStatus = feature.properties?.status || '';
        currentNotes = feature.properties?.notes || '';
    }
</script>

{#if browser && feature}
    <div class="w-full">
        <h3 class="font-bold text-xl mb-4">Update Dredging Status</h3>
        
        <div class="form-control w-full mb-4">
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
                <option value="unknown">Unknown</option>
                <option value="survey_planned">Survey Planned</option>
                <option value="engineering">Engineering</option>
                <option value="ready_not_funded">Ready - Not Funded</option>
                <option value="ready_partially_funded">Ready - Partially Funded</option>
                <option value="ready_fully_funded">Ready - Fully Funded</option>
                <option value="in_progress">In Progress</option>
                <option value="complete">Complete</option>
            </select>
        </div>

        <div class="form-control w-full mb-6">
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

        <div class="flex justify-end">
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
{/if} 