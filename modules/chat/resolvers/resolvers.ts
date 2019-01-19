import { InjectFunction } from '@graphql-modules/di'
import { PubSub, withFilter } from 'apollo-server-express';
import { User } from "../../../entity/User";
import { Chat } from "../../../entity/Chat";
import { Message } from "../../../entity/Message";
import { Recipient } from "../../../entity/Recipient";
import { IResolvers } from "../../../types/chat";
import { Connection } from 'typeorm';
import { CurrentUserProvider } from '../../auth/providers/current-user.provider';

export default InjectFunction(PubSub, Connection)((pubsub, connection): IResolvers => ({
  Query: {
    chats: async (obj, args, { injector }) => {
      const { currentUser } = injector.get(CurrentUserProvider);
      return await connection
        .createQueryBuilder(Chat, "chat")
        .leftJoin('chat.listingMembers', 'listingMembers')
        .where('listingMembers.id = :id', { id: currentUser.id })
        .getMany();
    },
    chat: async (obj, { chatId }) => {
      return await connection
        .createQueryBuilder(Chat, "chat")
        .whereInIds(chatId)
        .getOne();
    },
  },
  Mutation: {
    addChat: async (obj, { userId }, { injector }) => {
      const { currentUser } = injector.get(CurrentUserProvider);
      const user = await connection
        .createQueryBuilder(User, "user")
        .whereInIds(userId)
        .getOne();

      if (!user) {
        throw new Error(`User ${userId} doesn't exist.`);
      }

      let chat = await connection
        .createQueryBuilder(Chat, "chat")
        .where('chat.name IS NULL')
        .innerJoin('chat.allTimeMembers', 'allTimeMembers1', 'allTimeMembers1.id = :currentUserId', { currentUserId: currentUser.id })
        .innerJoin('chat.allTimeMembers', 'allTimeMembers2', 'allTimeMembers2.id = :userId', { userId: userId })
        .innerJoinAndSelect('chat.listingMembers', 'listingMembers')
        .getOne();

      if (chat) {
        // Chat already exists. Both users are already in the userIds array
        const listingMembers = await connection
          .createQueryBuilder(User, "user")
          .innerJoin('user.listingMemberChats', 'listingMemberChats', 'listingMemberChats.id = :chatId', { chatId: chat.id })
          .getMany();

        if (!listingMembers.find(user => user.id === currentUser.id)) {
          // The chat isn't listed for the current user. Add him to the memberIds
          chat.listingMembers.push(currentUser);
          chat = await connection.getRepository(Chat).save(chat);

          return chat || null;
        } else {
          throw new Error(`Chat already exists.`);
        }
      } else {
        // Create the chat
        chat = await connection.getRepository(Chat).save(new Chat({
          allTimeMembers: [currentUser, user],
          // Chat will not be listed to the other user until the first message gets written
          listingMembers: [currentUser],
        }));

        return chat || null;
      }
    },
    addGroup: async (obj, { userIds, groupName }, { injector }) => {
      const { currentUser } = injector.get(CurrentUserProvider);
      let users: User[] = [];
      for (let userId of userIds) {
        const user = await connection
          .createQueryBuilder(User, "user")
          .whereInIds(userId)
          .getOne();
        if (!user) {
          throw new Error(`User ${userId} doesn't exist.`);
        }
        users.push(user);
      }

      const chat = await connection.getRepository(Chat).save(new Chat({
        name: groupName,
        admins: [currentUser],
        owner: currentUser,
        allTimeMembers: [...users, currentUser],
        listingMembers: [...users, currentUser],
        actualGroupMembers: [...users, currentUser],
      }));

      pubsub.publish('chatAdded', {
        creatorId: currentUser.id,
        chatAdded: chat,
      });

      return chat || null;
    },
    removeChat: async (obj, { chatId }, { injector }) => {
      const { currentUser } = injector.get(CurrentUserProvider);
      const chat = await connection
        .createQueryBuilder(Chat, "chat")
        .whereInIds(Number(chatId))
        .innerJoinAndSelect('chat.listingMembers', 'listingMembers')
        .leftJoinAndSelect('chat.actualGroupMembers', 'actualGroupMembers')
        .leftJoinAndSelect('chat.admins', 'admins')
        .leftJoinAndSelect('chat.owner', 'owner')
        .leftJoinAndSelect('chat.messages', 'messages')
        .leftJoinAndSelect('messages.holders', 'holders')
        .getOne();

      if (!chat) {
        throw new Error(`The chat ${chatId} doesn't exist.`);
      }

      if (!chat.name) {
        // Chat
        if (!chat.listingMembers.find(user => user.id === currentUser.id)) {
          throw new Error(`The user is not a listing member of the chat ${chatId}.`);
        }

        // Instead of chaining map and filter we can loop once using reduce
        chat.messages = await chat.messages.reduce<Promise<Message[]>>(async (filtered$, message) => {
          const filtered = await filtered$;

          message.holders = message.holders.filter(user => user.id !== currentUser.id);

          if (message.holders.length !== 0) {
            // Remove the current user from the message holders
            await connection.getRepository(Message).save(message);
            filtered.push(message);
          } else {
            // Simply remove the message
            const recipients = await connection
              .createQueryBuilder(Recipient, "recipient")
              .innerJoinAndSelect('recipient.message', 'message', 'message.id = :messageId', { messageId: message.id })
              .innerJoinAndSelect('recipient.user', 'user')
              .getMany();
            for (let recipient of recipients) {
              await connection.getRepository(Recipient).remove(recipient);
            }
            await connection.getRepository(Message).remove(message);
          }

          return filtered;
        }, Promise.resolve([]));

        // Remove the current user from who gets the chat listed. The chat will no longer appear in his list
        chat.listingMembers = chat.listingMembers.filter(user => user.id !== currentUser.id);

        // Check how many members are left
        if (chat.listingMembers.length === 0) {
          // Delete the chat
          await connection.getRepository(Chat).remove(chat);
        } else {
          // Update the chat
          await connection.getRepository(Chat).save(chat);
        }
        return chatId;
      } else {
        // Group

        // Instead of chaining map and filter we can loop once using reduce
        chat.messages = await chat.messages.reduce<Promise<Message[]>>(async (filtered$, message) => {
          const filtered = await filtered$;

          message.holders = message.holders.filter(user => user.id !== currentUser.id);

          if (message.holders.length !== 0) {
            // Remove the current user from the message holders
            await connection.getRepository(Message).save(message);
            filtered.push(message);
          } else {
            // Simply remove the message
            const recipients = await connection
              .createQueryBuilder(Recipient, "recipient")
              .innerJoinAndSelect('recipient.message', 'message', 'message.id = :messageId', { messageId: message.id })
              .innerJoinAndSelect('recipient.user', 'user')
              .getMany();
            for (let recipient of recipients) {
              await connection.getRepository(Recipient).remove(recipient);
            }
            await connection.getRepository(Message).remove(message);
          }

          return filtered;
        }, Promise.resolve([]));

        // Remove the current user from who gets the group listed. The group will no longer appear in his list
        chat.listingMembers = chat.listingMembers.filter(user => user.id !== currentUser.id);

        // Check how many members (including previous ones who can still access old messages) are left
        if (chat.listingMembers.length === 0) {
          // Remove the group
          await connection.getRepository(Chat).remove(chat);
        } else {
          // Update the group

          // Remove the current user from the chat members. He is no longer a member of the group
          chat.actualGroupMembers = chat.actualGroupMembers && chat.actualGroupMembers.filter(user => user.id !== currentUser.id);
          // Remove the current user from the chat admins
          chat.admins = chat.admins && chat.admins.filter(user => user.id !== currentUser.id);
          // If there are no more admins left the group goes read only
          chat.owner = chat.admins && chat.admins[0] || null; // A null owner means the group is read-only

          await connection.getRepository(Chat).save(chat);
        }
        return chatId;
      }
    },
  },
  Subscription: {
    chatAdded: {
      subscribe: withFilter(() => pubsub.asyncIterator('chatAdded'),
        ({ creatorId, chatAdded }: { creatorId: string, chatAdded: Chat }, variables, { user: currentUser }: { user: User }) => {
          return Number(creatorId) !== currentUser.id &&
            !!chatAdded.listingMembers.find((user: User) => user.id === currentUser.id);
        }),
    }
  },
  Chat: {
    name: async (chat, args, { injector }) => {
      const { currentUser } = injector.get(CurrentUserProvider);
      if (chat.name) {
        return chat.name;
      }
      const user = await connection
        .createQueryBuilder(User, "user")
        .where('user.id != :userId', { userId: currentUser.id })
        .innerJoin('user.allTimeMemberChats', 'allTimeMemberChats', 'allTimeMemberChats.id = :chatId', { chatId: chat.id })
        .getOne();
      return user && user.name || null;
    },
    picture: async (chat, args, { injector }) => {
      const { currentUser } = injector.get(CurrentUserProvider);
      if (chat.name) {
        return chat.picture;
      }
      const user = await connection
        .createQueryBuilder(User, "user")
        .where('user.id != :userId', { userId: currentUser.id })
        .innerJoin('user.allTimeMemberChats', 'allTimeMemberChats', 'allTimeMemberChats.id = :chatId', { chatId: chat.id })
        .getOne();
      return user ? user.picture : null;
    },
    allTimeMembers: async (chat, args, { injector }) => {
      const { currentUser } = injector.get(CurrentUserProvider);
      return await connection
        .createQueryBuilder(User, "user")
        .innerJoin('user.allTimeMemberChats', 'allTimeMemberChats', 'allTimeMemberChats.id = :chatId', { chatId: chat.id })
        .getMany();
    },
    listingMembers: async (chat, args, { injector }) => {
      const { currentUser } = injector.get(CurrentUserProvider);
      return await connection
        .createQueryBuilder(User, "user")
        .innerJoin('user.listingMemberChats', 'listingMemberChats', 'listingMemberChats.id = :chatId', { chatId: chat.id })
        .getMany();
    },
    actualGroupMembers: async (chat, args, { injector }) => {
      const { currentUser } = injector.get(CurrentUserProvider);
      return await connection
        .createQueryBuilder(User, "user")
        .innerJoin('user.actualGroupMemberChats', 'actualGroupMemberChats', 'actualGroupMemberChats.id = :chatId', { chatId: chat.id })
        .getMany();
    },
    admins: async (chat, args, { injector }) => {
      const { currentUser } = injector.get(CurrentUserProvider);
      return await connection
        .createQueryBuilder(User, "user")
        .innerJoin('user.adminChats', 'adminChats', 'adminChats.id = :chatId', { chatId: chat.id })
        .getMany();
    },
    owner: async (chat, args, { injector }) => {
      const { currentUser } = injector.get(CurrentUserProvider);
      return await connection
        .createQueryBuilder(User, "user")
        .innerJoin('user.ownerChats', 'ownerChats', 'ownerChats.id = :chatId', { chatId: chat.id })
        .getOne() || null;
    },
    isGroup: (chat) => !!chat.name,
  },
}));