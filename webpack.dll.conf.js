const path = require('path');

const webpack = require('webpack');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');

// * dll文件存储路径
const dllPath = 'public/vendor'

module.exports = {
    entry: {
        // 需要提取的库文件
        vendor: ['vue', 'vue-router', 'axios', 'ant-design-vue']
    },
    output: {
        path: path.join(__dirname, dllPath),
        filename: 'test.dll.js',
        // vendor.dll.js中暴露出的全局变量名
        // 保持与webpack.DllPlugin中名称一致
        library: 'test_[hash]'
    },
    plugins: [
        // * 清除之前的dll文件
        new CleanWebpackPlugin(),
        // * 设置环境变量
        // new webpack.DefinePlugin({
        //     'process.env': {
        //         NODE_ENV: 'production'
        //     }
        // }),
        // * manifest.json 描述动态链接库包含了哪些内容
        new webpack.DllPlugin({
            path: path.join(__dirname, dllPath, 'test-manifest.json'),
            // * 保持与 output.library中文名称一致
            name: 'test_[hash]',
            context: process.cwd()
        })
    ]
}