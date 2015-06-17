/**
 * PostController
 *
 * @description :: Server-side logic for managing posts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {


    /* Get the latest feed for the landing page */
    feed: function (req, res) {

        Post
            .find()
            .sort('createdAt DESC')
            .limit(8)
            .populate('owner')
            .exec(function(err, posts) {
                if(err) {
                    return ErrorService.sendError(500, err, req, res);
                }
                else{
                    return res.json(posts);
                }
            });

    },


    /* Subscribe to an activity channel (to be able to speak with the other participants & the owner himself) */
    subscribe: function(req, res) {

        if(!req.param('postId')) {
            return ErrorService.sendError(400, 'Missing arguments', req, res);
        }

        var roomName = 'activity' + req.param('postId');
        sails.sockets.join(req.socket, roomName);
        return res.json(200);

    }



	
};

