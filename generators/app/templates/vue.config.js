
const path = require('path');

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

function resolve(dir) {
    return path.join(__dirname,'.', dir);
}

module.exports = {
    baseUrl : '/',
    publicPath : '/',
    chainWebpack: config => {
        config.resolve.alias
        .set('@', resolve('src'))
        .set('@assets',resolve('src/assets'))
        .set('styles',resolve('src/styles'))
        .set('@utils',resolve('src/utils'))
        .set('@views',resolve('src/views'))
    },
    devServer:{
        // 设置代理
        // before: require('./src/mock'),
        proxy: {
            "/issue": {
            target: "http://192.168.10.246:10021", // 访问数据的计算机域名121.199.71.86:8003
            ws: true, // 是否启用websockets
            changOrigin: true //开启代理
            },
            "/archives": {
                target: "http://192.168.10.246:10021", // 访问数据的计算机域名121.199.71.86:8003 http://10.33.2.189:9000
                ws: true, // 是否启用websockets
                changOrigin: true //开启代理
            }
        }
        
    },
    configureWebpack: config => {
        if (process.env.NODE_ENV === 'production') {
            return {
                plugins: [new BundleAnalyzerPlugin()]
            }
        }
    }
}