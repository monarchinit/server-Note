import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    todos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Todo",
      },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.statics.findUserByEmail = findUserByEmail;
userSchema.statics.createUser = createUser;
userSchema.statics.deleteTodoId = deleteTodoId;
userSchema.statics.createTodoId = createTodoId;

function findUserByEmail(email) {
  return this.findOne({ email });
}

function createUser(name, email, passwordHash) {
  return this.create({ name, email, passwordHash });
}

function createTodoId(todoId, userId) {
  return this.findByIdAndUpdate(userId, { $push: { todos: todoId } });
}

function deleteTodoId(todoId, userId) {
  return this.findByIdAndUpdate(userId, { $pull: { todos: todoId } });
}

// users
export const userModel = mongoose.model("User", userSchema);
