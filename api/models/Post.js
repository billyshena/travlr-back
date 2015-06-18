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

        categories: {
            collection: 'category',
            via: 'posts'
        },

        maxPersons: {
            type: 'integer',
            required: true
        },

        leftSlots: {
            type: 'integer'
        },

        dateActivity: {
            type: 'date'
        },

        duration: {
            type: 'integer'
        },

        image: {
            type: 'string'
        },

        country: {
            type: 'string'
        },

        zipcode: {
            type: 'string'
        },

        address: {
            type: 'string'
        },

        city: {
            type: 'string'
        }

    },

    beforeCreate: function(values, next) {

      var url  = 'http://www.splashbase.co/api/v1/images/random';

        values.leftSlots = values.maxPersons;

      http.request(url, function (result) {

        sails.log('result', result);
        var str = '';
        result.on('data', function (chunk) {
          str += chunk;
        });

        result.on('end', function() {
          str = JSON.parse(str);
          sails.log('values', values);
          values.image = str.url;
          return next();
        });

      }).end();

    }

};

