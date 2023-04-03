import sequelize from '.';
import Role from './Role.model';
import Token from './Token.model';
import User from './User.model';

const authentication = async () => {
  await sequelize.authenticate();

  Role.hasMany(User);
  User.belongsTo(Role);

  User.hasMany(Token);
  Token.belongsTo(User);

  await Role.sync();
  await User.sync();
  await Token.sync();
};

export default authentication;
