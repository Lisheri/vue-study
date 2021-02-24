const path = require('path')
const threadLoader = require('thread-loader');
const webpackDllConf = require('./webpack.dll.conf');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin')
const webpack = require('webpack')
function resolve(dir) {
    return path.join(__dirname, dir)
}

threadLoader.warmup({}, [
    'babel-loader'
])

module.exports = {
    // 基本路径
    publicPath: '/',
    // 打包后的文件夹
    outputDir: 'music',
    // 如果你不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建。
    productionSourceMap: false,
    // 配置全局路径
    chainWebpack: (config) => {
        config.resolve.alias
            .set('@', resolve('src'))
        const jsRule = config.module.rule('js');
        // ! 优化打包的文件， 取消node_modules下的js文件使用babel翻译
        jsRule.uses.clear(); // * 卸载本身的js配置
        // * 添加新的配置
        jsRule
            .include
                .add(resolve('src'))
                .end()
            .exclude
                .add('/node_modules/')
                .end()
            .use('thread-loader')
                .loader('thread-loader')
                .end()
            .use('babel')
                .loader('babel-loader?cacheDirectory=true')
                .end()
        // config.module.rule('js').loader('babel-loader').include([resolve('src')]).exclude('/node_modules/')
    },
    configureWebpack: {
        plugins: [
            new webpack.DllReferencePlugin({
                context: process.cwd(),
                manifest: require('./public/vendor/test-manifest.json')
            }),
            new AddAssetHtmlPlugin({
                filepath: path.join(__dirname, '/public/vendor/test.dll.js'),
              }),
        ],
        optimization: {
            concatenateModules: true
        }
    }
}