import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema, schema } from './schemas.js';
import { graphql } from 'graphql';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req) {
      const { query, variables } = req.body;
      try {
        const result = await graphql({
          schema: schema,
          source: query,
          variableValues: variables,
          contextValue: { prisma: fastify.prisma },
        });
        return result;
      } catch (error) {
        // Обработка ошибок
      }
    },
  });
};

export default plugin;
