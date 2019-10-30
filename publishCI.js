#!/usr/bin/env node

const figlet = require('figlet');
const inquirer = require('inquirer');
var fs = require('fs'), path = require('path'), shell = require('shelljs');

/**
 * CI
 * @type {*[]}
 */
const promptList = [// 具体交互内容
    {
        type: 'input',
        message: '请设置一个channel:',
        name: 'channel',
        default: "XoBPP2vxxHdSFpLaF86EckyjoUWjiGSe3y", // 默认值
        validate: function(val) {
            if(val.match(/\w{34}/g)) { // 校验位数
                const done = this.async();
                done(null, true);
            }
            return '请输入正确的channel'
        }
    },
    {
        type: 'input',
        message: '请设置一个网站名字:',
        name: 'brand',
        default: "XTAR" // 默认值
    },
    {
        type: 'input',
        message: '请设置一个ws链接:',
        name: 'wsUrl',
        default: "http://10.0.151.135:9001" // 默认值
    },
    {
        type: 'input',
        message: '请设置一个sdk节点地址:',
        name: 'sdkUrl',
        default: "http://101.132.32.129:43026" // 默认值
    },
    {
        type: 'input',
        message: '请设置一个api链接:',
        name: 'apiUrl',
        default: "http://10.0.151.135:8888" // 默认值
    },
    {
        type: 'input',
        message: '请设置一个version:',
        name: 'version',
        default: 83951616 // 默认值
    },
    // {
    //     type: 'rawlist',
    //     message: '请选择语言:',
    //     name: 'language',
    //     choices: [
    //         "zh",
    //         "en"
    //     ]
    // },
    // {
    //     type: 'rawlist',
    //     message: '请选择主题肤色:',
    //     name: 'Theme',
    //     choices: [
    //         "Dark",
    //         "Light"
    //     ]
    // },
];



const readFile = (channel, wsUrl, sdkUrl, apiUrl, version,) => {
    fs.readFile(__dirname + '/src/app/common/util/environment.json', {flag: 'r+', encoding: 'utf8'}, function (err, data) {
        if(err) {
            console.error(err);
            throw err;
        }
        console.log(channel, brand, wsUrl, sdkUrl, apiUrl, version);
        write(JSON.parse(data), channel, wsUrl, sdkUrl, apiUrl, version)
    });
};

const write = (data, channel, wsUrl, sdkUrl, apiUrl, version) => {
    data.UAT.channel = channel;
    data.UAT.wsUrl = wsUrl;
    data.UAT.sdkUrl = sdkUrl;
    data.UAT.apiUrl = apiUrl;
    data.UAT.version = Number(version);
    var w_data = JSON.stringify(data, null, 2);

    fs.writeFile(__dirname + '/src/app/common/util/environment.json', w_data, 'utf-8', function (err, data) {
        if(err) {
            console.error(err);
            throw err;
        } else {
            shell.exec('ng serve')
        }
    });
};

const todo = () => {
    inquirer.prompt(promptList).then(answers => {
        console.log('即将为你启动，请稍等.....');
        const {channel, wsUrl, sdkUrl, apiUrl, version} = answers;
        readFile(channel, wsUrl, sdkUrl, apiUrl, version);
    });
};

const init = () => {
    figlet.text('WELCOME TO XTAR DEX', {
        font: 'big', // Ghost standard  Isometric1  roman doom big banner  letters  contessa
        horizontalLayout: 'default',
        verticalLayout: 'default'
    }, function(err, data) {
        if (err) {
            console.log('Something went wrong...');
            console.dir(err);
            return;
        }
        console.log(data);
        todo();
    })
};

init();




