/**
 * Post.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

var http = require('http');

module.exports = {

    attributes: {

        owner: {
            model: 'user'
        },

        title: {
            type: 'string',
            required: true
        },

        content: {
            type: 'text',
            minLength: 10,
            required: true
        },

        price: {
            type: 'integer',
            required: true
        },

        tags: {
            collection: 'tag',
            via: 'posts'
        },

        category: {
            type: 'string'
        },

        maxPersons: {
            type: 'integer'
        },

        image: {
            type: 'string'
        }
    },

    afterCreate: function(values, next) {

      var url  = 'http://www.splashbase.co/api/v1/images/random';

      http.request(url, function (result) {

        sails.log('result', result);
        var str = '';
        result.on('data', function (chunk) {
          str += chunk;
        });

        result.on('end', function() {
          str = JSON.parse(str);
          values.image = str.url;
          return next();
        });

      }).end();

    }

};

