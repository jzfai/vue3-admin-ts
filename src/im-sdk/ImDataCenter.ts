import { reactive, ref } from 'vue';
import { BaseAdapter, LoaderListener } from './BaseAdapter';
import { ChatDB, getChatDB } from './db/chatDB';
import { ConversationController } from './entity/ConversationController';
import MessageBuffer from './entity/MessageBuffer';
import { ConversationData, ImUserData, MessageData } from './types';
import eventManager, { ImErrorCode } from './manager/errorManager';

interface Values {
  mine?: ImUserData;
  /**连接状态，可以用来显示在会话列表顶部显示网络状态 */
  connected: boolean;
}
export class ImDataCenter implements LoaderListener {
  private adapter!: BaseAdapter;
  private db?: ChatDB;
  private userId?: string | number;
  conversations: ConversationData[] = reactive([]);
  /**外面需要的响应式数据 */
  data = reactive<Values>({
    connected: false,
  });

  private _loaded = false;
  /**会话管理列表 */
  private conversationControllerMap: Record<string, ConversationController> =
    {};

  private messageBuffer?: MessageBuffer;

  setAdapter(adapter: BaseAdapter) {
    this.adapter = adapter;
    this.adapter.addListener(this);
  }
  async onLogin() {
    await this.adapter
      .fetchConversations()
      .catch((e) => {
        eventManager.emit({
          code: ImErrorCode.loadRemoteConversationError,
          error: e,
        });
        return [];
      })
      .then((list) => this.onLoadRemoteConversation(list));
    Object.values(this.conversationControllerMap).forEach((controller) =>
      controller.onLogin()
    );
    this.messageBuffer?.onReady();
  }
  onMessage(message: MessageData): void {
    this.messageBuffer?.onMessage(message);
  }
  onConnected(): void {
    this.data.connected = true;
  }
  onDisconnected(): void {
    this.data.connected = false;
  }

  login(userId: string, token: string) {
    if (this.userId === userId) {
      return;
    }
    this.db = getChatDB(userId);
    this.messageBuffer = new MessageBuffer(this.db, this.dispatchMessage);
    this.adapter.login(userId, token);
    Object.values(this.conversationControllerMap).forEach((controller) => {
      controller.updateDb(this.db!);
      controller.loadLocalMessage();
    });
    this.loadLocalConversation();
    this.adapter.fetchUser(userId).then((resp) => {
      this.data.mine = resp;
    });
    this._loaded = true;
  }
  logout() {
    this.adapter.logout();
    this.db?.close();
    this.userId = undefined;
    this.db = undefined;
    this.conversations.length = 0;
    this.conversationControllerMap = {};
    this._loaded = false;
  }

  private dispatchMessage = (message: MessageData) => {
    const conversation = this.getConversation(message.target, true);
    conversation!.onRecieve(message);
  };

  getConversation(id: string, autoAlloc?: boolean) {
    const conversationController = this.conversationControllerMap[id];
    if (conversationController) {
      return conversationController;
    }
    if (autoAlloc) {
      const base: ConversationData = {
        id,
        type: 'singleChat',
        isPinned: false,
        unReadCount: 0,
        time: Date.now(),
      };
      const conversation = this.adapter.buildConversation(base);
      this.conversations.unshift(conversation);
      const convRef = this.conversations[0];
      this.loadUserData(convRef);
      const controller = new ConversationController(
        this.db!,
        convRef,
        this.adapter,
        this.delaySort
      );
      this.conversationControllerMap[id] = controller;
      if (this._loaded) {
        controller.loadLocalMessage();
      }
      return controller;
    }
    return undefined;
  }

  private async loadLocalConversation() {
    if (!this.db) {
      return console.warn('数据库未就绪，不应该查询本地聊天记录');
    }
    const list = await this.db.conversations.toArray();
    list.forEach((conversation) => {
      const conv = this.conversationControllerMap[conversation.id];
      if (conv) {
        conv.update(conversation);
        conv.loadLocalMessage();
      } else {
        this.conversations.push(conversation);
        const convRef = this.conversations[this.conversations.length - 1];
        this.loadUserData(convRef);
        const controller = new ConversationController(
          this.db!,
          convRef,
          this.adapter,
          this.delaySort
        );
        this.conversationControllerMap[conversation.id] = controller;
        controller.loadLocalMessage();
      }
    });
  }

  private onLoadRemoteConversation(list: ConversationData[]) {
    list.forEach((conversation) => {
      const ctr = this.conversationControllerMap[conversation.id]
      if(ctr){
        ctr.update(conversation)
      }else{
        this.conversations.push(conversation);
        // 必须要这样
        const convRef = this.conversations[this.conversations.length - 1];
        this.loadUserData(convRef);
        this.db?.saveConversation(conversation);
        const controller = new ConversationController(
          this.db!,
          convRef,
          this.adapter,
          this.delaySort
        );
        controller.loadLocalMessage();
        this.conversationControllerMap[conversation.id] = controller;
      }
    });
    this.sortConversation();
  }
  /**对会话排序 */
  sortConversation() {
    this.conversations.sort((a, b) => {
      // pin 的会话优先显示
      const divPin = Number(b.isPinned) - Number(a.isPinned);
      if (divPin !== 0) {
        return divPin;
      }
      return b.time - a.time;
    });
  }

  private sortPromise?: Promise<void>;
  delaySort = (id?: string) => {
    if (this.conversations[0]?.id === id) {
      return;
    }
    if (!this.sortPromise) {
      this.sortPromise = Promise.resolve().then(() => {
        this.sortConversation();
        this.sortPromise = undefined;
      });
    }
  };

  private loadUserData(conversation: ConversationData) {
    // if (conversation.user) return;
    if (conversation.type !== 'singleChat') return;
    this.adapter.fetchUser(conversation.id).then((user) => {
      conversation.user = user;
    });
  }

  get totalUnread() {
    return this.conversations.reduce((ret, conversation) => {
      return ret + conversation.unReadCount;
    }, 0);
  }
}

export default new ImDataCenter();
