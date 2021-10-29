<script>
	import Welcome from './Welcome.svelte'
</script>

<main>	
	<h1>Demo</h1>
	<Welcome name='Jayden' --my-color='blue'/>
</main>

<style>
	main {
		text-align: center;
		max-width: 480px;
		margin: 0 auto;
	}

	h1 {
		color: purple;
	}
</style>