import Joi from "joi";
import { ValidationError } from "../helpers/errors.contructor";
import { userModel } from "../user/user.model";
import { todosModel } from "./todosModel";
import { getControllerProxy } from "../helpers/controllers.proxy";

class TodosController {
  async createTodo(req, res) {
    const { value } = req.body;
    const newRes = await todosModel.createTodo(value, req.userId);
    await userModel.createTodoId(newRes._id, req.userId);
    return res.status(201).send({ todo: newRes });
  }

  async updateTodo(req, res) {
    const { value, todoId } = req.body;
    const newRes = await todosModel.updateTodo(value, todoId);
    return res.status(200).send({ todo: newRes });
  }

  async deleteTodo(req, res) {
    const { todoId } = req.body;

    await userModel.deleteTodoId(todoId, req.userId);
    const r = await todosModel.deleteTodo(todoId);
    console.log(r, "r");

    return res.status(204).send();
  }

  async getTodos(req, res) {
    const myData = await userModel
      .findById(req.userId)
      .populate("todos")
      .exec((err, todos) => {
        res.status(200).json({ todos: todos.todos });
      });
  }

  validateUpdateTodo(req, res, next) {
    const updateTodoRules = Joi.object({
      value: Joi.string().required(),
      todoId: Joi.string().required(),
    });

    const result = Joi.validate(req.body, updateTodoRules);
    if (result.error) {
      return next(new ValidationError(result.error));
    }

    next();
  }

  validateCreateTodo(req, res, next) {
    const createTodoRules = Joi.object({
      value: Joi.string().required(),
    });

    const result = Joi.validate(req.body, createTodoRules);
    if (result.error) {
      return next(new ValidationError(result.error));
    }

    next();
  }

  validateDeleteTodo(req, res, next) {
    const deleteTodoRules = Joi.object({
      todoId: Joi.string().required(),
    });

    const result = Joi.validate(req.body, deleteTodoRules);
    if (result.error) {
      return next(new ValidationError(result.error));
    }

    next();
  }
}

export const todosController = getControllerProxy(new TodosController());
