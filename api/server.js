import express from "express";
import mongoose from "mongoose";
import { authRouter } from "./auth/auth.router";
import { todosRouter } from "./todos/todos.router";

export class FilmsServer {
  constructor() {
    this.server = null;
  }

  async start() {
    this.initServer();
    this.initMiddleware();
    this.initRoutes();
    await this.initDatabase();
    this.startListening();
  }

  initServer() {
    this.server = express();
  }

  initMiddleware() {
    this.server.use(express.json());
  }

  initRoutes() {
    this.server.use("/auth", authRouter);
    this.server.use("/todos", todosRouter);
    this.server.use((err, req, res, next) => {
      console.log(err);
      delete err.stack;
      next(err);
    });
  }

  async initDatabase() {
    await mongoose.connect(process.env.MONGODB_URL);
  }

  startListening() {
    const port = process.env.PORT;

    this.server.listen(port, () => {
      console.log("Server started listening on port", port);
    });
  }
}
