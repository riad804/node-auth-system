create_table:
  npx sequelize-cli migration:generate --name create-users
  npx sequelize-cli db:migrate --require ts-node/register

  // Seed super admin
  npx sequelize-cli seed:generate --name seed-super-admin

  //run the seed
  npx sequelize-cli db:seed:all --require ts-node/register
  //undo the seed
  npx sequelize-cli db:seed:undo --require ts-node/register

