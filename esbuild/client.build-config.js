const { build } = require('esbuild');
const fs = require('fs-extra');

const generateBuild = async () => {
  if (fs.existsSync('./build/public/static')) await fs.rm('./build/public/static', { recursive: true })

  await build({
    bundle: true,
    sourcemap: true,
    loader: { '.svg': 'dataurl', '.png': 'dataurl' },
    define: {
      'process.env.NODE_ENV': JSON.stringify(
        process.env.NODE_ENV || 'development',
      ),
    },
    entryPoints: ['./src/client/index.jsx'],
    incremental: true,
    minify: true,
    outdir: './build/public//static/',
    plugins: [],
  }).catch(() => process.exit(1))

    fs.copyFile('./src/client/index.html', './build/public/index.html', (err) => {
      if (err) throw err
    })

  process.exit(0)
};

generateBuild()
