import { Model, DataTypes } from 'sequelize';
import sequelize from '.';
import Role from './Role.model';

interface UserAttributes {
  id?: number;
  email: string;
  password: string;
  name: string;
  RoleId: number;
  Role?: Role;
  createdAt?: Date;
  updatedAt?: Date;
}

export default class User extends Model<UserAttributes> {
  public id!: number;
  public email!: string;
  public password!: string;
  public name!: string;
  public RoleId!: number;
  public role!: Role;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(128),
      allowNull: true,
    },
    RoleId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
  },
  {
    tableName: 'users',
    sequelize: sequelize, // instance of Sequelize
  }
);
