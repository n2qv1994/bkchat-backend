'use strict';

var uuid = require('node-uuid');
var Faker = require('Faker');

module.exports = {
  up: function (queryInterface, Sequelize) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.
    */

    var users = [
      {
        user_code: uuid.v1(),
        user_name: 'admin',
        pass_word: '$2a$10$7CRLvSx8H1wKww84uBka4emZ48v16skBJCYbzYz/lR9ZlK7hQPUCK',
        enabled: 1,
        status: 1,
        role_id: 1,
        image: 'images/default_ava.png',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        user_code: uuid.v1(),
        user_name: 'anhnh',
        pass_word: '$2a$10$7CRLvSx8H1wKww84uBka4emZ48v16skBJCYbzYz/lR9ZlK7hQPUCK',
        first_name: Faker.Name.firstName(),
        last_name: Faker.Name.lastName(),
        email: Faker.Internet.email(),
        address: Faker.Address.city(),
        image: 'images/anhnh.jpg',
        phone: Faker.PhoneNumber.phoneNumber(),
        enabled: 1,
        status: 1,
        role_id: 2,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        user_code: uuid.v1(),
        user_name: 'binhnh',
        pass_word: '$2a$10$7CRLvSx8H1wKww84uBka4emZ48v16skBJCYbzYz/lR9ZlK7hQPUCK',
        first_name: Faker.Name.firstName(),
        last_name: Faker.Name.lastName(),
        email: Faker.Internet.email(),
        address: Faker.Address.city(),
        image: 'images/default_ava.png',
        phone: Faker.PhoneNumber.phoneNumber(),
        enabled: 1,
        status: 1,
        role_id: 2,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        user_code: uuid.v1(),
        user_name: 'thanhnt',
        pass_word: '$2a$10$7CRLvSx8H1wKww84uBka4emZ48v16skBJCYbzYz/lR9ZlK7hQPUCK',
        first_name: Faker.Name.firstName(),
        last_name: Faker.Name.lastName(),
        email: Faker.Internet.email(),
        image: 'images/thanhnt.jpg',
        address: Faker.Address.city(),
        phone: Faker.PhoneNumber.phoneNumber(),
        enabled: 1,
        status: 1,
        role_id: 2,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        user_code: uuid.v1(),
        user_name: 'linhnh',
        pass_word: '$2a$10$7CRLvSx8H1wKww84uBka4emZ48v16skBJCYbzYz/lR9ZlK7hQPUCK',
        first_name: Faker.Name.firstName(),
        last_name: Faker.Name.lastName(),
        email: Faker.Internet.email(),
        image: 'images/linhnh.jpg',
        address: Faker.Address.city(),
        phone: Faker.PhoneNumber.phoneNumber(),
        enabled: 1,
        status: 1,
        role_id: 2,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        user_code: uuid.v1(),
        user_name: 'dungct',
        pass_word: '$2a$10$7CRLvSx8H1wKww84uBka4emZ48v16skBJCYbzYz/lR9ZlK7hQPUCK',
        first_name: Faker.Name.firstName(),
        last_name: Faker.Name.lastName(),
        email: Faker.Internet.email(),
        address: Faker.Address.city(),
        image: 'images/default_ava.png',
        phone: Faker.PhoneNumber.phoneNumber(),
        enabled: 1,
        status: 1,
        role_id: 2,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        user_code: uuid.v1(),
        user_name: 'vietnq',
        pass_word: '$2a$10$7CRLvSx8H1wKww84uBka4emZ48v16skBJCYbzYz/lR9ZlK7hQPUCK',
        first_name: Faker.Name.firstName(),
        last_name: Faker.Name.lastName(),
        image: 'images/vietnq.jpg',
        email: Faker.Internet.email(),
        address: Faker.Address.city(),
        phone: Faker.PhoneNumber.phoneNumber(),
        enabled: 1,
        status: 1,
        role_id: 2,
        created_at: new Date(),
        updated_at: new Date()
      }
    ];
    return queryInterface.bulkInsert('User', users, {});
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.
    */
    return queryInterface.bulkDelete('User', null, {});
  }
};
