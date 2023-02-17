import esbuild from 'esbuild';

const context = esbuild.context;

(async () => {
	await context({
		bundle: true,
		sourcemap: false,
		platform: 'node',
		loader: { '.svg': 'dataurl', '.png': 'dataurl' },
		define: {
			'process.env.NODE_ENV': JSON.stringify(
				process.env.NODE_ENV || 'Production'
			),
		},
		entryPoints: ['./src/server/index.ts'],
		minify: true,
		outdir: './build/',
	})
		.then((ctx) => ctx.rebuild())
		.catch(() => process.exit(1));

	process.exit(0);
})();
