const config = {
  entry:  {
    main: __dirname + '/src/index.js' 
  },
  output: {
    filename: 'bundle.js',
    path: __dirname + '/dist'
  }
};

module.exports = config;
