<script lang="ts">
    import { browser } from '$app/environment';
    import Map from '$lib/components/Map.svelte';
</script>

<div class="min-h-screen bg-base-200">
    <div class="container mx-auto p-4">
        <h1 class="text-3xl font-bold mb-4">Phillippi Creek Dredging Tracker</h1>
        
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <!-- Map -->
            <div class="lg:col-span-3 h-[600px] bg-white rounded-lg shadow-lg">
                {#if browser}
                    <Map />
                {:else}
                    <div class="flex items-center justify-center h-full">
                        <p>Loading map...</p>
                    </div>
                {/if}
            </div>

            <!-- Legend -->
            <div class="bg-white p-4 rounded-lg shadow-lg">
                <h2 class="text-xl font-semibold mb-4">Status Legend</h2>
                <div class="space-y-2">
                    <div class="flex items-center">
                        <div class="w-4 h-4 bg-[#FFA500] mr-2"></div>
                        <span>Planned</span>
                    </div>
                    <div class="flex items-center">
                        <div class="w-4 h-4 bg-[#008000] mr-2"></div>
                        <span>Funded</span>
                    </div>
                    <div class="flex items-center">
                        <div class="w-4 h-4 bg-[#FF0000] mr-2"></div>
                        <span>Not Funded</span>
                    </div>
                    <div class="flex items-center">
                        <div class="w-4 h-4 bg-[#0000FF] mr-2"></div>
                        <span>Completed</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
