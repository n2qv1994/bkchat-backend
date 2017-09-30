'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Conversation', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      conversation_code: {
        type: Sequelize.STRING
      },
      guest_id: {
        type: Sequelize.BIGINT,
        references: 'Guest',
        referencesKey: 'id'
      },
      user_id: {
        type: Sequelize.BIGINT,
        references: 'User',
        referencesKey: 'id'
      },
      status: {
        type: Sequelize.INTEGER
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
    return queryInterface.dropTable('Conversation');
  }
};
