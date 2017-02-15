'use strict';

module.exports = {
  development: {
    client: 'pg',
    connection: 'postgres://localhost/q2pi'
  },
  production: {
    client: 'pg',
    connection: 'postgres://gdiesxjvprmikz:KdiLXo6xH0_teSJ4UO6uOcNgoB@ec2-54-243-187-133.compute-1.amazonaws.com:5432/d1a5mv61mr8dig'
  }
};
