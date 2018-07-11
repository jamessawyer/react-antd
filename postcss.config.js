module.exports = {
  plugins: [
    require('precss'),
    require('postcss-cssnext'),
    require('autoprefixer')({
      browsers: ['> 0.5%', 'last 4 versions', 'Firefox ESR', 'ios > 9', 'android > 4.4'],
      flexbox: 'no-2009',
    }),
  ],
};
