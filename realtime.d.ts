declare namespace LeanCloudRealtime {
  interface AVUser {
    getSessionToken(): string;
  }

  interface SignatureResult {
    signature: string;
    timestamp: number;
    nonce: string;
  }
  type SignatureFactoryResult = Promise<SignatureResult> | SignatureResult;

  export class Realtime extends EventEmitter {
    constructor(options: {
      appId: string;
      appKey: string;
      region?: string;
      pushOfflineMessages?: boolean;
      noBinary?: boolean;
      ssl?: boolean;
      server?: string | { RTMRouter: string; api: string };
      RTMServers?: string | string[];
      plugins?: Array<Plugin>;
    });
    createIMClient(
      client: string | AVUser,
      options?: {
        signatureFactory?: (clientId: string) => SignatureFactoryResult;
        conversationSignatureFactory?: (
          clientId: string,
          conversationId: string,
          targetIds: string[],
          action: string
        ) => SignatureFactoryResult;
        blacklistSignatureFactory?: (
          clientId: string,
          conversationId: string,
          targetIds: string[],
          action: string
        ) => SignatureFactoryResult;
        tag?: string;
        isReconnect?: boolean;
      },
      tag?: string
    ): Promise<IMClient>;
    static defineConversationProperty(prop: string, descriptor?: Object);
    register(messageClass: AVMessage[]);
    retry();
  }

  class IMClient extends EventEmitter {
    id: string;
    close(): Promise<void>;
    createConversation(options: {
      members?: string[];
      name?: string;
      transient?: boolean;
      unique?: boolean;
      [key: string]: any;
    }): Promise<ConversationBase>;
    createChatRoom(options: {
      name?: string;
      [key: string]: any;
    }): Promise<ChatRoom>;
    createTemporaryConversation(options: {
      members?: string[];
      ttl?: number;
    }): Promise<TemporaryConversation>;
    getConversation(id: string, noCache?: boolean): Promise<ConversationBase>;
    getQuery(): ConversationQuery<PresistentConversation>;
    getServiceConversationQuery(): ConversationQuery<ServiceConversation>;
    getChatRoomQuery(): ConversationQuery<ChatRoom>;
    markAllAsRead(
      conversations: ConversationBase[]
    ): Promise<Array<ConversationBase>>;
    ping(clientIds: string[]): Promise<Array<string>>;
    parseMessage(json: Object): Promise<AVMessage>;
    parseConversation(json: Object): Promise<ConversationBase>;
  }

  class ConversationQuery<T extends ConversationBase> {
    addAscending(key: string): this;
    addDescending(key: string): this;
    ascending(key: string): this;
    compact(enabled?: boolean): this;
    containedIn(key: string, values: any): this;
    contains(key: string, subString: string): this;
    containsAll(key: string, values: any): this;
    containsMembers(peerIds: string[]): this;
    descending(key: string): this;
    doesNotExist(key: string): this;
    endsWith(key: string, suffix: string): this;
    equalTo(key: string, value: any): this;
    exists(key: string): this;
    find(): Promise<T[]>;
    greaterThan(key: string, value: any): this;
    greaterThanOrEqualTo(key: string, value: any): this;
    lessThan(key: string, value: any): this;
    lessThanOrEqualTo(key: string, value: any): this;
    limit(limit: number): this;
    matches(key: string, regex: string): this;
    notContainsIn(key: string, values: any): this;
    notEqualTo(key: string, value: any): this;
    sizeEqualTo(key: string, length: number): this;
    skip(skip: number): this;
    startsWith(key: string, prefix: string): this;
    withLastMessagesRefreshed(enabled?: boolean): this;
    withMembers(peerIds: string[], includeSelf: boolean): this;
  }
  /**
   *  对话
   */
  class ConversationBase extends EventEmitter {
    id: string;
    lastMessage?: Message;
    lastMessageAt?: Date;
    lastDeliveredAt?: Date;
    lastReadAt?: Date;
    unreadMessagesCount: Number;
    members: string[];
    readonly unreadMessagesMentioned: Boolean;
    [key: string]: any;
    // constructor();
    createMessagesIterator(option: {
      limit?: number;
      beforeTime?: Date;
      beforeMessageId?: string;
    });
    read(): Promise<this>;
    fetchReceiptTimestamps(): Promise<this>;
    queryMessages(options: {
      beforeTime?: Date;
      beforeMessageId?: string;
      afterTime?: Date;
      afterMessageId?: string;
      limit?: number;
      type: number;
    }): Promise<Array<Message>>;
    queryMessages(options: {
      startTime?: Date;
      startMessageId?: string;
      startClosed?: boolean;
      endTime?: Date;
      endMessageId?: string;
      endClosed?: boolean;
      limit?: number;
      type: number;
      direction?: MessageQueryDirection;
    }): Promise<Array<Message>>;
    send<T extends Message>(
      message: T,
      options?: {
        pushData?: Object;
        priority?: MessagePriority;
        receipt?: boolean;
        transient?: boolean;
        will?: boolean;
      }
    ): Promise<T>;
    update<T extends Message>(
      message: MessagePointer,
      newMessage: T
    ): Promise<T>;
    recall(message: MessagePointer): Promise<RecalledMessage>;
    count(): Promise<number>;
    toJSON(): Object;
    toFullJSON(): Object;
  }

  interface OperationFailureError extends Error {
    clientIds: string[];
    code?: number;
    detail?: string;
  }

  interface PartiallySuccess {
    successfulClientIds: string[];
    failures: OperationFailureError[];
  }

  interface PagedQueryParams {
    limit?: number;
    next?: string;
  }

  interface PagedResults<T> {
    results: T[];
    next: string;
  }

  class PresistentConversation extends ConversationBase {
    name: string;
    creator: string;
    createdAt: Date;
    updatedAt: Date;
    muted: boolean;
    mutedMembers?: string[];
    system: boolean;
    transient: boolean;
    get(key: string): any;
    set(key: string, value: any): this;
    save(): Promise<this>;
    fetch(): Promise<this>;
    mute(): Promise<this>;
    unmute(): Promise<this>;
    add(members: string[]): Promise<PartiallySuccess>;
    join(): Promise<this>;
    quit(): Promise<this>;
    remove(clientIds: string[]): Promise<PartiallySuccess>;
    muteMembers(clientIds: string[]): Promise<PartiallySuccess>;
    unmuteMembers(clientIds: string[]): Promise<PartiallySuccess>;
    queryMutedMembers(
      options?: PagedQueryParams
    ): Promise<PagedResults<string>>;
    blockMembers(clientIds: string[]): Promise<PartiallySuccess>;
    unblockMembers(clientIds: string[]): Promise<PartiallySuccess>;
    queryBlockedMembers(
      options?: PagedQueryParams
    ): Promise<PagedResults<string>>;
    getAllMemberInfo(): Promise<ConversationMemberInfo[]>;
    getMemberInfo(memberId: string): Promise<ConversationMemberInfo>;
    updateMemberRole(
      memberId: string,
      role: ConversationMemberRole
    ): Promise<this>;
  }

  export class Conversation extends PresistentConversation {}
  export class ChatRoom extends PresistentConversation {}
  export class ServiceConversation extends PresistentConversation {
    subscribe(): Promise<this>;
    unsubscribe(): Promise<this>;
  }

  export class TemporaryConversation extends ConversationBase {
    expiredAt: Date;
    expired: Boolean;
  }

  export enum ConversationMemberRole {
    MANAGER,
    MEMBER,
  }

  class ConversationMemberInfo {
    readonly conversationId: string;
    readonly memberId: string;
    readonly role: ConversationMemberRole;
    readonly isOwner: boolean;
    toJSON(): Object;
  }

  type MessagePointer = Message | { id: string; timestamp: Date | number };

  type Payload = Object | String | ArrayBuffer;

  export interface AVMessage {
    getPayload(): Payload;
  }

  export class Message implements AVMessage {
    constructor(content: any);
    cid: string;
    deliveredAt?: Date;
    updatedAt: Date;
    from: string;
    id: string;
    status: MessageStatus;
    timestamp: Date;
    readonly mentioned: Boolean;
    mentionList: string[];
    mentionedAll: Boolean;
    static parse(json: Object, message: Message): Message;
    static validate(): boolean;
    getPayload(): Payload;
    toJSON(): Object;
    toFullJSON(): Object;
    setMentionList(mentionList: string[]): this;
    getMentionList(): string[];
    mentionAll(): this;
  }

  // 二进制消息
  export class BinaryMessage extends Message {
    constructor(buffer: ArrayBuffer);
    buffer: ArrayBuffer;
  }

  // 富媒体消息
  export class TypedMessage extends Message {
    static TYPE: number;
    attributes: Object;
    text: string;
    readonly summary: string;
    type: number;
    getAttributes(): Object;
    getText(): string;
    setAttributes(attributes: Object): this;
  }

  // 内置文本消息类
  export class TextMessage extends TypedMessage {
    constructor(text?: string);
  }

  export class RecalledMessage extends TypedMessage {}

  class EventEmitter {
    on(evt: string, listener: Function): this;
    once(evt: string, listener: Function): this;
    off(evt: string, listener: Function): this;
    emit(evt: string, ...args: any[]): boolean;
  }

  interface Middleware<T> {
    (target: T): T;
  }
  interface Decorator<T> {
    (target: T): void;
  }

  export interface Plugin {
    name?: string;
    beforeMessageParse?: Middleware<AVMessage>;
    afterMessageParse?: Middleware<AVMessage>;
    beforeMessageDispatch?: (message: AVMessage) => boolean;
    messageClasses?: AVMessage[];
    onConversationCreate?: Decorator<ConversationBase>;
    onIMClientCreate?: Decorator<IMClient>;
    onRealtimeCreate?: Decorator<Realtime>;
  }

  export enum MessagePriority {
    LOW,
    NORMAL,
    HIGH,
  }

  export enum MessageStatus {
    NONE,
    SENDING,
    SENT,
    DELIVERED,
    FAILED,
  }

  export enum MessageQueryDirection {
    NEW_TO_OLD,
    OLD_TO_NEW,
  }

  export enum ErrorCode {
    CLOSE_NORMAL,
    CLOSE_ABNORMAL,
    APP_NOT_AVAILABLE,
    SIGNATURE_FAILED,
    INVALID_LOGIN,
    SESSION_REQUIRED,
    READ_TIMEOUT,
    LOGIN_TIMEOUT,
    FRAME_TOO_LONG,
    INVALID_ORIGIN,
    SESSION_CONFLICT,
    SESSION_TOKEN_EXPIRED,
    APP_QUOTA_EXCEEDED,
    MESSAGE_SENT_QUOTA_EXCEEDED,
    INTERNAL_ERROR,
    CONVERSATION_API_FAILED,
    CONVERSATION_SIGNATURE_FAILED,
    CONVERSATION_NOT_FOUND,
    CONVERSATION_FULL,
    CONVERSATION_REJECTED_BY_APP,
    CONVERSATION_UPDATE_FAILED,
    CONVERSATION_READ_ONLY,
    CONVERSATION_NOT_ALLOWED,
    CONVERSATION_UPDATE_REJECTED,
    CONVERSATION_QUERY_FAILED,
    CONVERSATION_LOG_FAILED,
    CONVERSATION_LOG_REJECTED,
    SYSTEM_CONVERSATION_REQUIRED,
    NORMAL_CONVERSATION_REQUIRED,
    CONVERSATION_BLACKLISTED,
    TRANSIENT_CONVERSATION_REQUIRED,
    CONVERSATION_MEMBERSHIP_REQUIRED,
    CONVERSATION_API_QUOTA_EXCEEDED,
    TEMPORARY_CONVERSATION_EXPIRED,
    INVALID_MESSAGING_TARGET,
    MESSAGE_REJECTED_BY_APP,
    MESSAGE_OWNERSHIP_REQUIRED,
    MESSAGE_NOT_FOUND,
    MESSAGE_UPDATE_REJECTED_BY_APP,
    MESSAGE_EDIT_DISABLED,
    MESSAGE_RECALL_DISABLED,
  }

  export enum Event {
    DISCONNECT,
    RECONNECT,
    RETRY,
    SCHEDULE,
    OFFLINE,
    ONLINE,

    RECONNECT_ERROR,

    INVITED,
    KICKED,
    MEMBERS_JOINED,
    MEMBERS_LEFT,
    MEMBER_INFO_UPDATED,
    BLOCKED,
    UNBLOCKED,
    MEMBERS_BLOCKED,
    MEMBERS_UNBLOCKED,
    MUTED,
    UNMUTED,
    MEMBERS_MUTED,
    MEMBERS_UNMUTED,
    MESSAGE,
    UNREAD_MESSAGES_COUNT_UPDATE,
    CLOSE,
    CONFLICT,
    UNHANDLED_MESSAGE,
    CONVERSATION_INFO_UPDATED,

    LAST_DELIVERED_AT_UPDATE,
    LAST_READ_AT_UPDATE,
    MESSAGE_RECALL,
    MESSAGE_UPDATE,
    INFO_UPDATED,
  }

  export function messageType(type: number): Function;
  export function messageField(fields: string[]): Function;
}

export = LeanCloudRealtime;
