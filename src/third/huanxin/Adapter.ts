import { BaseAdapter, LoaderListener } from '@/im-sdk/BaseAdapter';
import { CallAdapter, CallListener } from '@/im-sdk/callDataCenter';
import {
  CallAction,
  CallMessage,
  CallType,
  ConversationData,
  ImUserData,
  MessageData,
  MessageTempData,
} from '@/im-sdk/types';
import { generateBrief } from '@/im-sdk/utils/message';
// import userManager from '@/manager/user';
import {
  default as easemobChat,
  EasemobChat,
  default as WebIM,
} from 'easemob-websdk';
import {
  callDataConvert,
  CallDataExt,
  CmdCallMessageAction,
  messageConvert,
} from './utils';
import { uuid } from './api';
export class Adapter implements BaseAdapter, CallAdapter {
  imConn!: EasemobChat.Connection;

  userId!: string;
  token!: string;
  private ready: Promise<EasemobChat.Connection>;
  private _readyResolver!: (conn: EasemobChat.Connection) => void;

  constructor() {
    this.ready = new Promise<EasemobChat.Connection>((resolve) => {
      this._readyResolver = resolve;
    });
  }
  listener!: LoaderListener;
  addListener(listener: LoaderListener): void {
    this.listener = listener;
  }

  init(appKey: string) {
    this.imConn = new WebIM.connection({
      appKey,
    });
    this.startListen();
  }
  startListen() {
    // 这里没有用implement的原因是回调函数内部以其他对象作为this调用过this.xxx，会导致this指向异常
    const listener = <EasemobChat.EventHandlerType>{
      onConnected: this.onConnected.bind(this),
      onDisconnected: this.onDisconnected.bind(this),
      onTextMessage: this.onCommonMessage.bind(this),
      onImageMessage: this.onCommonMessage.bind(this),
      onCmdMessage: this.onCmdMessage.bind(this),
      onAudioMessage: this.onCommonMessage.bind(this),
      onLocationMessage: this.onLocationMessage.bind(this),
      onFileMessage: this.onFileMessage.bind(this),
      onCustomMessage: this.onCustomMessage.bind(this),
      onVideoMessage: this.onCommonMessage.bind(this),
      onPresence: this.onPresence.bind(this),
      onContactInvited: this.onContactInvited.bind(this),
      onContactDeleted: this.onContactDeleted.bind(this),
      onContactAdded: this.onContactAdded.bind(this),
      onContactRefuse: this.onContactRefuse.bind(this),
      onContactAgreed: this.onContactAgreed.bind(this),
      onGroupEvent: this.onGroupEvent.bind(this),
      onOnline: this.onOnline.bind(this),
      onOffline: this.onOffline.bind(this),
      onError: this.onError.bind(this),
      onRecallMessage: this.onRecallMessage.bind(this),
      onReceivedMessage: this.onReceivedMessage.bind(this),
      onDeliveredMessage: this.onDeliveredMessage.bind(this),
      onReadMessage: this.onCommonMessage.bind(this),
      onChannelMessage: this.onCommonMessage.bind(this),
    };
    this.imConn.addEventHandler('eventName', listener);
  }
  fetchUser(imId: string): Promise<ImUserData> {
    return Promise.resolve({
      imId,
      userId: 'defaultUserId',
      avatar: 'defaultAvatarUrl',
      name: 'defaultName',
    });
  }
  private loginPromise?: Promise<boolean>;
  async login(userId: string, token: string) {
    if (this.loginPromise) {
      return this.loginPromise;
    }
    this.userId = userId;
    this.token = token;
    this.loginPromise = new Promise(async (rs) => {
      const result = await this.imConn.open({
        user: userId,
        accessToken: token,
      });
      this.listener?.onLogin();
      this.callListener.onLogin();
      this.loginPromise = undefined;
      if (result) {
        return rs(true);
      }
      return rs(false);
    });
    return this.loginPromise;
  }
  logout(): void {
    if (!this.userId) return;
    this.userId = '';
    this.token = '';
    // 放到微任务末尾来操作
    Promise.resolve().then(() => {
      this.imConn.close();
    });
  }
  async fetchConversations(): Promise<ConversationData[]> {
    const result: ConversationData[] = [];
    await this.loopGetConversation('', result, []);
    return result;
  }
  private async loopGetConversation(
    cursor: string,
    collection: ConversationData[],
    blackList: string[]
  ) {
    const pageSize = 50;
    const conn = await this.ready;
    const resp = await conn.getServerConversations({ pageSize, cursor });
    if (resp.data) {
      resp.data.conversations.forEach((conversation) => {
        if (!blackList.includes(conversation.conversationId)) {
          const conv: ConversationData = {
            id: conversation.conversationId,
            type: conversation.conversationType,
            isPinned: conversation.isPinned,
            unReadCount: conversation.unReadCount,
            time: 0,
          };
          if (conversation.lastMessage) {
            const lastMessage = messageConvert(
              conversation.lastMessage as EasemobChat.MessagesType,
              this.userId
            );
            if (lastMessage) {
              conv.last = generateBrief(lastMessage);
              conv.time = lastMessage.time;
            }
          }
          collection.push(conv);
        }
      });
      if (resp.data.conversations.length === 50) {
        // 可能还有，就继续拉
        await this.loopGetConversation(resp.data.cursor, collection, blackList);
      }
    }
  }
  async fetchMessageList(
    userId: string,
    cursor: string
  ): Promise<{ cursor: string; list: MessageData[]; isEnd?: boolean }> {
    const conn = await this.ready;
    const resp = await conn.getHistoryMessages({
      targetId: userId,
      pageSize: 50,
      cursor,
      chatType: 'singleChat',
      searchDirection: 'up',
    });

    return {
      cursor: resp.cursor || '',
      isEnd: resp.isLast,
      list: resp.messages
        .map((message) => messageConvert(message, this.userId))
        .filter((v) => v) as MessageData[],
    };
  }
  async sendMessage(
    message: MessageTempData
  ): Promise<MessageData | undefined> {
    try {
      const conn = await this.ready;
      if (message.message.type === 'txt') {
        const body = WebIM.message.create({
          chatType: 'singleChat', // 会话类型，设置为单聊。
          type: 'txt', // 消息类型。
          from: this.userId,
          to: message.message.to, // 消息接收方（用户 ID)。
          msg: message.message.msg, // 消息内容。
          ext: message.message.ext,
        });
        const res = await conn.send(body);
        if (res.message) {
          return messageConvert(res.message, this.userId);
        }
      } else if (message.message.type === 'img') {
        const file = message.blob as File;
        const body = WebIM.message.create({
          // 消息类型。
          type: 'img',
          file: {
            data: message.blob as File,
            url: easemobChat.utils.parseDownloadResponse(message.message.url),
            filename: file.name,
            filetype: file.type,
          },
          from: this.userId,
          to: message.message.to,
          chatType: 'singleChat',
          thumbnailHeight: 50,
          thumbnailWidth: 50,
          width: message.message.width,
          height: message.message.height,
          file_length: message.message.length,
          ext: message.message.ext,
        });
        const res = await conn.send(body);
        if (res.message) {
          return messageConvert(res.message, this.userId);
        }
      } else if (message.message.type === 'audio') {
        const file = message.blob as File;
        const body = WebIM.message.create({
          // 消息类型。
          type: 'audio',
          file: {
            data: file,
            filename: file.name,
            filetype: file.type,
            url: easemobChat.utils.parseDownloadResponse(message.message.url),
          },
          filename: file.name,
          length: message.message.duration,
          from: this.userId,
          to: message.message.to,
          chatType: 'singleChat',
          ext: message.message.ext,
        });
        const res = await conn.send(body);
        if (res.message) {
          return messageConvert(res.message, this.userId);
        }
      } else if (message.message.type === 'video') {
        const file = message.blob as File;
        const body = WebIM.message.create({
          // 消息类型。
          type: 'video',
          file: {
            data: message.blob as File,
            url: message.message.url || '',
            filename: file.name,
            filetype: file.type,
          },
          filename: file.name,
          length: message.message.duration,
          from: this.userId,
          to: message.message.to,
          chatType: 'singleChat',
          ext: {
            width: message.message.width,
            height: message.message.height,
            ...message.message.ext,
          },
        });
        const res = await conn.send(body);
        if (res.message) {
          return messageConvert(res.message, this.userId);
        }
      } else if (message.message.type === 'read') {
        const body = WebIM.message.create({
          // 消息类型。
          type: 'read',
          from: this.userId,
          to: message.message.to,
          chatType: 'singleChat',
          id: message.message.messageId,
        });
        await conn.send(body);
      } else if (message.message.type === 'clearUnread') {
        const body = WebIM.message.create({
          chatType: 'singleChat', // 会话类型，设置为单聊。
          type: 'channel', // 消息类型。
          to: message.message.to,
        });
        await conn.send(body);
      }
    } catch (error) {
      console.error('发送消息失败', error);
    }
  }
  /**外部定制会话结构，可以在extra里面添加数据 */
  buildConversation(base: ConversationData): ConversationData {
    return base;
  }
  /**通用消息处理 */
  onCommonMessage(message: EasemobChat.MessagesType) {
    const ret = messageConvert(message, this.userId);
    if (!ret) return;
    this.listener?.onMessage(ret);
  }

