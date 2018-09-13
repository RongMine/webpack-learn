const path = require('path');
const fs = require('fs');
const chalk = require('chalk');//命令行
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');//开发模式使用服务器

var config = require('./webpack.config.js');//配置文件
var env = process.env.NODE_ENV;//环境

function handleStatsMessage(err, stats) {
    if (err || stats.hasErrors()) {
        console.log(chalk.red('编译失败'), chalk.red(JSON.stringify(err)));
        stats.toJson().errors.map((err) => console.log(chalk.red(err)));
        process.exit('编译失败');
    }
    let ob = stats.toJson({
        depth: true
    });
    console.log(chalk.white(`输出目录：${ob.outputPath}，编译耗时：${ob.time}ms,构建时间戳：${ob.builtAt}`));
    console.log(chalk.white("编译文件列表："));
    ob.assets.forEach((asset) => {
        console.log(chalk.green(path.resolve("build", asset.name)));
    });
    console.log(chalk.white(`编译完成${env === 'dev' ? '，监听中...' : ''}`));
}

//webpack构建
function build(entry) {
    console.log(chalk.white('编译中...'));
    let compiler = webpack(Object.assign(config, entry));
    if (env === 'dev') {
        let server = new WebpackDevServer(compiler, {
            contentBase: path.resolve('build'),
            compress: true,
            hot: true,
        });
        server.listen(8080,'localhost',(err) => {
            if (err) {
                return console.log(err);
            }
            console.log(chalk.green('Starting the development server...'));
            console.log();

            // openBrowser(protocol + '://' + host + ':' + port + '/');
        });
    }
    else
        compiler.run((err, stats) => {
            handleStatsMessage(err, stats);
        });
}

//构建entry
function init() {
    build();
}

init();