import { reactive } from 'vue';
import { BaseAdapter } from '../BaseAdapter';
import config from '../config';
import { ChatDB } from '../db/chatDB';
import {
  BaseMessage,
  ClearUnreadMessage,
  ConversationData,
  MessageData,
  MessageState,
  MessageTempData,
  ReadMessage,
} from '../types';
import { readImageFile, readVideoFile } from '../utils';
import { generateBrief } from '../utils/message';
import { toRaw } from 'vue';
import errorManager, { ImErrorCode } from '../manager/errorManager';

const INT_MAX = 2 ** 32;
export class ConversationController {
  messages: MessageData[] = reactive([]);
  private db: ChatDB;
  conversation: ConversationData;
  private adapter: BaseAdapter;
  private sorter: (id?: string) => void;

  private timeCousr = INT_MAX * 1000;
  private loadMoreId = 0;
  private noMore = false;
  private isInited = false;
  private isLogin = false;

  /**我的未读列表，用来记录我是否读取过，避免重复发送 */
  private unReadSet = new Set<string>();

  constructor(
    db: ChatDB,
    conversation: ConversationData,
    adapter: BaseAdapter,
    sorter: (id?: string) => void
  ) {
    this.db = db;
    this.conversation = conversation;
    this.adapter = adapter;
    this.sorter = sorter;
  }
  updateDb(db: ChatDB) {
    this.db = db;
  }

  async loadLocalMessage() {
    if (this.isInited) return;
    this.isInited = true;
    const dataList = await this.loadLocalHistory();
    this.timeCousr = dataList[0]?.time || 0;
    this.messages.unshift(...dataList);
    if (this.isLogin) {
      if (this.messages.length < 1) {
        this.loadMore();
      }
    }
  }

  onLogin() {
    if (this.messages.length < 1 && this.isInited) {
      this.loadMore();
    }
    this.isLogin = true;
  }

  private async loadLocalHistory() {
    const list = await this.db.messages
      .where(['target', 'time']) // 使用复合索引
      .between(
        [this.conversation.id, 0],
        [this.conversation.id, this.timeCousr],
        true,
        false
      )
      .reverse() // **关键步骤：将结果按 time 倒序排列**
      .limit(50)
      .toArray();
    return list.reverse();
  }

  async loadMore() {
    if (this.noMore) {
      return;
    }
    const id = ++this.loadMoreId;
    const dataList = await this.loadLocalHistory();
    if (id !== this.loadMoreId) {
      // 说明是重复请求，丢弃上一次的请求
      return;
    }
    if (dataList.length > 0) {
      this.timeCousr = dataList[0].time;
      this.messages.unshift(...dataList);
    } else {
      // 远程拉取，并保存
      try {
        const resp = await this.adapter.fetchMessageList(
          this.conversation.id,
          this.messages[0]?.id || ''
        );
        if (resp.list) {
          this.messages.unshift(...resp.list);
          resp.list.forEach((message) => {
            this.db.saveMessage(message);
          });
        }
        this.noMore = !!resp.isEnd;
      } catch (error) {
        errorManager.emit({
          code: ImErrorCode.loadRemoteMessageError,
          error: error,
        });
      }
    }
  }

  private async sendMessage(temp: MessageTempData) {
    if (config.onBeforeSendMessage) {
      try {
        const isOk = await config.onBeforeSendMessage(temp);
        if (!isOk) {
          return;
        }
      } catch (error) {
        console.log('执行消息发送前置检查失败');
      }
    }
    this.messages.push(temp.message);
    let ret: MessageData | undefined;
    try {
      ret = await this.adapter.sendMessage(temp);
    } catch (error) {
      errorManager.emit({
        code: ImErrorCode.sendMessageError,
        data: temp.message,
        error,
      });
      return;
    }
    const index = this.messages.lastIndexOf(temp.message);
    if (ret) {
      if (index >= 0) {
        // 替换原本的临时消息
        this.messages.splice(index, 1, ret);
      }
      if (temp.blob && 'url' in temp.message) {
        if (temp.message.url?.startsWith('blob')) {
          URL.revokeObjectURL(temp.message.url);
        }
      }
      this.db.saveMessage(ret);
      this.onConversationMessage(ret);
      config.onAfterSendMessage?.(ret);
      // 调整排序
      this.sorter(this.conversation.id);
    } else {
      errorManager.emit({
        code: ImErrorCode.sendMessageFailed,
        data: temp.message,
      });
      // 发送失败，先简单处理 todo
      if (index >= 0) {
        // 替换原本的临时消息
        this.messages.splice(index, 1);

        if (temp.blob && 'url' in temp.message) {
          if (temp.message.url?.startsWith('blob')) {
            URL.revokeObjectURL(temp.message.url);
          }
        }
      }
    }
  }

