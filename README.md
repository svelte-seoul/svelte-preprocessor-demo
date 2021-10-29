# Preprocess-demo

## --style-props

In Svelte, `1` is syntactic sugar for `2`.

```svelte
<!-- 1 -->
<Welcome
  --my-color=blue
  --my-bg-color=red
/>
```

```svelte
<!-- 2 -->
<div style="display: contents;  --my-color: blue; --my-bg-color: red">
  <Welcome/>
</div>
```

So in `Welcome`, css-variables are available.

## Using preprocessor
Of cource this is useless. But I made it for practice.

Here's new `App.svelte`.
```svelte
<!-- App.svelte -->
<Welcome/>

<style>
	Welcome {
		--my-color: blue;
		--my-bg-color: red;
	}
</style>
```

Preprocessor modify `Welcome.svelte` using `App.svelte` before compile time.

```svelte
<!-- Welcome.svelte -->
<div style="display: contents;  --my-color: blue; --my-bg-color: red">
    <h2>Hello {name}!</h2>
    <p>Visit the <a href="https://svelte.dev/tutorial">Svelte tutorial</a> to learn how to build Svelte apps.</p>
</div>
```
