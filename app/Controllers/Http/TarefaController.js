"use strict";


/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with tarefas
 */
const Tarefa = use("App/Models/Tarefa");
const Database = use("Database");
class TarefaController {
  /**
   * Show a list of all tarefas.
   * GET tarefas
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ request, response, auth }) {
    try {
      // const tarefa = await Tarefa.all();
      const tarefa = Database.select("titulo", "descricao")
        .from("tarefas")
        .where("user_id", auth.user.id);
      return tarefa;
    } catch (error) {
      response.status(500).send({ error: `Erro: ${error.message}` });
    }
  }

  /**
   * Create/save a new tarefa.
   * POST tarefas
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response, auth }) {
    try {
      const { id } = auth.user;
      const data = request.only(["titulo", "descricao"]);
      const tarefa = await Tarefa.create({ ...data, user_id: id });
      return tarefa;
    } catch (error) {
      response.status(500).send({ error: `Erro: ${error.message}` });
    }
  }

  /**
   * Display a single tarefa.
   * GET tarefas/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, request, response, auth }) {
    const tarefa = await Tarefa.query()
      .where("id", params.id)
      .where("user_id", "=", auth.user.id)
      .first();
    if (!tarefa) {
      response.status(404).send({ message: `Nenhum registro localizado` });
    }
    return tarefa;
  }

  /**
   * Update tarefa details.
   * PUT or PATCH tarefas/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response, auth }) {
    const { titulo, descricao } = request.all();
    const tarefa = await Tarefa.query()
      .where("id", params.id)
      .where("user_id", "=", auth.user.id)
      .first();

    if (!tarefa) {
      response.status(404).send({ message: `Nenhum registro localizado` });
    }

    tarefa.titulo = titulo;
    tarefa.descricao = descricao;
    tarefa.id = params.id;
    await tarefa.save();
    return tarefa;
  }

  /**
   * Delete a tarefa with id.
   * DELETE tarefas/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response, auth }) {
    const tarefa = await Tarefa.query()
      .where("id", params.id)
      .where("user_id", "=", auth.user.id)
      .first();

    if (!tarefa) {
      response.status(404).send({ message: `Nenhum registro localizado` });
    }
    await tarefa.delete()
    response.status(200).send({ message: `Registro deletado` });
  }
}

module.exports = TarefaController;
