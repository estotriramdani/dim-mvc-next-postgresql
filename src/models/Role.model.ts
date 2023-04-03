import { Model, DataTypes } from 'sequelize';
import sequelize from '.';

interface RoleAttributes {
  id: number;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export default class Role extends Model<RoleAttributes> {
  public id!: number;
  public name!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Role.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
  },
  {
    tableName: 'roles',
    sequelize: sequelize, // instance of Sequelize
  }
);
