import { PrismaClient } from '@prisma/client/index.js';
import { Static } from '@sinclair/typebox';
import DataLoader from 'dataloader';
import { profileSchema } from '../../profiles/schemas.js';
import { postSchema } from '../../posts/schemas.js';

export type ProfileLoader = Static<typeof profileSchema>;
export type PostLoader = Static<typeof postSchema>;
export interface GraphQLContext {
  prisma: PrismaClient;
  loaders: Loaders;
}

export type ContextFunction = () => GraphQLContext;

export interface Loaders {
  profileLoader: DataLoader<string, ProfileLoader, string>;
  postsLoader: DataLoader<string, PostLoader, string>;
}
