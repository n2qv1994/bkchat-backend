'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Transaction', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      transaction_code: {
        type: Sequelize.STRING
      },
      user_id: {
        type: Sequelize.BIGINT,
        references: 'User',
        referencesKey: 'id'
      },
      room_id: {
        type: Sequelize.BIGINT,
        references: 'Room',
        referencesKey: 'id'
      },
      action_id: {
        type: Sequelize.INTEGER,
        references: 'Activity_Type',
        referencesKey: 'id'
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('Transaction');
  }
};
