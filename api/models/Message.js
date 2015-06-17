/**
* Message.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  adapter: 'socket.io-redis',

  attributes: {


    room: {
      model: 'room',
      required: true
    },

    from: {
      model: 'user',
      required: true
    },

    to: {
      model: 'user',
      required: true
    },

    content: {
      type: 'text',
      minLength: 1
    }

  }
};