  /**给会话设置最新的数据 */
  private onConversationMessage(message: MessageData) {
    this.conversation.time = message.time;
    this.conversation.last = generateBrief(message);
    this.db.saveConversation(toRaw(this.conversation));
  }

  clearUnread() {
    if (this.conversation.unReadCount < 1) return;

    const base: BaseMessage = this.createBaseMessage();
    const message: ClearUnreadMessage = {
      id: '',
      ...base,
      type: 'clearUnread',
    };
    return this.adapter.sendMessage({ message }).then(() => {
      this.conversation.unReadCount = 0;
      this.unReadSet.clear();
      this.db.saveConversation(toRaw(this.conversation));
    });
  }

  private createBaseMessage(): BaseMessage {
    return {
      target: this.conversation.id,
      to: this.conversation.id,
      time: Date.now(),
      isRead: false,
      state: MessageState.sending,
    };
  }

  /**单独阅读了某条消息 */
  async sendReadMessage(target: MessageData) {
    if (!this.unReadSet.has(target.id)) {
      return;
    }
    const base: BaseMessage = this.createBaseMessage();
    const message: ReadMessage = {
      id: '',
      ...base,
      type: 'read',
      messageId: target.id,
    };
    await this.adapter.sendMessage({ message }).then(() => {
      this.conversation.unReadCount--;
      this.unReadSet.delete(target.id);
      this.db.saveConversation(toRaw(this.conversation));
    });
  }

  async sendTextMessage(msg: string, ext?: Record<string, any>) {
    const base: BaseMessage = this.createBaseMessage();
    const message: MessageData = {
      id: '',
      ...base,
      type: 'txt',
      msg,
      ext,
    };
    await this.sendMessage({ message });
  }
  async sendImageMessage(file: File, ext?: Record<string, any>) {
    const base: BaseMessage = this.createBaseMessage();
    const info = await readImageFile(file);
    const message: MessageData = {
      id: '',
      ...base,
      type: 'img',
      url: info.url,
      width: info.width,
      height: info.height,
      length: file.size,
      ext,
    };
    await this.sendMessage({ message, blob: file });
  }
  sendAudioMessage(file: Blob, duration: number, ext?: Record<string, any>) {
    const base: BaseMessage = this.createBaseMessage();
    const message: MessageData = {
      id: '',
      ...base,
      type: 'audio',
      url: URL.createObjectURL(file),
      duration,
      length: file.size,
      ext,
    };
    return this.sendMessage({ message, blob: file });
  }
  async sendVideoMessage(file: File, ext?: Record<string, any>) {
    const base: BaseMessage = this.createBaseMessage();
    const info = await readVideoFile(file);
    const message: MessageData = {
      id: '',
      ...base,
      type: 'video',
      url: info.url,
      width: info.width,
      height: info.height,
      length: file.size,
      duration: info.duration,
      ext,
    };
    await this.sendMessage({ message, blob: file });
  }

  onRecieve(data: MessageData) {
    // 读取消息
    if (data.type === 'clearUnread') {
      this.messages.forEach((message) => {
        if (message.time < data.time) {
          message.isRead = true;
        }
      });
    } else if (data.type === 'read') {
      const message = this.messages.find(
        (message) => message.id === data.messageId
      );
      if (message) {
        message.isRead = true;
      }
    } else {
      if (data.type === 'call') {
        const oldMessage = this.messages.find((m) => m.id === data.id);
        if (oldMessage) {
          Object.assign(oldMessage, data);
          this.onConversationMessage(data);
          this.sorter(this.conversation.id);
          return;
        }
      }
      this.messages.push(data);
      this.conversation.unReadCount++;
      this.unReadSet.add(data.id);
      this.onConversationMessage(data);
      // 调整排序
      this.sorter(this.conversation.id);
    }
  }
  onMessageUpdate(data: MessageData) {
    this.db.saveMessage(data);
    if (data.id === this.messages[this.messages.length - 1]?.id) {
      this.onConversationMessage(data);
    }
  }

  /**更新会话，同时可以判断是否需要拉取远端消息列表 */
  update(conversation: ConversationData) {
    if (conversation.time > this.conversation.time) {
      Object.assign(this.conversation, conversation);
      this.db.saveConversation(this.conversation)
    }
  }
}
