/**
* Invite.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

    buyer: {
      model: 'user',
      required: true
    },

    seller: {
      model: 'user',
      required: true
    },

    status: {
      type: 'string'
    },

    post: {
      model: 'post',
      required: true
    }


  },

  afterCreate: function(values, next) {

    Post
        .findOne(values.post)
        .exec(function(err, post) {
          if(err){ return next(err); }
          if(!post) { return next(); }
          else{
            sails.log('post', post);
            post.leftSlots = post.maxPersons - 1;
            post.save(function(err){
              if(err){ return next(err); }
              else{
                return next();
              }
            })
          }
        });
  }
};

