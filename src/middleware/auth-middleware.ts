import { Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { AppDataSource } from "..";
import { User } from "../entity/user-entity";

export const AuthMiddleware = async (req: Request, res: Response, next: Function) => {
  try {
    const jwt = req.cookies['jwt'];

    const payload: any = verify(jwt, process.env.SECRET_KEY);

    if (!payload) {
      return res.status(401).send({
        message: 'unauthenticated'
      });
    }

    const repository = AppDataSource.getRepository(User);

    req['user'] = await repository.findOne({
      where: {
        id: payload.id
      },
      relations: ['role', 'role.permissions']
    });

    next();
  } catch (e) {
      return res.status(401).send({
        message: `unauthenticated Error: ${e}`
      });
  }
}