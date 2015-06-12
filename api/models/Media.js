/**
* File.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

      /* The name of the file (hashed) */
      hashName: {
          type: 'string'
      },

      post: {
          model: 'post'
      },

      /* The name of the file which will be displayed to the user */
      name: {
          type: 'string'
      },

      size: {
          type: 'float'
      }



  }
};

