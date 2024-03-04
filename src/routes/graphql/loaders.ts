import DataLoader from 'dataloader';
import { PostLoader, ProfileLoader } from './types/types.js';

export const createLoaders = (prisma) => {
  const profileLoader = new DataLoader<string, ProfileLoader>(async (usersId) => {
    const profiles = await prisma.profile.findMany({
      where: { userId: { in: usersId } },
    });
    const profileById = profiles.reduce((map, profile) => {
      map[profile.userId] = profile;
      return map;
    }, {});
    return usersId.map((userId) => profileById[userId] || null);
  });

  const postsLoader = new DataLoader<string, PostLoader[]>(async (authorIds) => {
    const posts: PostLoader[] = await prisma.post.findMany({
      where: { authorId: { in: authorIds } },
    });
    const postsByAuthorId = posts.reduce((map, post) => {
      if (!map[post.authorId]) {
        map[post.authorId] = [];
      }
      map[post.authorId].push(post);
      return map;
    }, {});
    return authorIds.map((authorId) => postsByAuthorId[authorId] || []);
  });
  return {
    profileLoader,
    postsLoader,
  };
};
