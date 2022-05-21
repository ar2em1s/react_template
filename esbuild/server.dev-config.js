const { build } = require('esbuild');
const chokidar = require('chokidar');

(async () => {
  const builder = await build({
    bundle: true,
    sourcemap: true,
    platform: 'node',
    loader: { '.svg': 'dataurl', '.png': 'dataurl' },
    define: {
      'process.env.NODE_ENV': JSON.stringify(
        process.env.NODE_ENV || 'development',
      ),
    },
    entryPoints: ['./src/server/index.js'],
    incremental: true,
    minify: false,
    outdir: './build/',
  });

  chokidar
    .watch('./src/server/**/*.js', {
      awaitWriteFinish: {
        stabilityThreshold: 2000,
        pollInterval: 100,
      },
    })
    .on('add', (path) => {
      console.log(`File ${path} has been added to sever app`)
      builder.rebuild()
    })
    .on('change', (path) => {
      console.log(`File ${path} has been changed to sever app`)
      builder.rebuild()
    })
    .on('unlink', (path) => {
      console.log(`File ${path} has been removed to sever app`)
      builder.rebuild()
    })
    .on('addDir', (path) => {
      console.log(`Directory ${path} has been added to sever app`)
      builder.rebuild()
    })
    .on('unlinkDir', (path) => {
      console.log(`Directory ${path} has been removed to sever app`)
      builder.rebuild()
    })
})()
