import { Sequelize } from 'sequelize';
import pg from 'pg';

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.PGHOST,
  port: 5432,
  database: process.env.PGDATABASE,
  username: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  ssl: true,
  dialectModule: pg,
  dialectOptions: {
    encrypt: true,
    ssl: {
      rejectUnauthorized: false,
    },
  },
});

export default sequelize;
