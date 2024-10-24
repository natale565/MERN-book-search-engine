const { User, Book } = require('../../client/src/models');

const resolvers = {

    Query: {
        me: async (parent, args, context) => {
            if (context.user){
                return User.findOne({ _id: context.user._id }).populate('savedBooks');
            }
            throw new Error('You need to be logged in!');
        },
    },

    Mutation: {
        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);
            return { token, user };
        },
        login: async (parent, { email, password}) => {
            const user = await User.findOne({ email});
            if (!user) {
                throw new AuthenticationError('Incorrect credentials');
            }
            const correctPw = await user.isCorrectPassword(password);
            if (!correctPw) {
                throw new AuthenticationError('Incorrect credentials');
            }
            const token = signToken(user);
            return { token, user };
        },
        saveBook: async (parent, { bookData}, context) => {
            if (context.user){
                return User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: { savedBooks: bookData }},
                    { new: true, runValidators: true } // are the runValidators necessary?
                );
            }
            throw new AuthenticationError('You need to be logged in!');
        },
        removeBook: async (parent, { bookId }, context) => {
            if (context.user){
                return User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: { bookId }}},
                    { new: true }
                )
            }
        }

    },

};

module.exports = resolvers;

