<script lang="ts">
    import { browser } from '$app/environment';
    import Map from '$lib/components/Map.svelte';
</script>

<div class="min-h-screen bg-base-200">
    <div class="container mx-auto p-4 h-[calc(100vh-2rem)] flex flex-col">
        <h1 class="text-3xl font-bold mb-4">Phillippi Creek Dredging Tracker</h1>
        
        <div class="flex-1 flex flex-col lg:flex-row gap-4 min-h-0">
            <!-- Map -->
            <div class="flex-1 bg-white rounded-lg shadow-lg h-full">
                {#if browser}
                    <Map />
                {:else}
                    <div class="flex items-center justify-center h-full">
                        <p>Loading map...</p>
                    </div>
                {/if}
            </div>

            <!-- Legend -->
            <div class="lg:w-64 bg-white p-4 rounded-lg shadow-lg">
                <h2 class="text-xl font-semibold mb-4">Status Legend</h2>
                <div class="space-y-2">
                    <div class="flex items-center">
                        <div class="w-4 h-4 bg-[#808080] mr-2"></div>
                        <span>Unknown</span>
                    </div>
                    <div class="flex items-center">
                        <div class="w-4 h-4 bg-[#87CEEB] mr-2"></div>
                        <span>Survey Planned</span>
                    </div>
                    <div class="flex items-center">
                        <div class="w-4 h-4 bg-[#800080] mr-2"></div>
                        <span>Engineering</span>
                    </div>
                    <div class="flex items-center">
                        <div class="w-4 h-4 bg-[#FF0000] mr-2"></div>
                        <span>Ready - Not Funded</span>
                    </div>
                    <div class="flex items-center">
                        <div class="w-4 h-4 bg-[#FFA500] mr-2"></div>
                        <span>Ready - Partially Funded</span>
                    </div>
                    <div class="flex items-center">
                        <div class="w-4 h-4 bg-[#FFFF00] mr-2"></div>
                        <span>Ready - Fully Funded</span>
                    </div>
                    <div class="flex items-center">
                        <div class="w-4 h-4 bg-[#008000] mr-2"></div>
                        <span>In Progress</span>
                    </div>
                    <div class="flex items-center">
                        <div class="w-4 h-4 bg-[#000080] mr-2"></div>
                        <span>Complete</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