  ////////以下是回调---------------
  onConnected(message?: EasemobChat.ErrorEvent) {
    this._readyResolver(this.imConn);
    this.listener?.onConnected();
  }
  // SDK 与环信服务器断开连接。
  onDisconnected(message?: EasemobChat.ErrorEvent) {
    this.listener?.onDisconnected();
    this.ready = new Promise<EasemobChat.Connection>((resolve) => {
      this._readyResolver = resolve;
    });
    //断开回调触发后，如果业务登录状态为true则说明异常断开需要重新登录
    if (!this.token) {
      this.imConn.close();
    } else {
      //执行通过token，重新登录
      this.login(this.userId, this.token);
    }
  }

  // 当前用户收到透传消息。
  onCmdMessage(msg: EasemobChat.CmdMsgBody) {
    this.onCallData(msg);
  }
  // 当前用户收到位置消息。
  onLocationMessage(message: EasemobChat.LocationMsgBody) {}
  // 当前用户收到文件消息。
  onFileMessage(message: EasemobChat.FileMsgBody) {}
  // 当前用户收到自定义消息。
  onCustomMessage(message: EasemobChat.CustomMsgBody) {}
  // 当前用户订阅的其他用户的在线状态更新。
  onPresence(message: EasemobChat.PresenceMsg) {}
  // 当前用户收到好友邀请。
  onContactInvited(msg: EasemobChat.ContactMsgBody) {}
  // 联系人被删除。
  onContactDeleted(msg: EasemobChat.ContactMsgBody) {}
  // 新增联系人。
  onContactAdded(msg: EasemobChat.ContactMsgBody) {}
  // 当前用户发送的好友请求被拒绝。
  onContactRefuse(msg: EasemobChat.ContactMsgBody) {}
  // 当前用户发送的好友请求被同意。
  onContactAgreed(msg: EasemobChat.ContactMsgBody) {}
  // 当前用户收到群组邀请。
  onGroupEvent(message: EasemobChat.GroupEvent) {}
  // 本机网络连接成功。
  onOnline() {}
  // 本机网络掉线。
  onOffline() {}
  // 调用过程中出现错误。
  onError(message: EasemobChat.ErrorEvent) {
    if (message.type === 206) {
      // 其他地方登录了，这里自动退出
      // todo 这里还不能直接调用user.logout，会导致token也丢失，在开发时候会导致异常刷新token
    }
  }
  // 当前用户收到的消息被消息发送方撤回。
  onRecallMessage(message: EasemobChat.RecallMsgBody) {}
  // 当前用户发送的消息被接收方收到。
  onReceivedMessage(message: EasemobChat.ReceivedMsgBody) {}
  // 当前用户收到消息送达回执。
  onDeliveredMessage(message: EasemobChat.DeliveryMsgBody) {}

