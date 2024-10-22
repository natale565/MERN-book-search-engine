const { Query } = require('mongoose');
const { User, Book } = require('../../client/src/models');

const resolvers = {

    Query: {
        me: async (parent, args, context) => {
            if (context.user){
                return User.findOne({ _id: context.user._id }).populate('savedBooks');
            }
        }
    }

}

