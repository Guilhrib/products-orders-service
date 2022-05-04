import { Request, Response } from "express";
import { AppDataSource } from "..";
import { Role } from "../entity/role-entity";

export const GetAllRoles = async (req:Request, res:Response) => {
  const repository = AppDataSource.getRepository(Role);

  res.send(await repository.find());
}

export const GetRoleById = async (req:Request, res:Response) => {
  const repository = AppDataSource.getRepository(Role);

  const role = await repository.findOne({
    where: {
      id: parseInt(req.params.id)
    },
    relations: ['permissions']
  })

  res.send(role)
}

export const CreateRole = async (req:Request, res:Response) => {
  const { name, permissions } = req.body;
  
  const repository = AppDataSource.getRepository(Role);

  const role = await repository.save({
    name,
    permissions: permissions.map(id => ({id})) 
  });

  res.status(201).send(role);
}

export const UpdateRole = async (req:Request, res:Response) => {
  const { name, permissions } = req.body;
  
  const repository = AppDataSource.getRepository(Role);

  const role = await repository.save(
    {
      id: parseInt(req.params.id),
      name,
      permissions: permissions.map(id => ({id}))
    }
  );

  res.status(202).send(role);
}

export const DeleteRole = async (req:Request, res:Response) => {
  const repository = AppDataSource.getRepository(Role);

  await repository.delete(req.params.id);

  res.status(204).send(null);
}