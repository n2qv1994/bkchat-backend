'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Notification', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      notice_code: {
        type: Sequelize.STRING
      },
      notice_by: {
        type: Sequelize.BIGINT,
        references: 'User',
        referencesKey: 'id'
      },
      notice_type: {
        type: Sequelize.STRING
      },
      name: {
        type: Sequelize.STRING
      },
      notice_image: {
        type: Sequelize.STRING
      },
      notice_body: {
        type: Sequelize.STRING
      },
      notice_room: {
        type: Sequelize.STRING
      },
      send_at: {
        type: Sequelize.DATE
      },
      readed: {
        type: Sequelize.BOOLEAN
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      user_id: {
        type: Sequelize.BIGINT,
        references: 'User',
        referencesKey: 'id'
      },
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('Notification');
  }
};
