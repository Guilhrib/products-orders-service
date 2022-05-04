import { Request, Response } from "express";
import { AppDataSource } from "..";
import { Products } from "../entity/products-entity";

export const GetAllProducts = async (req: Request, res: Response) => {
  const take = 15;
  const page = parseInt(req.query.page as string || '1');

  const repository = AppDataSource.getRepository(Products);

  const [data, total] = await repository.findAndCount({
    take,
    skip: (page - 1) * take
  })

  res.send({
    data,
    meta: {
      total,
      page,
      last_page: Math.ceil(total/take)
    }
  });
}

export const CreateProducts = async (req: Request, res: Response) => {
  const repository = AppDataSource.getRepository(Products);

  const product = await repository.save(req.body);

  res.status(201).send(product);
}

export const GetProductById = async (req: Request, res: Response) => {
  const repository = AppDataSource.getRepository(Products);

  res.send(await repository.findOne({
    where: {
      id: parseInt(req.params.id)
    }
  }));
}

export const UpdateProduct = async (req: Request, res: Response) => {
  const repository = AppDataSource.getRepository(Products);

  await repository.update(
    req.params.id,
    req.body
  );

  res.status(202).send(await repository.findOneBy({id: parseInt(req.params.id)}));
}

export const DeleteProduct = async (req: Request, res: Response) => {
  const repository = AppDataSource.getRepository(Products);

  await repository.delete(req.params.id);

  res.status(204).send(null);
}