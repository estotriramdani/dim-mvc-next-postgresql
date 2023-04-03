import { Model, DataTypes } from 'sequelize';
import sequelize from '.';
interface TokenAttributes {
  id?: number;
  token: string;
  UserId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export default class Token extends Model<TokenAttributes> {
  public id!: number;
  public token!: string;
  public UserId!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Token.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    token: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    UserId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
  },
  {
    tableName: 'tokens',
    sequelize: sequelize, // instance of Sequelize
  }
);
