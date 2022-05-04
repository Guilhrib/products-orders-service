require('dotenv').config();

import express from 'express';
import cors from 'cors';
import { routes } from './routes';
import { DataSource } from 'typeorm';
import cookieParser from 'cookie-parser';

const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_SCHEMA,
  entities: [
    "src/entity/*.ts"
  ],
  logging: false,
  synchronize: true
})

AppDataSource.initialize()
  .then(() => {
    const app = express();

    app.use(express.json());
    app.use(cookieParser());
    app.use(cors({
      credentials: true,
      origin: ["http://localhost:3000"]
    }));

    routes(app);

    app.listen(8000, () => {
      console.log('listening to port 8000')
    })
  })
  .catch((err) => {
    console.log("Error during Data Source initialization", err)
  })

export {
  AppDataSource
}