/**
 * Post.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

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
        }
    }

};

