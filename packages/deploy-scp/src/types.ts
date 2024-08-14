export interface ServerOption {
  // deploy unique namespace
  namespace: string
  // remote deploy host
  host: string
  // remote deploy username, default is root
  username: string
  // remote deploy path
  targetPath: string
  // remote deploy port, default is 22
  port: string
  // local build command, default is `npm run build`
  buildCmd: string
}

export interface ScpDeployOption {
  // local build output dir, default is dist
  buildDir: string
  // remote server info
  servers: Array<ServerOption>
}

export interface DeployOption extends ServerOption {
  // local build output dir, default is dist
  buildDir: string
}
