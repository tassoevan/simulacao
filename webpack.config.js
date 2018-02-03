const path = require('path');
const spawn = require('child_process').spawn;
const chalk = require('chalk');

const afterBundlePlugin = {
  apply(compiler) {
    if (!compiler.options.watch) {
      return;
    }

    compiler.plugin('done', () =>
      spawn('node', [ './dist/simulation.js' ], { stdio: 'inherit' })
        .on('close', this.onClose));
  },

  onClose(error, stdout, stderr) {
    if (error) {
      console.error('\n' + chalk.bold.red('Failed') + '\n');
    } else {
      console.log('\n' + chalk.bold.green('Done') + '\n');
    }
  }
};

module.exports = (env, args) => ({
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'simulation.js'
  },
  plugins: [ afterBundlePlugin ]
});
