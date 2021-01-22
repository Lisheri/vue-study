function resolve(dir) {
    return path.join(__dirname, dir)
}
const path = require('path')
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
    }
}