import {
    GraphQLBoolean,
  GraphQLFloat,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';

let UserType;
let ProfileType;

const PostType = new GraphQLObjectType({
  name: 'Post',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLString) },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    author: { type: UserType },
  },
});

const SubscribersOnAuthorsType = new GraphQLObjectType({
  name: 'SubscribersOnAuthors',
  fields: {
    subscriber: { type: UserType },
    subscriberId: { type: new GraphQLNonNull(GraphQLString) },
    author: { type: UserType },
    authorId: { type: new GraphQLNonNull(GraphQLString) },
  },
});

const MemberTypeType = new GraphQLObjectType({
  name: 'MemberType',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLString) },
    discount: { type: GraphQLFloat },
    postsLimitPerMonth: { type: GraphQLInt },
    profiles: { type: new GraphQLList(ProfileType) },
  },
});

ProfileType = new GraphQLObjectType({
    name: 'Profile',
    fields: {
      id: { type: new GraphQLNonNull(GraphQLString) },
      isMale: { type: GraphQLBoolean },
      yearOfBirth: { type: GraphQLInt },
      user: { type: UserType },
      memberType: { type: MemberTypeType },
    },
  });

UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLString) },
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
    profile: { type: ProfileType },
    posts: { type: new GraphQLList(PostType) },
    userSubscribedTo: { type: new GraphQLList(SubscribersOnAuthorsType) },
    subscribedToUser: { type: new GraphQLList(SubscribersOnAuthorsType) },
  },
});
