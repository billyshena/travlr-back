/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */
var bcrypt = require('bcrypt');

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
            type: 'string',
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
        },

        type: {
            type: 'integer',
            defaultsTo: 100 // 100 = Searching mode    200 = Business mode
        },

        rating: {
            collection: 'rating',
            via: 'post'
        },

        /* Whether the user has been blocked by an administrator or not */
        blocked: {
            type: 'boolean',
            defaultsTo: false
        },


        // Removing the pass when JSONify the user
        toJSON: function () {
            var obj = this.toObject();
            delete obj.password;
            return obj;
        }


    },


    // Before User.js is created, hash the password
    beforeCreate: function (values, next) {

        bcrypt.hash(values.password, 10, function (err, hash) {

            if (err) return next(err);
            values.password = hash;
            next();

        });

    },

    beforeUpdate: function (values, next) {
        if (values.id) {
            User.findOne({
                id: values.id
            }).exec(function (error, user) {
                if (!error) {
                    // User try to make himself an administrator user, no-way-hose :D
                    values.type = user.type;

                    if (values.password && (values.password != user.password)) {
                        bcrypt.hash(values.password, 10, function (err, hash) {
                            if (err) return next(err);

                            values.password = hash;
                            next();
                        });
                    }
                    else {
                        next();
                    }
                }
                else {
                    return next(error);
                }
            });
        } else {
            next();
        }
    }

};

