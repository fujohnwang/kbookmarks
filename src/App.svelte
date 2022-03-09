<script>
	export let name;
</script>

<main>
	<div class="container mx-auto mt-24">
		<h1 class="text-9xl font-extrabold text-red-900">Hello {name}!</h1>
		<p>Visit the <a href="https://svelte.dev/tutorial">Svelte tutorial</a> to learn how to build Svelte apps.</p>
		<input type="text" placeholder="Type here" class="input input-bordered w-full max-w-xs p-3 mt-3">
	</div>
</main>


<style lang="postcss" global>
	@tailwind base;
	@tailwind components;
	@tailwind utilities;
</style>