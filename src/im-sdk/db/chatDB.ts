// db/chatDB.ts
import Dexie, { Table } from 'dexie';
import {
  MessageData,
  ConversationData,
  ReadMessage,
  ClearUnreadMessage,
} from '../types';
import { toRaw } from 'vue';

interface DelaySaver<T> {
  promise?: Promise<void>;
  unsaves: T[];
}

const dbMap: Record<number | string, ChatDB> = {};
export class ChatDB extends Dexie {
  messages!: Table<MessageData, string>; // 主键为 message.id
  conversations!: Table<ConversationData, string>; // 主键为 conversation.id

  private id: string;

  constructor(dbId: string) {
    super(dbId);
    this.id = dbId;
    this.version(1).stores({
      messages: 'id, target, time, to, [target+time]',
      conversations: 'id, type',
    });
  }
  close(closeOptions?: { disableAutoOpen: boolean } | undefined): void {
    super.close(closeOptions);
    delete dbMap[this.id];
  }
  /**延迟到微任务完成后再批量保存，这样可以将循环中的处理后置 */
  private messageSaver: DelaySaver<MessageData> = {
    unsaves: [],
  };
  private readMessages: ReadMessage[] = [];
  private clearUnreadMessage?: ClearUnreadMessage;
  saveMessage(message: MessageData) {
    /**如果没有id，说明是临时消息，先不用保存到本地 */
    if (!message.id) return;
    if (message.type === 'read') {
      this.readMessages.push(toRaw(message));
    } else if (message.type === 'clearUnread') {
      this.clearUnreadMessage = message;
    } else {
      this.messageSaver.unsaves.push(toRaw(message));
    }
    if (!this.messageSaver.promise) {
      this.messageSaver.promise = Promise.resolve().then(() => {
        this.messageSaver.promise = undefined;
        this.messages.bulkPut(this.messageSaver.unsaves);
        this.messageSaver.unsaves = [];
        this.readMessages.forEach((message) => {
          this.messages
            .where('id')
            .equals(message.messageId)
            .modify({ isRead: true });
        });
        this.readMessages = [];
        const message = this.clearUnreadMessage;
        if (message) {
          this.messages
            .where(['target', 'time']) // 使用复合索引
            .between(
              [message.target, 0],
              [message.target, message.time],
              true,
              true
            )
            .modify({ isRead: true });
        }
        this.clearUnreadMessage = undefined;
      });
    }
  }
  /**延迟到微任务完成后再批量保存，这样可以将循环中的处理后置 */
  private conversationSaver: DelaySaver<ConversationData> = {
    unsaves: [],
  };
  saveConversation(conversation: ConversationData) {
    this.conversationSaver.unsaves.push(toRaw(conversation));
    if (!this.conversationSaver.promise) {
      this.conversationSaver.promise = Promise.resolve().then(() => {
        this.conversationSaver.promise = undefined;
        this.conversations.bulkPut(this.conversationSaver.unsaves);
        this.conversationSaver.unsaves = [];
      });
    }
  }
}

export function getChatDB(userId: number | string) {
  const key = `user-${userId}`;
  const db = dbMap[key];
  if (db) {
    return db;
  }
  const newDb = new ChatDB(key);
  dbMap[key] = newDb;
  return newDb;
}
