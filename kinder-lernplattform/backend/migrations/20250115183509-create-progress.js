'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('progresses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userid: { // Fremdschlüssel zu "users"
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users', // Name der referenzierten Tabelle
          key: 'id',
        },
        onDelete: 'CASCADE', // Verhalten bei Löschung eines Benutzers
      },
      category: {
        type: Sequelize.STRING,
      },
      score: {
        type: Sequelize.INTEGER,
      },
      timestamp: {
        type: Sequelize.DATE,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        field: 'createdat'
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        field: 'updatedat'
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('progresses');
  },
};