// import { Dialect, Sequelize } from 'sequelize';

// interface DBConfig {
//   username: string;
//   password: string;
//   database: string;
//   host: string;
//   dialect: Dialect;
// }

// const config: {[env: string]: DBConfig} = {
//   // development: {
//   //   username: 'db_user',
//   //   password: 'dev.riad2654',
//   //   database: 'auth_system_db',
//   //   host: '127.0.0.1',
//   //   dialect: 'mysql',
//   // },
//   development: {
//     username: process.env.DB_USER || 'root',
//     password: process.env.DB_PASSWORD || '',
//     database: process.env.DB_NAME || 'auth_system_db',
//     host: process.env.DB_HOST || 'localhost',
//     dialect: 'mysql',
//   },
// }

// export = config;

module.exports = {
  development: {
    username: 'db_user',
    password: 'dev.riad2654',
    database: 'auth_system_db',
    host: '127.0.0.1',
    dialect: 'mysql',
  },
};