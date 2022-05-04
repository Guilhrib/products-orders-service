import { AppDataSource } from "..";
import { Products } from "../entity/products-entity";
import { faker } from '@faker-js/faker';
import { randomInt } from "crypto";

AppDataSource.initialize().then(async conection => {
  const repository = AppDataSource.getRepository(Products);

  for(let i = 0; i < 30; i++) {
    await repository.save({
      title: faker.lorem.word(5),
      description: faker.lorem.words(3),
      image: faker.image.imageUrl(200, 200, '', true),
      price: randomInt(10, 100)
    })
  }

  process.exit(0);
});