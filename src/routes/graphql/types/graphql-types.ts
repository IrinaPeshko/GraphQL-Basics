import {
  GraphQLBoolean,
  GraphQLEnumType,
  GraphQLFloat,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { UUIDType } from './uuid.js';
import { MemberTypeId } from '../../member-types/schemas.js';
import { GraphQLContext } from './types.js';

let UserType;
let ProfileType;
let PostType;
let SubscribersOnAuthorsType;
let MemberType;

UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
    profile: {
      type: ProfileType,
      resolve: async (user, _args, context: GraphQLContext) => {
        return await context.prisma.profile.findUnique({
          where: { userId: user.id },
        });
      },
    },
    posts: {
      type: new GraphQLList(PostType),
      resolve: async (user, _args, context: GraphQLContext) => {
        return await context.prisma.post.findMany({
          where: { authorId: user.id },
        });
      },
    },
    userSubscribedTo: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
      resolve: async (user, _args, context: GraphQLContext) => {
        const subscriptions = await context.prisma.subscribersOnAuthors.findMany({
          where: { subscriberId: user.id },
          include: {
            author: true,
          },
        });
        return subscriptions.map((subscription) => subscription.author);
      },
    },
    subscribedToUser: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
      resolve: async (user, _args, context: GraphQLContext) => {
        const subscribers = await context.prisma.subscribersOnAuthors.findMany({
          where: { authorId: user.id },
          include: {
            subscriber: true,
          },
        });
        return subscribers.map((subscription) => subscription.subscriber);
      },
    },
  }),
});

PostType = new GraphQLObjectType({
  name: 'Post',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    author: { type: UserType },
  }),
});

ProfileType = new GraphQLObjectType({
  name: 'Profile',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    user: { type: UserType },
    memberType: {
      type: MemberType,
      resolve: async (profile, _args, context: GraphQLContext) => {
        return await context.prisma.memberType.findUnique({
          where: { id: profile.memberTypeId },
        });
      },
    },
  }),
});

SubscribersOnAuthorsType = new GraphQLObjectType({
  name: 'SubscribersOnAuthors',
  fields: () => ({
    subscriber: { type: UserType },
    subscriberId: { type: new GraphQLNonNull(GraphQLString) },
    author: { type: UserType },
    authorId: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

MemberType = new GraphQLObjectType({
  name: 'MemberType',
  fields: () => ({
    id: { type: new GraphQLNonNull(MemberIdType) },
    discount: { type: new GraphQLNonNull(GraphQLFloat) },
    postsLimitPerMonth: { type: new GraphQLNonNull(GraphQLInt) },
    profiles: { type: new GraphQLList(ProfileType) },
  }),
});

const MemberIdType = new GraphQLEnumType({
  name: 'MemberTypeId',
  values: {
    basic: { value: MemberTypeId.BASIC },
    business: { value: MemberTypeId.BUSINESS },
  },
});

export {
  UserType,
  PostType,
  ProfileType,
  SubscribersOnAuthorsType,
  MemberType,
  MemberIdType,
};
