import { Type } from '@fastify/type-provider-typebox';
import { GraphQLNonNull, GraphQLObjectType, GraphQLSchema } from 'graphql';
import { queryFields } from './resolvers/queries.js';
import { GraphQLContext } from './types/types.js';
import { UserType } from './types/graphql-queries=-types.js';
import { mutationFields } from './resolvers/mutations.js';

export const gqlResponseSchema = Type.Partial(
  Type.Object({
    data: Type.Any(),
    errors: Type.Any(),
  }),
);

export const createGqlResponseSchema = {
  body: Type.Object(
    {
      query: Type.String(),
      variables: Type.Optional(Type.Record(Type.String(), Type.Any())),
    },
    {
      additionalProperties: false,
    },
  ),
};

const rootQuery = new GraphQLObjectType<unknown, GraphQLContext>({
  name: 'Query',
  fields: queryFields,
});

const rootMutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: mutationFields,
});

export const schema = new GraphQLSchema({
  query: rootQuery,
  mutation: rootMutation,
});
