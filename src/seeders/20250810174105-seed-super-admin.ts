import bcrypt from 'bcryptjs';
import { QueryInterface } from 'sequelize';

module.exports = {
  up: async (queryInterface: QueryInterface) => {
      const hashedPassword = await bcrypt.hash('password', 10);
  
      await queryInterface.bulkInsert('users', [
        {
          email: 'superadmin@example.com',
          password: hashedPassword,
          role: 'super_admin',
          is_verified: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ], {});
  },

  down: async (queryInterface: QueryInterface) => {
     await queryInterface.bulkDelete('users', { email: 'superadmin@example.com' }, {});
  }
};