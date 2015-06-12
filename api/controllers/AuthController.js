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

        User
            .findOne( { email: req.param('email') } )
            .exec(function (err, user) {
                if (err) {
                    return ErrorService.sendError(400, "Aucun compte avec cette adresse e-mail.", req, res);
                }

                // If no user was found / invalid credentials
                if (!user) {
                    return ErrorService.sendError(400, "E-mail ou mot de passe invalide.", req, res);
                }

                /* If the user has been blocked by an administrator */
                if(user.blocked){
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

    },


    /**
     * Action blueprints:
     *    `/auth/forgot`
     */
    forgot: function (req, res, next) {
        // Check for email
        if (!req.param('email')) {
            return ErrorService.sendError(400, "Adresse email manquante", req, res);
        }
        else {
            // User.findOneByEmail(req.param('email')).done(function(err, user) {
            User
                .findOne({
                    or: [{
                        schoolEmail: sanitizer.escape(req.param('email'))
                    }, {
                        email: sanitizer.escape(req.param('email'))
                    }]
                })
                .exec(function(err, user) {
                    if(err || !user) {
                        return ErrorService.sendError(404, err, req, res);
                    }
                    else {

                        bcrypt.hash(Math.random() + user.email, 10, function (err, hash) {
                            if(err) {
                                return ErrorService.sendError(500, "Error while creating the hash", req, res);
                            }

                            // removing all '/' so we don't have issues after in the URL
                            hash = hash.replace(/\//g,"");

                            // creating the token
                            PassToken.create({
                                owner: user.id,
                                hash: hash
                            }).exec(function(err, token) {
                                if(err) {
                                    return ErrorService.sendError(500, "Error while creating the token object", req, res);
                                }

                                // Sending email
                                EmailService.send({
                                    to: sanitizer.escape(req.param('email')),
                                    template: 'scoledge-password-forgotten',
                                    data: [
                                        {
                                            'REDEFINEURL': sails.config.custom.frontendUrl + '/#/redefine/' + token.hash
                                        }
                                    ]
                                }, function optionalCallback (err) {
                                    // If you need to wait to find out if the email was sent successfully,
                                    // or run some code once you know one way or the other, here's where you can do that.
                                    // If `err` is set, the send failed.  Otherwise, we're good!
                                    if(err) {
                                        return ErrorService.sendError(500, err, req, res);
                                    }
                                    return res.json(200);
                                });
                            });
                        });
                    }
            });
        }
    },


    /**
     * Action blueprints:
     *    `/auth/token`
     */
    token: function (req, res) {
        // Check for email
        if (!req.param('token')) {
            return ErrorService.sendError(400, "Missing arguments", req, res);
        }
        else {
            PassToken.findOne({
                hash: req.param('token')
            }).exec(function(err, token) {
                if(err || !token) {
                    return res.json({
                        isValid: false
                    });
                }
                else {
                    return res.json({
                        isValid: true
                    });
                }
            });
        }
    },


    /**
     * Action blueprints:
     *    `/auth/token`
     */
    resetPassword: function (req, res) {
        // Check for params
        if (!req.param('token') || !req.param('password')) {
            return ErrorService.sendError(400, "Paramètres manquants", req, res);
        }
        else {
            // finding the token first, to get the owner id
            PassToken.find({
                hash: req.param('token')
            }).exec(function(err, token) {

                sails.log('token : ', token)
                if(err || token.length == 0) {
                    return ErrorService.sendError(404, 'Token not found', req, res);
                }
                else {
                    // updating the user
                    User.update({
                        id: token[0].owner
                    }, {
                        id: token[0].owner,
                        password: req.param('password')
                    }).exec(function(err, user) {
                        if(err) {
                            return ErrorService.sendError(500, err, req, res);
                        }
                        else {
                            console.log(user)
                            // finally, removing all the token for the user
                            PassToken.destroy({
                                owner: user[0].id
                            }).exec(function(err) {
                                if(err) {
                                    return ErrorService.sendError(500, err, req, res);
                                }
                                return res.json('ok');
                            });
                        }
                    })

                }
            })
        }
    },

    /**
     * Action blueprints:
     *    `/facebook`
     */
    facebook: function (req, res) {


        var accessTokenUrl = 'https://graph.facebook.com/oauth/access_token?code=' + req.body.code
            + '&client_id=' + req.body.clientId
            + '&client_secret=' + sails.config.custom.fbSecret
            + '&redirect_uri=' + req.body.redirectUri;

        console.log(req.body.redirectUri);

        var graphApiUrl = 'https://graph.facebook.com/me';

        // First, getting an access token
        https.request(accessTokenUrl, function (result) {

            var accessToken = '';

            result.on('data', function (d) {
                accessToken += d;
            });

            result.on('end', function () {

                try {

                    // Step 2. Retrieve profile information about the current user.
                    https.get(graphApiUrl + '?' + accessToken, function (result) {

                        var profile = '';

                        result.on('data', function (d) {
                            profile += d;
                        });

                        result.on('end', function () {

                            profile = JSON.parse(profile);
                            console.log(profile)

                            User.findOne({
                                or: [{
                                    facebook: profile.id
                                }, {
                                    email: profile.email
                                }, {
                                    schoolEmail: profile.email
                                }]
                            }).exec(function (err, user) {

                                if (err) {
                                    return ErrorService.sendError(500, err, req, res);
                                }

                                sails.log(user);

                                /* If the user has been blocked by an administrator */
                                if(user.blocked){
                                    return res.json(403, 'Not allowed');
                                }



                                // If the user was found, we log him in
                                if (user && user.id) {

                                    // Setting the avatar if default avatar
                                    if(!user.avatar || user.avatar == '' || user.avatar.indexOf('default_avatar.png') != -1) {
                                        user.avatar = 'https://graph.facebook.com/' + profile.id +'/picture?type=large';
                                        user.save();
                                    }


                                    var jsonToken = JSON.stringify({
                                        id: user.id,
                                        school: user.school,
                                        type: user.type,
                                        hash: TokenService.issueToken(user)
                                    });

                                    return res.json({
                                        token: jsonToken
                                    });

                                }
                                else {
                                    return ErrorService.sendError(404, "User not found", req, res);
                                }
                            })
                        });
                    }).end();
                }
                catch (e) {
                    sails.log.warn('Could not parse response from options.hostname: ' + e);
                }
            })

        }).end();
    },

    /**
     * Action blueprints:
     *    `/google`
     */
    google: function (req, res) {

        var querystring = require('querystring');

        var data = querystring.stringify({
            code: req.body.code,
            client_id: req.body.clientId,
            client_secret: sails.config.custom.googleSecret,
            redirect_uri: req.body.redirectUri,
            grant_type: 'authorization_code'
        });

        var options = {
            host: 'accounts.google.com',
            port: 443,
            path: '/o/oauth2/token',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': data.length
            }
        };

        // First, getting an access token
        var googleReq = https.request(options, function (result) {

            var accessToken = '';

            result.on('data', function (d) {
                accessToken += d;
            });

            result.on('end', function () {

                var token = JSON.parse(accessToken).access_token;

                //sails.log(accessToken)

                // Step 2. Retrieve profile information about the current user.
                https.get('https://www.googleapis.com/plus/v1/people/me/openIdConnect?access_token=' + token, function (result) {

                    var profile = '';

                    result.on('data', function (d) {
                        profile += d;
                    });

                    result.on('end', function () {

                        profile = JSON.parse(profile);

                        // Checking if user exists
                        User.findOne({
                            or: [{
                                gPlus: profile.sub
                            }, {
                                email: profile.email
                            }, {
                                schoolEmail: profile.email
                            }]
                        }).exec(function (err, user) {

                            if (err) {
                                return ErrorService.sendError(500, err, req, res);
                            }

                            /* If the user has been blocked by an administrator */
                            if(user.blocked){
                                return res.json(403, 'Not allowed');
                            }

                            //sails.log(user);
                            // If the user was found, we log him in
                            if (user && user.id) {

                                var jsonToken = JSON.stringify({
                                    id: user.id,
                                    school: user.school,
                                    type: user.type,
                                    hash: TokenService.issueToken(user)
                                });

                                return res.json({
                                    token: jsonToken
                                });

                            }
                            else {
                                return ErrorService.sendError(404, "User not found", req, res);
                            }
                        })

                    });
                }).end();

            })

        });

        googleReq.write(data);
        googleReq.end();
    }

};