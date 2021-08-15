module.exports = {
    module: {
        loaders: [{
            test: /\.less$/,
            loaders: [
                'style-loader',
                'css-loader',
                {
                    loader: 'less-loader',
                    options: {
                        modifyVars: CustomAntThemeModifyVars(),
                        javascriptEnabled: true // Less version > 3.0.0
                    }
                }
            ]
        }]
    }
};