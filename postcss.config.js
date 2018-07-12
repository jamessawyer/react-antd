module.exports = {
  plugins: [
    require('postcss-easy-import'),
    require('precss'),
    require('postcss-cssnext')({
      browsers: ['> 0.5%', 'last 4 versions', 'Firefox ESR', 'ios > 9', 'android > 4.4'],
      flexbox: 'no-2009',
    }),
  ],
};
