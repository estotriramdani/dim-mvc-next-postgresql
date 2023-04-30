import { Sequelize } from 'sequelize';
import pg from 'pg';

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.PGHOST,
  logging: false,
  port: 5432,
  database: process.env.PGDATABASE,
  username: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  ssl: process.env.IS_DEV === 'TRUE' ? false : true,
  dialectModule: pg,
  dialectOptions:
    process.env.IS_DEV === 'TRUE'
      ? {}
      : {
          encrypt: true,
          ssl: {
            rejectUnauthorized: false,
          },
        },
});

export default sequelize;
