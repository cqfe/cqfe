#!/usr/bin/env node
import { program } from 'commander'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import init from './actions/init'
import deploy from './actions/deploy'

const pkg = JSON.parse(readFileSync(resolve(__dirname, '../package.json'), 'utf-8'))

program.name('sdfe').description('front end development tools').version(pkg.version, '-v, --version')

program.command('init').description('init config files in current working directory').action(init)

program
  .command('deploy', {
    isDefault: true,
  })
  .description('deploy to remote server')
  .option('-a, --app <app...>', 'application should be deployed, can be multiple, separated by en comma')
  .option('-n, --namespace <namespace>', 'server namespace to deploy')
  .action(deploy)

// TODO
program
  .command('build')
  .description('build an application')
  .option('-z, --zip', 'should zip the build output')
  .option('-a, --app', 'application to build')
  .option('-c, --copy', 'copy the build output to root directory')
  .action(deploy)

// TODO
program
  .command('genApi')
  .description('generate api file from swagger or openapi spec')
  .option('-u, --url', 'swagger or openapi spec url')
  .option('-o, --output', 'output file path')
  .option('-a, --app', 'application to build')
  .action(deploy)

program.parse(process.argv)
