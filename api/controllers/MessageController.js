/**
 * MessageController
 *
 * @description :: Server-side logic for managing messages
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {



    create: function(req, res) {

        if(!req.param('room') || !req.param('to')) {
            return ErrorService.sendError(400, 'Missing arguments', req, res);
        }

        Message
            .create({
                room: parseInt(req.param('room'), 10),
                from: req.token.id,
                to: parseInt(req.param('to'), 10)
            })
            .exec(function(err, message) {

                if(err) {
                    return ErrorService.sendError(500, err, req, res);
                }
                else {
                    return res.json(200);
                }

            });

    }
	
};

