import DataLoader from 'dataloader';
import {
  PostLoader,
  ProfileLoader,
  memberTypeLoader,
  subscribeUserLoader,
} from './types/types.js';

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

  const userSubscribedToLoader = new DataLoader<string, subscribeUserLoader[]>(
    async (subscriberIds) => {
      const subscriptions = await prisma.subscribersOnAuthors.findMany({
        where: {
          subscriberId: {
            in: subscriberIds,
          },
        },
        include: {
          author: true,
        },
      });
      const authorsBySubscriberId = subscriptions.reduce(
        (map, { subscriberId, author }) => {
          if (!map[subscriberId]) {
            map[subscriberId] = [];
          }
          if (author) {
            map[subscriberId].push(author);
          }
          return map;
        },
        {},
      );
      return subscriberIds.map(
        (subscriberId) => authorsBySubscriberId[subscriberId] || [],
      );
    },
  );

  const subscribedToUserLoader = new DataLoader<string, subscribeUserLoader[]>(
    async (authorIds) => {
      const subscriptions = await prisma.subscribersOnAuthors.findMany({
        where: {
          authorId: { in: authorIds },
        },
        include: {
          subscriber: true,
        },
      });

      const subscribersByAuthorId = subscriptions.reduce(
        (acc, { authorId, subscriber }) => {
          if (!acc[authorId]) {
            acc[authorId] = [];
          }
          if (subscriber) {
            acc[authorId].push(subscriber);
          }
          return acc;
        },
        {},
      );

      return authorIds.map((authorId) => subscribersByAuthorId[authorId] || []);
    },
  );

  const memberTypeLoader = new DataLoader<string, memberTypeLoader[]>(
    async (memberIds) => {
      const memberTypes = await prisma.memberType.findMany({
        where: {
          id: {
            in: memberIds,
          },
        },
      });
      const memberTypeMap = memberTypes.reduce((map, memberType) => {
        map[memberType.id] = memberType;
        return map;
      }, {});
      return memberIds.map((key) => memberTypeMap[key]);
    },
  );

  return {
    profileLoader,
    postsLoader,
    userSubscribedToLoader,
    subscribedToUserLoader,
    memberTypeLoader,
  };
};
