import { ModuleContext } from "@graphql-modules/core";
import { IRecipientModuleContext } from "../modules/recipient/index";

export type Maybe<T> = T | undefined | null;

export enum MessageType {
  Location = "LOCATION",
  Text = "TEXT",
  Picture = "PICTURE"
}

// ====================================================
// Types
// ====================================================

export interface Query {
  users?: Maybe<User[]>;

  chats?: Maybe<Chat[]>;

  chat?: Maybe<Chat>;
}

export interface User {
  id: string;

  name?: Maybe<string>;

  picture?: Maybe<string>;

  phone?: Maybe<string>;
}

export interface Chat {
  id: string;

  name?: Maybe<string>;

  picture?: Maybe<string>;

  allTimeMembers: User[];

  listingMembers: User[];

  actualGroupMembers: User[];

  admins?: Maybe<User[]>;

  owner?: Maybe<User>;

  isGroup: boolean;

  messages: (Maybe<Message>)[];

  unreadMessages: number;
}

export interface Message {
  id: string;

  sender: User;

  chat: Chat;

  content: string;

  createdAt: string;

  type: number;

  holders: User[];

  ownership: boolean;

  recipients: Recipient[];
}

export interface Recipient {
  user: User;

  message: Message;

  chat: Chat;

  receivedAt?: Maybe<string>;

  readAt?: Maybe<string>;
}

export interface Mutation {
  addChat?: Maybe<Chat>;

  addGroup?: Maybe<Chat>;

  removeChat?: Maybe<string>;

  addMembers?: Maybe<(Maybe<string>)[]>;

  removeMembers?: Maybe<(Maybe<string>)[]>;

  addAdmins?: Maybe<(Maybe<string>)[]>;

  removeAdmins?: Maybe<(Maybe<string>)[]>;

  setGroupName?: Maybe<string>;

  setGroupPicture?: Maybe<string>;

  addMessage?: Maybe<Message>;

  removeMessages?: Maybe<(Maybe<string>)[]>;

  markAsReceived?: Maybe<boolean>;

  markAsRead?: Maybe<boolean>;
}

export interface Subscription {
  chatAdded?: Maybe<Chat>;

  messageAdded?: Maybe<Message>;
}

// ====================================================
// Arguments
// ====================================================

export interface ChatQueryArgs {
  chatId: string;
}
export interface MessagesChatArgs {
  amount?: Maybe<number>;
}
export interface AddChatMutationArgs {
  userId: string;
}
export interface AddGroupMutationArgs {
  userIds: string[];

  groupName: string;
}
export interface RemoveChatMutationArgs {
  chatId: string;
}
export interface AddMembersMutationArgs {
  groupId: string;

  userIds: string[];
}
export interface RemoveMembersMutationArgs {
  groupId: string;

  userIds: string[];
}
export interface AddAdminsMutationArgs {
  groupId: string;

  userIds: string[];
}
export interface RemoveAdminsMutationArgs {
  groupId: string;

  userIds: string[];
}
export interface SetGroupNameMutationArgs {
  groupId: string;
}
export interface SetGroupPictureMutationArgs {
  groupId: string;
}
export interface AddMessageMutationArgs {
  chatId: string;

  content: string;
}
export interface RemoveMessagesMutationArgs {
  chatId: string;

  messageIds?: Maybe<(Maybe<string>)[]>;

  all?: Maybe<boolean>;
}
export interface MarkAsReceivedMutationArgs {
  chatId: string;
}
export interface MarkAsReadMutationArgs {
  chatId: string;
}
export interface MessageAddedSubscriptionArgs {
  chatId?: Maybe<string>;
}

import { GraphQLResolveInfo } from "graphql";

import { Chat } from "../entity/Chat";

import { Message } from "../entity/Message";

import { Recipient } from "../entity/Recipient";

import { User } from "../entity/User";

export type Resolver<Result, Parent = {}, Context = {}, Args = {}> = (
  parent: Parent,
  args: Args,
  context: Context,
  info: GraphQLResolveInfo
) => Promise<Result> | Result;

export interface ISubscriptionResolverObject<Result, Parent, Context, Args> {
  subscribe<R = Result, P = Parent>(
    parent: P,
    args: Args,
    context: Context,
    info: GraphQLResolveInfo
  ): AsyncIterator<R | Result> | Promise<AsyncIterator<R | Result>>;
  resolve?<R = Result, P = Parent>(
    parent: P,
    args: Args,
    context: Context,
    info: GraphQLResolveInfo
  ): R | Result | Promise<R | Result>;
}

