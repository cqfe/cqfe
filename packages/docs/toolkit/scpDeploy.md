# ScpDeploy

## Description

A front end deploy tool for scp. init config file in your project root directory by command `sdeploy init`, and edit config file to your need. then you can simple deploy your project to remote server by command `sdeploy -n xxx`.

## Useage

1. Global install tool `sudo npm install @cqfe/deploy-scp -g`
2. Init config file `sdeploy init`
3. Edit config file to your need
4. Deploy `sdeploy -n xxx(your namespace)`

## Config Field

```js
{
    // write your local build output dir
    buildDir: 'dist',
    // remote servers config
    servers: [{
        // write your deploy namespace, should be unique, use in deploy command to select which server to deploy
        namespace: '',
        // write your remote server host
        host: '',
        // write your remote server static file path
        targetPath: '',
        // write your remote server username
        username: 'root',
        // write your remote server port, default is 22
        port: '22',
        // write your local build command, default is npm run build
        buildCmd: 'npm run build',
    }]
}
```
