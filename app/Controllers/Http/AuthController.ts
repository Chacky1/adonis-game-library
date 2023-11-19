// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import User from 'App/Models/User'
import AuthLoginValidator from 'App/Validators/AuthLoginValidator'
import AuthRegisterValidator from 'App/Validators/AuthRegisterValidator'

export default class AuthController {
  public async register({ request, response }) {
    await request.validate(AuthRegisterValidator)

    const email = request.input('email')
    const password = request.input('password')

    try {
      const user = await User.create({ email, password })
      return response.json(user)
    } catch (error) {
      return response.badRequest(error)
    }
  }

  public async login({ auth, request, response }) {
    await request.validate(AuthLoginValidator)

    const email = request.input('email')
    const password = request.input('password')

    try {
      const token = await auth.use('api').attempt(email, password)
      return response.json(token)
    } catch (error) {
      return response.unauthorized('Invalid credentials')
    }
  }

  public async logout({ auth, response }) {
    try {
      await auth.use('api').logout()
      return response.json({ message: 'Logout successfully' })
    } catch (error) {
      return response.badRequest(error)
    }
  }
}
