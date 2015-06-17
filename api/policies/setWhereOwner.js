/**
 * Created by bshen on 15/03/15.
 */



module.exports = function(req, res, next){

    sails.log('query', req.query);
    if(req.query.where){
        var where = JSON.parse(req.param('where'));
        where.owner = req.token.id;
        req.query.where = JSON.stringify(where);
        return next();
    }
    else{
        req.query.where = JSON.stringify({ owner: req.token.id });
        sails.log('req.query', req.query);
        return next();
    }

};