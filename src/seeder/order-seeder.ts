import { AppDataSource } from "..";
import { faker } from '@faker-js/faker';
import { randomInt } from "crypto";
import { Order } from "../entity/order-entity";
import { OrderItem } from "../entity/order-item-entity";

AppDataSource.initialize().then(async conection => {
  const orderRepository = AppDataSource.getRepository(Order);
  const orderItensRepository = AppDataSource.getRepository(OrderItem);

  for(let i = 0; i < 30; i++) {
    const order = await orderRepository.save({
      first_name: faker.name.firstName(),
      last_name: faker.name.lastName(),
      email: faker.internet.email(),
    });

    for(let j = 0; j < randomInt(1, 5); j++) {
      await orderItensRepository.save({
        order,
        product_title: faker.lorem.word(5),
        price: randomInt(10, 100),
        quantity: randomInt(1, 5)
      });
    }
  }

  process.exit(0);
});