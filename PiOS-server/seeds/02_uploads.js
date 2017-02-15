'use strict';
var path = require('path');

exports.seed = function(knex, Promise) {
  var uploadDir = path.join(__dirname, '../public/uploads');
  // Deletes ALL existing entries
  return knex('uploads').del()
    .then(function() {
      // Inserts seed entries
      return knex('uploads').insert([{
        id: 1,
        name: 'Tron Fight Scene',
        file_name: 'upload_efbdb3ff5e5161af5c5d103c8cd25077_Test_Tron-Fight.mp4',
        category: 'movie',
        user_id: 4,
        created_at: new Date('2016-06-26 14:26:16 UTC'),
        updated_at: new Date('2016-06-26 14:26:16 UTC')
      }, {
        id: 2,
        name: 'Gnar Shredding in RMNP',
        file_name: 'upload_9e55ebb7fb43202d83dc5968a990057e_gnar_shred_RMNP.mp4',
        category: 'movie',
        user_id: 5,
        created_at: new Date('2016-06-26 14:26:16 UTC'),
        updated_at: new Date('2016-06-26 14:26:16 UTC')
      }, {
        id: 3,
        name: 'Tron Legacy BluRay',
        file_name: 'upload_5ac1255edbda58b3a974d6c865858eac_Tron.Legacy.BluRay.1080p.x264.5.1.Judas.mp4',
        category: 'movie',
        user_id: 3,
        created_at: new Date('2016-06-26 14:26:16 UTC'),
        updated_at: new Date('2016-06-26 14:26:16 UTC')
      }, {
        id: 4,
        name: 'Egg in Floppy Boots',
        file_name: 'upload_f653d25e148279beaf67372e3bb476a1_egg_in_boots.mp4',
        category: 'movie',
        user_id: 1,
        created_at: new Date('2016-06-26 14:26:16 UTC'),
        updated_at: new Date('2016-06-26 14:26:16 UTC')
      }]);
    })
    .then(() => {
      return knex.raw(
        "SELECT setval('uploads_id_seq', (SELECT MAX(id) FROM uploads));"
      );
    });
};
