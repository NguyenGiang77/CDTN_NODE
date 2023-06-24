'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users',[{
      firstName: 'John',
      lastName:  'Doe',
      email: 'example@example.com',
      password: '12345678',
      address: '123 Main Street',
      gender: 1,
      phoneNumber: '1234567890',
      roleId: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },


   down: async (queryInterface, Sequelize) =>{
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
