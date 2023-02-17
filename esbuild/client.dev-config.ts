import { context } from 'esbuild';
import chokidar from 'chokidar';
import servor from 'servor';
import fs from 'fs';

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
		minify: false,
		outdir: './build/public/static/',
		plugins: [],
	});
	await ctx.rebuild().catch((err) => console.error(err));

	chokidar
		.watch('./src/client/**/*.{ts,tsx}', {
			awaitWriteFinish: {
				stabilityThreshold: 2000,
				pollInterval: 100,
			},
		})
		.on('add', () => {
			ctx.rebuild().catch((err) => console.error(err));
		})
		.on('change', (path) => {
			console.log(`File ${path} has been changed to client app`);
			ctx.rebuild().catch((err) => console.error(err));
		})
		.on('unlink', (path) => {
			console.log(`File ${path} has been removed to client app`);
			ctx.rebuild().catch((err) => console.error(err));
		})
		.on('addDir', (path) => {
			console.log(`Directory ${path} has been added to client app`);
			ctx.rebuild().catch((err) => console.error(err));
		})
		.on('unlinkDir', (path) => {
			console.log(`Directory ${path} has been removed to client app`);
			ctx.rebuild().catch((err) => console.error(err));
		});

	fs.copyFile('./src/client/index.html', './build/public/index.html', (err) => {
		if (err) throw err;
	});

	await servor({
		root: './build/public/',
		static: false,
		fallback: 'index.html',
		reload: true,
		port: 3001,
	});

	console.info(['Servor hot refresh at http://localhost:3001']);
})();
