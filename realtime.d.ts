
declare module LeanCloudRealtime {

  export class Realtime extends EventEmitter {
    constructor(options: { appId: string, region?: string, pushOfflineMessages?: boolean, noBinary?: boolean, ssl?: boolean, plugins?: Array<Plugin> });
    createIMClient(clientId: string, clientOptions?: { signatureFactory?: Function, conversationSignatureFactory?: Function, tag?: string }): Promise<IMClient>;
    static defineConversationProperty(prop: string, descriptor?: Object);
    register(messageClass: AVMessage[]);
    retry();
  }

  class IMClient extends EventEmitter {
    id: string;
    close(): Promise<any>;
    createConversation(options: { members?: string[], name?: string, transient?: boolean, unique?: boolean, [key: string]: any }): Promise<Conversation>;
    getConversation(id: string, noCache?: boolean): Promise<Conversation>;
    getQuery(): ConversationQuery;
    markAllAsRead(conversations: Conversation[]): Promise<Array<Conversation>>;
    ping(clientIds: string[]): Promise<Array<string>>;
  }

  class ConversationQuery {
    addAscending(key: string): ConversationQuery;
    addDescending(key: string): ConversationQuery;
    ascending(key: string): ConversationQuery;
    compact(enabled?: boolean): ConversationQuery;
    containedIn(key: string, values: any): ConversationQuery;
    contains(key: string, subString: string): ConversationQuery;
    containsAll(key: string, values: any): ConversationQuery;
    containsMembers(peerIds: string[]): ConversationQuery;
    descending(key: string): ConversationQuery;
    doesNotExist(key: string): ConversationQuery;
    endsWith(key: string, suffix: string): ConversationQuery;
    equalTo(key: string, value: any): ConversationQuery;
    exists(key: string): ConversationQuery;
    find(): Promise<Array<Conversation>>;
    greaterThan(key: string, value: any): ConversationQuery;
    greaterThanOrEqualTo(key: string, value: any): ConversationQuery;
    lessThan(key: string, value: any): ConversationQuery;
    lessThanOrEqualTo(key: string, value: any): ConversationQuery;
    limit(limit: number): ConversationQuery;
    matches(key: string, regex: string): ConversationQuery;
    notContainsIn(key: string, values: any): ConversationQuery;
    notEqualTo(key: string, value: any): ConversationQuery;
    sizeEqualTo(key: string, length: number): ConversationQuery;
    skip(skip: number): ConversationQuery;
    startsWith(key: string, prefix: string): ConversationQuery;
    withLastMessagesRefreshed(enabled?: boolean): ConversationQuery;
    withMembers(peerIds: string[], includeSelf: boolean): ConversationQuery;
  }
  /**
  *  对话
  */
  class Conversation extends EventEmitter {
    id: string;
    name: string;
    creator: string;
    createdAt: Date;
    updatedAt: Date;
    lastMessage?: Message;
    lastMessageAt?: Date;
    lastDeliveredAt?: Date;
    lastReadAt?: Date;
    unreadMessagesCount: Number;
    members: string[];
    muted: boolean;
    mutedMembers?: string[];
    system: boolean;
    transient: boolean;
    [key: string]: any;
    // constructor();
    add(members: string[]): Promise<Conversation>;
    count(): Promise<number>;
    createMessagesIterator(option: { limit?: number, beforeTime?: Date, beforeMessageId?: string });
    fetch(): Promise<Conversation>;
    get(key: string): any;
    join(): Promise<Conversation>;
    read(): Promise<Conversation>;
    markAsRead(): Promise<Conversation>;
    fetchReceiptTimestamps(): Promise<Conversation>;
    mute(): Promise<Conversation>;
    queryMessages(options: { beforeTime?: Date, beforeMessageId?: string, afterTime?: Date, afterMessageId?: string, limit?: number }): Promise<Array<Message>>;
    quit(): Promise<Conversation>;
    remove(clientIds: string[]): Promise<Conversation>;
    save(): Promise<Conversation>;
    send(message: Message, options?: { pushData?: Object, priority?: MessagePriority, receipt?: boolean, transient?: boolean, will?: boolean }): Promise<Message>;
    set(key: string, value: any): Conversation;
    unmute(): Promise<Conversation>;
    update<T extends Message>(message: MessagePointer, newMessage: T): Promise<T>;
    recall(message: MessagePointer): Promise<RecalledMessage>;
  }

  type MessagePointer = Message | {id: string, timestamp: Date|number};

  export interface AVMessage {
    toJSON(): any;
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
    transient: boolean;
    static parse(json: Object, message: Message): Message;
    static validate(): boolean;
    setTransient(transient: boolean): Message;
    toJSON(): Object;
  }

  // 富媒体消息
  export class TypedMessage extends Message {
    attributes: {};
    text: string;
    title: string;
    type: number;
    getAttributes(): {};
    getText(): string;
    setAttributes(attributes: {}): TypedMessage;
  }

  // 内置文本消息类
  export class TextMessage extends TypedMessage {
    constructor(text?: string);
  }

  export class RecalledMessage extends TypedMessage {}

  class EventEmitter {
    on(evt: string, listener: Function): EventEmitter;
    once(evt: string, listener: Function): EventEmitter;
    off(evt: string, listener: Function): EventEmitter;
    emit(evt: string, ...args: any[]): boolean;
  }

  interface Middleware<T> {
    (target: T): T
  }
  interface Decorator<T> {
    (target: T): void
  }

  export interface Plugin {
    name?: string;
    beforeMessageParse?: Middleware<AVMessage>;
    afterMessageParse?: Middleware<AVMessage>;
    beforeMessageDispatch?: (message: AVMessage) => boolean;
    messageClasses?: AVMessage[];
    onConversationCreate?: Decorator<Conversation>;
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

  export enum ErrorCode {
    CLOSE_NORMAL,
    CLOSE_ABNORMAL,
    APP_NOT_AVAILABLE,
    INVALID_LOGIN,
    SESSION_REQUIRED,
    READ_TIMEOUT,
    LOGIN_TIMEOUT,
    FRAME_TOO_LONG,
    INVALID_ORIGIN,
    SESSION_CONFLICT,
    SESSION_TOKEN_EXPIRED,
    INTERNAL_ERROR,
    SEND_MESSAGE_TIMEOUT,
    CONVERSATION_SIGNATURE_FAILED,
    CONVERSATION_NOT_FOUND,
    CONVERSATION_FULL,
    CONVERSATION_REJECTED_BY_APP,
    CONVERSATION_UPDATE_FAILED,
    CONVERSATION_READ_ONLY,
    CONVERSATION_NOT_ALLOWED,
    INVALID_MESSAGING_TARGET,
    MESSAGE_REJECTED_BY_APP,
  }
  
  export function messageType(type: number): Function
  export function messageField(fields: string[]): Function
}

export = LeanCloudRealtime;