export type SubscriptionResolver<
  Result,
  Parent = {},
  Context = {},
  Args = {}
> =
  | ((
      ...args: any[]
    ) => ISubscriptionResolverObject<Result, Parent, Context, Args>)
  | ISubscriptionResolverObject<Result, Parent, Context, Args>;

export type TypeResolveFn<Types, Parent = {}, Context = {}> = (
  parent: Parent,
  context: Context,
  info: GraphQLResolveInfo
) => Maybe<Types>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult, TArgs = {}, TContext = {}> = (
  next: NextResolverFn<TResult>,
  source: any,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export namespace QueryResolvers {
  export interface Resolvers<
    Context = ModuleContext<IRecipientModuleContext>,
    TypeParent = {}
  > {
    users?: UsersResolver<Maybe<User[]>, TypeParent, Context>;

    chats?: ChatsResolver<Maybe<Chat[]>, TypeParent, Context>;

    chat?: ChatResolver<Maybe<Chat>, TypeParent, Context>;
  }

  export type UsersResolver<
    R = Maybe<User[]>,
    Parent = {},
    Context = ModuleContext<IRecipientModuleContext>
  > = Resolver<R, Parent, Context>;
  export type ChatsResolver<
    R = Maybe<Chat[]>,
    Parent = {},
    Context = ModuleContext<IRecipientModuleContext>
  > = Resolver<R, Parent, Context>;
  export type ChatResolver<
    R = Maybe<Chat>,
    Parent = {},
    Context = ModuleContext<IRecipientModuleContext>
  > = Resolver<R, Parent, Context, ChatArgs>;
  export interface ChatArgs {
    chatId: string;
  }
}

export namespace UserResolvers {
  export interface Resolvers<
    Context = ModuleContext<IRecipientModuleContext>,
    TypeParent = User
  > {
    id?: IdResolver<string, TypeParent, Context>;

    name?: NameResolver<Maybe<string>, TypeParent, Context>;

    picture?: PictureResolver<Maybe<string>, TypeParent, Context>;

    phone?: PhoneResolver<Maybe<string>, TypeParent, Context>;
  }

  export type IdResolver<
    R = string,
    Parent = User,
    Context = ModuleContext<IRecipientModuleContext>
  > = Resolver<R, Parent, Context>;
  export type NameResolver<
    R = Maybe<string>,
    Parent = User,
    Context = ModuleContext<IRecipientModuleContext>
  > = Resolver<R, Parent, Context>;
  export type PictureResolver<
    R = Maybe<string>,
    Parent = User,
    Context = ModuleContext<IRecipientModuleContext>
  > = Resolver<R, Parent, Context>;
  export type PhoneResolver<
    R = Maybe<string>,
    Parent = User,
    Context = ModuleContext<IRecipientModuleContext>
  > = Resolver<R, Parent, Context>;
}

export namespace ChatResolvers {
  export interface Resolvers<
    Context = ModuleContext<IRecipientModuleContext>,
    TypeParent = Chat
  > {
    id?: IdResolver<string, TypeParent, Context>;

    name?: NameResolver<Maybe<string>, TypeParent, Context>;

    picture?: PictureResolver<Maybe<string>, TypeParent, Context>;

    allTimeMembers?: AllTimeMembersResolver<User[], TypeParent, Context>;

    listingMembers?: ListingMembersResolver<User[], TypeParent, Context>;

    actualGroupMembers?: ActualGroupMembersResolver<
      User[],
      TypeParent,
      Context
    >;

    admins?: AdminsResolver<Maybe<User[]>, TypeParent, Context>;

    owner?: OwnerResolver<Maybe<User>, TypeParent, Context>;

    isGroup?: IsGroupResolver<boolean, TypeParent, Context>;

    messages?: MessagesResolver<(Maybe<Message>)[], TypeParent, Context>;

    unreadMessages?: UnreadMessagesResolver<number, TypeParent, Context>;
  }

  export type IdResolver<
    R = string,
    Parent = Chat,
    Context = ModuleContext<IRecipientModuleContext>
  > = Resolver<R, Parent, Context>;
  export type NameResolver<
    R = Maybe<string>,
    Parent = Chat,
    Context = ModuleContext<IRecipientModuleContext>
  > = Resolver<R, Parent, Context>;
  export type PictureResolver<
    R = Maybe<string>,
    Parent = Chat,
    Context = ModuleContext<IRecipientModuleContext>
  > = Resolver<R, Parent, Context>;
  export type AllTimeMembersResolver<
    R = User[],
    Parent = Chat,
    Context = ModuleContext<IRecipientModuleContext>
  > = Resolver<R, Parent, Context>;
  export type ListingMembersResolver<
    R = User[],
    Parent = Chat,
    Context = ModuleContext<IRecipientModuleContext>
  > = Resolver<R, Parent, Context>;
  export type ActualGroupMembersResolver<
    R = User[],
    Parent = Chat,
    Context = ModuleContext<IRecipientModuleContext>
  > = Resolver<R, Parent, Context>;
  export type AdminsResolver<
    R = Maybe<User[]>,
    Parent = Chat,
    Context = ModuleContext<IRecipientModuleContext>
  > = Resolver<R, Parent, Context>;
  export type OwnerResolver<
    R = Maybe<User>,
    Parent = Chat,
    Context = ModuleContext<IRecipientModuleContext>
  > = Resolver<R, Parent, Context>;
  export type IsGroupResolver<
    R = boolean,
    Parent = Chat,
    Context = ModuleContext<IRecipientModuleContext>
  > = Resolver<R, Parent, Context>;
  export type MessagesResolver<
    R = (Maybe<Message>)[],
    Parent = Chat,
    Context = ModuleContext<IRecipientModuleContext>
  > = Resolver<R, Parent, Context, MessagesArgs>;
  export interface MessagesArgs {
    amount?: Maybe<number>;
  }

  export type UnreadMessagesResolver<
    R = number,
    Parent = Chat,
    Context = ModuleContext<IRecipientModuleContext>
  > = Resolver<R, Parent, Context>;
}

export namespace MessageResolvers {
  export interface Resolvers<
    Context = ModuleContext<IRecipientModuleContext>,
    TypeParent = Message
  > {
    id?: IdResolver<string, TypeParent, Context>;

    sender?: SenderResolver<User, TypeParent, Context>;

    chat?: ChatResolver<Chat, TypeParent, Context>;

    content?: ContentResolver<string, TypeParent, Context>;

    createdAt?: CreatedAtResolver<string, TypeParent, Context>;

    type?: TypeResolver<number, TypeParent, Context>;

    holders?: HoldersResolver<User[], TypeParent, Context>;

    ownership?: OwnershipResolver<boolean, TypeParent, Context>;

    recipients?: RecipientsResolver<Recipient[], TypeParent, Context>;
  }

  export type IdResolver<
    R = string,
    Parent = Message,
    Context = ModuleContext<IRecipientModuleContext>
  > = Resolver<R, Parent, Context>;
  export type SenderResolver<
    R = User,
    Parent = Message,
    Context = ModuleContext<IRecipientModuleContext>
  > = Resolver<R, Parent, Context>;
  export type ChatResolver<
    R = Chat,
    Parent = Message,
    Context = ModuleContext<IRecipientModuleContext>
  > = Resolver<R, Parent, Context>;
  export type ContentResolver<
    R = string,
    Parent = Message,
    Context = ModuleContext<IRecipientModuleContext>
  > = Resolver<R, Parent, Context>;
  export type CreatedAtResolver<
    R = string,
    Parent = Message,
    Context = ModuleContext<IRecipientModuleContext>
  > = Resolver<R, Parent, Context>;
  export type TypeResolver<
    R = number,
    Parent = Message,
    Context = ModuleContext<IRecipientModuleContext>
  > = Resolver<R, Parent, Context>;
  export type HoldersResolver<
    R = User[],
    Parent = Message,
    Context = ModuleContext<IRecipientModuleContext>
  > = Resolver<R, Parent, Context>;
  export type OwnershipResolver<
    R = boolean,
    Parent = Message,
    Context = ModuleContext<IRecipientModuleContext>
  > = Resolver<R, Parent, Context>;
  export type RecipientsResolver<
    R = Recipient[],
    Parent = Message,
    Context = ModuleContext<IRecipientModuleContext>
  > = Resolver<R, Parent, Context>;
}

export namespace RecipientResolvers {
  export interface Resolvers<
    Context = ModuleContext<IRecipientModuleContext>,
    TypeParent = Recipient
  > {
    user?: UserResolver<User, TypeParent, Context>;

    message?: MessageResolver<Message, TypeParent, Context>;

    chat?: ChatResolver<Chat, TypeParent, Context>;

    receivedAt?: ReceivedAtResolver<Maybe<string>, TypeParent, Context>;

    readAt?: ReadAtResolver<Maybe<string>, TypeParent, Context>;
  }

  export type UserResolver<
    R = User,
    Parent = Recipient,
    Context = ModuleContext<IRecipientModuleContext>
  > = Resolver<R, Parent, Context>;
  export type MessageResolver<
    R = Message,
    Parent = Recipient,
    Context = ModuleContext<IRecipientModuleContext>
  > = Resolver<R, Parent, Context>;
  export type ChatResolver<
    R = Chat,
    Parent = Recipient,
    Context = ModuleContext<IRecipientModuleContext>
  > = Resolver<R, Parent, Context>;
  export type ReceivedAtResolver<
    R = Maybe<string>,
    Parent = Recipient,
    Context = ModuleContext<IRecipientModuleContext>
  > = Resolver<R, Parent, Context>;
  export type ReadAtResolver<
    R = Maybe<string>,
    Parent = Recipient,
    Context = ModuleContext<IRecipientModuleContext>
  > = Resolver<R, Parent, Context>;
}

export namespace MutationResolvers {
  export interface Resolvers<
    Context = ModuleContext<IRecipientModuleContext>,
    TypeParent = {}
  > {
    addChat?: AddChatResolver<Maybe<Chat>, TypeParent, Context>;

    addGroup?: AddGroupResolver<Maybe<Chat>, TypeParent, Context>;

    removeChat?: RemoveChatResolver<Maybe<string>, TypeParent, Context>;

    addMembers?: AddMembersResolver<
      Maybe<(Maybe<string>)[]>,
      TypeParent,
      Context
    >;

    removeMembers?: RemoveMembersResolver<
      Maybe<(Maybe<string>)[]>,
      TypeParent,
      Context
    >;

    addAdmins?: AddAdminsResolver<
      Maybe<(Maybe<string>)[]>,
      TypeParent,
      Context
    >;

    removeAdmins?: RemoveAdminsResolver<
      Maybe<(Maybe<string>)[]>,
      TypeParent,
      Context
    >;

    setGroupName?: SetGroupNameResolver<Maybe<string>, TypeParent, Context>;

    setGroupPicture?: SetGroupPictureResolver<
      Maybe<string>,
      TypeParent,
      Context
    >;

    addMessage?: AddMessageResolver<Maybe<Message>, TypeParent, Context>;

    removeMessages?: RemoveMessagesResolver<
      Maybe<(Maybe<string>)[]>,
      TypeParent,
      Context
    >;

    markAsReceived?: MarkAsReceivedResolver<
      Maybe<boolean>,
      TypeParent,
      Context
    >;

    markAsRead?: MarkAsReadResolver<Maybe<boolean>, TypeParent, Context>;
  }

  export type AddChatResolver<
    R = Maybe<Chat>,
    Parent = {},
    Context = ModuleContext<IRecipientModuleContext>
  > = Resolver<R, Parent, Context, AddChatArgs>;
  export interface AddChatArgs {
    userId: string;
  }

  export type AddGroupResolver<
    R = Maybe<Chat>,
    Parent = {},
    Context = ModuleContext<IRecipientModuleContext>
  > = Resolver<R, Parent, Context, AddGroupArgs>;
  export interface AddGroupArgs {
    userIds: string[];

    groupName: string;
  }

  export type RemoveChatResolver<
    R = Maybe<string>,
    Parent = {},
    Context = ModuleContext<IRecipientModuleContext>
  > = Resolver<R, Parent, Context, RemoveChatArgs>;
  export interface RemoveChatArgs {
    chatId: string;
  }

  export type AddMembersResolver<
    R = Maybe<(Maybe<string>)[]>,
    Parent = {},
    Context = ModuleContext<IRecipientModuleContext>
  > = Resolver<R, Parent, Context, AddMembersArgs>;
  export interface AddMembersArgs {
    groupId: string;

    userIds: string[];
  }

  export type RemoveMembersResolver<
    R = Maybe<(Maybe<string>)[]>,
    Parent = {},
    Context = ModuleContext<IRecipientModuleContext>
  > = Resolver<R, Parent, Context, RemoveMembersArgs>;
  export interface RemoveMembersArgs {
    groupId: string;

    userIds: string[];
  }

  export type AddAdminsResolver<
    R = Maybe<(Maybe<string>)[]>,
    Parent = {},
    Context = ModuleContext<IRecipientModuleContext>
  > = Resolver<R, Parent, Context, AddAdminsArgs>;
  export interface AddAdminsArgs {
    groupId: string;

    userIds: string[];
  }

  export type RemoveAdminsResolver<
    R = Maybe<(Maybe<string>)[]>,
    Parent = {},
    Context = ModuleContext<IRecipientModuleContext>
  > = Resolver<R, Parent, Context, RemoveAdminsArgs>;
  export interface RemoveAdminsArgs {
    groupId: string;

    userIds: string[];
  }

  export type SetGroupNameResolver<
    R = Maybe<string>,
    Parent = {},
    Context = ModuleContext<IRecipientModuleContext>
  > = Resolver<R, Parent, Context, SetGroupNameArgs>;
  export interface SetGroupNameArgs {
    groupId: string;
  }

  export type SetGroupPictureResolver<
    R = Maybe<string>,
    Parent = {},
    Context = ModuleContext<IRecipientModuleContext>
  > = Resolver<R, Parent, Context, SetGroupPictureArgs>;
  export interface SetGroupPictureArgs {
    groupId: string;
  }

  export type AddMessageResolver<
    R = Maybe<Message>,
    Parent = {},
    Context = ModuleContext<IRecipientModuleContext>
  > = Resolver<R, Parent, Context, AddMessageArgs>;
  export interface AddMessageArgs {
    chatId: string;

    content: string;
  }

  export type RemoveMessagesResolver<
    R = Maybe<(Maybe<string>)[]>,
    Parent = {},
    Context = ModuleContext<IRecipientModuleContext>
  > = Resolver<R, Parent, Context, RemoveMessagesArgs>;
  export interface RemoveMessagesArgs {
    chatId: string;

    messageIds?: Maybe<(Maybe<string>)[]>;

    all?: Maybe<boolean>;
  }

  export type MarkAsReceivedResolver<
    R = Maybe<boolean>,
    Parent = {},
    Context = ModuleContext<IRecipientModuleContext>
  > = Resolver<R, Parent, Context, MarkAsReceivedArgs>;
  export interface MarkAsReceivedArgs {
    chatId: string;
  }

  export type MarkAsReadResolver<
    R = Maybe<boolean>,
    Parent = {},
    Context = ModuleContext<IRecipientModuleContext>
  > = Resolver<R, Parent, Context, MarkAsReadArgs>;
  export interface MarkAsReadArgs {
    chatId: string;
  }
}

export namespace SubscriptionResolvers {
  export interface Resolvers<
    Context = ModuleContext<IRecipientModuleContext>,
    TypeParent = {}
  > {
    chatAdded?: ChatAddedResolver<Maybe<Chat>, TypeParent, Context>;

    messageAdded?: MessageAddedResolver<Maybe<Message>, TypeParent, Context>;
  }

  export type ChatAddedResolver<
    R = Maybe<Chat>,
    Parent = {},
    Context = ModuleContext<IRecipientModuleContext>
  > = SubscriptionResolver<R, Parent, Context>;
  export type MessageAddedResolver<
    R = Maybe<Message>,
    Parent = {},
    Context = ModuleContext<IRecipientModuleContext>
  > = SubscriptionResolver<R, Parent, Context, MessageAddedArgs>;
  export interface MessageAddedArgs {
    chatId?: Maybe<string>;
  }
}

/** Directs the executor to skip this field or fragment when the `if` argument is true. */
export type SkipDirectiveResolver<Result> = DirectiveResolverFn<
  Result,
  SkipDirectiveArgs,
  ModuleContext<IRecipientModuleContext>
>;
export interface SkipDirectiveArgs {
  /** Skipped when true. */
  if: boolean;
}

/** Directs the executor to include this field or fragment only when the `if` argument is true. */
export type IncludeDirectiveResolver<Result> = DirectiveResolverFn<
  Result,
  IncludeDirectiveArgs,
  ModuleContext<IRecipientModuleContext>
>;
export interface IncludeDirectiveArgs {
  /** Included when true. */
  if: boolean;
}

/** Marks an element of a GraphQL schema as no longer supported. */
export type DeprecatedDirectiveResolver<Result> = DirectiveResolverFn<
  Result,
  DeprecatedDirectiveArgs,
  ModuleContext<IRecipientModuleContext>
>;
export interface DeprecatedDirectiveArgs {
  /** Explains why this element was deprecated, usually also including a suggestion for how to access supported similar data. Formatted using the Markdown syntax (as specified by [CommonMark](https://commonmark.org/). */
  reason?: string;
}

export interface IResolvers {
  Query?: QueryResolvers.Resolvers;
  User?: UserResolvers.Resolvers;
  Chat?: ChatResolvers.Resolvers;
  Message?: MessageResolvers.Resolvers;
  Recipient?: RecipientResolvers.Resolvers;
  Mutation?: MutationResolvers.Resolvers;
  Subscription?: SubscriptionResolvers.Resolvers;
}

export interface IDirectiveResolvers<Result> {
  skip?: SkipDirectiveResolver<Result>;
  include?: IncludeDirectiveResolver<Result>;
  deprecated?: DeprecatedDirectiveResolver<Result>;
}