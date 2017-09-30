'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Activity', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      user_id: {
        type: Sequelize.BIGINT,
        references: 'User',
        referencesKey: 'id'
      },
      action_id: {
        type: Sequelize.INTEGER,
        references: 'Activity_Type',
        referencesKey: 'id'
      },
      conversation_id: {
        type: Sequelize.BIGINT,
        references: 'Conversation',
        referencesKey: 'id'
      },
      reverse_id: {
        type: Sequelize.BIGINT,
        references: 'Reservation',
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
    return queryInterface.dropTable('Activity');
  }
};
