const { resolve } = require('path');

module.exports = {
    entry: "./src/index.ts",
    output: {
        filename: "ludex-web3.js",
        path: resolve(__dirname, 'dist'),
        library: 'LudexWeb3',
        libraryTarget: 'umd'
    },
    resolve: {
        extensions: ['.js', '.ts'] // Corrected
    },
    module: {
        rules: [ // Changed to an array
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    devtool: 'source-map',
    mode: 'development'
};