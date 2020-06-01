import Joi from "joi";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  ValidationError,
  ConflictError,
  UnauthorizedError,
} from "../helpers/errors.contructor";
import { userModel } from "../user/user.model";
import { getControllerProxy } from "../helpers/controllers.proxy";
import { sessionModel } from "../session/session.model";
import { dto } from "../helpers/dto";

class AuthController {
  constructor() {
    this._saltRounds = 5;
    this._jwtSecret = process.env.JWT_SECRET;
  }

  async signUp(req, res) {
    // 1. validate req body
    // 2. throw 409 if user with such email exists
    // 3. hash password
    // 4. create user
    // 5. send successfull response
    const { email, password, name } = req.body;
    console.log(name, "name");

    const existingUser = await userModel.findUserByEmail(email);
    if (existingUser) {
      throw new ConflictError("User with such email already exists");
    }

    const passwordHash = await bcryptjs.hash(password, this._saltRounds);

    const newUser = await userModel.createUser(name, email, passwordHash);
    const newSession = await sessionModel.createSession(newUser._id);
    const token = await jwt.sign(
      { sessionId: newSession._id, ueserId: newUser._id },
      this._jwtSecret
    );

    return res.status(201).json({ ...dto.composeUser(newUser), token });
  }

  async signIn(req, res) {
    // 1. validate req body
    // 2. get user with email
    // 3. 401 no user with such email
    // 4. 401 if wrong password
    // 5. generate token
    // 6. send successfull response

    const { email, password } = req.body;

    const user = await userModel.findUserByEmail(email);
    if (!user) {
      throw new UnauthorizedError("Authentication failed");
    }

    const isPasswordCorrect = await bcryptjs.compare(
      password,
      user.passwordHash
    );
    if (!isPasswordCorrect) {
      throw new UnauthorizedError("Authentication failed");
    }

    const newSession = await sessionModel.createSession(user._id);
    const token = await jwt.sign(
      { sessionId: newSession._id, ueserId: user._id },
      this._jwtSecret
    );

    return res.status(201).json({
      ...dto.composeUser(user),
      token,
    });
  }

  async authorize(req, res, next) {
    const authHeader = req.get("Authorization") || "";
    const token = authHeader.replace("Bearer ", "");

    let sessionID;
    try {
      const { sessionId, ueserId } = await jwt.verify(token, this._jwtSecret);
      sessionID = sessionId;
    } catch (err) {
      throw new UnauthorizedError(err);
    }

    const session = await sessionModel.findSessionById(sessionID);
    if (!session || session.status === "Disabled") {
      throw new UnauthorizedError("Session is disabled");
    }

    req.userId = session.userId;
    req.session = session;

    next();
  }

  async signOut(req, res, next) {
    try {
      const { _id: sessionId } = req.session;
      await sessionModel.disableSession(sessionId);

      return res.status(204).send();
    } catch (err) {
      next(err);
    }
  }

  validateSignUp(req, res, next) {
    const signUpRules = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().required(),
      password: Joi.string().required(),
    });

    const result = Joi.validate(req.body, signUpRules);
    if (result.error) {
      return next(new ValidationError(result.error));
    }

    next();
  }

  validateSignIn(req, res, next) {
    const signInRules = Joi.object({
      email: Joi.string().required(),
      password: Joi.string().required(),
    });

    const result = Joi.validate(req.body, signInRules);
    if (result.error) {
      return next(new ValidationError(result.error));
    }

    next();
  }
}

export const authController = getControllerProxy(new AuthController());
