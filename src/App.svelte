<script>
	import Welcome from './Welcome.svelte'
</script>

<main>	
	<h1>Demo</h1>
	<Welcome name='Jayden'/>
</main>

<style>
	Welcome {
		/* display: contents; */
		--my-color: blue;
		--my-bg-color: red;
		background-color: green;
	}
	main {
		text-align: center;
		max-width: 480px;
		margin: 0 auto;
	}

	h1 {
		color: purple;
	}
</style>
