'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true, // Email sollte einzigartig sein
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdat: { // Kleinbuchstaben
        allowNull: false,
        type: Sequelize.DATE,
        field: 'createdat', // Mappt auf das korrekte Feld in der Datenbank
      },
      updatedat: { // Kleinbuchstaben
        allowNull: false,
        type: Sequelize.DATE,
        field: 'updatedat', // Mappt auf das korrekte Feld in der Datenbank
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  },
};
