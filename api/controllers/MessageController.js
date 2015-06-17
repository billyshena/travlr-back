/**
 * MessageController
 *
 * @description :: Server-side logic for managing messages
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {


    create: function(req, res) {

        if(!req.param('room') || !req.param('to') || !req.param('content')) {
            return ErrorService.sendError(400, 'Missing arguments', req, res);
        }

        Message
            .create({
                room: parseInt(req.param('room'), 10),
                from: req.token.id,
                to: parseInt(req.param('to'), 10),
                content: req.param('content')
            })
            .exec(function(err, message) {

                sails.log('created mess', message);
                if(err) {
                    return ErrorService.sendError(500, err, req, res);
                }
                else {
                    Message
                        .findOne(message.id)
                        .populate('from')
                        .populate('to')
                        .exec(function(err, result) {
                            sails.log('result', result);
                            if(err) {
                                return ErrorService.sendError(500, err, req, res);
                            }
                            if(!result) {
                                return ErrorService.sendError(500, 'Result object not found', req, res);
                            }
                            else{
                                sails.log('brodcasting', message.room, ' with result = ', result);
                                /* Broadcasting event to all connected users in the channel */
                                sails.sockets.broadcast('activity' + message.room, 'message', result);
                                return res.json(200);
                            }
                        });
                }

            });

    }
	
};

