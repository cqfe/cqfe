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

program.name('sdfe').description('front end development tools').version(pkg.version, '-v, --version')
program.command('init').description('init app').action(init)
program.command('initConfig').description('init config files in current working directory').action(initConfig)

program
  .command('deploy')
  .description('deploy to remote server')
  .option('-a, --app <app...>', 'application should be deployed, can be multiple, separated by en comma')
  .option('-n, --namespace <namespace>', 'server namespace to deploy')
  .action(deploy)

program
  .command('build')
  .description('build an application')
  .option('-z, --zip', 'should zip the build output')
  .option('-a, --app <app...>', 'application to build')
  .option('-c, --copy <copy>', 'copy the build output to root directory')
  .action(build)

program
  .command('dev')
  .description('dev an application')
  .option('-a, --app <app...>', 'application to develop')
  .action(dev)

program
  .command('genApi')
  .description('generate api file from swagger or openapi spec')
  .option('-u, --url <url>', 'swagger or openapi spec url')
  .option('-o, --output <output>', 'output file path')
  .option('-a, --app <app>', 'application to build')
  .action(generateApi)

program.parse(process.argv)
