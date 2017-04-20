declare module 'leancloud-realtime' {
    /**
    * LeanMessage
    */
    namespace LeanMessage {
        class Realtime extends EventEmitter {
            constructor(options: { appId: string, region?: string, pushOfflineMessages?: boolean, noBinary?: boolean, ssl?: boolean, plugins?: boolean });
            createIMClient(clientId: string, clientOptions?: { signatureFactory?: Function, conversationSignatureFactory?: Function, tag?: string }): Promise<IMClient>;
            static defineConversationProperty(prop: string, descriptor?: Object);
            register(messageClass: Function[]);
            retry();
        }
        class IMClient extends EventEmitter {
            close(): Promise<any>;
            createConversation(options: { members?: string[], name?: string, transient?: boolean, unique?: boolean, [key: string]: any }): Promise<Conversation>;
            getConversation(id: string, noCache?: boolean): Promise<Conversation>;
            getQuery(): ConversationQuery;
            markAllAsRead(conversations: Conversation[]): Promise<Array<Conversation>>;
            ping(clientIds: string[]): Promise<Array<string>>;
        }
        class ConversationQuery {
            find<T>(): Promise<T>;
            addAscending(key: string): ConversationQuery;
            addDescending(key: string): ConversationQuery;
            ascending(key: string): ConversationQuery;
            compact(enabled?: boolean): ConversationQuery;
            containedIn(key: string, values: any): ConversationQuery;
            contains(key: string, subString: string): ConversationQuery;
            containsAll(key: string, values: any): ConversationQuery;
            containsMembers(peerIds: string[]): ConversationQuery;
            descending(key: string): ConversationQuery;
            endsWith(key: string, suffix: string): ConversationQuery;
            equalTo(key: string, value: any): ConversationQuery;
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
            //constructor();
            id: string;
            name: string;
            [key: string]: any;
            add(members: string[]): Promise<Conversation>;
            count(): Promise<number>;
            createMessagesIterator(option: { limit?: number, beforeTime?: Date, beforeMessageId?: string });
            fetch(): Promise<Conversation>;
            get(key: string): any;
            join(): Promise<Conversation>;
            markAsRead(): Promise<Conversation>;
            mute(): Promise<Conversation>;
            queryMessages(options: { beforeTime?: Date, beforeMessageId?: string, afterTime?: Date, afterMessageId?: string, limit?: number }): Promise<Array<Message>>;
            quit(): Promise<Conversation>;
            remove(clientIds: string[]): Promise<Conversation>;
            save(): Promise<Conversation>;
            send(message: Message): Promise<Message>;
            set(key: string, value: any): Conversation;
            unmute(): Promise<Conversation>;
        }
        //
        class AVMessage {
            static parse(json: any, message: AVMessage): AVMessage;
            static validate(json): boolean;
            toJSON(): any;
        }

        class Message extends AVMessage {
            constructor(content: any);
            cid: string;
            deliveredAt?: Date;
            from: string;
            id: string;
            needReceipt: boolean;
            readonly status: number;
            timestamp: Date;
            transient: boolean;
            static parse(json: Object, message: Message): Message;
            static validate(): boolean;
            setNeedReceipt(needReceipt: boolean): Message;
            setTransient(transient: boolean): Message;
            toJSON(): Object;
        }

        // 富媒体消息
        class TypedMessage extends Message {
            attributes: {};
            text: string;
            readonly type: number;
            getAttributes(): {};
            getText(): string;
            setAttributes(attributes: {}): TypedMessage;
        }

        // 内置文本消息类
        class TextMessage extends TypedMessage {
            constructor(text?: string);
        }

        class EventEmitter {
            on(evt: string, listener: Function): EventEmitter;
            once(evt: string, listener: Function): EventEmitter;
            off(evt: string, listener: Function): EventEmitter;
            emit(evt: string, ...args: any[]): EventEmitter;
        }
    }
    export = LeanMessage;
}
