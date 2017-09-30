'use strict';
module.exports = function(sequelize, DataTypes) {
  var Transaction = sequelize.define('Transaction', {
    transaction_code: DataTypes.STRING,
    user_id: DataTypes.BIGINT,
    room_id: DataTypes.BIGINT,
    action_id: DataTypes.INTEGER
  }, {
    // don't use camelcase for automatically added attributes but underscore style
    // so updatedAt will be updated_at
    underscored: true,
    // disable the modification of tablenames; By default, sequelize will automatically
    // transform all passed model names (first parameter of define) into plural.
    // if you don't want that, set the following
    freezeTableName: true
  }, {
    classMethods: {
      associate: function(models) {
        Transaction.belongsTo(models.User, {foreignKey: 'user_id', targetKey: 'user_id'});
        Transaction.belongsTo(models.Room, {foreignKey: 'room_id', targetKey: 'room_id'});
        Transaction.belongsTo(models.Activity_Type, {foreignKey: 'action_id', targetKey: 'action_id'});
      }
    }
  });
  return Transaction;
};