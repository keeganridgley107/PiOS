'use strict';

exports.seed = function(knex, Promise) {

  // Deletes ALL existing entries
  return knex('users').del()
    .then(function() {
      return Promise.all([
          // Inserts seed entries
          knex('users').insert([{
            id: 1,
            username: 'Z-rad-Eggs64',
            password: '$2a$06$KrJ7ldWf2grQN.9SlIjRieJ3RMBe3KCB.7Euq0uU24iKrZ2yqU0Vy',
            email: 'dinkydinky@gmail.com',
            created_at: new Date('2016-12-06 14:26:16 UTC'),
            avatar_path: 'uploads/owl.svg'
          }, {
            id: 2,
            username: 'Keegan',
            password: '$2a$06$KrJ7ldWf2grQN.9SlIjRieJ3RMBe3KCB.7Euq0uU24iKrZ2yqU0Vy',
            email: 'Keegan@gmail.com',
            created_at: new Date('2016-12-06 14:26:16 UTC'),
            avatar_path: 'uploads/deer.svg'
          }, {
            id: 3,
            username: 'Kyle',
            password: '$2a$06$KrJ7ldWf2grQN.9SlIjRieJ3RMBe3KCB.7Euq0uU24iKrZ2yqU0Vy',
            email: 'Kyle@gmail.com',
            created_at: new Date('2016-12-06 14:26:16 UTC'),
            avatar_path: 'uploads/ladybug.svg'
          }, {
            id: 4,
            username: 'TvannTheMan239',
            password: '$2a$06$KrJ7ldWf2grQN.9SlIjRieJ3RMBe3KCB.7Euq0uU24iKrZ2yqU0Vy',
            email: 'TvannTheMan239@gmail.com',
            created_at: new Date('2016-12-06 14:26:16 UTC'),
            avatar_path: 'uploads/competition.svg'
          }, {
            id: 5,
            username: 'Steve',
            password: '$2a$06$KrJ7ldWf2grQN.9SlIjRieJ3RMBe3KCB.7Euq0uU24iKrZ2yqU0Vy',
            email: 'Steve@gmail.com',
            created_at: new Date('2016-12-06 14:26:16 UTC'),
            avatar_path: 'uploads/cliff.svg'
          }])
        ])
        .then(() => {
          return knex.raw(
            "SELECT setval('users_id_seq', (SELECT MAX(id) FROM users))"
          );
        });
    });
};
