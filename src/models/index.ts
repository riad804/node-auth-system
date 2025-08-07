import { sequelize } from "../utils/sequelize";

import { UserModel } from "./user";

export const User = UserModel(sequelize);

export {sequelize};