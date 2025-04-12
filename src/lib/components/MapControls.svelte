<script lang="ts">
    import type L from 'leaflet';
    
    export let map: L.Map;
    export let leaflet: typeof L;
</script>

<div class="leaflet-control-container">
    <div class="leaflet-top leaflet-left">
        <div class="leaflet-control-zoom leaflet-bar leaflet-control">
            <a class="leaflet-control-zoom-in" href="#" title="Zoom in" role="button" aria-label="Zoom in">+</a>
            <a class="leaflet-control-zoom-out" href="#" title="Zoom out" role="button" aria-label="Zoom out">-</a>
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