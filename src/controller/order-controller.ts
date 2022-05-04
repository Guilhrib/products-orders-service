import { Request, Response } from "express";
import { Parser } from "json2csv";
import { AppDataSource } from "..";
import { Order } from "../entity/order-entity";
import { OrderItem } from "../entity/order-item-entity";

export const GetAllOrders = async (req: Request, res: Response) => {
  const take = 10;
  const page = parseInt(req.query.page as string || '1');

  const repository = AppDataSource.getRepository(Order);

  const [data, total] = await repository.findAndCount({
    take,
    skip: (page - 1) * take,
    relations: ['order_itens']
  });

  res.send({
    data: data.map((order:Order) => ({
      id: order.id,
      name: order.name,
      email: order.email,
      total: order.total,
      created_at: order.created_at,
      order_itens: order.order_itens
    })),
    meta: {
      total,
      page,
      last_page: Math.ceil(total / take)
    }
  });
}

export const ExportOrder = async (req: Request, res: Response) => {
  const parse = new Parser({
    fields: ['ID', 'Name', 'Email', 'Product Title', 'Price', 'Quantity']
  });

  const repository = AppDataSource.getRepository(Order);

  const orders = await repository.find({relations: ['order_itens']});

  const json = [];

  orders.forEach((order: Order) => {
    json.push({
      ID: order.id,
      Name: order.name,
      Email: order.email,
      'Product Title': '',
      Price: '',
      Quantity: ''
    })

    order.order_itens.forEach((itens: OrderItem) => {
      json.push({
        ID: '',
        Name: '',
        Email: '',
        'Product Title': itens.product_title,
        Price: itens.price,
        Quantity: itens.quantity
      })
    });
  });

  const csv = parse.parse(json);

  res.header('Content-Type', 'text/csv');
  res.attachment('orders.csv');
  res.send(csv);
}

export const OrderByDate = async (req: Request, res: Response) => {
  const result = await AppDataSource.manager.query(`
    SELECT date_format(express_study.order.created_at, '%Y-%m-%d') as date, sum(express_study.order_item.price * express_study.order_item.quantity) as soma
    FROM express_study.order
    JOIN express_study.order_item on order_id = order_item.order_id
    GROUP BY date
  `);

  res.send(result);
}