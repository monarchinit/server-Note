import mongoose from "mongoose";
const { Schema } = mongoose;

const todoSchema = new Schema(
  {
    value: { type: String, required: true },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

todoSchema.statics.createTodo = createTodo;
todoSchema.statics.updateTodo = updateTodo;
todoSchema.statics.deleteTodo = deleteTodo;

function createTodo(value, userId) {
  return this.create({ value, author: userId });
}

function updateTodo(value, todoId) {
  return this.findByIdAndUpdate(todoId, { value });
}

function deleteTodo(todoId) {
  return this.findByIdAndDelete(todoId);
}

export const todosModel = mongoose.model("Todo", todoSchema, "todos");
