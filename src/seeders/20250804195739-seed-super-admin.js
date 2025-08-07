'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash('password', 10);

    await queryInterface.bulkInsert('Users', [
      {
        email: 'superadmin@example.com',
        password: hashedPassword,
        role: 'super_admin',
        isVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', { email: 'superadmin@example.com' });
  }
};
