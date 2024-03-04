import { GraphQLList, GraphQLNonNull, graphql } from 'graphql';
import {
  MemberIdType,
  MemberType,
  PostType,
  ProfileType,
  UserType,
} from '../types/graphql-queries=-types.js';
import { GraphQLContext } from '../types/types.js';
import { UUIDType } from '../types/uuid.js';

const users = {
  type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
  resolve: async (_parent, _args, context: GraphQLContext) =>
    context.prisma.user.findMany(),
};

const user = {
  type: UserType,
  args: {
    id: { type: new GraphQLNonNull(UUIDType) },
  },
  resolve: async (_parent, args, context: GraphQLContext) =>
    context.prisma.user.findUnique({
      where: { id: args.id },
      include: {
        userSubscribedTo: {},
        subscribedToUser: true,
      },
    }),
};

const posts = {
  type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(PostType))),
  resolve: async (_parent, _args, context: GraphQLContext) =>
    context.prisma.post.findMany(),
};

const post = {
  type: PostType,
  args: {
    id: { type: new GraphQLNonNull(UUIDType) },
  },
  resolve: async (_parent, args, context: GraphQLContext) =>
    context.prisma.post.findUnique({ where: { id: args.id } }),
};

const profiles = {
  type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(ProfileType))),
  resolve: async (_parent, _args, context: GraphQLContext) =>
    context.prisma.profile.findMany(),
};

const profile = {
  type: ProfileType,
  args: {
    id: { type: new GraphQLNonNull(UUIDType) },
  },
  resolve: async (_parent, args, context: GraphQLContext) =>
    context.prisma.profile.findUnique({ where: { id: args.id } }),
};

const memberTypes = {
  type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(MemberType))),
  resolve: async (_parent, _args, context: GraphQLContext) =>
    context.prisma.memberType.findMany(),
};

const memberType = {
  type: MemberType,
  args: {
    id: { type: new GraphQLNonNull(MemberIdType) },
  },
  resolve: async (_parent, args, context: GraphQLContext) =>
    context.prisma.memberType.findUnique({ where: { id: args.id } }),
};

export const userResolvers = {
  profile: {
    type: ProfileType,
    resolve: async (user, _args, context: GraphQLContext) => {
      return context.loaders.profileLoader.load(user.id);
    },
  },

  posts: {
    type: new GraphQLList(PostType),
    resolve: async (user, _args, context: GraphQLContext) => {
      return context.loaders.postsLoader.load(user.id);
    },
  },

  userSubscribedTo: {
    type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
    resolve: async (user, _args, context: GraphQLContext) => {
      return context.loaders.userSubscribedToLoader.load(user.id);
    },
  },

  subscribedToUser: {
    type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
    resolve: async (user, _args, context: GraphQLContext) => {
      return context.loaders.subscribedToUserLoader.load(user.id);
    },
  },

  memberType: {
    type: MemberType,
    resolve: async (profile, _args, context: GraphQLContext) => {
      return context.loaders.memberTypeLoader.load(profile.memberTypeId);
    },
  },
};

export const queryFields = {
  users: { ...users },
  user: { ...user },
  posts: { ...posts },
  post: { ...post },
  profiles: { ...profiles },
  profile: { ...profile },
  memberTypes: { ...memberTypes },
  memberType: { ...memberType },
};
