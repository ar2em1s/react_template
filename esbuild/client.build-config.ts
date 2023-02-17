import { context } from 'esbuild';
import fs from 'fs-extra';

(async () => {
	const ctx = await context({
		bundle: true,
		sourcemap: true,
		loader: { '.svg': 'dataurl', '.png': 'dataurl' },
		define: {
			'process.env.NODE_ENV': JSON.stringify(
				process.env.NODE_ENV || 'development'
			),
		},
		entryPoints: ['./src/client/index.tsx'],
		minify: true,
		outdir: './build/public/static/',
		plugins: [],
	}).catch(() => process.exit(1));
	await ctx.rebuild();

	fs.copyFile('./src/client/index.html', './build/public/index.html', (err) => {
		if (err) throw err;
	});

	process.exit(0);
})();
