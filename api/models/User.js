/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

      firstName: {
          type: 'string'
      },

      lastName: {
          type: 'string'
      },

      email: {
          type: 'email',
          required: true
      },

      password: {
          type: 'password',
          required: true
      },

      phone: {
          type: 'string'
      },

      avatar: {
          type: 'string',
          defaultsTo: 'https://d2y7at0phqmw80.cloudfront.net/img/default_avatar.png'
      },

      job: {
          type: 'string'
      },

      bio: {
          type: 'text'
      }











  }

};

