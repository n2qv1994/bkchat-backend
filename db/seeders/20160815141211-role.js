'use strict';

var uuid = require('node-uuid');

module.exports = {
  up: function (queryInterface, Sequelize) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

    */

    var roles = [
      {
        id: 1,
        role_code: uuid.v1(),
        role_name: 'admin',
        description: 'admin',
        enabled: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 2,
        role_code: uuid.v1(),
        role_name: 'member',
        description: 'member',
        enabled: 1,
        created_at: new Date(),
        updated_at: new Date()
      }
    ];
    return queryInterface.bulkInsert('Role', roles, {});
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

    */
    return queryInterface.bulkDelete('Role', null, {});
  }
};
