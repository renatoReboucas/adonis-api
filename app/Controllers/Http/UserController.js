'use strict'
// 22:11
const User = use('App/Models/User')
const { validateAll } = use('Validator')
class UserController {
   async create({request, response}){
    try {

      const erroMensage = {
        "username.required": "Esse campo é obrigatório",
        "username.unique": "Esse usuário já existe",
        "username.min": "O username deve ter mais que 5 caracteres",
      };
      // ! validacao usuario
      const validation =await validateAll(request.all(),{
        username:  'required|min:5|unique:users',
        email: 'required|email|unique:users',
        password: 'required|min:6'
      }, erroMensage)

      if(validation.fails()){
        return response.status(400).send({message: validation.messages()})
      }
      const data = request.only(["username", "email", "password"]);
      const user = await User.create(data);
      return user;
    } catch (error) {
      response.status(500).send({error: `Erro: ${error.message}`})
    }
  }

  async login ({request, response, auth}){
    try {
      const {email, password} = request.all()
      const validToken = await auth.attempt(email,password)
      return validToken
    } catch (error) {
      response.status(500).send({ error: `Erro: ${error.message}` });
    }
  }

}

module.exports = UserController
