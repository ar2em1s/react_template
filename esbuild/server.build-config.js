const { build } = require('esbuild');

(async () => {
  await build({
    bundle: true,
    sourcemap: false,
    platform: 'node',
    loader: { '.svg': 'dataurl', '.png': 'dataurl' },
    define: {
      'process.env.NODE_ENV': JSON.stringify(
        process.env.NODE_ENV || 'Production',
      ),
    },
    entryPoints: ['./src/server/index.js'],
    incremental: true,
    minify: true,
    outdir: './build/',
  }).catch(() => process.exit(1))

  process.exit(0)
})()
