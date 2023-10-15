#!/usr/bin/env node
const { program } = require('commander');
const chalk = require('chalk');
const path = require('path');
const inquirer = require('inquirer');
const ora = require('ora')
const figlet = require("figlet");
const fs = require('fs-extra');
const gitClone = require('git-clone');
// 仓库列表
const projectList = {
    'vue': 'git@github.com:'
}

// 首行提示
program.name('my_cli').usage('<command> [options]')
// 版本号
program.version(`v${require('../package.json').version}`)
// 命令
// 创建项目的命令
program
    .command('create <app-name>')
    .description('Create a new instance')
    .action(async (name) => {
        // 1.先判断有没有已经存在了？
        const targetPath = path.join(process.cwd(), name)
        // console.log(process.cwd());// 绝对路径
        if (fs.existsSync(path.join(process.cwd(), name))){
            // 存在的话
            const answers = await inquirer.prompt([
                {
                    type: 'confirm',
                    message: '是否要进行覆盖之前的文件夹',
                    default: false,
                    name: 'overwrite'
                }
            ])
            if (answers.overwrite) {
                fs.remove(targetPath)
                console.log('删除成功')
            }else {
                return;
            }
        } else { }
        const answers = await inquirer.prompt([
            {
                type: 'list',
                message: '选择你所需的框架',
                name: 'type',
                choices: [
                    {
                        name: 'vue',
                        value: 'vue',
                    },
                    {
                        name: 'react',
                        value: 'react',
                    }
                ]
            },
            {
                type: 'list',
                message: '是否使用ts?',
                name: 'ts',
                choices: [
                    {
                        name: '是',
                        value: true,
                    },
                    {
                        name: '否',
                        value: false,
                    }
                ]
            }
        ])
        console.log(answers)
        const key = answers.type + (answers.ts ? '&ts' : '');
        const spinner = ora('Loading...').start();
        gitClone(projectList[key], name, { checkout: 'main' }, (err) => {
            if (err) {
                spinner.fail('下载失败');
            } else {
                spinner.succeed('下载成功');
                fs.remove(path.join(targetPath, '.git'));
            }
        })
    })
// 给 help信息添加提示
program.on('--help', () => {
    console.log(
        figlet.textSync("Boo!", {
        font: "Ghost",
        horizontalLayout: "default",
        verticalLayout: "default",
        width: 100,
        whitespaceBreak: true,
        })
    );
})
program.parse(process.argv);