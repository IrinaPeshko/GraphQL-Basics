import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql';
import { UUIDType } from './uuid.js';
import { MemberIdType } from './graphql-queries=-types.js';

const CreateUserInput = new GraphQLInputObjectType({
  name: 'createUserType',
  fields: () => ({
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
  }),
});

const CreatePostInput = new GraphQLInputObjectType({
  name: 'createPostType',
  fields: () => ({
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    authorId: { type: new GraphQLNonNull(UUIDType) },
  }),
});

const CreateProfileInput = new GraphQLInputObjectType({
  name: 'createProfileType',
  fields: () => ({
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    memberTypeId: { type: new GraphQLNonNull(MemberIdType) },
    userId: { type: new GraphQLNonNull(UUIDType) },
  }),
});

const changeUserType = new GraphQLInputObjectType({
  name: 'changeUserType',
  fields: () => ({
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
  }),
});

const changePostType = new GraphQLInputObjectType({
  name: 'changePostType',
  fields: () => ({
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    authorId: { type: UUIDType },
  }),
});

const changeProfileType = new GraphQLInputObjectType({
  name: 'changeProfileType',
  fields: () => ({
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    memberTypeId: { type: MemberIdType },
    userId: { type: UUIDType },
  }),
});

export { MemberIdType, CreatePostInput, CreateUserInput, CreateProfileInput, changeUserType, changePostType, changeProfileType};
