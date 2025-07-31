export interface ServerOption {
  // deploy unique namespace
  namespace: string
  // remote deploy host
  host: string
  // remote deploy username, default is root
  user: string
  // remote deploy path
  path: string
  // remote deploy port, default is 22
  port?: string
}

export interface GenerateApiOptions {
  app: string
  url: string
  output: string
  service: string
}

export interface SdfeOptions {
  app: string
  deploy: Array<ServerOption>
  genApi: Array<GenerateApiOptions>
  build: BuildOptions
}

export interface DeployCmdInterface {
  app: string[]
  namespace: string
  build?: boolean
  rename?: string
}

export interface BuildOptions {
  app: string[]
  copy?: string
  zip?: boolean
}
