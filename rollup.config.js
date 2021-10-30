import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import css from 'rollup-plugin-css-only';
import cssParser from 'css';

const production = !process.env.ROLLUP_WATCH;

let cache = {};

function serve() {
	let server;

	function toExit() {
		if (server) server.kill(0);
	}

	return {
		writeBundle() {
			if (server) return;
			server = require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
				stdio: ['ignore', 'inherit', 'inherit'],
				shell: true
			});

			process.on('SIGTERM', toExit);
			process.on('exit', toExit);
		}
	};
}

export default {
	input: 'src/main.js',
	output: {
		sourcemap: true,
		format: 'iife',
		name: 'app',
		file: 'public/build/bundle.js'
	},
	plugins: [
		svelte({
			preprocess: [
				{
					markup: ({content, filename}) => {

						const [withoutPath, withoutPathAndExtension] = filename.match(/(\w+).svelte/);

						const markupStart = content.indexOf('</script>') + '</script>'.length;
						const markupEnd = content.indexOf('<style>');

						const scriptArea = content.substr(0, markupStart);
						const markupArea = content.substr(markupStart, markupEnd - markupStart);
						const styleArea = content.substr(markupEnd);

						const isHtmlTag = (input) => ['main', 'h1', 'h2', 'p'].includes(input);
						const stripStyleTag = (input) => input.substr('<stye>'.length + 1, input.indexOf('</style>') - '<stye>'.length - 1)

						let styles = {};

						cssParser.parse(stripStyleTag(styleArea)).stylesheet.rules.forEach(({ selectors, declarations }) => {
							if(!isHtmlTag(selectors[0])) {
								const componentName = selectors[0];

								const {property, value} = declarations;

								styles[componentName] = declarations.reduce((acc, {property, value}) => {
									return acc += `${property}: ${value};`
								}, '');
							}
						});

						cache = {...cache, ...styles};

						const wrap = (style, string) => (`<div style="${style}">${string}</div>`);
						
						if(cache[withoutPathAndExtension]) {
							return { 
								code: scriptArea 
										+ wrap(cache[withoutPathAndExtension], markupArea) 
										+ styleArea 
							};
						}

						return {code: content};
					}
				}
			],
			compilerOptions: {
				// enable run-time checks when not in production
				dev: !production
			}
		}),
		// we'll extract any component CSS out into
		// a separate file - better for performance
		css({ output: 'bundle.css' }),

		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration -
		// consult the documentation for details:
		// https://github.com/rollup/plugins/tree/master/packages/commonjs
		resolve({
			browser: true,
			dedupe: ['svelte']
		}),
		commonjs(),

		// In dev mode, call `npm run start` once
		// the bundle has been generated
		!production && serve(),

		// Watch the `public` directory and refresh the
		// browser on changes when not in production
		!production && livereload('public'),

		// If we're building for production (npm run build
		// instead of npm run dev), minify
		production && terser()
	],
	watch: {
		clearScreen: false
	}
};
