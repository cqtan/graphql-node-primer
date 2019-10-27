require("babel-register") // For ES6 import/export syntax
require("@babel/polyfill/noConflict")
const server = require("../../src/server").default // .default because ES6 export in server.js

module.exports = async () => {
  global.httpServer = await server.start({ port: 4000 })
}
