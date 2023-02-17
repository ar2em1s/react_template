import { context } from 'esbuild';
import chokidar from 'chokidar';

(async () => {
	const ctx = await context({
		bundle: true,
		sourcemap: true,
		platform: 'node',
		loader: { '.svg': 'dataurl', '.png': 'dataurl' },
		define: {
			'process.env.NODE_ENV': JSON.stringify(
				process.env.NODE_ENV || 'development'
			),
		},
		entryPoints: ['./src/server/index.ts'],
		minify: false,
		outdir: './build/',
	});
	await ctx.rebuild().catch((err) => console.error(err));

	chokidar
		.watch('./src/server/**/*.ts', {
			awaitWriteFinish: {
				stabilityThreshold: 2000,
				pollInterval: 100,
			},
		})
		.on('add', (path) => {
			console.log(`File ${path} has been added to server app`);
			ctx.rebuild().catch((err) => console.error(err));
		})
		.on('change', (path) => {
			console.log(`File ${path} has been changed to server app`);
			ctx.rebuild().catch((err) => console.error(err));
		})
		.on('unlink', (path) => {
			console.log(`File ${path} has been removed to server app`);
			ctx.rebuild().catch((err) => console.error(err));
		})
		.on('addDir', (path) => {
			console.log(`Directory ${path} has been added to server app`);
			ctx.rebuild().catch((err) => console.error(err));
		})
		.on('unlinkDir', (path) => {
			console.log(`Directory ${path} has been removed to server app`);
			ctx.rebuild().catch((err) => console.error(err));
		});
})();
