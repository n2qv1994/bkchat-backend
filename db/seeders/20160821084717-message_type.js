'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.
    */
    var message_type = [
      { id: 1, message_type: "ROOM", created_at: new Date(), updated_at: new Date() },
      { id: 2, message_type: "SINGLE", created_at: new Date(), updated_at: new Date() }
    ]
    return queryInterface.bulkInsert('Message_Type', message_type, {});
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.
    */
    return queryInterface.bulkDelete('Message_Type', null, {});
  }
};
