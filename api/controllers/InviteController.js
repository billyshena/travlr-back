/**
 * InviteController
 *
 * @description :: Server-side logic for managing invites
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {


    create: function(req, res) {

        if(!req.param('seller')) {
            return ErrorService.sendError(400, 'Missing arguments', req, res);
        }

        Invite
            .create({
                buyer: req.token.id,
                seller: parseInt(req.param('seller'), 10),
                post: parseInt(req.param('post'), 10)
            })
            .exec(function(err, invite) {
                if(err){
                    return ErrorService.sendError(500, err, req, res);
                }
                else{
                    return res.json(200);
                }
            })


    }
	
};

