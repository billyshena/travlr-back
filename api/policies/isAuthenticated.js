'use strict';

module.exports = function (request, response, next) {

    var token;

    // If the token is passed through headers Authorization
    if (request.headers && request.headers.authorization) {

        var parts = request.headers.authorization.split(' ');

        if (parts.length == 2) {
            var scheme = parts[0], credentials = parts[1];
            if (/^Bearer$/i.test(scheme)) {
                token = credentials;
            }
        }
        else {
            return response.json(401, {message: 'Format is Authorization: Bearer [token]'});
        }
    }

    // Or by POST or GET
    else if (request.param('token')) {
        token = request.param('token');
        // We delete the token from query and body to not mess with blueprints
        delete request.query.token;

        if(request.body && request.body.token) {
            delete request.body.token;
        }
    }

    else {
        return response.json(401, {message: 'No Authorization header was found'});
    }

    // Then we verify the token
    TokenService.verifyToken(token, function (error, token) {

        if (error) {
            return response.json(401, { message: 'The token is not valid' });
        }

        else {
            // Putting the token in the request and the owner with the body
            request.token = token;
            return next();
        }
    });
};