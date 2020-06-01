export class Dto {
  composeUser(user) {
    const { _id: id, name, email, todos } = user;

    return {
      user: {
        id,
        name,
        email,
        todos,
      },
    };
  }
}

export const dto = new Dto();
