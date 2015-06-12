/**
 * AuthController.js
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 *
 *
 * Contains different login or registration functions:
 *     - Basic login /auth/login
 *     - Facebook /facebook
 *     - LinkedIn /linkedIn
 *     - Google /google
 *
 */

var bcrypt = require('bcrypt');
var validator = require('validator');
var jwt = require('jsonwebtoken');
var https = require('https');

module.exports = {

    /**
     * Action blueprints:
     *    `/auth/login`
     */
    login: function (req, res) {

        // Check for email and password in params sent via the form, if none
        // redirect the browser back to the sign-in form.
        if (!req.param('email') || !req.param('password') || !validator.isEmail(req.param('email'))) {
            return ErrorService.sendError(400, "E-mail ou mot de passe manquant.", req, res);
        }

        /* We try to find the User by the email parameter */
        User
            .findOne({email: req.param('email')})
            .exec(function (err, user) {
                if (err) {
                    return ErrorService.sendError(400, "Aucun compte avec cette adresse e-mail.", req, res);
                }

                // If no user was found / invalid credentials
                if (!user) {
                    return ErrorService.sendError(400, "E-mail ou mot de passe invalide.", req, res);
                }

                /* If the user has been blocked by an administrator */
                if (user.blocked) {
                    return res.json(403, 'Not allowed');
                }

                // Compare password from the form params to the encrypted password of the user found.
                bcrypt.compare(req.param('password'), user.password, function (err, valid) {
                    if (err) {
                        return ErrorService.sendError(400, err, req, res);
                    }
                    //console.log(user);
                    // If the password from the form doesn't match the password from the database...
                    if (!valid) {
                        return ErrorService.sendError(400, "E-mail ou mot de passe invalide.", req, res);
                    }

                    var jsonToken = JSON.stringify({
                        id: user.id,
                        type: user.type,
                        school: user.school,
                        hash: TokenService.issueToken(user)
                    });

                    return res.json({
                        token: jsonToken
                    });

                });

            });
    }



};