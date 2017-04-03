require('colors')

const path = require('path')
const express = require('express')
const proxyMiddleware = require('http-proxy-middleware')

export class Server {
  constructor(config) {
    this.config = config
    this.app = express()

    // Serve pure static assets
    if (process.env.NODE_ENV === 'production') {
      this.app.use(this.config.client.build.publicPath, express.static('../dist'))
    }
    else {
      const staticsPath = path.posix.join(this.config.client.dev.publicPath, 'statics/')
      this.app.use(staticsPath, express.static('../client/statics'))
    }

    // Define HTTP proxies to your custom API backend. See /config/index.js -> proxyTable
    // https://github.com/chimurai/http-proxy-middleware
    Object.keys(this.config.proxyTable).forEach(function (context) {
      let options = this.config.proxyTable[context]
      if (typeof options === 'string') {
        options = { target: options }
      }
      this.app.use(proxyMiddleware(context, options))
    })
  }

  run () {
    let promise = new Promise((resolve, reject) => {
      this.app.listen(this.config.port, function (err) {
        if (err) {
          reject(err)
        }
        else {
          resolve()
        }
      })
    })

    return promise
  }
}
