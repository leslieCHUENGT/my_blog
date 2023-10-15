#!/usr/bin/env node
const { program } = require('commander');
const chalk = require('chalk');
const inquirer = require('inquirer');
const ora = require('ora')
const figlet = require("figlet");
const fs = require('fs-extra');
// ------------figlet-----------------
// console.log(
//     figlet.textSync("Boo!", {
//       font: "Ghost",
//       horizontalLayout: "default",
//       verticalLayout: "default",
//       width: 80,
//       whitespaceBreak: true,
//     })
//   );
// -----------git clone-------------------

// -----------ora----------------------------
// const spinner = ora('Loading unicorns').start();

// setTimeout(() => {
// 	spinner.color = 'yellow';
// 	spinner.text = 'Loading rainbows';
// }, 1000);
// setTimeout(() => {
//     // spinner.succeed('下载成功');
//     spinner.fail('下载失败');
// }, 4000)
// -----------inquirer --------------------
// inquirer
//     .prompt([
//         /* Pass your questions in here */
//         {
//             type: 'input',
//             name: 'food',
//             message: '你吃什么？',
//             default: '汉堡包',
//         },
//         {
//             type: 'confirm',
//             name: 'hot',
//             message: '你吃不吃？',
//             default: false,
//         }
//     ])
//     .then((answers) => {
//         // Use user feedback for... whatever!!
//         console.log(answers);
//     })
//     .catch((error) => {
//         if (error.isTtyError) {
//             // Prompt couldn't be rendered in the current environment
//         } else {
//             // Something else went wrong
//         }
//     });
// -----------chalk --------------
// const log = console.log;

// // Combine styled and normal strings
// log(chalk.blue('Hello') + ' World' + chalk.red('!'));

// // Compose multiple styles using the chainable API
// log(chalk.blue.bgRed.bold('Hello world!'));

// // Pass in multiple arguments
// log(chalk.blue('Hello', 'World!', 'Foo', 'bar', 'biz', 'baz'));

// // Nest styles
// log(chalk.red('Hello', chalk.underline.bgBlue('world') + '!'));

// // Nest styles of the same type even (color, underline, background)
// log(chalk.green(
// 	'I am a green line ' +
// 	chalk.blue.underline.bold('with a blue substring') +
// 	' that becomes green again!'
// ));

// // ES2015 template literal
// log(`
// CPU: ${chalk.red('90%')}
// RAM: ${chalk.green('40%')}
// DISK: ${chalk.yellow('70%')}
// `);

// // Use RGB colors in terminal emulators that support it.
// log(chalk.rgb(123, 45, 67).underline('Underlined reddish color'));
// log(chalk.hex('#DEADED').bold('Bold gray!'));

//------------commander-----------
// // console.log(process.argv);
// program.name('my_cli').usage('<command> [options]');
// program
//   .option('-d, --debug', 'output extra debugging')
//   .option('-s, --small', 'small pizza size')
//   .option('-p, --pizza-type <type>', 'flavour of pizza');
// // 通过绑定处理函数实现命令（这里的指令描述为放在`.command`中）
// // 返回新生成的命令（即该子命令）以供继续配置
// program
//   .command('clone <source> [destination]')
//   .description('clone a repository into a newly created directory')
//   .action((source, destination) => {
//     console.log('clone command called', source, destination);
//   });
// program.parse(process.argv);// node的环境变量,解析
// const options = program.opts();
// console.log(options);


