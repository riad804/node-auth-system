import { DataTypes, Model, Sequelize } from 'sequelize';

export interface IUser extends Model {
  id: number;
  email: string;
  password: string;
  role: 'super_admin' | 'admin' | 'editor' | 'user';
  isVerified: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export const UserModel = (sequelize: Sequelize) => {
  return sequelize.define<IUser>('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('super_admin', 'admin', 'editor', 'user'),
      defaultValue: 'user',
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  }, {
    tableName: 'users',
  });
}