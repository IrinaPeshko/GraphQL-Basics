import { Type } from '@fastify/type-provider-typebox';
import { GraphQLBoolean, GraphQLObjectType, GraphQLSchema } from 'graphql';

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

const rootQuery = new GraphQLObjectType({
  name: 'Query',
  fields: {}
})

const rootMutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {}
})

export const schema = new GraphQLSchema({
  query: rootQuery,
  mutation: rootMutation
})
