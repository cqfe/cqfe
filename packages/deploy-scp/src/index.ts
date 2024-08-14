#!/usr/bin/env node
import { program } from 'commander'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import init from './actions/init'
import deploy from './actions/deploy'

const pkg = JSON.parse(readFileSync(resolve(__dirname, '../package.json'), 'utf-8'))

program.name('sdeploy').description('command line tools for scp deploy').version(pkg.version, '-v, --version')

program.command('init').description('init config files in current working directory').action(init)

program
  .command('deploy', {
    isDefault: true,
  })
  .description('deploy to remote server')
  .option('-n, --namespace <namespace...>', 'server namespace to deploy')
  .action(deploy)

program.parse(process.argv)
