'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Message', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      content: {
        type: Sequelize.TEXT
      },
      sended_by: {
        type: Sequelize.BIGINT,
        references: 'User',
        referencesKey: 'id'
      },
      recieved_by: {
        type: Sequelize.BIGINT,
        references: 'User',
        referencesKey: 'id'
      },
      room_id: {
        type: Sequelize.BIGINT,
        references: 'Room',
        referencesKey: 'id'
      },
      message_type: {
        type: Sequelize.INTEGER,
        references: 'Message_Type',
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
    return queryInterface.dropTable('Message');
  }
};
