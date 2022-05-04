import { Request, Response } from "express";
import { AppDataSource } from "..";
import { User } from "../entity/user-entity";
import bcyptjs from 'bcryptjs'

export const GetAll = async (req: Request, res: Response) => {
  const take = 10;
  const page = parseInt(req.query.page as string || '1');

  const repository = AppDataSource.getRepository(User);
  

  const [data, total] = await repository.findAndCount({
    take,
    skip: (page - 1) * take,
    relations: ['role']
  });

  res.send({
    data: data.map(user => {
      const {password, ...data} = user;
      return data;
    }),
    meta: {
      total,
      page,
      last_page: Math.ceil(total/take)
    }
  });
}

export const CreateUser = async (req: Request, res: Response) => {
  const {role_id, ...body} = req.body;
  const hashedPassword = await bcyptjs.hash('user', 10);

  const repository = await AppDataSource.getRepository(User);

  const {password, ...user} = await repository.save({
    ...body,
    password: hashedPassword,
    role: {
      id: role_id
    }
  })

  res.status(201).send(user);
}

export const GetUserById = async (req: Request, res: Response) => {
  const repository = await AppDataSource.getRepository(User);

  const userId = parseInt(req.params.id);

  const {password, ...user} = await repository.findOne({
    where: {
      id: userId
    },
    relations: ['role']
  })

  res.send(user);
}

export const UpdateUser = async (req: Request, res: Response) => {
  const {role_id, ...body} = req.body;
  const repository = await AppDataSource.getRepository(User);
  const userId = parseInt(req.params.id);

  await repository.update(req.params.id, {
    ...body,
    role: {
      id: role_id
    }
  });

  const {password, ...user} = await repository.findOne({
    where: {
      id: userId
    },
    relations: ['role']
  })

  res.status(202).send(user);
}

export const DeleteUser = async (req: Request, res: Response) => {
  const repository = await AppDataSource.getRepository(User);
  // const userId = parseInt(req.params.id);

  await repository.delete(req.params.id)

  res.status(204).send(null);
}