/**
 * Created by shen on 04/06/14.
 */
'use strict';

var jwt = require('jsonwebtoken');

// With this method we generate a new token based on payload we want to put on it
module.exports.issueToken = function(payload) {
    return jwt.sign(
        payload, // This is the payload we want to put inside the token
        "yw5nywHe20LWflWagvkEeK1jeO33iFuN2wPRNQ7S7ddkTmJt0ItJcssQOBYJBbw", // Secret string which will be used to sign the token
        { expiresInMinutes: 10080 } // Expire time = 24 hours (60 * 24)      10080 = 1 week
    );
};

module.exports.verifyToken = function(token, verified) {
    return jwt.verify(
        token, // The token to be verified
        "yw5nywHe20LWflWagvkEeK1jeO33iFuN2wPRNQ7S7ddkTmJt0ItJcssQOBYJBbw", // The secret we used to sign it.
        {}, // Options, none in this case
        verified // The callback to be call when the verification is done.
    );
};
