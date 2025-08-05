# deploy-scp

It has been integrated into @cqfe/sdfe. Please use the new cli tool [@cqfe/sdfe](https://github.com/cqfe/cqfe/tree/main/packages/sdfe)

## Description

A front end deploy tool for scp. init config file in your project root directory by command `sdeploy init`, and edit config file to your need. then you can simple deploy your project to remote server by command `sdeploy -n xxx`.

## Usage

1. Global install tool `sudo npm install @cqfe/deploy-scp -g`
2. Init config file `sdeploy init`
3. Edit config file to your need
4. Deploy `sdeploy -n xxx(your namespace)`

## Example

以下配置会自行如下操作

```js
{
  buildDir: 'dist',
  servers: [{
    namespace: 'test',
    host: '206.237.17.153',
    username: 'root',
    targetPath: '/var/tmp/dist2',
    buildCmd: 'mkdir dist'
  }]
}
```

1. 执行清理命令包括
   - 构建目录清理：`buildDir` -> `resolve(process.cwd(),dist)`
   - 重命名目录`targetPath.split('/').pop()` -> `resolve(process.cwd(),dist2)`
   - 重命名目录压缩文件`targetPath.dir.zip` -> `resolve(process.cwd(),dist2.zip)`
2. 执行构建命令`buildCmd` -> `mkdir dist`
3. 重命名构建文件夹`buildDir`(dist) -> `targetPath.split('/').pop()`(dist2)
4. 压缩重命名文件夹`targetPath.split('/').pop()` -> `targetPath.split('/').pop().zip`
5. 存在密码则写入粘贴板，环境变量中密码key命名为`PWD_${usename}_${host}.replaceALL('.','_')`
6. 执行scp命令`scp -P ${port} ${targetPath.split('/').pop().zip} ${username}@${host}:${targetPath}.zip`

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
