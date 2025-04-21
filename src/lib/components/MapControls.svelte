<script lang="ts">
    import type L from 'leaflet';
    
    export let map: L.Map;

    function zoomIn() {
        map.zoomIn();
    }

    function zoomOut() {
        map.zoomOut();
    }
</script>

<div class="leaflet-control-container">
    <div class="leaflet-top leaflet-left">
        <div class="leaflet-control-zoom leaflet-bar leaflet-control">
            <button class="leaflet-control-zoom-in" title="Zoom in" aria-label="Zoom in" on:click={zoomIn}>+</button>
            <button class="leaflet-control-zoom-out" title="Zoom out" aria-label="Zoom out" on:click={zoomOut}>-</button>
        </div>
    </div>
</div>

<style>
    :global(.leaflet-control-zoom) {
        margin: 10px !important;
    }

    :global(.leaflet-control-attribution) {
        font-size: 10px;
        padding: 2px 4px;
    }

    @media (min-width: 768px) {
        :global(.leaflet-control-zoom) {
            margin: 20px !important;
        }
    }
</style> 