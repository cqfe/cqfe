#!/usr/bin/env node
import { program } from 'commander'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import init from './actions/init'
import deploy from './actions/deploy'
import build from './actions/build'
import dev from './actions/dev'
import generateApi from './actions/generateApi'
import initConfig from './actions/initConfig'

const pkg = JSON.parse(readFileSync(resolve(__dirname, '../package.json'), 'utf-8'))

program.name('sdfe').description('Front end development tools').version(pkg.version, '-v, --version')
program.command('init').description('Init app').action(init)
program.command('initConfig').description('Init config files in current working directory').action(initConfig)

program
  .command('deploy')
  .description('Deploy to remote server')
  .option('-a, --app <app...>', 'Application should be deployed, can be multiple, separated by en comma')
  .option('-n, --namespace <namespace>', 'Server namespace to deploy')
  .option('-b, --build', 'Build before deploy')
  .option('-r, --rename <rename>', 'Folder name in remote server, default is appName or folderName')
  .action(deploy)

program
  .command('build')
  .description('Build an application')
  .option('-z, --zip', 'Should zip the build output')
  .option('-a, --app <app...>', 'Application to run build command')
  .option('-c, --copy <copy>', 'Copy the build output to root directory')
  .action(build)

program
  .command('dev')
  .description('Dev an application')
  .option('-a, --app <app...>', 'Application to run dev command')
  .action(dev)

program
  .command('genApi')
  .description('Generate api file from swagger or openapi spec')
  .option('-u, --url <url>', 'Swagger or openapi spec url')
  .option('-o, --output <output>', 'Output file path')
  .option('-a, --app <app>', 'Application to build')
  .action(generateApi)

program.parse(process.argv)