  // 拉黑用户
  addUsersToBlocklist(imUserId: string) {
    this.imConn.addUsersToBlocklist({ name: imUserId });
  }

  // 取消拉黑
  removeUserFromBlocklist(imUserId: string) {
    this.imConn.removeUserFromBlocklist({ name: imUserId });
  }

  // 删除服务端会话列表
  deleteConversation() {
    this.imConn.deleteAllMessagesAndConversations();
  }

  //////////语音聊天相关
  callListener!: CallListener;
  async react(
    data: CallMessage,
    action: CallAction
  ): Promise<{ id: string; success: boolean }> {
    try {
      const conn = await this.ready;
      const ext: CallDataExt = {
        action,
        result: data.result,
        callId: data.callId,
        type: data.callType,
        channel: data.channel,
        start: data.start,
        end: data.end,
      };
      switch (action) {
        case CallAction.callout: {
          break;
        }
        case CallAction.accept: {
          break;
        }
        case CallAction.refuse: {
          break;
        }
        case CallAction.busy: {
          break;
        }
        case CallAction.cancel: {
          break;
        }
        case CallAction.enter: {
          break;
        }
        case CallAction.finish: {
          break;
        }
        case CallAction.video2vioce: {
          break;
        }
        case CallAction.timeout: {
          break;
        }
      }
      const body = WebIM.message.create({
        chatType: 'singleChat', // 会话类型，设置为单聊。
        type: 'cmd', // 消息类型。
        from: data.from,
        to: data.to, // 消息接收方（用户 ID)。
        action: CmdCallMessageAction,
        ext,
      });
      const res = await conn.send(body);
      const message = res.message;
      if (message) {
        return {
          success: true,
          id: message.id,
        };
      }
    } catch (error) {
      console.log('视频聊天交互失败', error);
    }
    return {
      success: false,
      id: '',
    };
  }
  addCallListener(listener: CallListener): void {
    this.callListener = listener;
  }

