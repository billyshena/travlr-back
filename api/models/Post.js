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
            type: 'date',
            required: true
        },

        duration: {
            type: 'integer',
            required: true
        },

        image: {
            type: 'string'
        },

        country: {
            type: 'string',
            required: true
        },

        zipcode: {
            type: 'string',
            required: true
        },

        address: {
            type: 'string',
            required: true
        },

        city: {
            type: 'string',
            required: true
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

