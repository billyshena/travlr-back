/**
 * TagController
 *
 * @description :: Server-side logic for managing tags
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    name: {
        type: 'string'
    },

    posts: {
        collection: 'post',
        via: 'tags'
    }


	
};

