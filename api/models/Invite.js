/**
* Invite.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

    buyer: {
      model: 'user',
      required: true
    },

    seller: {
      model: 'user',
      required: true
    },

    status: {
      type: 'string'
    },

    post: {
      model: 'post',
      required: true
    }


  }
};

