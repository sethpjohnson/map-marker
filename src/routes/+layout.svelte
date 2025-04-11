<script lang="ts">
	import '../app.css';
</script>

<div class="min-h-screen bg-base-100" data-theme="light">
	<slot />
</div>

<style>
	:global(html) {
		height: 100%;
		width: 100%;
	}

	:global(body) {
		margin: 0;
		padding: 0;
		height: 100vh;
		width: 100vw;
		overflow-x: hidden;
	}
</style>
