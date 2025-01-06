const tsConfigPaths = require('tsconfig-paths');

module.exports = async () => {
  tsConfigPaths.register({
    baseUrl: './src',
    paths: {
      '@components/*': ['components/*'],
      '@utils/*': ['utils/*'],
    },
  });
};
