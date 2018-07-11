module.exports = {
  plugins: [
    require('precss'),
    require('postcss-cssnext')({ browsers: ['> 1%', 'last 2 versions'] }),
  ],
};
