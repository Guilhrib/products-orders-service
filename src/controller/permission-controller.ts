import { Request, Response } from "express";
import { AppDataSource } from "..";
import { Permissions } from "../entity/permission-entity";

export const GetPermissions = async (req: Request, res:Response) => {
  const repository = AppDataSource.getRepository(Permissions);

  res.send(await repository.find());
}