/**
 * RoomController
 *
 * @description :: Server-side logic for managing rooms
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {


    create: function(req, res) {

        /* Check whether if the Room exists already */
        Room
            .findOne({
                buyer: req.token.id,
                seller: parseInt(req.param('seller'), 10)
            })
            .exec(function(err, room) {
                sails.log('room found', room);
                if(err) {
                    return ErrorService.sendError(500, err, req, res);
                }
                if(!room) {

                    /* Creating Room if it does not exist yet */
                    Room
                        .create({
                            buyer: req.token.id,
                            seller: parseInt(req.param('seller'), 10)
                        })
                        .exec(function(err, room) {
                            if(err) {
                                return ErrorService.sendError(500, err, req, res);
                            }
                            else{
                                return res.json(200);
                            }
                        });

                }
                else {
                    return res.json(200);
                }
            });




    }

	
};

