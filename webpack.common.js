const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
//const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  entry:  './src/index.js',
  devtool: 'cheap-source-map',
  plugins: [
    //new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      inject: false,
      template: require('html-webpack-template'),
      links: [
        'https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css'
      ],
      bodyHtmlSnippet: `
      <h2 class="title">WIES Connections</h2>
      <div class="key">
      <span style="color:rgb(175, 101, 197)"><i class="fa fa-eyedropper"></i>: Applied Research</span>
      <span style="color:rgb(175, 101, 197)"><i class="fa fa-flask"></i>: Basic Research</span>
      <span style="color:rgb(197, 77, 81)"><i class="fa fa-id-badge"></i>: Faculty</span>
      <span style="color:rgb(197, 77, 81)"><i class="fa fa-graduation-cap"></i>: Grad Student</span>
      <span style="color:rgb(17, 181, 153)"><i class="fa fa-handshake-o"></i>: Outreach - Citizen Science</span>
      <span style="color:rgb(17, 181, 153)"><i class="fa fa-bell"></i>: Outreach - K-12</span>
      <span style="color:rgb(17, 181, 153)"><i class="fa fa-microphone"></i>: Outreach - Symposia</span>
      <span style="color:rgb(63,128,205)"><i class="fa fa-sitemap"></i>: Major Program</span>
      <span style="color:rgb(119,147,60)"><i class="fa fa-sun-o"></i>: Summer university classes</span>
      <span style="color:rgb(197, 77, 81)"><i class="fa fa-id-card"></i>: UG Student</span>
      <span style="color:rgb(119,147,60)"><i class="fa fa-book"></i>: USC Classes</span>
      <span style="color:rgb(173, 171, 27)"><i class="fa fa-trophy"></i>: USC Fellowships</span>
      <span style="color:rgb(154, 154, 154)"><i class="fa fa-file-text"></i>: Whitepapers</span>
      </div>
      <button style="visibility: hidden; display: none;" id="save-positions" type="button" onclick="savePositions();">Save Positions</button>
      <div id="mynetwork"></div>
      <div class="nodeContent"><h4>Node Content:</h4>
        <pre id="nodeContent"></pre>
      </div>
      `,
      title: 'WIES Nodes'
    })
  ],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      }
    ]
  }
};
