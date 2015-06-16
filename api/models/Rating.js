/**
* Rating.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

    owner: {
      model: 'user'
    },

    post: {
      model: 'post'
    },

    comment: {
      model: 'comment'
    },

    value: {
      type: 'integer',
      enum: [0, 1, 2, 3, 4, 5]
    }


  }
};

