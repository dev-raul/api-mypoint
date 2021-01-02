'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

class AuthFile {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ request,response }, next) {
    // call next to advance the request
    const token = request.input('token')
    console.log('token', token)
    if(!token){
      return response.status(401).json({error: 'Você não tem permissão de acesso!'})
    }
    request.request.headers.authorization = `Bearer ${token}`
    await next()
  }
}

module.exports = AuthFile
