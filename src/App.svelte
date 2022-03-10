<script>

</script>

<main>
	<div class="container mx-auto m-3">
		<h1 class="text-3xl font-extrabold text-accent">Save Bookmark</h1>

		<div class="form-control w-full max-w-xs">
			<label class="label" for="title">
				<span class="label-text">Title</span>
			</label>
			<input id="title" type="text" placeholder="Type here" class="input input-bordered w-full max-w-xs">
		</div>

<!--		<div class="form-control w-full max-w-xs">-->
<!--			<label class="label">-->
<!--				<span class="label-text">URL</span>-->
<!--			</label>-->
<!--			<input type="text" placeholder="Type here" class="input input-bordered w-full max-w-xs">-->
<!--		</div>-->
		<div class="form-control w-full max-w-xs">
			<label class="label" for="comment">
				<span class="label-text">Comment</span>
			</label>
			<textarea id="comment" placeholder="Type here" class="textarea h-36 border-accent"/>
		</div>
		<div class="mt-3 space-x-3">
			<button class="btn w-24">Save</button>
			<button class="btn w-24">Cancel</button>
		</div>
	</div>
</main>


<style lang="postcss" global>
	@tailwind base;
	@tailwind components;
	@tailwind utilities;
</style>