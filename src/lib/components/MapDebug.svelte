<script lang="ts">
    export let messages: string[] = [];
</script>

<div 
    id="map-debug"
    class="absolute top-[10px] left-[10px] bg-black/70 text-white p-[10px] z-[1000]"
>
    {#each messages as message}
        <div>{message}</div>
    {/each}
</div> 