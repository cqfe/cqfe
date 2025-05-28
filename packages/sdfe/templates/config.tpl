module.exports = {
  // your app name
  app: ''
  deploy: [{
    // server namespace
    namespace: '',
    // server deployment path
    path: '',
    // server host
    host: '',
    // server ssh port
    port: ''
  }],
  genApi: {
    // name of api file
    app: '',
    // swagger document url
    url: '',
    // output file path
    output: 'apis/',
    // be imported service path
    service: "import service from '@/services/appName'"
  },
  build: {
    // copy sub application output folder to root path
    copy: '',
    // should zip output folder
    zip: true
  }
}