  onCallData(message: EasemobChat.CmdMsgBody) {
    const data = callDataConvert(message, this.userId);
    console.log('收到通话消息', data,message);

    if (data) {
      const ext = message.ext as CallDataExt;

      switch (ext.action) {
        case CallAction.callout: {
          this.callListener.onCall(data);
          break;
        }
        case CallAction.accept: {
          this.callListener.onAccepted(data);
          break;
        }
        case CallAction.busy: {
          this.callListener.onBusy(data);
          break;
        }
        case CallAction.cancel: {
          this.callListener.onCancel(data);
          break;
        }
        case CallAction.refuse: {
          this.callListener.onRefused(data);
          break;
        }
        case CallAction.enter: {
          this.callListener.onEnter(data);
          break;
        }
        case CallAction.timeout: {
          this.callListener.onTimeout(data);
          break;
        }
        case CallAction.finish: {
          this.callListener.onFinished(data);
          break;
        }
        case CallAction.video2vioce: {
          this.callListener.onVideo2Vioce(data);
          break;
        }
        case CallAction.abort: {
          this.callListener.onAbort(data);
          break;
        }
      }
    }
  }
  async getChannel(): Promise<string> {
    return uuid();
  }
  async joinChannel(channel: string, callType: CallType): Promise<boolean> {
    // try {
    //   const conn = await this.ready;
    //   const success = await CallRoom.getAuthToken(conn, this.userId, channel);
    //   if (!success) return false;
    //   await CallRoom.join(channel, callType);
    //   return true;
    // } catch (error) {
    //   console.log('加入聊天频道失败', error);
    //   return false;
    // }
    return true;
  }
  exitChannel(): void {
    // CallRoom.exit();
  }
}
const imAdapter = new Adapter();
export default imAdapter;
