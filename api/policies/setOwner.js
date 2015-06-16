'use strict';

module.exports = function (request, response, next) {
    request.body.owner = request.token.id;
    next();
};