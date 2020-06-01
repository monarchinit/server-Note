import { Router } from "express";
import { todosController } from "./todos.controller";
import { authController } from "../auth/auth.controller";

const router = Router();

router.post(
  "/",
  authController.authorize,
  todosController.validateCreateTodo,
  todosController.createTodo
);
router.patch(
  "/",
  authController.authorize,
  todosController.validateUpdateTodo,
  todosController.updateTodo
);
router.get("/", authController.authorize, todosController.getTodos);
router.delete(
  "/",
  authController.authorize,
  todosController.validateDeleteTodo,
  todosController.deleteTodo
);

export const todosRouter = router;
