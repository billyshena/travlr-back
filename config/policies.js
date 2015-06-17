/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your controllers.
 * You can apply one or more policies to a given controller, or protect
 * its actions individually.
 *
 * Any policy file (e.g. `api/policies/authenticated.js`) can be accessed
 * below by its filename, minus the extension, (e.g. "authenticated")
 *
 * For more information on how policies work, see:
 * http://sailsjs.org/#!/documentation/concepts/Policies
 *
 * For more information on configuring policies, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.policies.html
 */


module.exports.policies = {

    '*': false,

    AuthController: {
        login: true
    },

    UserController: {
        create: true,
        findOne: true
    },

    PostController: {
        create: ['isAuthenticated', 'setOwner'],
        find: ['isAuthenticated', 'setWhereOwner'],
        findOne: ['isAuthenticated'],
        feed: true,
        subscribe: ['isAuthenticated']
    },

    CategoryController: {
        create: true,
        find: true
    },


    ServiceController: {
        '*': true
    },


    InviteController: {

        create: ['isAuthenticated', 'setOwner'],
        find: ['isAuthenticated'],
        findOne: ['isAuthenticated']

    },

    RoomController: {
        create: ['isAuthenticated']
    },

    MessageController: {
        create: ['isAuthenticated']
    }







};
