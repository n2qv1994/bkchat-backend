'use strict';

var uuid = require('node-uuid');

module.exports = {
  up: function (queryInterface, Sequelize) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.
    */
    var activities = [
      {
        action_code: uuid.v1(),
        action_name: "JOIN ROOM",
        enabled: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        action_code: uuid.v1(),
        action_name: "LEFT ROOM",
        enabled: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        action_code: uuid.v1(),
        action_name: "LOGIN",
        enabled: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        action_code: uuid.v1(),
        action_name: "LOGOUT",
        enabled: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        action_code: uuid.v1(),
        action_name: "DISCONNECT",
        enabled: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        action_code: uuid.v1(),
        action_name: "UPLOAD",
        enabled: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        action_code: uuid.v1(),
        action_name: "RESERVE ROOM",
        enabled: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        action_code: uuid.v1(),
        action_name: "CALL",
        enabled: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        action_code: uuid.v1(),
        action_name: "MISS",
        enabled: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        action_code: uuid.v1(),
        action_name: "DENY",
        enabled: 1,
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    return queryInterface.bulkInsert('Activity_Type', activities, {});
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.
    */
    return queryInterface.bulkDelete('Activity_Type', null, {});
  }
};
